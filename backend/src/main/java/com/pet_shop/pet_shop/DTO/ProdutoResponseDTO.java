package com.pet_shop.pet_shop.DTO;

import com.pet_shop.pet_shop.Model.Produto;
import java.math.BigDecimal;

public class ProdutoResponseDTO {
    private Integer cod_produto;
    private String nome_produto;
    private String descricao;
    private BigDecimal preco_venda;
    private int quantidade_estoque;

    public ProdutoResponseDTO(Produto produto) {
        this.cod_produto = produto.getCod_produto();
        this.nome_produto = produto.getNome_produto();
        this.descricao = produto.getDescricao();
        this.preco_venda = produto.getPreco_venda();
        this.quantidade_estoque = produto.getQuantidade_estoque();
    }

    // Getters
    public Integer getCod_produto() {
        return cod_produto;
    }

    public String getNome_produto() {
        return nome_produto;
    }

    public String getDescricao() {
        return descricao;
    }

    public BigDecimal getPreco_venda() {
        return preco_venda;
    }

    public int getQuantidade_estoque() {
        return quantidade_estoque;
    }
}
