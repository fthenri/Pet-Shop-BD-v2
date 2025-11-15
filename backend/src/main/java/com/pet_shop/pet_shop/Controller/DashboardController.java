package com.pet_shop.pet_shop.Controller;

import com.pet_shop.pet_shop.Service.DashboardService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/dashboard")
@CrossOrigin(origins = "*")
public class DashboardController {

    @Autowired
    private DashboardService dashboardService;

    @GetMapping("/faturamento-anual")
    public ResponseEntity<List<Map<String, Object>>> getFaturamentoAnual(
            @RequestParam(required = false) Integer produtoId,
            @RequestParam(required = false) Integer atendenteId) {
        
        List<Map<String, Object>> data = dashboardService.getFaturamentoAnual(produtoId, atendenteId);
        return ResponseEntity.ok(data);
    }

    @GetMapping("/faturamento-mensal")
    public ResponseEntity<List<Map<String, Object>>> getFaturamentoMensal(
            @RequestParam("ano") int ano,
            @RequestParam(required = false) Integer produtoId,
            @RequestParam(required = false) Integer atendenteId) {
        
        List<Map<String, Object>> data = dashboardService.getFaturamentoMensal(ano, produtoId, atendenteId);
        return ResponseEntity.ok(data);
    }

    @GetMapping("/faturamento-diario")
    public ResponseEntity<List<Map<String, Object>>> getFaturamentoDiario(
            @RequestParam("mes") String mes,
            @RequestParam(required = false) Integer produtoId,
            @RequestParam(required = false) Integer atendenteId) {
        
        List<Map<String, Object>> data = dashboardService.getFaturamentoDiario(mes, produtoId, atendenteId);
        return ResponseEntity.ok(data);
    }

    @GetMapping("/top-produtos-receita")
    public ResponseEntity<List<Map<String, Object>>> getTopProdutosPorReceita(
            @RequestParam(required = false) Integer ano,
            @RequestParam(required = false) String mes,
            @RequestParam(required = false) Integer atendenteId) {
        
        List<Map<String, Object>> data = dashboardService.getTopProdutosPorReceita(ano, mes, atendenteId);
        return ResponseEntity.ok(data);
    }

    @GetMapping("/top-clientes-gasto")
    public ResponseEntity<List<Map<String, Object>>> getTopClientesPorGasto(
            @RequestParam(required = false) Integer ano,
            @RequestParam(required = false) String mes,
            @RequestParam(required = false) Integer produtoId) {
        
        List<Map<String, Object>> data = dashboardService.getTopClientesPorGasto(ano, mes, produtoId);
        return ResponseEntity.ok(data);
    }

    @GetMapping("/novos-clientes-mes")
    public ResponseEntity<List<Map<String, Object>>> getNovosClientesPorMes() {
        List<Map<String, Object>> data = dashboardService.getNovosClientesPorMes();
        return ResponseEntity.ok(data);
    }
    
    @GetMapping("/pets-por-idade")
    public ResponseEntity<List<Map<String, Object>>> getPetsPorCategoriaIdade() {
        List<Map<String, Object>> data = dashboardService.getPetsPorCategoriaIdade();
        return ResponseEntity.ok(data);
    }

    @GetMapping("/produtos-encalhados")
    public ResponseEntity<List<Map<String, Object>>> getProdutosEncalhados() {
        List<Map<String, Object>> data = dashboardService.getProdutosEncalhados();
        return ResponseEntity.ok(data);
    }

    @GetMapping("/ticket-medio")
    public ResponseEntity<Map<String, Object>> getTicketMedio(
            @RequestParam(required = false) Integer ano,
            @RequestParam(required = false) String mes,
            @RequestParam(required = false) Integer produtoId,
            @RequestParam(required = false) Integer atendenteId) {
        
        Map<String, Object> data = dashboardService.getTicketMedio(ano, mes, produtoId, atendenteId);
        return ResponseEntity.ok(data);
    }

    @GetMapping("/top-produtos-quantidade")
    public ResponseEntity<List<Map<String, Object>>> getTopProdutosPorQuantidade(
            @RequestParam(required = false) Integer ano,
            @RequestParam(required = false) String mes,
            @RequestParam(required = false) Integer atendenteId) {
        
        List<Map<String, Object>> data = dashboardService.getTopProdutosPorQuantidade(ano, mes, atendenteId);
        return ResponseEntity.ok(data);
    }

    @GetMapping("/vendas-por-atendente")
    public ResponseEntity<List<Map<String, Object>>> getVendasPorAtendente(
            @RequestParam(required = false) Integer ano,
            @RequestParam(required = false) String mes,
            @RequestParam(required = false) Integer produtoId) {
        
        List<Map<String, Object>> data = dashboardService.getVendasPorAtendente(ano, mes, produtoId);
        return ResponseEntity.ok(data);
    }

    @GetMapping("/consultas-por-veterinario")
    public ResponseEntity<List<Map<String, Object>>> getConsultasPorVeterinario(
            @RequestParam(required = false) Integer ano,
            @RequestParam(required = false) String mes) {
        
        List<Map<String, Object>> data = dashboardService.getConsultasPorVeterinario(ano, mes);
        return ResponseEntity.ok(data);
    }


    @GetMapping("/filtros/produtos")
    public ResponseEntity<List<Map<String, Object>>> getFiltroProdutos() {
        List<Map<String, Object>> data = dashboardService.getFiltroProdutos();
        return ResponseEntity.ok(data);
    }

    @GetMapping("/filtros/atendentes")
    public ResponseEntity<List<Map<String, Object>>> getFiltroAtendentes() {
        List<Map<String, Object>> data = dashboardService.getFiltroAtendentes();
        return ResponseEntity.ok(data);
    }
}