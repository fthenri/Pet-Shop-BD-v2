package com.pet_shop.pet_shop.Model;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public class Venda {
    private Integer numVenda;
    private LocalDateTime dataHora;
    private BigDecimal valorTotal;
    private String formaPagamento;
    private String cpfCliente;
    private Integer codFuncionario;

    public Venda() {
    }

    public Venda(Integer numVenda, LocalDateTime dataHora, BigDecimal valorTotal, String formaPagamento, String cpfCliente, Integer codFuncionario) {
        this.numVenda = numVenda;
        this.dataHora = dataHora;
        this.valorTotal = valorTotal;
        this.formaPagamento = formaPagamento;
        this.cpfCliente = cpfCliente;
        this.codFuncionario = codFuncionario;
    }

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