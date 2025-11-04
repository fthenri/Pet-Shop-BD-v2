package com.pet_shop.pet_shop.Model;

import java.time.LocalDate;

public class Veterinario extends Funcionario {
    private String crmv;

    public Veterinario() {
        super();
    }

    public Veterinario(Integer codFuncionario, String nome, String cpf, LocalDate dataAdmissao, Integer codSupervisor, String crmv) {
        super(codFuncionario, nome, cpf, dataAdmissao, codSupervisor);
        this.crmv = crmv;
    }

    public String getCrmv() {
        return crmv;
    }

    public void setCrmv(String crmv) {
        this.crmv = crmv;
    }
}