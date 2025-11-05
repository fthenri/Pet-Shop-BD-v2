package com.pet_shop.pet_shop.Service;

import com.pet_shop.pet_shop.DTO.PetRequestDTO;
import com.pet_shop.pet_shop.DTO.PetResponseDTO;
import com.pet_shop.pet_shop.Model.Pet;
import com.pet_shop.pet_shop.Repository.ClienteRepository;
import com.pet_shop.pet_shop.Repository.PetRepository;
import com.pet_shop.pet_shop.exception.ResourceNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class PetService {

    @Autowired
    private PetRepository petRepository;

    @Autowired
    private ClienteRepository clienteRepository; 

    private PetResponseDTO toResponseDTO(Pet pet) {
        PetResponseDTO dto = new PetResponseDTO();
        dto.setCpfCliente(pet.getCpfCliente());
        dto.setCod_pet(pet.getCod_pet()); 
        dto.setNomePet(pet.getNomePet());
        dto.setEspecie(pet.getEspecie());
        dto.setRaca(pet.getRaca());
        dto.setDataNascimento(pet.getDataNascimento());
        dto.setObservacoes(pet.getObservacoes());
        return dto;
    }

    public List<PetResponseDTO> getPetsByClienteCpf(String cpf) {
        if (clienteRepository.findByCpf(cpf) == null) {
            throw new ResourceNotFoundException("Cliente com CPF '" + cpf + "' não encontrado.");
        }
        return petRepository.findByCpfCliente(cpf).stream()
                .map(this::toResponseDTO)
                .collect(Collectors.toList());
    }

    public PetResponseDTO createPet(PetRequestDTO petDTO) {
        if (clienteRepository.findByCpf(petDTO.getCpfCliente()) == null) {
            throw new ResourceNotFoundException("Cliente com CPF '" + petDTO.getCpfCliente() + "' não encontrado.");
        }

        Pet pet = new Pet();
        pet.setCpfCliente(petDTO.getCpfCliente());
        pet.setNomePet(petDTO.getNomePet());
        pet.setEspecie(petDTO.getEspecie());
        pet.setRaca(petDTO.getRaca());
        pet.setDataNascimento(petDTO.getDataNascimento());
        pet.setObservacoes(petDTO.getObservacoes());

        Pet savedPet = petRepository.save(pet);
        return toResponseDTO(savedPet);
    }

    public PetResponseDTO updatePet(int codPet, PetRequestDTO petDTO) {
        Pet petExistente = petRepository.findByCodPet(codPet)
                .orElseThrow(() -> new ResourceNotFoundException("Pet com código '" + codPet + "' não encontrado."));

        petExistente.setNomePet(petDTO.getNomePet());
        petExistente.setEspecie(petDTO.getEspecie());
        petExistente.setRaca(petDTO.getRaca());
        petExistente.setDataNascimento(petDTO.getDataNascimento());
        petExistente.setObservacoes(petDTO.getObservacoes());
        
        petRepository.update(petExistente);
        return toResponseDTO(petExistente);
    }

    public void deletePet(int codPet) {
        Pet pet = petRepository.findByCodPet(codPet)
                .orElseThrow(() -> new ResourceNotFoundException("Pet com código '" + codPet + "' não encontrado."));
        
        try {
            petRepository.deleteByCodPet(codPet);
        } catch (Exception e) {
            throw new RuntimeException("Não é possível excluir o pet, pois ele possui consultas associadas.", e);
        }
    }
}