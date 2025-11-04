package com.pet_shop.pet_shop.Repository;

import com.pet_shop.pet_shop.Model.Produto;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.stereotype.Repository;

import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.List;
import java.util.Optional;

@Repository
public class ProdutoRepository {

    @Autowired
    private JdbcTemplate jdbcTemplate;

    // RowMapper para mapear o resultado da consulta para um objeto Produto
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

    /**
     * Retorna todos os produtos do banco de dados.
     */
    public List<Produto> findAll() {
        final String sql = "SELECT * FROM Produto";
        return jdbcTemplate.query(sql, rowMapper);
    }

    /**
     * Busca um produto pelo seu código.
     */
    public Optional<Produto> findById(int cod_produto) {
        final String sql = "SELECT * FROM Produto WHERE cod_produto = ?";
        try {
            Produto produto = jdbcTemplate.queryForObject(sql, new Object[]{cod_produto}, rowMapper);
            return Optional.ofNullable(produto);
        } catch (Exception e) {
            return Optional.empty();
        }
    }

    /**
     * Salva um novo produto no banco de dados (inserção).
     */
    public int save(Produto produto) {
        final String sql = "INSERT INTO Produto (nome_produto, descricao, preco_venda, quantidade_estoque, cnpjFornecedor) VALUES (?, ?, ?, ?, ?)";
        return jdbcTemplate.update(sql, produto.getNome_produto(), produto.getDescricao(), produto.getPreco_venda(), produto.getQuantidade_estoque(), produto.getCnpjFornecedor());
    }

    /**
     * Atualiza um produto existente no banco de dados.
     */
    public int update(Produto produto) {
        final String sql = "UPDATE Produto SET nome_produto = ?, descricao = ?, preco_venda = ?, quantidade_estoque = ?, cnpjFornecedor = ? WHERE cod_produto = ?";
        return jdbcTemplate.update(sql, produto.getNome_produto(), produto.getDescricao(), produto.getPreco_venda(), produto.getQuantidade_estoque(), produto.getCnpjFornecedor(), produto.getCod_produto());
    }

    /**
     * Deleta um produto do banco de dados pelo seu código.
     */
    public int deleteById(int cod_produto) {
        final String sql = "DELETE FROM Produto WHERE cod_produto = ?";
        return jdbcTemplate.update(sql, cod_produto);
    }
}