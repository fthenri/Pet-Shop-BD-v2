package com.pet_shop.pet_shop.DTO;

import java.time.LocalDate;

import com.pet_shop.pet_shop.Model.Atendente;

public record AtendenteResponseDTO(Integer codFuncionario, String nome, String cpf, LocalDate dataAdmissao,
        Integer codSupervisor) {
    public AtendenteResponseDTO(Atendente atendente) {
        this(atendente.getCodFuncionario(), atendente.getNome(), atendente.getCpf(), atendente.getDataAdmissao(),
                atendente.getCodSupervisor());
    }
}
