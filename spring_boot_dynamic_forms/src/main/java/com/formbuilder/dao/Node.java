package com.formbuilder.dao;

import java.util.List;

import lombok.Getter;
import lombok.Setter;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

@JsonIgnoreProperties(ignoreUnknown = true)
public class Node {
	@Getter @Setter
	private String datatype;
	@Getter @Setter
	private String id;
	@Getter @Setter
	private String label;
	@Getter @Setter
	private int lowerbound;
	@Getter @Setter
	private int upperbound;
	@Getter @Setter
	private String val;
	@Getter @Setter
	private List<Node> children;
}
