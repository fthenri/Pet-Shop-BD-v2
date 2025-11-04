package com.pet_shop.pet_shop.Model;

import java.time.LocalDate;

public class Pet {
    private String cpfCliente;
    private String nomePet;
    private String especie;
    private String raca;
    private LocalDate dataNascimento;
    private String observacoes;

    public Pet() {
    }

    public Pet(String cpfCliente, String nomePet, String especie, String raca, LocalDate dataNascimento, String observacoes) {
        this.cpfCliente = cpfCliente;
        this.nomePet = nomePet;
        this.especie = especie;
        this.raca = raca;
        this.dataNascimento = dataNascimento;
        this.observacoes = observacoes;
    }

    public String getCpfCliente() {
        return cpfCliente;
    }

    public void setCpfCliente(String cpfCliente) {
        this.cpfCliente = cpfCliente;
    }

    public String getNomePet() {
        return nomePet;
    }

    public void setNomePet(String nomePet) {
        this.nomePet = nomePet;
    }

    public String getEspecie() {
        return especie;
    }

    public void setEspecie(String especie) {
        this.especie = especie;
    }

    public String getRaca() {
        return raca;
    }

    public void setRaca(String raca) {
        this.raca = raca;
    }

    public LocalDate getDataNascimento() {
        return dataNascimento;
    }

    public void setDataNascimento(LocalDate dataNascimento) {
        this.dataNascimento = dataNascimento;
    }

    public String getObservacoes() {
        return observacoes;
    }

    public void setObservacoes(String observacoes) {
        this.observacoes = observacoes;
    }
}