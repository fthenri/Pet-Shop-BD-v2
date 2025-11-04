package com.pet_shop.pet_shop.Model;

import java.time.LocalDateTime;

public class Consulta {
    private Integer numConsulta;
    private LocalDateTime dataHora;
    private String sintomasRelatados;
    private String diagnostico;
    private String cpfClientePet;
    private String nomePet;
    private Integer codVeterinario;

    public Consulta() {
    }

    public Consulta(Integer numConsulta, LocalDateTime dataHora, String sintomasRelatados, String diagnostico, String cpfClientePet, String nomePet, Integer codVeterinario) {
        this.numConsulta = numConsulta;
        this.dataHora = dataHora;
        this.sintomasRelatados = sintomasRelatados;
        this.diagnostico = diagnostico;
        this.cpfClientePet = cpfClientePet;
        this.nomePet = nomePet;
        this.codVeterinario = codVeterinario;
    }

    public Integer getNumConsulta() {
        return numConsulta;
    }

    public void setNumConsulta(Integer numConsulta) {
        this.numConsulta = numConsulta;
    }

    public LocalDateTime getDataHora() {
        return dataHora;
    }

    public void setDataHora(LocalDateTime dataHora) {
        this.dataHora = dataHora;
    }

    public String getSintomasRelatados() {
        return sintomasRelatados;
    }

    public void setSintomasRelatados(String sintomasRelatados) {
        this.sintomasRelatados = sintomasRelatados;
    }

    public String getDiagnostico() {
        return diagnostico;
    }

    public void setDiagnostico(String diagnostico) {
        this.diagnostico = diagnostico;
    }

    public String getCpfClientePet() {
        return cpfClientePet;
    }

    public void setCpfClientePet(String cpfClientePet) {
        this.cpfClientePet = cpfClientePet;
    }

    public String getNomePet() {
        return nomePet;
    }

    public void setNomePet(String nomePet) {
        this.nomePet = nomePet;
    }

    public Integer getCodVeterinario() {
        return codVeterinario;
    }

    public void setCodVeterinario(Integer codVeterinario) {
        this.codVeterinario = codVeterinario;
    }
}