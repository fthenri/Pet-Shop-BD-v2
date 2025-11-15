package com.pet_shop.pet_shop.Repository;

import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.stereotype.Repository;
import org.springframework.jdbc.core.JdbcTemplate;
import java.math.BigDecimal;

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
            BigDecimal totalGasto = rs.getBigDecimal("total_gasto");
            cliente.setTotalGasto(totalGasto != null ? totalGasto : BigDecimal.ZERO);

            return cliente;
        }
    }

    public Cliente save(Cliente cliente) {
        String sql = "INSERT INTO Cliente (cpf, nome, logradouro, numero, bairro, cidade, estado, cep, telefone1, telefone2) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
        jdbcTemplate.update(sql, cliente.getCpf(), cliente.getNome(), cliente.getLogradouro(), cliente.getNumero(),
                cliente.getBairro(), cliente.getCidade(), cliente.getEstado(), cliente.getCep(), cliente.getTelefone1(),
                cliente.getTelefone2());
        return cliente;
    }

    public List<Cliente> findAll() {
        String sql = "SELECT *, FN_TotalGastoCliente(cpf) as total_gasto FROM Cliente";
        return jdbcTemplate.query(sql, new ClienteRowMapper());
    }

    public Cliente findByCpf(String cpf) {
        String sql = "SELECT *, FN_TotalGastoCliente(cpf) as total_gasto FROM Cliente WHERE cpf = ?";
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

    public int update(Cliente cliente) {
        String sql = "UPDATE Cliente SET nome = ?, logradouro = ?, numero = ?, bairro = ?, cidade = ?, estado = ?, cep = ?, telefone1 = ?, telefone2 = ? WHERE cpf = ?";
        return jdbcTemplate.update(sql, cliente.getNome(), cliente.getLogradouro(), cliente.getNumero(),
                cliente.getBairro(), cliente.getCidade(), cliente.getEstado(), cliente.getCep(), cliente.getTelefone1(),
                cliente.getTelefone2(), cliente.getCpf());
    }

    public int deleteByCpf(String cpf) {
        String sql = "DELETE FROM Cliente WHERE cpf = ?";
        return jdbcTemplate.update(sql, cpf);
    }
}
