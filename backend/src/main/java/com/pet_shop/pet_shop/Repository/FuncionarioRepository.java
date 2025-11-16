package com.pet_shop.pet_shop.Repository;

import com.pet_shop.pet_shop.DTO.FuncionarioGeralResponseDTO;

import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.jdbc.support.GeneratedKeyHolder;
import org.springframework.jdbc.support.KeyHolder;
import org.springframework.stereotype.Repository;

import com.pet_shop.pet_shop.Model.Atendente;
import com.pet_shop.pet_shop.Model.Funcionario;
import com.pet_shop.pet_shop.Model.Veterinario;

@Repository
public class FuncionarioRepository {

    @Autowired
    private JdbcTemplate jdbcTemplate;

    private final RowMapper<Veterinario> vetRowMapper = (rs, rowNum) -> {
        Veterinario vet = new Veterinario();
        vet.setCodFuncionario(rs.getInt("cod_funcionario"));
        vet.setNome(rs.getString("nome"));
        vet.setCpf(rs.getString("cpf"));
        vet.setDataAdmissao(rs.getDate("data_admissao").toLocalDate());
        vet.setCodSupervisor(rs.getObject("supervisor", Integer.class));
        vet.setCrmv(rs.getString("CRMV"));
        return vet;
    };

    private final RowMapper<Atendente> atendenteRowMapper = (rs, rowNum) -> {
        Atendente atendente = new Atendente();
        atendente.setCodFuncionario(rs.getInt("cod_funcionario"));
        atendente.setNome(rs.getString("nome"));
        atendente.setCpf(rs.getString("cpf"));
        atendente.setDataAdmissao(rs.getDate("data_admissao").toLocalDate());
        atendente.setCodSupervisor(rs.getObject("supervisor", Integer.class));
        return atendente;
    };

    private final RowMapper<Funcionario> funcRowMapper = (rs, rowNum) -> {
        Funcionario func = new Funcionario();
        func.setCodFuncionario(rs.getInt("cod_funcionario"));
        func.setNome(rs.getString("nome"));
        func.setCpf(rs.getString("cpf"));
        func.setDataAdmissao(rs.getDate("data_admissao").toLocalDate());
        func.setCodSupervisor(rs.getObject("supervisor", Integer.class));
        return func;
    };

    private final RowMapper<FuncionarioGeralResponseDTO> geralRowMapper = (rs, rowNum) -> {
        String crmv = rs.getString("CRMV");
        Integer codAtendente = rs.getObject("cod_atendente", Integer.class);
        
        String tipo;
        if (crmv != null) {
            tipo = "Veterinário";
        } else if (codAtendente != null) {
            tipo = "Atendente";
        } else {
            tipo = "Funcionário"; 
        }

        return new FuncionarioGeralResponseDTO(
            rs.getInt("cod_funcionario"),
            rs.getString("nome"),
            rs.getString("cpf"),
            rs.getDate("data_admissao").toLocalDate(),
            rs.getObject("supervisor", Integer.class),
            crmv,
            tipo
        );
    };

    public List<FuncionarioGeralResponseDTO> findAllGeral() {
        String sql = """
            SELECT
                f.cod_funcionario, f.nome, f.cpf, f.data_admissao, f.supervisor,
                v.CRMV,
                a.cod_funcionario AS cod_atendente
            FROM
                Funcionario f
            LEFT JOIN
                Veterinario v ON f.cod_funcionario = v.cod_funcionario
            LEFT JOIN
                Atendente a ON f.cod_funcionario = a.cod_funcionario
            ORDER BY
                f.nome;
            """;
        return jdbcTemplate.query(sql, geralRowMapper);
    }

    public Optional<Funcionario> findByCpf(String cpf) {
        String sql = "SELECT * FROM Funcionario WHERE cpf = ?";
        try {
            Funcionario func = jdbcTemplate.queryForObject(sql, new Object[] { cpf }, funcRowMapper);
            return Optional.ofNullable(func);
        } catch (Exception e) {
            return Optional.empty();
        }
    }

    public Optional<Funcionario> findById(int id) {
        String sql = "SELECT * FROM Funcionario WHERE cod_funcionario = ?";
        try {
            Funcionario func = jdbcTemplate.queryForObject(sql, new Object[] { id }, funcRowMapper);
            return Optional.ofNullable(func);
        } catch (Exception e) {
            return Optional.empty();
        }
    }

    public Optional<Veterinario> findVeterinarioById(int id) {
        String sql = "SELECT * FROM Funcionario f JOIN Veterinario v ON f.cod_funcionario = v.cod_funcionario WHERE f.cod_funcionario = ?";
        try {
            Veterinario vet = jdbcTemplate.queryForObject(sql, new Object[] { id }, vetRowMapper);
            return Optional.ofNullable(vet);
        } catch (Exception e) {
            return Optional.empty();
        }
    }

    public Optional<Atendente> findAtendenteById(int id) {
        String sql = "SELECT * FROM Funcionario f JOIN Atendente a ON f.cod_funcionario = a.cod_funcionario WHERE f.cod_funcionario = ?";
        try {
            Atendente atendente = jdbcTemplate.queryForObject(sql, new Object[] { id }, atendenteRowMapper);
            return Optional.ofNullable(atendente);
        } catch (Exception e) {
            return Optional.empty();
        }
    }

    public List<Veterinario> findAllVeterinarios() {
        String sql = "SELECT * FROM Funcionario f JOIN Veterinario v ON f.cod_funcionario = v.cod_funcionario";
        return jdbcTemplate.query(sql, vetRowMapper);
    }

    public List<Atendente> findAllAtendentes() {
        String sql = "SELECT * FROM Funcionario f JOIN Atendente a ON f.cod_funcionario = a.cod_funcionario";
        return jdbcTemplate.query(sql, atendenteRowMapper);
    }

    private Integer saveFuncionarioBase(Funcionario funcionario) {
        String sql = "INSERT INTO Funcionario (nome, cpf, data_admissao, supervisor) VALUES (?, ?, ?, ?)";
        KeyHolder keyHolder = new GeneratedKeyHolder();

        jdbcTemplate.update(connection -> {
            PreparedStatement ps = connection.prepareStatement(sql, Statement.RETURN_GENERATED_KEYS);
            ps.setString(1, funcionario.getNome());
            ps.setString(2, funcionario.getCpf());
            ps.setDate(3, java.sql.Date.valueOf(funcionario.getDataAdmissao()));
            ps.setObject(4, funcionario.getCodSupervisor());
            return ps;
        }, keyHolder);

        return keyHolder.getKey().intValue();
    }

    public Veterinario saveVeterinario(Veterinario veterinario) {
        Integer codFuncionario = saveFuncionarioBase(veterinario);
        veterinario.setCodFuncionario(codFuncionario);

        String sqlVet = "INSERT INTO Veterinario (cod_funcionario, CRMV) VALUES (?, ?)";
        jdbcTemplate.update(sqlVet, veterinario.getCodFuncionario(), veterinario.getCrmv());
        
        return veterinario;
    }

    public Atendente saveAtendente(Atendente atendente) {
        Integer codFuncionario = saveFuncionarioBase(atendente);
        atendente.setCodFuncionario(codFuncionario);

        String sqlAte = "INSERT INTO Atendente (cod_funcionario) VALUES (?)";
        jdbcTemplate.update(sqlAte, atendente.getCodFuncionario());
        
        return atendente;
    }

    public Funcionario saveFuncionarioPuro(Funcionario funcionario) {
        Integer codFuncionario = saveFuncionarioBase(funcionario);
        funcionario.setCodFuncionario(codFuncionario);
        return funcionario;
    }

    private int updateFuncionarioBase(Funcionario funcionario) {
        String sql = "UPDATE Funcionario SET nome = ?, data_admissao = ?, supervisor = ? WHERE cod_funcionario = ?";
        return jdbcTemplate.update(sql,
                funcionario.getNome(),
                funcionario.getDataAdmissao(),
                funcionario.getCodSupervisor(),
                funcionario.getCodFuncionario());
    }

    public int updateVeterinario(Veterinario veterinario) {
        updateFuncionarioBase(veterinario);
        String sqlVet = "UPDATE Veterinario SET CRMV = ? WHERE cod_funcionario = ?";
        return jdbcTemplate.update(sqlVet, veterinario.getCrmv(), veterinario.getCodFuncionario());
    }

    public int updateAtendente(Atendente atendente) {
        return updateFuncionarioBase(atendente);
    }

    public int updateFuncionarioPuro(Funcionario funcionario) {
        return updateFuncionarioBase(funcionario);
    }

    public int deleteById(int codFuncionario) {
        String sql = "DELETE FROM Funcionario WHERE cod_funcionario = ?";
        return jdbcTemplate.update(sql, codFuncionario);
    }
}