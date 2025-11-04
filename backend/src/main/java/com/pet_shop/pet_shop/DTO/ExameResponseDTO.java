package com.pet_shop.pet_shop.DTO;

public class ExameResponseDTO {
    private Integer numConsulta;
    private String nomeExame;
    private String dataSolicitacao;
    private String resultado;

    public ExameResponseDTO(Integer numConsulta, String nomeExame, String dataSolicitacao, String resultado) {
        this.numConsulta = numConsulta;
        this.nomeExame = nomeExame;
        this.dataSolicitacao = dataSolicitacao;
        this.resultado = resultado;
    }

    public Integer getNumConsulta() {
        return numConsulta;
    }

    public String getNomeExame() {
        return nomeExame;
    }

    public String getDataSolicitacao() {
        return dataSolicitacao;
    }

    public String getResultado() {
        return resultado;
    }
}
