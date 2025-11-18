package com.pet_shop.pet_shop.Service;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.pet_shop.pet_shop.DTO.FornecedorRequestDTO;
import com.pet_shop.pet_shop.DTO.FornecedorResponseDTO;
import com.pet_shop.pet_shop.Model.Fornecedor;
import com.pet_shop.pet_shop.Repository.FornecedorRepository;
import com.pet_shop.pet_shop.exception.BusinessException;
import com.pet_shop.pet_shop.exception.ResourceNotFoundException;

@Service
public class FornecedorService {

    @Autowired
    private FornecedorRepository fornecedorRepository;

    private FornecedorResponseDTO toResponseDTO(Fornecedor fornecedor) {
        FornecedorResponseDTO dto = new FornecedorResponseDTO();
        dto.setCnpj(fornecedor.getCnpj());
        dto.setRazaoSocial(fornecedor.getRazaoSocial());
        dto.setContatoPrincipal(fornecedor.getContatoPrincipal());
        return dto;
    }

    public List<FornecedorResponseDTO> getAllFornecedores() {
        return fornecedorRepository.findAll().stream()
                .map(this::toResponseDTO)
                .collect(Collectors.toList());
    }

    public FornecedorResponseDTO getFornecedorByCnpj(String cnpj) {
        Fornecedor fornecedor = fornecedorRepository.findByCnpj(cnpj)
                .orElseThrow(() -> new ResourceNotFoundException("Fornecedor com CNPJ '" + cnpj + "' não encontrado."));
        return toResponseDTO(fornecedor);
    }

    public FornecedorResponseDTO createFornecedor(FornecedorRequestDTO fornecedorDTO) {
        fornecedorRepository.findByCnpj(fornecedorDTO.getCnpj()).ifPresent(f -> {
            throw new BusinessException("CNPJ já cadastrado.");
        });

        Fornecedor fornecedor = new Fornecedor();
        fornecedor.setCnpj(fornecedorDTO.getCnpj());
        fornecedor.setRazaoSocial(fornecedorDTO.getRazaoSocial());
        fornecedor.setContatoPrincipal(fornecedorDTO.getContatoPrincipal());

        Fornecedor savedFornecedor = fornecedorRepository.save(fornecedor);
        return toResponseDTO(savedFornecedor);
    }

    public FornecedorResponseDTO updateFornecedor(String cnpj, FornecedorRequestDTO fornecedorDTO) {
        Fornecedor fornecedorExistente = fornecedorRepository.findByCnpj(cnpj)
                .orElseThrow(() -> new ResourceNotFoundException("Não é possível atualizar. Fornecedor com CNPJ '" + cnpj + "' não encontrado."));

        fornecedorExistente.setRazaoSocial(fornecedorDTO.getRazaoSocial());
        fornecedorExistente.setContatoPrincipal(fornecedorDTO.getContatoPrincipal());

        fornecedorRepository.update(fornecedorExistente);
        return toResponseDTO(fornecedorExistente);
    }

    public void deleteFornecedor(String cnpj) {
        Fornecedor fornecedor = fornecedorRepository.findByCnpj(cnpj)
                .orElseThrow(() -> new ResourceNotFoundException("Não é possível deletar. Fornecedor com CNPJ '" + cnpj + "' não encontrado."));
        try {
            fornecedorRepository.deleteByCnpj(cnpj);
        } catch (Exception e) {
            throw new RuntimeException("Não é possível excluir o fornecedor, pois existem produtos associados a ele. Exclua primeiro os produtos relacionados.", e);
        }
    }
}