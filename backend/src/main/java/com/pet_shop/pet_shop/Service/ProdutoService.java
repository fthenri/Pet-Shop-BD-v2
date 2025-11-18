package com.pet_shop.pet_shop.Service;

import com.pet_shop.pet_shop.DTO.ProdutoRequestDTO;
import com.pet_shop.pet_shop.DTO.ProdutoResponseDTO;
import com.pet_shop.pet_shop.Model.Produto;
import com.pet_shop.pet_shop.Repository.FornecedorRepository; 
import com.pet_shop.pet_shop.Repository.ProdutoRepository;
import com.pet_shop.pet_shop.exception.BusinessException; 
import com.pet_shop.pet_shop.exception.ResourceNotFoundException; 
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class ProdutoService {

    @Autowired
    private ProdutoRepository produtoRepository;

    @Autowired
    private FornecedorRepository fornecedorRepository;

    private void validarFornecedor(String cnpj) {
        if (cnpj == null || fornecedorRepository.findByCnpj(cnpj).isEmpty()) {
            throw new BusinessException("Fornecedor com CNPJ '" + cnpj + "' não encontrado.");
        }
    }

    public List<ProdutoResponseDTO> getAllProdutos() {
        return produtoRepository.findAll().stream()
                .map(ProdutoResponseDTO::new)
                .collect(Collectors.toList());
    }

    public Optional<ProdutoResponseDTO> getProdutoById(int id) {
        return produtoRepository.findById(id).map(ProdutoResponseDTO::new);
    }

    public ProdutoResponseDTO createProduto(ProdutoRequestDTO produtoDTO) {
        validarFornecedor(produtoDTO.getCnpjFornecedor());

        Produto produto = new Produto();
        produto.setNome_produto(produtoDTO.getNome_produto());
        produto.setDescricao(produtoDTO.getDescricao());
        produto.setPreco_venda(produtoDTO.getPreco_venda());
        produto.setQuantidade_estoque(produtoDTO.getQuantidade_estoque());
        produto.setCnpjFornecedor(produtoDTO.getCnpjFornecedor());

        Produto produtoSalvo = produtoRepository.save(produto);
        return new ProdutoResponseDTO(produtoSalvo);
    }

    public Optional<ProdutoResponseDTO> updateProduto(int id, ProdutoRequestDTO produtoDetails) {
        validarFornecedor(produtoDetails.getCnpjFornecedor());

        return produtoRepository.findById(id).map(produto -> {
            
            if (produtoDetails.getPreco_venda().compareTo(produto.getPreco_venda()) != 0) {
                produtoRepository.updatePrecoProduto(id, produtoDetails.getPreco_venda());
                produto.setPreco_venda(produtoDetails.getPreco_venda()); 
            }

            produto.setNome_produto(produtoDetails.getNome_produto());
            produto.setDescricao(produtoDetails.getDescricao());
            produto.setQuantidade_estoque(produtoDetails.getQuantidade_estoque());
            produto.setCnpjFornecedor(produtoDetails.getCnpjFornecedor());
            
            produtoRepository.update(produto);
            
            return new ProdutoResponseDTO(produto);
        }).map(Optional::of) 
          .orElseThrow(() -> new ResourceNotFoundException("Produto com código '" + id + "' não encontrado."));
    }

    public boolean deleteProduto(int id) {
        if (produtoRepository.findById(id).isPresent()) {
            try {
                produtoRepository.deleteById(id);
                return true;
            } catch (Exception e) {
                throw new BusinessException("Não é possível excluir o produto, pois ele está associado a vendas existentes.");
            }
        }
        return false;
    }
}