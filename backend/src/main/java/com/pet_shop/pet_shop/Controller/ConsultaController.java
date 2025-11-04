package com.pet_shop.pet_shop.Controller;

import com.pet_shop.pet_shop.DTO.ConsultaSqlRequestDTO;
import com.pet_shop.pet_shop.Service.ConsultaService;
import org.springframework.beans.factory.annotation.Autowired;
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
}