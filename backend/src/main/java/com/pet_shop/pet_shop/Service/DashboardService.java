package com.pet_shop.pet_shop.Service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@Service
public class DashboardService {

    @Autowired
    private JdbcTemplate jdbcTemplate;

    private String buildWhereClause(Integer ano, String mes, Integer produtoId, Integer atendenteId) {
        List<String> conditions = new ArrayList<>();
        
        if (ano != null) {
            conditions.add("YEAR(v.data_hora) = " + ano);
        }
        if (mes != null) {
            conditions.add("DATE_FORMAT(v.data_hora, '%Y-%m') = '" + mes + "'");
        }
        if (produtoId != null) {
            conditions.add("co.cod_produto = " + produtoId);
        }
        if (atendenteId != null) {
            conditions.add("v.cod_funcionario = " + atendenteId);
        }

        if (conditions.isEmpty()) {
            return "";
        }
        return "WHERE " + String.join(" AND ", conditions);
    }

    public List<Map<String, Object>> getFaturamentoAnual(Integer produtoId, Integer atendenteId) {
        String joinClause = "";
        String whereClause = "";
        List<Object> params = new ArrayList<>();

        if (produtoId != null) {
            joinClause = "JOIN contem co ON v.num_venda = co.num_venda ";
            whereClause = "WHERE co.cod_produto = ? ";
            params.add(produtoId);
        }
        if (atendenteId != null) {
            whereClause = whereClause.isEmpty() ? "WHERE " : whereClause + "AND ";
            whereClause += "v.cod_funcionario = ? ";
            params.add(atendenteId);
        }
        
        String sql = "SELECT YEAR(v.data_hora) as ano, SUM(v.valor_total) as faturamento " +
                     "FROM Venda v " + joinClause + whereClause +
                     "GROUP BY YEAR(v.data_hora) ORDER BY ano ASC";

        return jdbcTemplate.queryForList(sql, params.toArray());
    }

    public List<Map<String, Object>> getFaturamentoMensal(int ano, Integer produtoId, Integer atendenteId) {
        String joinClause = (produtoId != null) ? "JOIN contem co ON v.num_venda = co.num_venda " : "";
        String whereClause = buildWhereClause(ano, null, produtoId, atendenteId);
        
        String sql = "SELECT DATE_FORMAT(v.data_hora, '%Y-%m') as mes, SUM(v.valor_total) as faturamento " +
                     "FROM Venda v " + joinClause + whereClause +
                     "GROUP BY mes ORDER BY mes ASC";
        
        return jdbcTemplate.queryForList(sql);
    }

    public List<Map<String, Object>> getFaturamentoDiario(String mes, Integer produtoId, Integer atendenteId) {
        String joinClause = (produtoId != null) ? "JOIN contem co ON v.num_venda = co.num_venda " : "";
        String whereClause = buildWhereClause(null, mes, produtoId, atendenteId);
        
        String sql = "SELECT DATE(v.data_hora) as dia, SUM(v.valor_total) as faturamento " +
                     "FROM Venda v " + joinClause + whereClause +
                     "GROUP BY dia ORDER BY dia ASC";
        
        return jdbcTemplate.queryForList(sql);
    }

    public List<Map<String, Object>> getTopProdutosPorReceita(Integer ano, String mes, Integer atendenteId) {
        String joinClause = "JOIN Venda v ON co.num_venda = v.num_venda ";
        String whereClause = buildWhereClause(ano, mes, null, atendenteId);

        String sql = "SELECT p.cod_produto, p.nome_produto, SUM(co.quantidade * p.preco_venda) as receita_total " +
                     "FROM contem co " +
                     "JOIN Produto p ON co.cod_produto = p.cod_produto " +
                     joinClause + whereClause +
                     "GROUP BY p.cod_produto, p.nome_produto ORDER BY receita_total DESC LIMIT 5";
        
        return jdbcTemplate.queryForList(sql);
    }

    public List<Map<String, Object>> getTopClientesPorGasto(Integer ano, String mes) {
        String sql = "SELECT c.nome, SUM(v.valor_total) as total_gasto " +
                     "FROM Venda v " +
                     "JOIN Cliente c ON v.cpfCliente = c.cpf ";
        
        if (mes != null) {
            sql += "WHERE DATE_FORMAT(v.data_hora, '%Y-%m') = '" + mes + "' ";
        } else if (ano != null) {
            sql += "WHERE YEAR(v.data_hora) = " + ano + " ";
        }

        sql += "GROUP BY c.cpf, c.nome ORDER BY total_gasto DESC LIMIT 10";
        return jdbcTemplate.queryForList(sql);
    }
    
    public List<Map<String, Object>> getNovosClientesPorMes() {
        String sql = "SELECT DATE_FORMAT(data_cadastro, '%Y-%m') as mes, COUNT(*) as total_novos " +
                     "FROM Cliente " +
                     "GROUP BY mes " +
                     "ORDER BY mes ASC";
        return jdbcTemplate.queryForList(sql);
    }

    public List<Map<String, Object>> getPetsPorCategoriaIdade() {
        String sql = "SELECT FN_CalcularCategoriaIdadePet(data_nascimento) as categoria, COUNT(*) as total " +
                     "FROM Pet " +
                     "WHERE data_nascimento IS NOT NULL " +
                     "GROUP BY categoria " +
                     "ORDER BY categoria";
        return jdbcTemplate.queryForList(sql);
    }


    public List<Map<String, Object>> getFiltroProdutos() {
        String sql = "SELECT cod_produto, nome_produto FROM Produto ORDER BY nome_produto";
        return jdbcTemplate.queryForList(sql);
    }

    public List<Map<String, Object>> getFiltroAtendentes() {
        String sql = "SELECT f.cod_funcionario, f.nome " +
                     "FROM Funcionario f " +
                     "JOIN Atendente a ON f.cod_funcionario = a.cod_funcionario " +
                     "ORDER BY f.nome";
        return jdbcTemplate.queryForList(sql);
    }
}