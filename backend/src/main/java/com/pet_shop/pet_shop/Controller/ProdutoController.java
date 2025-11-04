package com.pet_shop.pet_shop.Controller;

import com.pet_shop.pet_shop.DTO.ProdutoRequestDTO;
import com.pet_shop.pet_shop.DTO.ProdutoResponseDTO;
import com.pet_shop.pet_shop.Service.ProdutoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/produtos")
@CrossOrigin(origins = "*") // Permite que o frontend acesse esta API
public class ProdutoController {

    @Autowired
    private ProdutoService produtoService;

    // Endpoint para LER todos os produtos (GET /api/produtos)
    @GetMapping
    public List<ProdutoResponseDTO> getAllProdutos() {
        return produtoService.getAllProdutos();
    }

    // Endpoint para LER um produto por ID (GET /api/produtos/{id})
    @GetMapping("/{id}")
    public ResponseEntity<ProdutoResponseDTO> getProdutoById(@PathVariable int id) {
        return produtoService.getProdutoById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // Endpoint para CRIAR um novo produto (POST /api/produtos)
    @PostMapping
    public ResponseEntity<ProdutoResponseDTO> createProduto(@RequestBody ProdutoRequestDTO produto) {
        ProdutoResponseDTO novoProduto = produtoService.createProduto(produto);
        return ResponseEntity.status(HttpStatus.CREATED).body(novoProduto);
    }

    // Endpoint para ATUALIZAR um produto (PUT /api/produtos/{id})
    @PutMapping("/{id}")
    public ResponseEntity<ProdutoResponseDTO> updateProduto(@PathVariable int id,
            @RequestBody ProdutoRequestDTO produtoDetails) {
        return produtoService.updateProduto(id, produtoDetails)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // Endpoint para DELETAR um produto (DELETE /api/produtos/{id})
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteProduto(@PathVariable int id) {
        if (produtoService.deleteProduto(id)) {
            return ResponseEntity.noContent().build(); // Sucesso, sem conteúdo para retornar
        } else {
            return ResponseEntity.notFound().build(); // Não encontrou o produto para deletar
        }
    }
}