package com.springboot.dynaform;

import java.util.LinkedHashMap;
import java.util.List;
import java.util.stream.Collectors;

import javax.naming.NamingException;

import org.apache.log4j.Logger;
import org.json.simple.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.autoconfigure.EnableAutoConfiguration;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import com.springboot.dynaform.dao.UiFormDao;
import com.springboot.dynaform.dto.UiForm;

import lombok.val;

@RestController
@EnableAutoConfiguration
public class DynamicController {

	@Autowired
	UiFormDao dao;

	public DynamicController() throws NamingException {
	}

	private static Logger logger = Logger.getLogger(DynamicController.class);

	@RequestMapping(value = "/saveForm", method = RequestMethod.POST)
	public int saveForm(@RequestBody JSONObject input) {
		// TODO: Implement save
		dao.saveFormData(input);
		return 0;
	}

	@RequestMapping("/getFormList")
	public List<UiForm> getFormList() {
		return dao.getFormList();
	}

	@RequestMapping("/getFormDataList/{form_id}")
	public List<JSONObject> getFormDataList(@PathVariable("form_id") int formId) {
		return dao.getFormDataList(formId).stream().map(x -> new JSONObject(x)).collect(Collectors.toList());
	}

	@RequestMapping("/getFormData/{form_id}/{data_id}")
	public JSONObject getFormData(@PathVariable("form_id") int formId, @PathVariable("data_id") int dataId) {
		val form = dao.getFormInfo(formId);
		val formLinks = dao.getFormLinkInfo(formId);

		val json = dao.getFormData(dataId, form, formLinks);
		val json1 = new LinkedHashMap();
		json1.put("fields", json);
		json1.put("type", "fieldset");
		json1.put("label", form.getDisplayName());
		val json2 = new LinkedHashMap();
		json2.put(form.getFormTableName(), json1);

		JSONObject json3 = new JSONObject(json2);

		return json3;
	}
	
	@RequestMapping("/testStream")
	public void testStream() {
		dao.testStream();
	}

}