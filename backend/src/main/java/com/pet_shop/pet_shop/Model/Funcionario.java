package com.pet_shop.pet_shop.Model;

import java.time.LocalDate;

public class Funcionario {
    private Integer codFuncionario;
    private String nome;
    private String cpf;
    private LocalDate dataAdmissao;
    private Integer codSupervisor;

    public Funcionario() {
    }

    public Funcionario(Integer codFuncionario, String nome, String cpf, LocalDate dataAdmissao, Integer codSupervisor) {
        this.codFuncionario = codFuncionario;
        this.nome = nome;
        this.cpf = cpf;
        this.dataAdmissao = dataAdmissao;
        this.codSupervisor = codSupervisor;
    }

    public Integer getCodFuncionario() {
        return codFuncionario;
    }

    public void setCodFuncionario(Integer codFuncionario) {
        this.codFuncionario = codFuncionario;
    }

    public String getNome() {
        return nome;
    }

    public void setNome(String nome) {
        this.nome = nome;
    }

    public String getCpf() {
        return cpf;
    }

    public void setCpf(String cpf) {
        this.cpf = cpf;
    }

    public LocalDate getDataAdmissao() {
        return dataAdmissao;
    }

    public void setDataAdmissao(LocalDate dataAdmissao) {
        this.dataAdmissao = dataAdmissao;
    }

    public Integer getCodSupervisor() {
        return codSupervisor;
    }

    public void setCodSupervisor(Integer codSupervisor) {
        this.codSupervisor = codSupervisor;
    }
}