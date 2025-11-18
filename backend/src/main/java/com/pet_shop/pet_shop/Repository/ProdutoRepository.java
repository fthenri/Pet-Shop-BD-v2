package com.pet_shop.pet_shop.Repository;

import com.pet_shop.pet_shop.Model.Produto;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.jdbc.support.GeneratedKeyHolder;
import org.springframework.jdbc.support.KeyHolder;
import org.springframework.stereotype.Repository;

import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;
import java.util.List;
import java.util.Optional;

@Repository
public class ProdutoRepository {

    @Autowired
    private JdbcTemplate jdbcTemplate;

    private final RowMapper<Produto> rowMapper = (rs, rowNum) -> {
        Produto produto = new Produto();
        produto.setCod_produto(rs.getInt("cod_produto"));
        produto.setNome_produto(rs.getString("nome_produto"));
        produto.setDescricao(rs.getString("descricao"));
        produto.setPreco_venda(rs.getBigDecimal("preco_venda"));
        produto.setQuantidade_estoque(rs.getInt("quantidade_estoque"));
        produto.setCnpjFornecedor(rs.getString("cnpjFornecedor"));
        return produto;
    };

    public List<Produto> findAll() {
        final String sql = "SELECT * FROM Produto";
        return jdbcTemplate.query(sql, rowMapper);
    }

    public Optional<Produto> findById(int cod_produto) {
        final String sql = "SELECT * FROM Produto WHERE cod_produto = ?";
        try {
            Produto produto = jdbcTemplate.queryForObject(sql, new Object[]{cod_produto}, rowMapper);
            return Optional.ofNullable(produto);
        } catch (Exception e) {
            return Optional.empty();
        }
    }

    public Produto save(Produto produto) {
        final String sql = "INSERT INTO Produto (nome_produto, descricao, preco_venda, quantidade_estoque, cnpjFornecedor) VALUES (?, ?, ?, ?, ?)";
        KeyHolder keyHolder = new GeneratedKeyHolder();

        jdbcTemplate.update(connection -> {
            PreparedStatement ps = connection.prepareStatement(sql, Statement.RETURN_GENERATED_KEYS);
            ps.setString(1, produto.getNome_produto());
            ps.setString(2, produto.getDescricao());
            ps.setBigDecimal(3, produto.getPreco_venda());
            ps.setInt(4, produto.getQuantidade_estoque());
            ps.setString(5, produto.getCnpjFornecedor());
            return ps;
        }, keyHolder);

        produto.setCod_produto(keyHolder.getKey().intValue());
        return produto;
    }

    public int update(Produto produto) {
        final String sql = "UPDATE Produto SET nome_produto = ?, descricao = ?, preco_venda = ?, quantidade_estoque = ?, cnpjFornecedor = ? WHERE cod_produto = ?";
        return jdbcTemplate.update(sql, produto.getNome_produto(), produto.getDescricao(), produto.getPreco_venda(), produto.getQuantidade_estoque(), produto.getCnpjFornecedor(), produto.getCod_produto());
    }

    public int deleteById(int cod_produto) {
        final String sql = "DELETE FROM Produto WHERE cod_produto = ?";
        return jdbcTemplate.update(sql, cod_produto);
    }
}