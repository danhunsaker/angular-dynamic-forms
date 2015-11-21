package com.formbuilder.dao;

import lombok.Getter;
import lombok.Setter;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

@JsonIgnoreProperties(ignoreUnknown = true)
public class FormInformation {
	
	@Getter @Setter
	private String id;

	@Getter @Setter
	private String type;

	@Getter @Setter
	private Node rootnode;
}
