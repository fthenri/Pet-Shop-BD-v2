package com.pet_shop.pet_shop.DTO;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public class VendaResponseDTO {

    private Integer numVenda;
    private LocalDateTime dataHora;
    private BigDecimal valorTotal;
    private String formaPagamento;
    private String cpfCliente;
    private Integer codFuncionario;
    
    public Integer getNumVenda() {
        return numVenda;
    }

    public void setNumVenda(Integer numVenda) {
        this.numVenda = numVenda;
    }

    public LocalDateTime getDataHora() {
        return dataHora;
    }

    public void setDataHora(LocalDateTime dataHora) {
        this.dataHora = dataHora;
    }

    public BigDecimal getValorTotal() {
        return valorTotal;
    }

    public void setValorTotal(BigDecimal valorTotal) {
        this.valorTotal = valorTotal;
    }

    public String getFormaPagamento() {
        return formaPagamento;
    }

    public void setFormaPagamento(String formaPagamento) {
        this.formaPagamento = formaPagamento;
    }

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
}
