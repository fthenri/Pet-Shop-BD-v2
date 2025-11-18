package com.pet_shop.pet_shop.Repository;

import com.pet_shop.pet_shop.Model.Consulta;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.support.GeneratedKeyHolder;
import org.springframework.jdbc.support.KeyHolder;
import org.springframework.stereotype.Repository;

import java.sql.PreparedStatement;
import java.sql.Statement;
import java.sql.Timestamp;

@Repository
public class ConsultaRepository {

    @Autowired
    private JdbcTemplate jdbcTemplate;

    public Consulta save(Consulta consulta) {
        final String sql = "INSERT INTO Consulta_Atende (cod_pet, cod_funcionario, data_hora, sintomas_relatados, diagnostico) VALUES (?, ?, ?, ?, ?)";
        KeyHolder keyHolder = new GeneratedKeyHolder();

        jdbcTemplate.update(connection -> {
            PreparedStatement ps = connection.prepareStatement(sql, Statement.RETURN_GENERATED_KEYS);
            ps.setInt(1, consulta.getCodPet());
            ps.setInt(2, consulta.getCodVeterinario());
            ps.setTimestamp(3, Timestamp.valueOf(consulta.getDataHora()));
            ps.setString(4, consulta.getSintomasRelatados());
            ps.setString(5, consulta.getDiagnostico());
            return ps;
        }, keyHolder);

        consulta.setNumConsulta(keyHolder.getKey().intValue());
        return consulta;
    }
}