package com.pet_shop.pet_shop.DTO;

import java.time.LocalDateTime;

public class ConsultaResponseDTO {

    private Integer numConsulta;
    private LocalDateTime dataHora;
    private String sintomasRelatados;
    private String diagnostico;
    private Integer codPet;
    private Integer codVeterinario;

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

    public Integer getCodPet() {
        return codPet;
    }

    public void setCodPet(Integer codPet) {
        this.codPet = codPet;
    }

    public Integer getCodVeterinario() {
        return codVeterinario;
    }

    public void setCodVeterinario(Integer codVeterinario) {
        this.codVeterinario = codVeterinario;
    }
}