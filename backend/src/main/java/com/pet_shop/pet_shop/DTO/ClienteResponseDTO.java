package com.pet_shop.pet_shop.DTO;

import java.time.LocalDateTime;

import com.pet_shop.pet_shop.Model.Cliente;

public class ClienteResponseDTO {
    private String cpf;
    private String nome;
    private LocalDateTime dataCadastro;
    private String telefone1;
    private String telefone2;
    private String logradouro;
    private String numero;
    private String bairro;
    private String cidade;
    private String estado;
    private String cep;

    public ClienteResponseDTO(Cliente cliente) {
        this.cpf = cliente.getCpf();
        this.nome = cliente.getNome();
        this.dataCadastro = cliente.getDataCadastro();
        this.telefone1 = cliente.getTelefone1();
        this.telefone2 = cliente.getTelefone2();
        this.logradouro = cliente.getLogradouro();
        this.numero = cliente.getNumero();
        this.bairro = cliente.getBairro();
        this.cidade = cliente.getCidade();
        this.estado = cliente.getEstado();
        this.cep = cliente.getCep();
    }

    public String getCpf() {
        return cpf;
    }

    public String getNome() {
        return nome;
    }

    public LocalDateTime getDataCadastro() {
        return dataCadastro;
    }

    public String getTelefone1() {
        return telefone1;
    }

    public String getTelefone2() {
        return telefone2;
    }

    public String getLogradouro() {
        return logradouro;
    }

    public String getNumero() {
        return numero;
    }

    public String getBairro() {
        return bairro;
    }

    public String getCidade() {
        return cidade;
    }

    public String getEstado() {
        return estado;
    }

    public String getCep() {
        return cep;
    }
}
