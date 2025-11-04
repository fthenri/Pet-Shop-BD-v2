package com.pet_shop.pet_shop.Repository;

import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.stereotype.Repository;
import org.springframework.jdbc.core.JdbcTemplate;

import com.pet_shop.pet_shop.DTO.ClienteResponseDTO;
import com.pet_shop.pet_shop.Model.Cliente;

@Repository
public class ClienteRepository {
    @Autowired
    private JdbcTemplate jdbcTemplate;

    private static final class ClienteRowMapper implements RowMapper<Cliente> {
        @Override
        public Cliente mapRow(ResultSet rs, int rowNum) throws SQLException {
            Cliente cliente = new Cliente();
            cliente.setCpf(rs.getString("cpf"));
            cliente.setNome(rs.getString("nome"));
            cliente.setDataCadastro(rs.getTimestamp("data_cadastro").toLocalDateTime());
            cliente.setLogradouro(rs.getString("logradouro"));
            cliente.setNumero(rs.getString("numero"));
            cliente.setBairro(rs.getString("bairro"));
            cliente.setCidade(rs.getString("cidade"));
            cliente.setEstado(rs.getString("estado"));
            cliente.setCep(rs.getString("cep"));
            cliente.setTelefone1(rs.getString("telefone1"));
            cliente.setTelefone2(rs.getString("telefone2"));
            return cliente;
        }
    }

    // Criar um novo cliete - Bernardo
    public Cliente save(Cliente cliente) {
        String sql = "INSERT INTO Cliente (cpf, nome, logradouro, numero, bairro, cidade, estado, cep, telefone1, telefone2) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
        jdbcTemplate.update(sql, cliente.getCpf(), cliente.getNome(), cliente.getLogradouro(), cliente.getNumero(),
                cliente.getBairro(), cliente.getCidade(), cliente.getEstado(), cliente.getCep(), cliente.getTelefone1(),
                cliente.getTelefone2());
        return cliente;
    }

    // Ler (Find all) um novo cliente - Bernardo
    public List<Cliente> findAll() {
        String sql = "SELECT * FROM Cliente";
        return jdbcTemplate.query(sql, new ClienteRowMapper());
    }

    // Ler (find by CPF) - Bernardo
    public Cliente findByCpf(String cpf) {
        String sql = "SELECT * FROM Cliente WHERE cpf = ?";
        try {
            return jdbcTemplate.queryForObject(sql, new Object[] { cpf }, new ClienteRowMapper());
        } catch (Exception e) {
            return null;
        }
    }

    public List<ClienteResponseDTO> findByNomeContaining(String nomeParcial) {
        String sql = "SELECT * FROM cliente WHERE nome LIKE ?";

        return jdbcTemplate.query(sql, new Object[]{"%" + nomeParcial + "%"}, (rs, rowNum) -> {
            Cliente cliente = new Cliente();
            cliente.setCpf(rs.getString("cpf"));
            cliente.setNome(rs.getString("nome"));
            cliente.setDataCadastro(rs.getTimestamp("data_cadastro").toLocalDateTime());
            cliente.setTelefone1(rs.getString("telefone1"));
            cliente.setTelefone2(rs.getString("telefone2"));
            cliente.setCidade(rs.getString("cidade"));
            return new ClienteResponseDTO(cliente);
        });
    }

    // Atualizar - Bernardo
    public int update(Cliente cliente) {
        String sql = "UPDATE Cliente SET nome = ?, logradouro = ?, numero = ?, bairro = ?, cidade = ?, estado = ?, cep = ?, telefone1 = ?, telefone2 = ? WHERE cpf = ?";
        return jdbcTemplate.update(sql, cliente.getNome(), cliente.getLogradouro(), cliente.getNumero(),
                cliente.getBairro(), cliente.getCidade(), cliente.getEstado(), cliente.getCep(), cliente.getTelefone1(),
                cliente.getTelefone2(), cliente.getCpf());
    }

    // Deletar - Bernardo
    public int deleteByCpf(String cpf) {
        String sql = "DELETE FROM Cliente WHERE cpf = ?";
        return jdbcTemplate.update(sql, cpf);
    }
}
