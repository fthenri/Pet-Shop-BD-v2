package com.pet_shop.pet_shop.Service;

import com.pet_shop.pet_shop.DTO.ConsultaRequestDTO;
import com.pet_shop.pet_shop.DTO.ConsultaResponseDTO;
import com.pet_shop.pet_shop.Model.Consulta;
import com.pet_shop.pet_shop.Repository.ConsultaRepository;
import com.pet_shop.pet_shop.Repository.FuncionarioRepository;
import com.pet_shop.pet_shop.Repository.PetRepository;
import com.pet_shop.pet_shop.exception.BusinessException;
import com.pet_shop.pet_shop.exception.ResourceNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@Service
public class ConsultaService {

    @Autowired
    private JdbcTemplate jdbcTemplate;

    @Autowired
    private ConsultaRepository consultaRepository;
    
    @Autowired
    private PetRepository petRepository;
    
    @Autowired
    private FuncionarioRepository funcionarioRepository;

    @Transactional
    public ConsultaResponseDTO createConsulta(ConsultaRequestDTO dto) {
        petRepository.findByCodPet(dto.getCodPet())
                .orElseThrow(() -> new ResourceNotFoundException("Pet com código '" + dto.getCodPet() + "' não encontrado."));
        
        funcionarioRepository.findVeterinarioById(dto.getCodVeterinario())
                .orElseThrow(() -> new ResourceNotFoundException("Veterinário com código '" + dto.getCodVeterinario() + "' não encontrado."));
        
        if(dto.getDiagnostico() == null || dto.getDiagnostico().trim().isEmpty()) {
            throw new BusinessException("O campo 'Diagnóstico / Descrição' é obrigatório.");
        }

        Consulta consulta = new Consulta();
        consulta.setCodPet(dto.getCodPet());
        consulta.setCodVeterinario(dto.getCodVeterinario());
        consulta.setSintomasRelatados(dto.getSintomasRelatados());
        consulta.setDiagnostico(dto.getDiagnostico());
        consulta.setDataHora(LocalDateTime.now());

        Consulta consultaSalva = consultaRepository.save(consulta);

        return toResponseDTO(consultaSalva);
    }

    private ConsultaResponseDTO toResponseDTO(Consulta consulta) {
        ConsultaResponseDTO dto = new ConsultaResponseDTO();
        dto.setNumConsulta(consulta.getNumConsulta());
        dto.setDataHora(consulta.getDataHora());
        dto.setSintomasRelatados(consulta.getSintomasRelatados());
        dto.setDiagnostico(consulta.getDiagnostico());
        dto.setCodPet(consulta.getCodPet());
        dto.setCodVeterinario(consulta.getCodVeterinario());
        return dto;
    }

    public List<Map<String, Object>> executeSelectQuery(String sql) {
        if (!sql.trim().toLowerCase().startsWith("select")) {
            throw new IllegalArgumentException("Apenas consultas do tipo SELECT são permitidas.");
        }
        return jdbcTemplate.queryForList(sql);
    }
}