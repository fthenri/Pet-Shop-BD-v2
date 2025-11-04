package com.pet_shop.pet_shop.DTO;

import java.time.LocalDate;
import com.pet_shop.pet_shop.Model.Veterinario;

public record VeterinarioResponseDTO(
    Integer codFuncionario, 
    String nome, 
    String cpf, 
    LocalDate dataAdmissao,
    Integer codSupervisor,
    String crmv
) {
    public VeterinarioResponseDTO(Veterinario veterinario) {
        this(
            veterinario.getCodFuncionario(), 
            veterinario.getNome(), 
            veterinario.getCpf(), 
            veterinario.getDataAdmissao(),
            veterinario.getCodSupervisor(),
            veterinario.getCrmv()
        );
    }
}