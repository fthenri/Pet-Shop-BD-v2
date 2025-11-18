package com.pet_shop.pet_shop.Service;

import com.pet_shop.pet_shop.DTO.VendaCompletaRequestDTO;
import com.pet_shop.pet_shop.DTO.VendaResponseDTO;
import com.pet_shop.pet_shop.DTO.ItemVendaRequestDTO;
import com.pet_shop.pet_shop.Model.Produto;
import com.pet_shop.pet_shop.Model.Venda;
import com.pet_shop.pet_shop.Repository.ProdutoRepository;
import com.pet_shop.pet_shop.Repository.VendaRepository;
import com.pet_shop.pet_shop.exception.BusinessException;
import com.pet_shop.pet_shop.exception.ResourceNotFoundException;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

@Service
public class VendaService {

    @Autowired
    private VendaRepository vendaRepository;

    @Autowired
    private ProdutoRepository produtoRepository; 

    @Transactional(rollbackFor = Exception.class)
    public VendaResponseDTO createVenda(VendaCompletaRequestDTO dto) {

        if (dto.getItens() == null || dto.getItens().isEmpty()) {
            throw new BusinessException("A venda deve conter pelo menos um item.");
        }

        BigDecimal valorTotalCalculado = BigDecimal.ZERO;
        Map<Integer, Produto> produtosCache = new HashMap<>(); 

        for (ItemVendaRequestDTO item : dto.getItens()) {
            Produto produto = produtoRepository.findById(item.getCodProduto())
                .orElseThrow(() -> new ResourceNotFoundException("Produto com código '" + item.getCodProduto() + "' não encontrado."));
            
            produtosCache.put(produto.getCod_produto(), produto); 

            BigDecimal subtotal = produto.getPreco_venda().multiply(BigDecimal.valueOf(item.getQuantidade()));
            valorTotalCalculado = valorTotalCalculado.add(subtotal);
        }

        Venda novaVenda = new Venda();
        novaVenda.setCpfCliente(dto.getCpfCliente());
        novaVenda.setCodFuncionario(dto.getCodFuncionario());
        novaVenda.setFormaPagamento(dto.getFormaPagamento());
        novaVenda.setDataHora(LocalDateTime.now());
        novaVenda.setValorTotal(valorTotalCalculado);

        Venda vendaSalva = vendaRepository.saveVenda(novaVenda);
        int numVendaGerado = vendaSalva.getNumVenda();

        try {
            for (ItemVendaRequestDTO item : dto.getItens()) {
                vendaRepository.saveItemVenda(numVendaGerado, item);
            }
        } catch (Exception e) {
            if (e.getMessage() != null && e.getMessage().contains("Estoque insuficiente")) {
                throw new BusinessException("Estoque insuficiente para um dos produtos. A venda foi cancelada.");
            }
            
            throw new BusinessException("Erro ao processar os itens da venda. A venda foi cancelada.");
        }

        return toResponseDTO(vendaSalva);
    }
    
    private VendaResponseDTO toResponseDTO(Venda venda) {
        VendaResponseDTO dto = new VendaResponseDTO();
        dto.setNumVenda(venda.getNumVenda());
        dto.setDataHora(venda.getDataHora());
        dto.setValorTotal(venda.getValorTotal());
        dto.setFormaPagamento(venda.getFormaPagamento());
        dto.setCpfCliente(venda.getCpfCliente());
        dto.setCodFuncionario(venda.getCodFuncionario());
        return dto;
    }
}