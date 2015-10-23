package com.boeing.cgaas.dto;

import lombok.Getter;
import lombok.Setter;

public class UiForm {
	@Getter
	@Setter
	public int id;
	
	@Getter
	@Setter
	public String formTableName;

	@Getter
	@Setter
	public String displayName;
	
	@Getter
	@Setter
	public int orderBy;
}
