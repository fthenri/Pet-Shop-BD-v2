USE PetShop;

-- =======================================================
-- PROCEDIMENTO 1: Atualizar Preço do Produto (com IF)
-- =======================================================
DELIMITER $$
CREATE PROCEDURE SP_AtualizarPrecoProduto(
    IN p_cod_produto INT,
    IN p_novo_preco DECIMAL(10, 2)
)
BEGIN
    IF p_novo_preco < 0 THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'O preco do produto nao pode ser negativo.';
    ELSE
        UPDATE Produto
        SET
            preco_venda = p_novo_preco
        WHERE
            cod_produto = p_cod_produto;
    END IF;
END$$
DELIMITER ;

-- 3. PROCEDIMENTO: SP_AtualizarPrecoProduto (Para Atualização)
-- JUSTIFICATIVA: O valor semântico deste procedimento é garantir a **integridade dos dados e a regra de negócio**. Ele centraliza a lógica de atualização de preços, impedindo (através da estrutura condicional e do `SIGNAL`) que um preço se torne negativo, um estado de dados semanticamente inválido para um produto. Ele age como uma camada de segurança de dados que a aplicação pode consumir.

-- =======================================================
-- PRÉ-REQUISITO PARA O PROCEDIMENTO 2
-- Tabela de log para a procedure com cursor
-- =======================================================

CREATE TABLE Log_CorrecaoVenda (
    id_log INT PRIMARY KEY AUTO_INCREMENT,
    num_venda_corrigida INT NOT NULL,
    valor_antigo DECIMAL(10, 2) NOT NULL,
    valor_calculado DECIMAL(10, 2) NOT NULL,
    data_correcao TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (num_venda_corrigida) REFERENCES Venda(num_venda)
);

-- =======================================================
-- PROCEDIMENTO 2: Auditoria de Vendas (com CURSOR)
-- =======================================================

DELIMITER $$
CREATE PROCEDURE SP_AuditarECorrigirTotaisVenda()
BEGIN
    -- 1. Declaração de variáveis
    DECLARE v_done INT DEFAULT 0;
    DECLARE v_num_venda INT;
    DECLARE v_valor_armazenado DECIMAL(10, 2);
    DECLARE v_valor_calculado DECIMAL(10, 2);

    -- 2. Declaração do CURSOR
    DECLARE c_vendas CURSOR FOR
        SELECT num_venda, valor_total FROM Venda;

    -- 3. Handler para o fim do cursor
    DECLARE CONTINUE HANDLER FOR NOT FOUND SET v_done = 1;

    -- 4. Abrir o CURSOR
    OPEN c_vendas;

    -- 5. Iniciar o Loop
    read_loop: LOOP
    
        -- 6. Buscar a próxima linha
        FETCH c_vendas INTO v_num_venda, v_valor_armazenado;
        
        -- 7. Sair do loop se não houver mais dados
        IF v_done THEN
            LEAVE read_loop;
        END IF;

        -- 8. Calcular o total real da venda
        SELECT
            SUM(co.quantidade * p.preco_venda) 
        INTO
            v_valor_calculado
        FROM
            contem co
        JOIN
            Produto p ON co.cod_produto = p.cod_produto
        WHERE
            co.num_venda = v_num_venda;

        -- 9. Comparar, e agir se for diferente
        IF v_valor_armazenado != v_valor_calculado THEN
        
            -- Atualiza o valor correto na tabela Venda
            UPDATE Venda
            SET valor_total = v_valor_calculado
            WHERE num_venda = v_num_venda;
            
            -- Registra a correção no log de auditoria
            INSERT INTO Log_CorrecaoVenda
                (num_venda_corrigida, valor_antigo, valor_calculado)
            VALUES
                (v_num_venda, v_valor_armazenado, v_valor_calculado);
                
        END IF;

    -- 10. Fim do Loop
    END LOOP;

    -- 11. Fechar o CURSOR
    CLOSE c_vendas;

END$$
DELIMITER ;

-- 4. PROCEDIMENTO: SP_AuditarECorrigirTotaisVenda (Com CURSOR)
-- JUSTIFICATIVA: Esta Stored Procedure é uma ferramenta de auditoria e manutenção de dados. O uso de `CURSOR` é obrigatório porque a operação não é um simples UPDATE em massa. A procedure precisa iterar por cada venda (linha por linha), executar um `SELECT` complexo (com JOIN e SUM) para recalcular o total daquela venda, comparar o resultado com o valor já armazenado e, condicionalmente (apenas se os valores forem diferentes), executar um UPDATE e registrar a correção em um log de auditoria. Essa lógica processual (Iterar -> Calcular -> Comparar -> Agir/Registrar) não pode ser replicada por um único comando UPDATE.
