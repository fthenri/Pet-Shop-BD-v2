package com.pet_shop.pet_shop.Controller;

import com.pet_shop.pet_shop.DTO.ConsultaRequestDTO;
import com.pet_shop.pet_shop.DTO.ConsultaResponseDTO;
import com.pet_shop.pet_shop.DTO.ConsultaSqlRequestDTO;
import com.pet_shop.pet_shop.Service.ConsultaService;
import com.pet_shop.pet_shop.exception.BusinessException;
import com.pet_shop.pet_shop.exception.ResourceNotFoundException; 
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus; 
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/consultas")
@CrossOrigin(origins = "*") 
public class ConsultaController {

    @Autowired
    private ConsultaService consultaService;

    @PostMapping
    public ResponseEntity<?> createConsulta(@RequestBody ConsultaRequestDTO consultaDTO) {
        try {
            ConsultaResponseDTO novaConsulta = consultaService.createConsulta(consultaDTO);
            return ResponseEntity.status(HttpStatus.CREATED).body(novaConsulta);
        } catch (ResourceNotFoundException | BusinessException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(new ErrorResponse(e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ErrorResponse("Erro ao registrar consulta: " + e.getMessage()));
        }
    }

    @PostMapping("/executar")
    public ResponseEntity<?> executarConsulta(@RequestBody ConsultaSqlRequestDTO request) {
        try {
            List<Map<String, Object>> resultado = consultaService.executeSelectQuery(request.getQuery());
            return ResponseEntity.ok(resultado);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("Erro ao executar a consulta: " + e.getMessage());
        }
    }

    private static class ErrorResponse {
        private final String message;
        public ErrorResponse(String message) { this.message = message; }
        public String getMessage() { return message; }
    }
}