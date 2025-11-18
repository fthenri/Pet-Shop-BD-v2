package com.pet_shop.pet_shop.DTO;

import java.time.LocalDateTime;

public class ConsultaRequestDTO {

    private String sintomasRelatados;
    private String diagnostico;
    private Integer codPet;
    private Integer codVeterinario;


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