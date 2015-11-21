package com.formbuilder;

import java.io.IOException;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import lombok.val;

import org.json.simple.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.fasterxml.jackson.core.JsonParseException;
import com.fasterxml.jackson.databind.JsonMappingException;
import com.formbuilder.dao.FormInformation;

@Service
public class FormInformationService {

	private final FormInformationRepository repository;

	@Autowired
	public FormInformationService(FormInformationRepository repository) {
		this.repository = repository;
	}

	public void deleteAll() {
		repository.deleteAll();
	}

	public List<String> findAllFormTemplates() throws Exception {
		return repository.findAllFormTemplates().map(x -> x.getRootnode().getId()).collect(Collectors.toList());
	}

	public void save(FormInformation formTemplate) {
		formTemplate.setType("template");
		repository.save(formTemplate);
	}

	public FormInformation findTemplateByName(String name) {
		return repository.findTemplateByName(name);
	}

	public void save(JSONObject input, String formName, String dataId) {
		val formTemplate = dataId.equals("0") ? findTemplateByName(formName) : repository.findFormData(formName, dataId);
		
		if(dataId.equals("0")){
			formTemplate.setId(null);
			formTemplate.setType("data");
		}
		//combine formTemplate and input
		Utils.combineFormDataAndInput(formTemplate, input);
		repository.save(formTemplate);
	}

	public Map<String, Object> getData(String formName, String dataid) throws JsonParseException, JsonMappingException, IOException {
		val root = dataid.equals("0") ? findTemplateByName(formName) : repository.findFormData(formName, dataid);
		return Utils.convertAttributeToUi(root);
	}

	public List<FormInformation> findAllDataByNames(String formName) {
		return repository.findAllFormData(formName).collect(Collectors.toList());
	}
}
