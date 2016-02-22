package com.formbuilder;

import java.io.IOException;
import java.util.List;
import java.util.Map;

import org.json.simple.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.autoconfigure.EnableAutoConfiguration;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.fasterxml.jackson.core.JsonParseException;
import com.fasterxml.jackson.databind.JsonMappingException;
import com.formbuilder.dao.FormInformation;

@RestController
@EnableAutoConfiguration
public class DynamicController {

	@Autowired
	private FormInformationService formTemplatesService;

	@RequestMapping("/getDataList/{formName}")
	public List<FormInformation> getDataList(@PathVariable("formName") String formName) throws Exception {
		return formTemplatesService.findAllDataByNames(formName);
	}

	@RequestMapping("/getTemplateList")
	public List<String> getTemplateList() throws Exception {
		return formTemplatesService.findAllFormTemplates();
	}

	@RequestMapping("/getFormData/{formName}/{dataid}")
	public Map<String, Object> getFormData(@PathVariable("formName") String formName, @PathVariable("dataid") String dataid)
			throws JsonParseException, JsonMappingException, IOException {
		return formTemplatesService.getData(formName, dataid);
	}

	@RequestMapping("/getDesignOfForm/{formName}")
	public FormInformation getDesignOfForm(@PathVariable("formName") String formName) throws JsonParseException, JsonMappingException,
			IOException {
		return formTemplatesService.findTemplateByName(formName);
	}

	@RequestMapping(value = "/saveDesignOfForm", method = RequestMethod.POST)
	public void saveDesignOfForm(@RequestBody FormInformation input) {
		formTemplatesService.save(input);
	}

	@RequestMapping(value = "/saveForm", method = RequestMethod.POST)
	public void saveForm(@RequestBody JSONObject input, @RequestParam("formid") String formId, @RequestParam("dataid") String dataId) {
		formTemplatesService.save(input, formId, dataId);
	}
}
