package com.springboot.dynaform.util;

import java.util.Iterator;
import java.util.NoSuchElementException;
import java.util.Spliterator;
import java.util.Spliterators;
import java.util.function.Function;
import java.util.stream.Stream;
import java.util.stream.StreamSupport;

import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.support.rowset.ResultSetWrappingSqlRowSet;
import org.springframework.jdbc.support.rowset.SqlRowSet;

public class JdbcStream {
	JdbcTemplate jdbcTemplate;

	public JdbcStream(JdbcTemplate jdbcTemplate) {
		this.jdbcTemplate = jdbcTemplate;
	}

	public <T> T streamQuery(String sql, Function<Stream<SqlRowSet>, ? extends T> streamer, Object... args) {
		return jdbcTemplate.query(sql, resultSet -> {
			final SqlRowSet rowSet = new ResultSetWrappingSqlRowSet(resultSet);

			Spliterator<SqlRowSet> spliterator = Spliterators.spliteratorUnknownSize(new Iterator<SqlRowSet>() {
				@Override
				public boolean hasNext() {
					return !rowSet.isLast();
				}

				@Override
				public SqlRowSet next() {
					if (!rowSet.next()) {
						throw new NoSuchElementException();
					}
					return rowSet;
				}
			}, Spliterator.IMMUTABLE);
			boolean parallel = false;
			return streamer.apply(StreamSupport.stream(spliterator, parallel));
		} , args);
	}
}
