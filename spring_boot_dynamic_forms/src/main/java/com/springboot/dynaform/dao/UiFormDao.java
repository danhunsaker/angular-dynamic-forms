package com.springboot.dynaform.dao;

import java.sql.ResultSet;
import java.sql.ResultSetMetaData;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

import lombok.val;

import org.apache.log4j.Logger;
import org.json.simple.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Component;

import com.springboot.dynaform.dto.UiForm;
import com.springboot.dynaform.dto.UiFormLink;

@Component
public class UiFormDao {
	private static Logger logger = Logger.getLogger(UiFormDao.class);
	private JdbcTemplate jdbcTemplate;

	@Autowired
	public UiFormDao(JdbcTemplate jdbcTemplate) {
		this.jdbcTemplate = jdbcTemplate;
	}

	public List<UiForm> getFormList() {
		String sql = "select * from ui_form order by order_by";
		return jdbcTemplate.query(sql, (rs, rowNum) -> {
			return getUiForm(rs);
		});
	}

	public Map getFormData(int dataId, UiForm form, List<UiFormLink> formLinks) {
		val json = new LinkedHashMap();
		getFormDataHeader(dataId, form, json);

		formLinks.forEach(x -> getFormLinkData(dataId, form, x, json));

		val json1 = new LinkedHashMap();
		json1.put("type", "submit");
		json1.put("label", "Submit");

		json.put("submit", json1);
		return json;
	}

	public UiForm getFormInfo(int formId) {
		val sql = "select * from ui_form where id=?";
		return jdbcTemplate.queryForObject(sql, new Object[] { formId }, (rs, rowNum) -> getUiForm(rs));
	}

	public List<UiFormLink> getFormLinkInfo(int formId) {
		val sql = "select * from ui_form_link where ui_form_id=?";
		return jdbcTemplate.query(sql, (rs, rowNum) -> getUiFormLink(rs), formId);
	}

	private static UiForm getUiForm(ResultSet rs) throws SQLException {
		val form = new UiForm();
		form.setId(rs.getInt("id"));
		form.setFormTableName(rs.getString("form_table_name"));
		form.setDisplayName(rs.getString("display_name"));
		form.setOrderBy(rs.getInt("order_by"));
		return form;
	}

	private String getDiplayName(String name) {
		// TODO Auto-generated method stub
		val split = name.split("_");
		val res = new StringBuffer();

		for (String str : split) {
			char[] stringArray = str.trim().toCharArray();
			stringArray[0] = Character.toUpperCase(stringArray[0]);
			str = new String(stringArray);

			res.append(str).append(" ");
		}

		return res.toString();
	}

	private static UiFormLink getUiFormLink(ResultSet rs) throws SQLException {
		val form1 = new UiFormLink();
		form1.setUiFormId(rs.getInt("ui_form_id"));
		form1.setUiFormLinkId(rs.getInt("ui_form_link_id"));
		return form1;
	}

	private void getFormLinkData(int dataId, UiForm form, UiFormLink formLink, Map json) {
		val sql = "select * from ui_form where id=?";

		val list = jdbcTemplate.query(sql, (rs, rowNum) -> rs.getString("form_table_name") + "#" + rs.getString("display_name"),
				formLink.getUiFormLinkId());

		val list1 = new ArrayList<LinkedHashMap>();
		list.forEach(x -> {
			String[] st = x.split("#");

			getSelectedData(jdbcTemplate, form, st[0], dataId, st[1], json);
		});
	}

	private void getSelectedData(JdbcTemplate jdbcTemplate, UiForm form, String tableName, int dataId, String displayName, Map root) {
		// Get Entire list
		val relnTableList = getRelationsshipDataList(jdbcTemplate, tableName);

		val sql = String.format("select x.id, x.name from %s as x, %s_%s_relationship as y where y.%s_id=x.id and y.%s_id=?", tableName,
				form.getFormTableName(), tableName, tableName, form.getFormTableName());
		List<String> relnList1 = new ArrayList<String>();
		if (dataId != 0) {
			relnList1 = jdbcTemplate.query(sql, (rs, rowNum) -> {
				return rs.getObject(1) + "#" + rs.getObject(2);
			}, dataId);
		}

		val relnList = relnList1;
		val optionsJsonList = new ArrayList<LinkedHashMap>();
		// None selected
		val json1 = new LinkedHashMap();
		relnTableList.forEach(x -> {
			String split[] = x.split("#");

			Map jsonLoc = new LinkedHashMap();
			jsonLoc.put("label", split[1]);
			if (!relnList.isEmpty() && relnList.contains(x)) {
				// TODO: currently we assume it is always returing one rows. we
				// need to change this
				// One value selected
				jsonLoc.put("val", Boolean.toString(true));
				jsonLoc.put("slaveTo", Boolean.toString(true));
			} else {
				jsonLoc.put("val", Boolean.toString(false));
				jsonLoc.put("slaveTo", Boolean.toString(false));
			}

			json1.put(split[0], jsonLoc);
		});

		val relnTableJson = new LinkedHashMap();
		relnTableJson.put("type", "checklist");
		relnTableJson.put("label", displayName);
		relnTableJson.put("options", json1);

		root.put(tableName, relnTableJson);
	}

	private List<String> getRelationsshipDataList(JdbcTemplate jdbcTemplate, String tableName) {
		// String sql2 = "select name from " + tableName;
		val sql = String.format("select id, name from %s", tableName);
		return jdbcTemplate.query(sql, (rs, rowNum) -> rs.getString(1) + "#" + rs.getString(2));
	}

	private void getFormDataHeader(int dataId, UiForm form, Map json) {
		if (dataId != 0) {
			val sql = String.format("select * from %s where id=?", form.getFormTableName());
			jdbcTemplate.query(sql, (rs, rowNum) -> {
				ResultSetMetaData rsmd = rs.getMetaData();
				for (int i = 1; i < rsmd.getColumnCount() + 1; i++) {
					String name = rsmd.getColumnName(i).toLowerCase();
					Map innerJson = new LinkedHashMap();
					innerJson.put("type", getType(rsmd.getColumnTypeName(i).toLowerCase(), name));
					innerJson.put("label", getDiplayName(name));
					innerJson.put("val", rs.getObject(i));
					json.put(name, innerJson);
				}
				return "";
			}, dataId);
		} else {
			val sql = String.format("select * from %s", form.getFormTableName());
			generateCreateJson(sql, json);
		}
	}

	private void generateCreateJson(String sql, Map json) {
		jdbcTemplate.query(sql, (rs) -> {
			ResultSetMetaData rsmd = rs.getMetaData();
			for (int i = 1; i < rsmd.getColumnCount() + 1; i++) {
				String name = rsmd.getColumnName(i).toLowerCase();
				
				Map innerJson = new LinkedHashMap();
				innerJson.put("type", getType(rsmd.getColumnTypeName(i).toLowerCase(), name));
				innerJson.put("label", getDiplayName(name));
				innerJson.put("placeholder", getDefaultValue(rsmd));
				json.put(name, innerJson);
			}
		});
	}

	private Object getType(String columnTypeName, String name) {
		// TODO Auto-generated method stub
		if(name.equals("id")){
			return "label";
		}
		switch(columnTypeName){
		case "varchar":
		case "varchar_ignorecase":
			return "text";
		case "date":
			return columnTypeName;
		case "integer":
			return "number";
		}
		return columnTypeName;
	}

	private String getDefaultValue(ResultSetMetaData rsmd) {
		// TODO Auto-generated method stub
		return "whatever";
	}

	public List<Map> getFormDataList(int formId) {
		val form = getFormInfo(formId);

		val sql = String.format("select id, name from %s", form.getFormTableName());
		return jdbcTemplate.query(sql, (rs, rowNum) -> {
			Map json1 = new LinkedHashMap();
			json1.put("id", rs.getInt(1));
			json1.put("name", rs.getString(2));
			return json1;
		});
	}

	public void saveFormData(JSONObject input) {
		logger.debug(input);
	}
}
