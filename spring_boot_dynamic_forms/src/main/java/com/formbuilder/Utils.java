package com.formbuilder;

import java.io.IOException;
import java.util.LinkedHashMap;
import java.util.Map;

import lombok.val;

import org.apache.log4j.Logger;
import org.json.simple.JSONObject;

import com.fasterxml.jackson.core.JsonParseException;
import com.fasterxml.jackson.databind.JsonMappingException;
import com.formbuilder.dao.FormInformation;
import com.formbuilder.dao.Node;

public class Utils {
	private static Logger logger = Logger.getLogger(Utils.class);

	public static Map<String, Object> convertAttributeToUi(FormInformation root) throws JsonParseException, JsonMappingException, IOException {
		// TODO Auto-generated method stub

		val map = new LinkedHashMap<String, Object>();
		val map1 = new LinkedHashMap<String, Object>();
		Node node = root.getRootnode();
		map.put(node.getId(), getUiInfo(node, ""));
		map1.put("type", "submit");
		map1.put("label", "Submit");
		map.put("submit", map1);
		return map;
	}

	public static void combineFormDataAndInput(FormInformation formTemplate, JSONObject input) {
		combineFormDataAndInput(formTemplate.getRootnode(), input);
	}

	private static void combineFormDataAndInput(Node node, JSONObject input) {
		Object oVal = input.get(node.getId());
		if (oVal != null) {
			node.setVal(oVal.toString());
		}

		if (node.getChildren() != null) {
			node.getChildren().forEach(x -> combineFormDataAndInput(x, input));
		}
	}

	private static Map<String, Object> getUiInfo(Node node, String parentOptId) {

		val map = new LinkedHashMap<String, Object>();
		addGenericInfo(node, parentOptId, map);

		if (isNotACompositeItem(node)) {
			addDatatypeAttributes(node, map);
		} else {
			if (childrenPresent(node)) {
				addChildrenAttributes(node, map);
			}
		}
		return map;
	}

	private static void addChildrenAttributes(Node node, Map<String, Object> map) {
		val map1 = new LinkedHashMap<String, Object>();

		int cnt = node.getChildren().size();
		String curretParentOptId = "";
		if (isCompositeSelectsingle(node, cnt)) {
			curretParentOptId = addSelectionForTheGroup(node, map1, cnt);
		}
		for (Node n : node.getChildren()) {
			map1.put(n.getId() + "-fieldset", getUiInfo(n, curretParentOptId));
		}
		map.put("fields", map1);
	}

	private static boolean childrenPresent(Node node) {
		return node.getChildren() != null && !node.getChildren().isEmpty();
	}

	private static String addSelectionForTheGroup(Node node, Map<String, Object> map, int cnt) {
		String curretParentOptId;
		curretParentOptId = node.getId() + "-opt";
		val map3 = new LinkedHashMap<String, Object>();
		map3.put("label", node.getLabel() + " Options");
		map3.put("type", "radio");
		Map<String, Object> map2 = new LinkedHashMap<String, Object>();
		for (Node n : node.getChildren()) {
			map2.put(n.getId() + "-opt", n.getLabel());
		}
		map3.put("values", map2);
		map.put(curretParentOptId, map3);
		return curretParentOptId;
	}

	private static boolean isCompositeSelectsingle(Node node, int count) {
		return node.getDatatype().equals("Composite-selectsingle") && count > 1;
	}

	private static void addGenericInfo(Node node, String parentOptId, Map<String, Object> map) {
		map.put("label", node.getLabel());
		addEnableDisableRule(node, parentOptId, map);
		map.put("type", "fieldset");
	}

	private static boolean isNotACompositeItem(Node node) {
		return !node.getDatatype().startsWith("Composite");
	}

	private static void addDatatypeAttributes(Node node, Map<String, Object> map) {
		val map1 = new LinkedHashMap<String, Object>();
		map1.put("type", node.getDatatype());

		addAdditionalRules(node, map1, node.getId() + "-control");
		val map2 = new LinkedHashMap<String, Object>();
		map2.put(node.getId(), map1);
		map.put("fields", map2);
	}

	private static void addEnableDisableRule(Node node, String parentOptId, Map<String, Object> map) {
		if (!parentOptId.equals("")) {
			val map1 = new LinkedHashMap<String, Object>();
			map1.put("ng-disabled", "urlFormData['" + parentOptId + "'] != '" + node.getId() + "-opt'");
			map.put("attributes", map1);
		}
	}

	private static void addAdditionalRules(Node node, Map<String, Object> map, String id) {
		// TODO Add rules for various datatypes
		switch (node.getDatatype()) {
		case "number":
			map.put("minValue", node.getLowerbound());
			map.put("maxValue", node.getUpperbound());
			map.put("placeholder", "Numeric Value");
			if (node.getVal() != null) {
				float fVal = Float.parseFloat(node.getVal());
				map.put("val", fVal);
			}
			break;
		case "text":
			map.put("placeholder", "Text Value");
			if (node.getVal() != null) {
				map.put("val", node.getVal());
			}
			break;
		case "textarea":
			map.put("placeholder", "Description");
			if (node.getVal() != null) {
				map.put("val", node.getVal());
			}
			break;
		default:
			break;
		}
	}
}
