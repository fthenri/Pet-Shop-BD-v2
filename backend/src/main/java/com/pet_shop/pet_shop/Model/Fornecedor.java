package com.pet_shop.pet_shop.Model;

public class Fornecedor {
    private String cnpj;
    private String razaoSocial;
    private String contatoPrincipal;

    public Fornecedor() {
    }

    public Fornecedor(String cnpj, String razaoSocial, String contatoPrincipal) {
        this.cnpj = cnpj;
        this.razaoSocial = razaoSocial;
        this.contatoPrincipal = contatoPrincipal;
    }

    public String getCnpj() {
        return cnpj;
    }

    public void setCnpj(String cnpj) {
        this.cnpj = cnpj;
    }

    public String getRazaoSocial() {
        return razaoSocial;
    }

    public void setRazaoSocial(String razaoSocial) {
        this.razaoSocial = razaoSocial;
    }

    public String getContatoPrincipal() {
        return contatoPrincipal;
    }

    public void setContatoPrincipal(String contatoPrincipal) {
        this.contatoPrincipal = contatoPrincipal;
    }
}