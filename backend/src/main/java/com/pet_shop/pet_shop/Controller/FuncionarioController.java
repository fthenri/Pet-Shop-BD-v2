package com.pet_shop.pet_shop.Controller;

import com.pet_shop.pet_shop.DTO.FuncionarioGeralResponseDTO;
import com.pet_shop.pet_shop.DTO.FuncionarioRequestDTO;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.pet_shop.pet_shop.DTO.AtendenteRequestDTO;
import com.pet_shop.pet_shop.DTO.AtendenteResponseDTO;
import com.pet_shop.pet_shop.DTO.VeterinarioRequestDTO;
import com.pet_shop.pet_shop.DTO.VeterinarioResponseDTO;
import com.pet_shop.pet_shop.Service.FuncionarioService;
import com.pet_shop.pet_shop.exception.ResourceNotFoundException;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "*")
public class FuncionarioController {

    @Autowired
    private FuncionarioService funcionarioService;


    @PostMapping("/veterinarios")
    public ResponseEntity<VeterinarioResponseDTO> createVeterinario(@RequestBody VeterinarioRequestDTO dto) {
        return ResponseEntity.ok(funcionarioService.createVeterinario(dto));
    }

    @GetMapping("/veterinarios")
    public ResponseEntity<List<VeterinarioResponseDTO>> getAllVeterinarios() {
        return ResponseEntity.ok(funcionarioService.getAllVeterinarios());
    }

    @GetMapping("/veterinarios/{id}")
    public ResponseEntity<VeterinarioResponseDTO> getVeterinarioById(@PathVariable int id) {
        return ResponseEntity.ok(funcionarioService.getVeterinarioById(id));
    }

    @PutMapping("/veterinarios/{id}")
    public ResponseEntity<VeterinarioResponseDTO> updateVeterinario(@PathVariable int id, @RequestBody VeterinarioRequestDTO dto) {
        return ResponseEntity.ok(funcionarioService.updateVeterinario(id, dto));
    }


    @PostMapping("/atendentes")
    public ResponseEntity<AtendenteResponseDTO> createAtendente(@RequestBody AtendenteRequestDTO dto) {
        return ResponseEntity.ok(funcionarioService.createAtendente(dto));
    }

    @GetMapping("/atendentes")
    public ResponseEntity<List<AtendenteResponseDTO>> getAllAtendentes() {
        return ResponseEntity.ok(funcionarioService.getAllAtendentes());
    }

    @GetMapping("/atendentes/{id}")
    public ResponseEntity<AtendenteResponseDTO> getAtendenteById(@PathVariable int id) {
        return ResponseEntity.ok(funcionarioService.getAtendenteById(id));
    }

    @PutMapping("/atendentes/{id}")
    public ResponseEntity<AtendenteResponseDTO> updateAtendente(@PathVariable int id, @RequestBody AtendenteRequestDTO dto) {
        return ResponseEntity.ok(funcionarioService.updateAtendente(id, dto));
    }

    @PostMapping("/funcionarios")
    public ResponseEntity<FuncionarioGeralResponseDTO> createFuncionarioPuro(@RequestBody FuncionarioRequestDTO dto) {
        return ResponseEntity.ok(funcionarioService.createFuncionarioPuro(dto));
    }

    @PutMapping("/funcionarios/{id}")
    public ResponseEntity<FuncionarioGeralResponseDTO> updateFuncionarioPuro(@PathVariable int id, @RequestBody FuncionarioRequestDTO dto) {
        return ResponseEntity.ok(funcionarioService.updateFuncionarioPuro(id, dto));
    }

    @GetMapping("/funcionarios/geral")
    public ResponseEntity<List<FuncionarioGeralResponseDTO>> getAllFuncionariosGeral() {
        return ResponseEntity.ok(funcionarioService.getAllFuncionariosGeral());
    }

    @DeleteMapping("/funcionarios/{id}")
    public ResponseEntity<?> deleteFuncionario(@PathVariable int id) {
        try {
            funcionarioService.deleteFuncionario(id);
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
        public ErrorResponse(String message) { this.message = message; }
        public String getMessage() { return message; }
    }
}