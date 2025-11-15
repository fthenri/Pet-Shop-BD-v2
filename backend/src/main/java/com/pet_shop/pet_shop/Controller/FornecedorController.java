package com.pet_shop.pet_shop.Controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.pet_shop.pet_shop.DTO.FornecedorRequestDTO;
import com.pet_shop.pet_shop.DTO.FornecedorResponseDTO;
import com.pet_shop.pet_shop.Service.FornecedorService;
import com.pet_shop.pet_shop.exception.ResourceNotFoundException;

@RestController
@RequestMapping("/api/fornecedores") 
@CrossOrigin(origins = "*")
public class FornecedorController {

    @Autowired
    private FornecedorService fornecedorService;

    @PostMapping
    public ResponseEntity<FornecedorResponseDTO> createFornecedor(@RequestBody FornecedorRequestDTO fornecedorDTO) {
        FornecedorResponseDTO novoFornecedor = fornecedorService.createFornecedor(fornecedorDTO);
        return ResponseEntity.ok(novoFornecedor);
    }

    @GetMapping
    public ResponseEntity<List<FornecedorResponseDTO>> getAllFornecedores() {
        return ResponseEntity.ok(fornecedorService.getAllFornecedores());
    }

    @GetMapping("/{cnpj}")
    public ResponseEntity<FornecedorResponseDTO> getFornecedorByCnpj(@PathVariable String cnpj) {
        FornecedorResponseDTO fornecedor = fornecedorService.getFornecedorByCnpj(cnpj);
        return ResponseEntity.ok(fornecedor);
    }

    @PutMapping("/{cnpj}")
    public ResponseEntity<FornecedorResponseDTO> updateFornecedor(@PathVariable String cnpj,
            @RequestBody FornecedorRequestDTO fornecedorDTO) {
        FornecedorResponseDTO fornecedorAtualizado = fornecedorService.updateFornecedor(cnpj, fornecedorDTO);
        return ResponseEntity.ok(fornecedorAtualizado);
    }

    @DeleteMapping("/{cnpj}")
    public ResponseEntity<?> deleteFornecedor(@PathVariable String cnpj) {
        try {
            fornecedorService.deleteFornecedor(cnpj);
            return ResponseEntity.noContent().build();
        } catch (ResourceNotFoundException e) {
            return ResponseEntity.status(404)
                    .body(new ErrorResponse(e.getMessage()));
        } catch (RuntimeException e) {
            return ResponseEntity.status(400)
                    .body(new ErrorResponse(e.getMessage()));
        }
    }

    private static class ErrorResponse {
        private final String message;

        public ErrorResponse(String message) {
            this.message = message;
        }

        public String getMessage() {
            return message;
        }
    }
}