package com.pet_shop.pet_shop.Repository;

import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.stereotype.Repository;

import com.pet_shop.pet_shop.Model.Fornecedor;

@Repository
public class FornecedorRepository {

    @Autowired
    private JdbcTemplate jdbcTemplate;

    private static final class FornecedorRowMapper implements RowMapper<Fornecedor> {
        @Override
        public Fornecedor mapRow(ResultSet rs, int rowNum) throws SQLException {
            Fornecedor fornecedor = new Fornecedor();
            fornecedor.setCnpj(rs.getString("cnpj"));
            fornecedor.setRazaoSocial(rs.getString("razao_social"));
            fornecedor.setContatoPrincipal(rs.getString("contato_principal"));
            return fornecedor;
        }
    }

    public List<Fornecedor> findAll() {
        String sql = "SELECT * FROM Fornecedor";
        return jdbcTemplate.query(sql, new FornecedorRowMapper());
    }

    public Optional<Fornecedor> findByCnpj(String cnpj) {
        String sql = "SELECT * FROM Fornecedor WHERE cnpj = ?";
        try {
            Fornecedor fornecedor = jdbcTemplate.queryForObject(sql, new Object[] { cnpj }, new FornecedorRowMapper());
            return Optional.ofNullable(fornecedor);
        } catch (Exception e) {
            return Optional.empty();
        }
    }

    public Fornecedor save(Fornecedor fornecedor) {
        String sql = "INSERT INTO Fornecedor (cnpj, razao_social, contato_principal) VALUES (?, ?, ?)";
        jdbcTemplate.update(sql, 
            fornecedor.getCnpj(), 
            fornecedor.getRazaoSocial(), 
            fornecedor.getContatoPrincipal()
        );
        return fornecedor;
    }

    public int update(Fornecedor fornecedor) {
        String sql = "UPDATE Fornecedor SET razao_social = ?, contato_principal = ? WHERE cnpj = ?";
        return jdbcTemplate.update(sql, 
            fornecedor.getRazaoSocial(), 
            fornecedor.getContatoPrincipal(), 
            fornecedor.getCnpj()
        );
    }

    public int deleteByCnpj(String cnpj) {
        String sql = "DELETE FROM Fornecedor WHERE cnpj = ?";
        return jdbcTemplate.update(sql, cnpj);
    }
}