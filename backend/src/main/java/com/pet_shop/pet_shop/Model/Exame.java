package com.pet_shop.pet_shop.Model;

import java.time.LocalDate;

public class Exame {
    private Integer numConsulta;
    private String nomeExame;
    private LocalDate dataSolicitacao;
    private String resultado;

    public Exame() {
    }

    public Exame(Integer numConsulta, String nomeExame, LocalDate dataSolicitacao, String resultado) {
        this.numConsulta = numConsulta;
        this.nomeExame = nomeExame;
        this.dataSolicitacao = dataSolicitacao;
        this.resultado = resultado;
    }

    public Integer getNumConsulta() {
        return numConsulta;
    }

    public void setNumConsulta(Integer numConsulta) {
        this.numConsulta = numConsulta;
    }

    public String getNomeExame() {
        return nomeExame;
    }

    public void setNomeExame(String nomeExame) {
        this.nomeExame = nomeExame;
    }

    public LocalDate getDataSolicitacao() {
        return dataSolicitacao;
    }

    public void setDataSolicitacao(LocalDate dataSolicitacao) {
        this.dataSolicitacao = dataSolicitacao;
    }

    public String getResultado() {
        return resultado;
    }

    public void setResultado(String resultado) {
        this.resultado = resultado;
    }
}