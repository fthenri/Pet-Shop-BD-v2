package com.pet_shop.pet_shop.DTO;

import java.util.List;

public class VendaCompletaRequestDTO {
    
    private String cpfCliente;
    private Integer codFuncionario;
    private String formaPagamento;
    private List<ItemVendaRequestDTO> itens;

    public String getCpfCliente() {
        return cpfCliente;
    }
    public void setCpfCliente(String cpfCliente) {
        this.cpfCliente = cpfCliente;
    }
    public Integer getCodFuncionario() {
        return codFuncionario;
    }
    public void setCodFuncionario(Integer codFuncionario) {
        this.codFuncionario = codFuncionario;
    }
    public String getFormaPagamento() {
        return formaPagamento;
    }
    public void setFormaPagamento(String formaPagamento) {
        this.formaPagamento = formaPagamento;
    }
    public List<ItemVendaRequestDTO> getItens() {
        return itens;
    }
    public void setItens(List<ItemVendaRequestDTO> itens) {
        this.itens = itens;
    }
}