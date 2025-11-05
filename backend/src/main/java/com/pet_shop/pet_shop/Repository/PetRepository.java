package com.pet_shop.pet_shop.Repository;

import com.pet_shop.pet_shop.Model.Pet;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.stereotype.Repository;

import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.List;
import java.util.Optional;

@Repository
public class PetRepository {

    @Autowired
    private JdbcTemplate jdbcTemplate;

    private final RowMapper<Pet> rowMapper = (rs, rowNum) -> {
        Pet pet = new Pet();
        pet.setCpfCliente(rs.getString("cpfCliente"));
        pet.setCod_pet(rs.getInt("cod_pet")); 
        pet.setNomePet(rs.getString("nome_pet"));
        pet.setEspecie(rs.getString("especie"));
        pet.setRaca(rs.getString("raca"));
        pet.setDataNascimento(rs.getDate("data_nascimento") != null ? rs.getDate("data_nascimento").toLocalDate() : null);
        pet.setObservacoes(rs.getString("observacoes"));
        return pet;
    };
    
    public List<Pet> findByCpfCliente(String cpf) {
        final String sql = "SELECT * FROM Pet WHERE cpfCliente = ?";
        return jdbcTemplate.query(sql, new Object[]{cpf}, rowMapper);
    }

    public Optional<Pet> findByCodPet(int codPet) {
        final String sql = "SELECT * FROM Pet WHERE cod_pet = ?";
        try {
            Pet pet = jdbcTemplate.queryForObject(sql, new Object[]{codPet}, rowMapper);
            return Optional.ofNullable(pet);
        } catch (Exception e) {
            return Optional.empty();
        }
    }

    public Pet save(Pet pet) {
        Integer maxCodPet = jdbcTemplate.queryForObject("SELECT COALESCE(MAX(cod_pet), 0) + 1 FROM Pet", Integer.class);
        pet.setCod_pet(maxCodPet);

        final String sql = "INSERT INTO Pet (cod_pet, nome_pet, especie, raca, data_nascimento, observacoes, cpfCliente) VALUES (?, ?, ?, ?, ?, ?, ?)";
        jdbcTemplate.update(sql, 
            pet.getCod_pet(),
            pet.getNomePet(), 
            pet.getEspecie(), 
            pet.getRaca(), 
            pet.getDataNascimento(), 
            pet.getObservacoes(), 
            pet.getCpfCliente()
        );
        return pet;
    }

    public int update(Pet pet) {
        final String sql = "UPDATE Pet SET nome_pet = ?, especie = ?, raca = ?, data_nascimento = ?, observacoes = ? WHERE cod_pet = ? AND cpfCliente = ?";
        return jdbcTemplate.update(sql,
            pet.getNomePet(),
            pet.getEspecie(),
            pet.getRaca(),
            pet.getDataNascimento(),
            pet.getObservacoes(),
            pet.getCod_pet(),
            pet.getCpfCliente()
        );
    }

    public int deleteByCodPet(int codPet) {
        final String sql = "DELETE FROM Pet WHERE cod_pet = ?";
        return jdbcTemplate.update(sql, codPet);
    }
}