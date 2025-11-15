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
@RequestMapping("/api")
@CrossOrigin(origins = "*")
public class PetController {

    @Autowired
    private PetService petService;

    @GetMapping("/clientes/{cpf}/pets")
    public ResponseEntity<List<PetResponseDTO>> getPetsByCliente(@PathVariable String cpf) {
        return ResponseEntity.ok(petService.getPetsByClienteCpf(cpf));
    }

    @GetMapping("/pets") 
    public ResponseEntity<List<PetResponseDTO>> getAllPets() {
        return ResponseEntity.ok(petService.getAllPets());
    }

    @PostMapping("/pets")
    public ResponseEntity<PetResponseDTO> createPet(@RequestBody PetRequestDTO petDTO) {
        PetResponseDTO novoPet = petService.createPet(petDTO);
        return ResponseEntity.ok(novoPet);
    }

    @PutMapping("/pets/{codPet}")
    public ResponseEntity<PetResponseDTO> updatePet(@PathVariable int codPet, @RequestBody PetRequestDTO petDTO) {
        PetResponseDTO petAtualizado = petService.updatePet(codPet, petDTO);
        return ResponseEntity.ok(petAtualizado);
    }

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