package com.pet_shop.pet_shop.DTO;

import java.time.LocalDate;

public record VeterinarioRequestDTO(
    String nome, 
    String cpf, 
    LocalDate dataAdmissao, 
    Integer codSupervisor,
    String crmv
    ) {
    
}
