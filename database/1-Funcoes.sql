USE PetShop;

-- =======================================================
-- FUNÇÃO 1: Calcular Categoria de Idade do Pet (Com IF)
-- =======================================================

DELIMITER $$
CREATE FUNCTION FN_CalcularCategoriaIdadePet(
    p_data_nascimento DATE
)
RETURNS VARCHAR(20)
NOT DETERMINISTIC
READS SQL DATA
BEGIN
    DECLARE v_idade_anos INT;
    DECLARE v_categoria VARCHAR(20);

    SET v_idade_anos = TIMESTAMPDIFF(YEAR, p_data_nascimento, CURDATE());

    IF v_idade_anos < 1 THEN
        SET v_categoria = 'Filhote';
    ELSEIF v_idade_anos <= 7 THEN
        SET v_categoria = 'Adulto';
    ELSE
        SET v_categoria = 'Idoso';
    END IF;

    RETURN v_categoria;
END$$
DELIMITER ;

-- 1. FUNÇÃO: FN_CalcularCategoriaIdadePet (Com Estrutura Condicional)
-- JUSTIFICATIVA: O valor semântico é alto, pois permite:
--     -> Marketing Direcionado: Criar campanhas específicas (ex: "Mês do check-up sênior" para pets idosos ou "Promoção de ração para filhotes").
--     -> Apoio Clínico: Ajudar veterinários a identificar rapidamente em relatórios quais pets precisam de protocolos de vacinação de filhote ou cuidados geriátricos.
--     -> Vendas Otimizadas: Permitir que o sistema (ou um atendente) sugira produtos corretos (brinquedos, ração, suplementos) para a fase de vida do animal.

-- =======================================================
-- FUNÇÃO 2: Calcular Total Gasto por Cliente
-- =======================================================

DELIMITER $$
CREATE FUNCTION FN_TotalGastoCliente(
    p_cpf_cliente VARCHAR(11)
)
RETURNS DECIMAL(10, 2)
NOT DETERMINISTIC
READS SQL DATA
BEGIN
    DECLARE v_total_gasto DECIMAL(10, 2);

    SELECT
        SUM(valor_total) INTO v_total_gasto
    FROM
        Venda
    WHERE
        cpfCliente = p_cpf_cliente;

    -- Se o cliente nunca comprou, retorna 0 em vez de NULL
    IF v_total_gasto IS NULL THEN
        SET v_total_gasto = 0.00;
    END IF;

    RETURN v_total_gasto;
END$$
DELIMITER ;

-- 2. FUNÇÃO: FN_TotalGastoCliente
-- JUSTIFICATIVA: Esta função encapsula uma métrica de negócio vital: o "Valor de Vida do Cliente" (Customer Lifetime Value) parcial. Seu valor semântico está em simplificar relatórios e análises de BI. Ao invés de reescrever um `SUM` e `GROUP BY` complexo, a gestão pode simplesmente `SELECT FN_TotalGastoCliente('cpf')` para classificar os clientes mais valiosos, otimizar campanhas de fidelidade ou identificar clientes em risco de evasão (baixo gasto).
