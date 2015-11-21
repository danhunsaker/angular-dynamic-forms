package com.formbuilder;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertNotNull;

import java.io.IOException;
import java.nio.charset.Charset;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.util.List;
import java.util.Map;

import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.SpringApplicationConfiguration;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;

import com.fasterxml.jackson.core.JsonParseException;
import com.fasterxml.jackson.databind.JsonMappingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.formbuilder.dao.FormInformation;

@RunWith(SpringJUnit4ClassRunner.class)
@SpringApplicationConfiguration(classes = Application.class)
public class FormsTemplateServiceTest {

	@Autowired
	FormInformationService formsService;

	@Before
	public void init() throws IOException {
		formsService.deleteAll();
		String payload = readFile("src/main/resources/schema/form-template.json", Charset.defaultCharset());
		ObjectMapper om = new ObjectMapper();
		FormInformation formTemplate = om.readValue(payload, FormInformation.class);
		formsService.save(formTemplate);
	}

	static String readFile(String path, Charset encoding) throws IOException {
		byte[] encoded = Files.readAllBytes(Paths.get(path));
		return new String(encoded, encoding);
	}
	
	@Test
	public void testFindAll() throws Exception {
		List<String> list = formsService.findAllFormTemplates();
		
		assertEquals(list.size(), 1);
		
		assertEquals(list.get(0), "fuelload");
	}
	
	@Test
	public void testFindByName() throws JsonParseException, JsonMappingException, IOException {
		FormInformation formTemplate= formsService.findTemplateByName("fuelload");
				
		assertEquals(formTemplate.getRootnode().getId(), "fuelload");
		
		Map<String, Object> map = Utils.convertAttributeToUi(formTemplate);
		assertNotNull(map);
	}
	
	List<String> findAllByNames1() {
		// db[db.runCommand({"mapreduce" : "formTemplates",
		// "map" : function() {for (var key in this) { emit(key, null); }},
		// "reduce" : function(key, stuff) {return null;},
		// "out": "formTemplates" + "_keys"}).result].distinct("_id")

		//DBObject object = new BasicDBObject();
		//object.put("mapreduce", formTemplates);
		//object.put("map", "function() { for (var key in this) { emit(key, null); } }");
		//object.put("reduce", "function(key, stuff) { return null; }");
		//object.put("out", formTemplates + "_keys");
		//CommandResult cResult = template.executeCommand(object);
		//List<String> l = template.getCollection(formTemplates + "_keys").distinct("_id");

		//return l.stream().filter(x -> !x.equals("_id")).collect(Collectors.toList());
		return null;
	}

}
