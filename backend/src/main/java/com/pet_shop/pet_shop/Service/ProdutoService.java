package com.pet_shop.pet_shop.Service;

import com.pet_shop.pet_shop.DTO.ProdutoRequestDTO;
import com.pet_shop.pet_shop.DTO.ProdutoResponseDTO;
import com.pet_shop.pet_shop.Model.Produto;
import com.pet_shop.pet_shop.Repository.ProdutoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class ProdutoService {

    @Autowired
    private ProdutoRepository produtoRepository;

    public List<ProdutoResponseDTO> getAllProdutos() {
        return produtoRepository.findAll().stream()
                .map(ProdutoResponseDTO::new)
                .collect(Collectors.toList());
    }

    public Optional<ProdutoResponseDTO> getProdutoById(int id) {
        return produtoRepository.findById(id).map(ProdutoResponseDTO::new);
    }

    public ProdutoResponseDTO createProduto(ProdutoRequestDTO produtoDTO) {
        Produto produto = new Produto();
        produto.setNome_produto(produtoDTO.getNome_produto());
        produto.setDescricao(produtoDTO.getDescricao());
        produto.setPreco_venda(produtoDTO.getPreco_venda());
        produto.setQuantidade_estoque(produtoDTO.getQuantidade_estoque());
        produto.setCnpjFornecedor(produtoDTO.getCnpjFornecedor());

        produtoRepository.save(produto);
        return new ProdutoResponseDTO(produto);
    }

    public Optional<ProdutoResponseDTO> updateProduto(int id, ProdutoRequestDTO produtoDetails) {
        return produtoRepository.findById(id).map(produto -> {
            produto.setNome_produto(produtoDetails.getNome_produto());
            produto.setDescricao(produtoDetails.getDescricao());
            produto.setPreco_venda(produtoDetails.getPreco_venda());
            produto.setQuantidade_estoque(produtoDetails.getQuantidade_estoque());
            produto.setCnpjFornecedor(produtoDetails.getCnpjFornecedor());
            produtoRepository.save(produto);
            return new ProdutoResponseDTO(produto);
        });
    }

    public boolean deleteProduto(int id) {
        if (produtoRepository.findById(id).isPresent()) {
            produtoRepository.deleteById(id);
            return true;
        }
        return false;
    }
}