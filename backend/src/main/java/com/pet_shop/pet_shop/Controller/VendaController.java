package com.pet_shop.pet_shop.Controller;

import com.pet_shop.pet_shop.DTO.VendaCompletaRequestDTO;
import com.pet_shop.pet_shop.DTO.VendaResponseDTO;
import com.pet_shop.pet_shop.Service.VendaService;
import com.pet_shop.pet_shop.exception.BusinessException;
import com.pet_shop.pet_shop.exception.ResourceNotFoundException;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/vendas")
@CrossOrigin(origins = "*")
public class VendaController {

    @Autowired
    private VendaService vendaService;

    @PostMapping
    public ResponseEntity<?> registrarVenda(@RequestBody VendaCompletaRequestDTO vendaDTO) {
        try {
            VendaResponseDTO novaVenda = vendaService.createVenda(vendaDTO);
            return ResponseEntity.status(HttpStatus.CREATED).body(novaVenda);
        } catch (ResourceNotFoundException | BusinessException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(new ErrorResponse(e.getMessage()));
        } catch (Exception e) {
             return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ErrorResponse("Erro interno ao processar a venda: " + e.getMessage()));
        }
    }

    private static class ErrorResponse {
        private final String message;
        public ErrorResponse(String message) { this.message = message; }
        public String getMessage() { return message; }
    }
}