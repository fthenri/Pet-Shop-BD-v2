package com.pet_shop.pet_shop.Model;

import java.math.BigDecimal;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Produto {
    private Integer cod_produto;
    private String nome_produto;
    private String descricao;
    private BigDecimal preco_venda;
    private int quantidade_estoque;
    private String cnpjFornecedor;

}