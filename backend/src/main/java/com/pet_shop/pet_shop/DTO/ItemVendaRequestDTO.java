package com.pet_shop.pet_shop.DTO;

public class ItemVendaRequestDTO {
    private Integer codProduto;
    private int quantidade;

    public Integer getCodProduto() {
        return codProduto;
    }
    public void setCodProduto(Integer codProduto) {
        this.codProduto = codProduto;
    }
    public int getQuantidade() {
        return quantidade;
    }
    public void setQuantidade(int quantidade) {
        this.quantidade = quantidade;
    }
}