package com.pet_shop.pet_shop.Controller;

import com.pet_shop.pet_shop.DTO.PetRequestDTO;
import com.pet_shop.pet_shop.DTO.PetResponseDTO;
import com.pet_shop.pet_shop.Service.PetService;
import com.pet_shop.pet_shop.exception.ResourceNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api") // Define a rota base como /api
@CrossOrigin(origins = "*")
public class PetController {

    @Autowired
    private PetService petService;

    // Endpoint para LER todos os pets de UM cliente
    // Responde a GET /api/clientes/{cpf}/pets
    @GetMapping("/clientes/{cpf}/pets")
    public ResponseEntity<List<PetResponseDTO>> getPetsByCliente(@PathVariable String cpf) {
        return ResponseEntity.ok(petService.getPetsByClienteCpf(cpf));
    }

    // Endpoint para CRIAR um novo pet
    // Responde a POST /api/pets
    @PostMapping("/pets")
    public ResponseEntity<PetResponseDTO> createPet(@RequestBody PetRequestDTO petDTO) {
        PetResponseDTO novoPet = petService.createPet(petDTO);
        return ResponseEntity.ok(novoPet);
    }

    // Endpoint para ATUALIZAR um pet
    // Responde a PUT /api/pets/{codPet}
    @PutMapping("/pets/{codPet}")
    public ResponseEntity<PetResponseDTO> updatePet(@PathVariable int codPet, @RequestBody PetRequestDTO petDTO) {
        PetResponseDTO petAtualizado = petService.updatePet(codPet, petDTO);
        return ResponseEntity.ok(petAtualizado);
    }

    // Endpoint para DELETAR um pet
    // Responde a DELETE /api/pets/{codPet}
    @DeleteMapping("/pets/{codPet}")
    public ResponseEntity<?> deletePet(@PathVariable int codPet) {
        try {
            petService.deletePet(codPet);
            return ResponseEntity.noContent().build();
        } catch (ResourceNotFoundException e) {
            return ResponseEntity.status(404).body(e.getMessage());
        } catch (RuntimeException e) {
            return ResponseEntity.status(400).body(e.getMessage());
        }
    }
}