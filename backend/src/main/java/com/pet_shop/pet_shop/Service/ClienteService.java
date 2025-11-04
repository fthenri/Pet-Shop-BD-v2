package com.pet_shop.pet_shop.Service;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.pet_shop.pet_shop.DTO.ClienteRequestDTO; // IMPORTAR
import com.pet_shop.pet_shop.DTO.ClienteResponseDTO;
import com.pet_shop.pet_shop.Model.Cliente;
import com.pet_shop.pet_shop.Repository.ClienteRepository;
import com.pet_shop.pet_shop.exception.ResourceNotFoundException;

@Service
public class ClienteService {

    @Autowired
    private ClienteRepository clienteRepository;

    public List<ClienteResponseDTO> getAllClientes() {
        return clienteRepository.findAll().stream().map(ClienteResponseDTO::new).collect(Collectors.toList());
    }

    public ClienteResponseDTO getClienteByCpf(String cpf) {
        Cliente cliente = clienteRepository.findByCpf(cpf);
        if (cliente == null) {
            throw new ResourceNotFoundException("Cliente com CPF '" + cpf + "' não encontrado.");
        }
        return new ClienteResponseDTO(cliente);
    }

    public List<ClienteResponseDTO> buscarClientesPorNome(String nome) {
        if (nome == null || nome.trim().isEmpty()) {
            throw new IllegalArgumentException("O termo de busca não pode ser vazio.");
        }
        return clienteRepository.findByNomeContaining(nome);
    }

    public ClienteResponseDTO createCliente(ClienteRequestDTO clienteDTO) {
        Cliente cliente = new Cliente();
        cliente.setCpf(clienteDTO.getCpf());
        cliente.setNome(clienteDTO.getNome());
        cliente.setLogradouro(clienteDTO.getLogradouro());
        cliente.setNumero(clienteDTO.getNumero());
        cliente.setBairro(clienteDTO.getBairro());
        cliente.setCidade(clienteDTO.getCidade());
        cliente.setEstado(clienteDTO.getEstado());
        cliente.setCep(clienteDTO.getCep());
        cliente.setTelefone1(clienteDTO.getTelefone1());
        cliente.setTelefone2(clienteDTO.getTelefone2());
        cliente.setDataCadastro(java.time.LocalDateTime.now()); // Adiciona a data de cadastro

        Cliente savedCliente = clienteRepository.save(cliente);
        return new ClienteResponseDTO(savedCliente);
    }

    public ClienteResponseDTO updateCliente(String cpf, ClienteRequestDTO clienteDTO) {
        Cliente clienteExistente = clienteRepository.findByCpf(cpf);
        if (clienteExistente == null) {
            throw new ResourceNotFoundException(
                    "Não é possível atualizar. Cliente com CPF '" + cpf + "' não encontrado.");
        }

        clienteExistente.setNome(clienteDTO.getNome());
        clienteExistente.setLogradouro(clienteDTO.getLogradouro());
        clienteExistente.setNumero(clienteDTO.getNumero());
        clienteExistente.setBairro(clienteDTO.getBairro());
        clienteExistente.setCidade(clienteDTO.getCidade());
        clienteExistente.setEstado(clienteDTO.getEstado());
        clienteExistente.setCep(clienteDTO.getCep());
        clienteExistente.setTelefone1(clienteDTO.getTelefone1());
        clienteExistente.setTelefone2(clienteDTO.getTelefone2());

        clienteRepository.update(clienteExistente);
        return new ClienteResponseDTO(clienteExistente);
    }

    public void deleteCliente(String cpf) {
        Cliente cliente = clienteRepository.findByCpf(cpf);
        if (cliente == null) {
            throw new ResourceNotFoundException(
                    "Não é possível deletar. Cliente com CPF '" + cpf + "' não encontrado.");
        }
        try {
            clienteRepository.deleteByCpf(cpf);
        } catch (Exception e) {
            throw new RuntimeException(
                    "Não é possível excluir o cliente pois existem vendas associadas a ele. Exclua primeiro as vendas relacionadas.", e);
        }
    }
}