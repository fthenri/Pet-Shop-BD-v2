package com.pet_shop.pet_shop.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class DashboardService {

    @Autowired
    private JdbcTemplate jdbcTemplate;

    public List<Map<String, Object>> getFaturamentoAnual(Integer produtoId, Integer atendenteId) {
        StringBuilder sql = new StringBuilder(
            "SELECT YEAR(v.data_hora) as ano, SUM(v.valor_total) as faturamento " +
            "FROM Venda v "
        );
        List<Object> params = new ArrayList<>();
        List<String> whereConditions = new ArrayList<>();

        if (produtoId != null) {
            sql.append("JOIN contem co ON v.num_venda = co.num_venda ");
            whereConditions.add("co.cod_produto = ?");
            params.add(produtoId);
        }
        if (atendenteId != null) {
            whereConditions.add("v.cod_funcionario = ?");
            params.add(atendenteId);
        }

        if (!whereConditions.isEmpty()) {
            sql.append("WHERE ").append(String.join(" AND ", whereConditions));
        }
        
        sql.append(" GROUP BY YEAR(v.data_hora) ORDER BY ano ASC");
        return jdbcTemplate.queryForList(sql.toString(), params.toArray());
    }

    public List<Map<String, Object>> getFaturamentoMensal(int ano, Integer produtoId, Integer atendenteId) {
        StringBuilder sql = new StringBuilder(
            "SELECT DATE_FORMAT(v.data_hora, '%Y-%m') as mes, SUM(v.valor_total) as faturamento " +
            "FROM Venda v "
        );
        List<Object> params = new ArrayList<>();
        List<String> whereConditions = new ArrayList<>();

        whereConditions.add("YEAR(v.data_hora) = ?");
        params.add(ano);

        if (produtoId != null) {
            sql.append("JOIN contem co ON v.num_venda = co.num_venda ");
            whereConditions.add("co.cod_produto = ?");
            params.add(produtoId);
        }
        if (atendenteId != null) {
            whereConditions.add("v.cod_funcionario = ?");
            params.add(atendenteId);
        }

        sql.append("WHERE ").append(String.join(" AND ", whereConditions));
        sql.append(" GROUP BY mes ORDER BY mes ASC");
        
        return jdbcTemplate.queryForList(sql.toString(), params.toArray());
    }

    public List<Map<String, Object>> getFaturamentoDiario(String mes, Integer produtoId, Integer atendenteId) {
        StringBuilder sql = new StringBuilder(
            "SELECT DATE(v.data_hora) as dia, SUM(v.valor_total) as faturamento " +
            "FROM Venda v "
        );
        List<Object> params = new ArrayList<>();
        List<String> whereConditions = new ArrayList<>();

        whereConditions.add("DATE_FORMAT(v.data_hora, '%Y-%m') = ?");
        params.add(mes);

        if (produtoId != null) {
            sql.append("JOIN contem co ON v.num_venda = co.num_venda ");
            whereConditions.add("co.cod_produto = ?");
            params.add(produtoId);
        }
        if (atendenteId != null) {
            whereConditions.add("v.cod_funcionario = ?");
            params.add(atendenteId);
        }

        sql.append("WHERE ").append(String.join(" AND ", whereConditions));
        sql.append(" GROUP BY dia ORDER BY dia ASC");
        
        return jdbcTemplate.queryForList(sql.toString(), params.toArray());
    }

    public List<Map<String, Object>> getTopProdutosPorReceita(Integer ano, String mes, Integer atendenteId) {
        StringBuilder sql = new StringBuilder(
            "SELECT p.cod_produto, p.nome_produto, SUM(co.quantidade * p.preco_venda) as receita_total " +
            "FROM contem co " +
            "JOIN Produto p ON co.cod_produto = p.cod_produto " +
            "JOIN Venda v ON co.num_venda = v.num_venda "
        );
        List<Object> params = new ArrayList<>();
        List<String> whereConditions = new ArrayList<>();

        if (mes != null) {
            whereConditions.add("DATE_FORMAT(v.data_hora, '%Y-%m') = ?");
            params.add(mes);
        } else if (ano != null) {
            whereConditions.add("YEAR(v.data_hora) = ?");
            params.add(ano);
        }
        if (atendenteId != null) {
            whereConditions.add("v.cod_funcionario = ?");
            params.add(atendenteId);
        }

        if (!whereConditions.isEmpty()) {
            sql.append("WHERE ").append(String.join(" AND ", whereConditions));
        }

        sql.append(" GROUP BY p.cod_produto, p.nome_produto ORDER BY receita_total DESC LIMIT 5");
        return jdbcTemplate.queryForList(sql.toString(), params.toArray());
    }

    public List<Map<String, Object>> getTopClientesPorGasto(Integer ano, String mes, Integer produtoId) {
        StringBuilder sql = new StringBuilder(
            "SELECT c.nome, SUM(v.valor_total) as total_gasto " +
            "FROM Venda v " +
            "JOIN Cliente c ON v.cpfCliente = c.cpf "
        );
        List<Object> params = new ArrayList<>();
        List<String> whereConditions = new ArrayList<>();

        if (produtoId != null) {
            sql.append("JOIN contem co ON v.num_venda = co.num_venda ");
            whereConditions.add("co.cod_produto = ?");
            params.add(produtoId);
        }
        if (mes != null) {
            whereConditions.add("DATE_FORMAT(v.data_hora, '%Y-%m') = ?");
            params.add(mes);
        } else if (ano != null) {
            whereConditions.add("YEAR(v.data_hora) = ?");
            params.add(ano);
        }
        
        if (!whereConditions.isEmpty()) {
            sql.append("WHERE ").append(String.join(" AND ", whereConditions));
        }

        sql.append(" GROUP BY c.cpf, c.nome ORDER BY total_gasto DESC LIMIT 10");
        return jdbcTemplate.queryForList(sql.toString(), params.toArray());
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

    public List<Map<String, Object>> getProdutosEncalhados() {
        String sql = "SELECT P.cod_produto, P.nome_produto, P.quantidade_estoque " +
                     "FROM Produto P " +
                     "LEFT JOIN contem co ON P.cod_produto = co.cod_produto " +
                     "WHERE co.num_venda IS NULL " +
                     "ORDER BY P.nome_produto";
        return jdbcTemplate.queryForList(sql);
    }

    public Map<String, Object> getTicketMedio(Integer ano, String mes, Integer produtoId, Integer atendenteId) {
         StringBuilder sql = new StringBuilder(
            "SELECT AVG(v.valor_total) as ticket_medio " +
            "FROM Venda v "
        );
        List<Object> params = new ArrayList<>();
        List<String> whereConditions = new ArrayList<>();

        if (produtoId != null) {
            sql.append("JOIN contem co ON v.num_venda = co.num_venda ");
            whereConditions.add("co.cod_produto = ?");
            params.add(produtoId);
        }
        if (mes != null) {
            whereConditions.add("DATE_FORMAT(v.data_hora, '%Y-%m') = ?");
            params.add(mes);
        } else if (ano != null) {
            whereConditions.add("YEAR(v.data_hora) = ?");
            params.add(ano);
        }
        if (atendenteId != null) {
            whereConditions.add("v.cod_funcionario = ?");
            params.add(atendenteId);
        }
        
        if (!whereConditions.isEmpty()) {
            sql.append("WHERE ").append(String.join(" AND ", whereConditions));
        }
        
        return jdbcTemplate.queryForMap(sql.toString(), params.toArray());
    }

    public Map<String, Object> getFaturamentoTotal(Integer ano, String mes, Integer produtoId, Integer atendenteId) {
        StringBuilder sql = new StringBuilder(
            "SELECT SUM(v.valor_total) as faturamento_total " +
            "FROM Venda v "
        );
        List<Object> params = new ArrayList<>();
        List<String> whereConditions = new ArrayList<>();

        if (produtoId != null) {
            sql.append("JOIN contem co ON v.num_venda = co.num_venda ");
            whereConditions.add("co.cod_produto = ?");
            params.add(produtoId);
        }
        if (mes != null) {
            whereConditions.add("DATE_FORMAT(v.data_hora, '%Y-%m') = ?");
            params.add(mes);
        } else if (ano != null) {
            whereConditions.add("YEAR(v.data_hora) = ?");
            params.add(ano);
        }
        if (atendenteId != null) {
            whereConditions.add("v.cod_funcionario = ?");
            params.add(atendenteId);
        }
        
        if (!whereConditions.isEmpty()) {
            sql.append("WHERE ").append(String.join(" AND ", whereConditions));
        }
        
        return jdbcTemplate.queryForMap(sql.toString(), params.toArray());
    }

    public Map<String, Object> getTotalVendas(Integer ano, String mes, Integer produtoId, Integer atendenteId) {
        StringBuilder sql = new StringBuilder(
            "SELECT COUNT(DISTINCT v.num_venda) as total_vendas " +
            "FROM Venda v "
        );
        List<Object> params = new ArrayList<>();
        List<String> whereConditions = new ArrayList<>();

        if (produtoId != null) {
            sql.append("JOIN contem co ON v.num_venda = co.num_venda ");
            whereConditions.add("co.cod_produto = ?");
            params.add(produtoId);
        }
        if (mes != null) {
            whereConditions.add("DATE_FORMAT(v.data_hora, '%Y-%m') = ?");
            params.add(mes);
        } else if (ano != null) {
            whereConditions.add("YEAR(v.data_hora) = ?");
            params.add(ano);
        }
        if (atendenteId != null) {
            whereConditions.add("v.cod_funcionario = ?");
            params.add(atendenteId);
        }
        
        if (!whereConditions.isEmpty()) {
            sql.append("WHERE ").append(String.join(" AND ", whereConditions));
        }
        
        return jdbcTemplate.queryForMap(sql.toString(), params.toArray());
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

    public List<Map<String, Object>> getTopProdutosPorQuantidade(Integer ano, String mes, Integer atendenteId) {
        StringBuilder sql = new StringBuilder(
            "SELECT p.cod_produto, p.nome_produto, SUM(co.quantidade) as unidades_vendidas " +
            "FROM contem co " +
            "JOIN Produto p ON co.cod_produto = p.cod_produto " +
            "JOIN Venda v ON co.num_venda = v.num_venda "
        );
        List<Object> params = new ArrayList<>();
        List<String> whereConditions = new ArrayList<>();

        if (mes != null) {
            whereConditions.add("DATE_FORMAT(v.data_hora, '%Y-%m') = ?");
            params.add(mes);
        } else if (ano != null) {
            whereConditions.add("YEAR(v.data_hora) = ?");
            params.add(ano);
        }
        if (atendenteId != null) {
            whereConditions.add("v.cod_funcionario = ?");
            params.add(atendenteId);
        }

        if (!whereConditions.isEmpty()) {
            sql.append("WHERE ").append(String.join(" AND ", whereConditions));
        }

        sql.append(" GROUP BY p.cod_produto, p.nome_produto ORDER BY unidades_vendidas DESC LIMIT 5");
        return jdbcTemplate.queryForList(sql.toString(), params.toArray());
    }

    public List<Map<String, Object>> getVendasPorAtendente(Integer ano, String mes, Integer produtoId) {
        StringBuilder sql = new StringBuilder(
            "SELECT f.cod_funcionario, f.nome, SUM(v.valor_total) as total_vendido " +
            "FROM Venda v " +
            "JOIN Funcionario f ON v.cod_funcionario = f.cod_funcionario "
        );
        List<Object> params = new ArrayList<>();
        List<String> whereConditions = new ArrayList<>();

        if (produtoId != null) {
            sql.append("JOIN contem co ON v.num_venda = co.num_venda ");
            whereConditions.add("co.cod_produto = ?");
            params.add(produtoId);
        }
        if (mes != null) {
            whereConditions.add("DATE_FORMAT(v.data_hora, '%Y-%m') = ?");
            params.add(mes);
        } else if (ano != null) {
            whereConditions.add("YEAR(v.data_hora) = ?");
            params.add(ano);
        }
        
        if (!whereConditions.isEmpty()) {
            sql.append("WHERE ").append(String.join(" AND ", whereConditions));
        }

        sql.append(" GROUP BY f.cod_funcionario, f.nome ORDER BY total_vendido DESC");
        return jdbcTemplate.queryForList(sql.toString(), params.toArray());
    }

    public List<Map<String, Object>> getConsultasPorVeterinario(Integer ano, String mes) {
        StringBuilder sql = new StringBuilder(
            "SELECT f.nome, COUNT(*) as total_consultas " +
            "FROM Consulta_Atende ca " +
            "JOIN Funcionario f ON ca.cod_funcionario = f.cod_funcionario "
        );
        List<Object> params = new ArrayList<>();
        List<String> whereConditions = new ArrayList<>();

        if (mes != null) {
            whereConditions.add("DATE_FORMAT(ca.data_hora, '%Y-%m') = ?");
            params.add(mes);
        } else if (ano != null) {
            whereConditions.add("YEAR(ca.data_hora) = ?");
            params.add(ano);
        }
        
        if (!whereConditions.isEmpty()) {
            sql.append("WHERE ").append(String.join(" AND ", whereConditions));
        }

        sql.append(" GROUP BY f.cod_funcionario, f.nome ORDER BY total_consultas DESC");
        return jdbcTemplate.queryForList(sql.toString(), params.toArray());
    }

    public List<Map<String, Object>> getFiltroAnos() {
        String sql = "SELECT DISTINCT YEAR(data_hora) as ano FROM Venda ORDER BY ano DESC";
        return jdbcTemplate.queryForList(sql);
    }

    public List<Map<String, Object>> getFiltroMeses(int ano) {
        String sql = "SELECT DISTINCT DATE_FORMAT(data_hora, '%Y-%m') as mes " +
                     "FROM Venda " +
                     "WHERE YEAR(data_hora) = ? " +
                     "ORDER BY mes ASC";
        return jdbcTemplate.queryForList(sql, ano);
    }

    @Transactional
    public void executarAuditoriaVendas() {
        String sql = "CALL SP_AuditarECorrigirTotaisVenda()";
        jdbcTemplate.update(sql);
    }
}