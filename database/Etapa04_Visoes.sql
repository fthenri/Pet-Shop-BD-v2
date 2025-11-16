USE PetShop;
 
-- ENTREGÁVEL 3: VISÕES (VIEWS) 

-- VISÃO 1: Relatório Detalhado da Consulta

-- Justificativa Semântica: Esta visão é para uso da recepção e 
-- dos veterinários. Ela cria um "relatório" de fácil acesso
-- que desnormaliza (achata) os dados mais importantes de uma consulta,
-- unindo 5 tabelas (Consulta_Atende, Pet, Cliente, Veterinario, Funcionario)
-- para mostrar quem foi atendido, por quem, e qual o diagnóstico,
-- sem que o usuário final precise saber fazer todos esses JOINs

CREATE VIEW VW_DetalhesConsulta AS
SELECT
  CA.num_consulta,
  CA.data_hora,
  P.nome_pet AS nome_animal,
  P.especie,
  P.raca,
  C.nome AS nome_cliente,
  C.telefone1 AS contato_cliente,
  F.nome AS nome_veterinario,
  V.CRMV,
  CA.sintomas_relatados,
  CA.diagnostico
FROM
  Consulta_Atende CA
JOIN
  Pet P ON CA.cod_pet = P.cod_pet
JOIN
  Cliente C ON P.cpfCliente = C.cpf
JOIN
  Veterinario V ON CA.cod_funcionario = V.cod_funcionario
JOIN
  Funcionario F ON V.cod_funcionario = F.cod_funcionario;


-- VISÃO 2: Relatório Analítico de Itens Vendidos
-- Justificativa Semântica: Esta visão é para análise de negócios 
-- e gerenciamento. Ela une 6 tabelas (contem, Venda, Produto, Cliente, 
-- Funcionario, Fornecedor) para criar um relatório completo
-- que mostra CADA item vendido, em qual venda, por qual atendente,
-- para qual cliente, e quem era o fornecedor daquele produto
-- (Esta view usa mais de 3 JOINs, conforme solicitado)

CREATE VIEW VW_RelatorioItensVendidos AS
SELECT
  V.num_venda,
  V.data_hora,
  C.nome AS nome_cliente,
  Fun.nome AS nome_atendente,
  P.cod_produto,
  P.nome_produto,
  co.quantidade AS qtd_vendida,
  P.preco_venda AS preco_unitario,
  (co.quantidade * P.preco_venda) AS subtotal_item,
  Forne.razao_social AS nome_fornecedor
FROM
  contem co
JOIN
  Venda V ON co.num_venda = V.num_venda
JOIN
  Produto P ON co.cod_produto = P.cod_produto
JOIN
  Cliente C ON V.cpfCliente = C.cpf
JOIN
  Funcionario Fun ON V.cod_funcionario = Fun.cod_funcionario
JOIN
  Fornecedor Forne ON P.cnpjFornecedor = Forne.cnpj;