package com.pet_shop.pet_shop.DTO;

import java.time.LocalDate;

public record FuncionarioGeralResponseDTO(
    Integer codFuncionario,
    String nome,
    String cpf,
    LocalDate dataAdmissao,
    Integer codSupervisor,
    String crmv, 
    String tipo 
) {
}