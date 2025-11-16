USE PetShop;

-- 4 NOVAS CONSULTAS (REQUISITOS DO PROJETO - ETAPA 04)

-- Consulta 5: FULL OUTER JOIN (Simulado com UNION)
-- Objetivo: Listar todos os funcionários que são Veterinários E 
-- todos os funcionários que são Atendentes, mostrando seus dados
SELECT 
    F.nome,
    F.cpf,
    V.CRMV,
    NULL AS 'Tipo_Atendente' 
FROM 
    Veterinario V
JOIN 
    Funcionario F ON V.cod_funcionario = F.cod_funcionario

UNION

SELECT 
    F.nome,
    F.cpf,
    NULL AS 'CRMV', 
    A.cod_funcionario AS 'Tipo_Atendente'
FROM 
    Atendente A
JOIN 
    Funcionario F ON A.cod_funcionario = F.cod_funcionario;


-- Consulta 6: Subconsulta (com NOT IN)
-- Objetivo: Listar todos os clientes que se cadastraram, 
-- mas que NUNCA realizaram uma compra (ou seja, seu CPF não está na tabela Venda)
SELECT 
    cpf, 
    nome, 
    telefone1,
    data_cadastro
FROM 
    Cliente
WHERE 
    cpf NOT IN (SELECT DISTINCT cpfCliente FROM Venda);


-- Consulta 7: Subconsulta (Correlacionada com EXISTS)
-- Objetivo: Listar todas as Vendas (e o nome do cliente) que incluíram 
-- pelo menos um produto cujo estoque atual (quantidade_estoque) é baixo (ex: < 20 unidades)
SELECT 
    V.num_venda, 
    V.data_hora, 
    C.nome AS nome_cliente,
    V.valor_total
FROM 
    Venda V
JOIN 
    Cliente C ON V.cpfCliente = C.cpf
WHERE 
    EXISTS (
        -- Subconsulta correlacionada: verifica para CADA venda (V.num_venda)
        SELECT 1 
        FROM contem co
        JOIN Produto P ON co.cod_produto = P.cod_produto
        WHERE 
            co.num_venda = V.num_venda 
            AND P.quantidade_estoque < 20
    );

 
-- Consulta 8: Anti-Join (com LEFT JOIN ... IS NULL)
-- Objetivo: Listar todos os produtos do catálogo que NUNCA 
-- foram vendidos. Isso é um "Anti-Join" porque pegamos todos
-- os produtos (LEFT) e excluímos os que têm uma venda (contem.num_venda IS NULL)
-- Isso é extremamente útil para o gerenciamento de estoque
-- para identificar produtos "encalhados"

SELECT
  P.cod_produto,
  P.nome_produto,
  P.preco_venda,
  P.quantidade_estoque,
  F.razao_social AS nome_fornecedor
FROM
  Produto P
LEFT JOIN
  contem co ON P.cod_produto = co.cod_produto
JOIN
  Fornecedor F ON P.cnpjFornecedor = F.cnpj
WHERE
  co.num_venda IS NULL 
ORDER BY
  P.nome_produto;