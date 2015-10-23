package com.boeing.cgaas;

import java.util.LinkedHashMap;
import java.util.Map;

import junit.framework.Assert;

import org.json.simple.JSONObject;
import org.junit.Test;
import org.junit.Ignore;

public class TestJSONObject {

	@Ignore
	@Test
	public void test() {
		Map obj = new LinkedHashMap();
		obj.put("a", "foo1");
		obj.put("b", new Integer(100));
		obj.put("c", new Double(1000.21));
		obj.put("d", new Boolean(true));
		obj.put("e", "foo2");
		obj.put("f", "foo3");
		obj.put("g", "foo4");
		obj.put("h", "foo5");
		obj.put("x", null);
		JSONObject json = new JSONObject(obj);
		
		String expectedJsonString = "{\"a\":\"foo1\",\"b\":100,\"c\":1000.21,\"d\":true,\"e\":\"foo2\",\"f\":\"foo3\",\"g\":\"foo4\",\"h\":\"foo5\",\"x\":null}";

		Assert.assertEquals(expectedJsonString, json);
	}

}
