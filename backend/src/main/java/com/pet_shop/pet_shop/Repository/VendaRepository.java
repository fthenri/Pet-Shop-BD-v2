package com.pet_shop.pet_shop.Repository;

import com.pet_shop.pet_shop.DTO.ItemVendaRequestDTO;
import com.pet_shop.pet_shop.Model.Venda;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.support.GeneratedKeyHolder;
import org.springframework.jdbc.support.KeyHolder;
import org.springframework.stereotype.Repository;

import java.sql.PreparedStatement;
import java.sql.Statement;

@Repository
public class VendaRepository {

    @Autowired
    private JdbcTemplate jdbcTemplate;

    public Venda saveVenda(Venda venda) {
        final String sql = "INSERT INTO Venda (cpfCliente, cod_funcionario, data_hora, valor_total, forma_pagamento) VALUES (?, ?, ?, ?, ?)";
        KeyHolder keyHolder = new GeneratedKeyHolder();

        jdbcTemplate.update(connection -> {
            PreparedStatement ps = connection.prepareStatement(sql, Statement.RETURN_GENERATED_KEYS);
            ps.setString(1, venda.getCpfCliente());
            ps.setInt(2, venda.getCodFuncionario());
            ps.setTimestamp(3, java.sql.Timestamp.valueOf(venda.getDataHora()));
            ps.setBigDecimal(4, venda.getValorTotal());
            ps.setString(5, venda.getFormaPagamento());
            return ps;
        }, keyHolder);

        venda.setNumVenda(keyHolder.getKey().intValue());
        return venda;
    }

    public void saveItemVenda(int numVenda, ItemVendaRequestDTO item) {
        final String sql = "INSERT INTO contem (cod_produto, num_venda, quantidade) VALUES (?, ?, ?)";
        jdbcTemplate.update(sql, item.getCodProduto(), numVenda, item.getQuantidade());
    }
}