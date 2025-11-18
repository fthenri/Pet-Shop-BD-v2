package com.pet_shop.pet_shop.Service;

import com.pet_shop.pet_shop.DTO.FuncionarioGeralResponseDTO;
import com.pet_shop.pet_shop.DTO.FuncionarioRequestDTO;
import com.pet_shop.pet_shop.Model.Funcionario;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.pet_shop.pet_shop.DTO.AtendenteRequestDTO;
import com.pet_shop.pet_shop.DTO.AtendenteResponseDTO;
import com.pet_shop.pet_shop.DTO.VeterinarioRequestDTO;
import com.pet_shop.pet_shop.DTO.VeterinarioResponseDTO;
import com.pet_shop.pet_shop.Model.Atendente;
import com.pet_shop.pet_shop.Model.Veterinario;
import com.pet_shop.pet_shop.Repository.FuncionarioRepository;
import com.pet_shop.pet_shop.exception.BusinessException; 
import com.pet_shop.pet_shop.exception.ResourceNotFoundException;

@Service
public class FuncionarioService {

    @Autowired
    private FuncionarioRepository funcionarioRepository;


    @Transactional
    public VeterinarioResponseDTO createVeterinario(VeterinarioRequestDTO dto) {
        funcionarioRepository.findByCpf(dto.cpf()).ifPresent(f -> {
            throw new BusinessException("CPF já cadastrado.");
        });

        Veterinario vet = new Veterinario();
        vet.setNome(dto.nome());
        vet.setCpf(dto.cpf());
        vet.setDataAdmissao(dto.dataAdmissao());
        vet.setCodSupervisor(dto.codSupervisor());
        vet.setCrmv(dto.crmv());

        Veterinario savedVet = funcionarioRepository.saveVeterinario(vet);
        return new VeterinarioResponseDTO(savedVet);
    }

    public List<VeterinarioResponseDTO> getAllVeterinarios() {
        return funcionarioRepository.findAllVeterinarios().stream()
                .map(VeterinarioResponseDTO::new)
                .collect(Collectors.toList());
    }

    public VeterinarioResponseDTO getVeterinarioById(int id) {
        return funcionarioRepository.findVeterinarioById(id)
                .map(VeterinarioResponseDTO::new)
                .orElseThrow(() -> new ResourceNotFoundException("Veterinário com código '" + id + "' não encontrado."));
    }

    @Transactional
    public VeterinarioResponseDTO updateVeterinario(int id, VeterinarioRequestDTO dto) {
        Veterinario vetExistente = funcionarioRepository.findVeterinarioById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Veterinário com código '" + id + "' não encontrado."));

        vetExistente.setNome(dto.nome());
        vetExistente.setDataAdmissao(dto.dataAdmissao());
        vetExistente.setCodSupervisor(dto.codSupervisor());
                vetExistente.setCrmv(dto.crmv());
        
        funcionarioRepository.updateVeterinario(vetExistente);
        return new VeterinarioResponseDTO(vetExistente);
    }


    @Transactional
    public AtendenteResponseDTO createAtendente(AtendenteRequestDTO dto) {
        funcionarioRepository.findByCpf(dto.cpf()).ifPresent(f -> {
            throw new BusinessException("CPF já cadastrado.");
        });

        Atendente atendente = new Atendente();
        atendente.setNome(dto.nome());
        atendente.setCpf(dto.cpf());
        atendente.setDataAdmissao(dto.dataAdmissao());
        atendente.setCodSupervisor(dto.codSupervisor());

        Atendente savedAtendente = funcionarioRepository.saveAtendente(atendente);
        return new AtendenteResponseDTO(savedAtendente);
    }

    public List<AtendenteResponseDTO> getAllAtendentes() {
        return funcionarioRepository.findAllAtendentes().stream()
                .map(AtendenteResponseDTO::new)
                .collect(Collectors.toList());
    }

    public AtendenteResponseDTO getAtendenteById(int id) {
        return funcionarioRepository.findAtendenteById(id)
                .map(AtendenteResponseDTO::new)
                .orElseThrow(() -> new ResourceNotFoundException("Atendente com código '" + id + "' não encontrado."));
    }

    @Transactional
    public AtendenteResponseDTO updateAtendente(int id, AtendenteRequestDTO dto) {
        Atendente atendenteExistente = funcionarioRepository.findAtendenteById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Atendente com código '" + id + "' não encontrado."));

        atendenteExistente.setNome(dto.nome());
        atendenteExistente.setDataAdmissao(dto.dataAdmissao());
        atendenteExistente.setCodSupervisor(dto.codSupervisor());
        
        funcionarioRepository.updateAtendente(atendenteExistente);
        return new AtendenteResponseDTO(atendenteExistente);
    }
    
    @Transactional
    public FuncionarioGeralResponseDTO createFuncionarioPuro(FuncionarioRequestDTO dto) {
        funcionarioRepository.findByCpf(dto.getCpf()).ifPresent(f -> {
            throw new BusinessException("CPF já cadastrado.");
        });

        Funcionario func = new Funcionario();
        func.setNome(dto.getNome());
        func.setCpf(dto.getCpf());
        func.setDataAdmissao(dto.getDataAdmissao());
        func.setCodSupervisor(dto.getCodSupervisor());

        Funcionario savedFunc = funcionarioRepository.saveFuncionarioPuro(func);
        return new FuncionarioGeralResponseDTO(
            savedFunc.getCodFuncionario(),
            savedFunc.getNome(),
            savedFunc.getCpf(),
            savedFunc.getDataAdmissao(),
            savedFunc.getCodSupervisor(),
            null,
            "Funcionário"
        );
    }

    @Transactional
    public FuncionarioGeralResponseDTO updateFuncionarioPuro(int id, FuncionarioRequestDTO dto) {
        Funcionario funcExistente = funcionarioRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Funcionário com código '" + id + "' não encontrado."));

        funcExistente.setNome(dto.getNome());
        funcExistente.setDataAdmissao(dto.getDataAdmissao());
        funcExistente.setCodSupervisor(dto.getCodSupervisor());
        
        funcionarioRepository.updateFuncionarioPuro(funcExistente);
        
        return new FuncionarioGeralResponseDTO(
            funcExistente.getCodFuncionario(),
            funcExistente.getNome(),
            funcExistente.getCpf(),
            funcExistente.getDataAdmissao(),
            funcExistente.getCodSupervisor(),
            null,
            "Funcionário"
        );
    }


    public List<FuncionarioGeralResponseDTO> getAllFuncionariosGeral() {
        return funcionarioRepository.findAllGeral();
    }
    
    @Transactional
    public void deleteFuncionario(int id) {
        funcionarioRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Funcionário com código '" + id + "' não encontrado."));
        
        try {
            funcionarioRepository.deleteById(id);
        } catch (Exception e) {
            throw new BusinessException("Não é possível excluir o funcionário, pois ele pode ser supervisor de outros ou possuir registros associados.");
        }
    }
}