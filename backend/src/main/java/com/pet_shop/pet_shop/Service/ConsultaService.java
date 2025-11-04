package com.pet_shop.pet_shop.Service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;

@Service
public class ConsultaService {

    @Autowired
    private JdbcTemplate jdbcTemplate;

    public List<Map<String, Object>> executeSelectQuery(String sql) {
        if (!sql.trim().toLowerCase().startsWith("select")) {
            throw new IllegalArgumentException("Apenas consultas do tipo SELECT são permitidas.");
        }

        return jdbcTemplate.queryForList(sql);
    }
}