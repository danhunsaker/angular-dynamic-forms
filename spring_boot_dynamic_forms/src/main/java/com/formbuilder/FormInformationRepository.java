package com.formbuilder;

import java.util.stream.Stream;

import org.springframework.data.mongodb.repository.Query;
import org.springframework.data.repository.CrudRepository;

import com.formbuilder.dao.FormInformation;


public interface FormInformationRepository extends CrudRepository<FormInformation, Long> {

	@Query(value = "{\"type\": \"template\"}, {\"_id\":1, \"rootnode.id\" : 1 }")
	Stream<FormInformation> findAllFormTemplates();
	
	@Query(value = "{\"type\": \"template\", \"rootnode._id\" : ?0} }")
	FormInformation findTemplateByName(String name);
	
	@Query(value = "{\"type\": \"data\", \"rootnode._id\" : ?0}, {\"_id\":1, \"rootnode.id\" : 1 }")
	Stream<FormInformation> findAllFormData(String formName);
	
	@Query(value = "{\"type\": \"data\", \"rootnode._id\" : ?0, \"_id\": ?1}, {\"_id\":1, \"rootnode.id\" : 1 }")
	FormInformation findFormData(String formName, String id);
}
