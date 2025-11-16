USE PetShop;

-- =======================================================
-- TRIGGER 1: Auditoria de Preço (Tabela de Log)
-- (Tabela de Log)
-- =======================================================

CREATE TABLE Log_AuditoriaPreco (
    id_log INT PRIMARY KEY AUTO_INCREMENT,
    cod_produto_afetado INT NOT NULL,
    preco_antigo DECIMAL(10, 2) NOT NULL,
    preco_novo DECIMAL(10, 2) NOT NULL,
    data_hora_alteracao TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    usuario_db VARCHAR(100) NOT NULL,
    
    FOREIGN KEY (cod_produto_afetado) REFERENCES Produto(cod_produto) ON DELETE CASCADE
);

-- (Trigger de Log)
DELIMITER $$
CREATE TRIGGER TRG_AuditoriaPrecoProduto
AFTER UPDATE ON Produto
FOR EACH ROW
BEGIN
    IF NEW.preco_venda != OLD.preco_venda THEN
        INSERT INTO Log_AuditoriaPreco (
            cod_produto_afetado,
            preco_antigo,
            preco_novo,
            data_hora_alteracao,
            usuario_db
        )
        VALUES (
            OLD.cod_produto,
            OLD.preco_venda,
            NEW.preco_venda,
            NOW(),
            USER()
        );
    END IF;
END$$
DELIMITER ;

-- 5. TRIGGER: TRG_AuditoriaPrecoProduto (Para Tabela de Log)
-- JUSTIFICATIVA: Em um PetShop, o preço dos produtos (rações, medicamentos) muda constantemente. Este trigger cria um rastro de auditoria automático e inviolável na tabela `Log_AuditoriaPreco` para cada alteração de preço. O valor semântico é imenso para a segurança e governança, pois permite responder perguntas críticas como: "Quem alterou o preço do Bravecto e quando?" ou "Qual era o preço da Ração olden no mês passado?". Ele garante a integridade dos dados financeiros, registrando o "antes", o "depois", "quando" e "quem" fez a alteração.

-- =======================================================
-- TRIGGER 2 (Parte A): Verificação de Estoque (BEFORE)
-- =======================================================

DELIMITER $$
CREATE TRIGGER TRG_VerificarEstoqueAntesDaVenda
BEFORE INSERT ON contem
FOR EACH ROW
BEGIN
    DECLARE v_estoque_atual INT;

    SELECT
        quantidade_estoque INTO v_estoque_atual
    FROM
        Produto
    WHERE
        cod_produto = NEW.cod_produto;

    IF v_estoque_atual < NEW.quantidade THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Estoque insuficiente para o produto. Venda cancelada.';
    END IF;
END$$
DELIMITER ;

-- =======================================================
-- TRIGGER 2 (Parte B): Baixa de Estoque (AFTER)
-- =======================================================

DELIMITER $$
CREATE TRIGGER TRG_AtualizarEstoqueAposVenda
AFTER INSERT ON contem
FOR EACH ROW
BEGIN
    UPDATE Produto
    SET
        quantidade_estoque = quantidade_estoque - NEW.quantidade
    WHERE
        cod_produto = NEW.cod_produto;
END$$
DELIMITER ;

-- 6.TRIGGER: TRG_VerificarEstoqueAntesDaVenda e TRG_AtualizarEstoqueAposVenda 
-- JUSTIFICATIVA: Esta dupla de triggers é o núcleo da * * automação da gestão de inventário * *.O seu valor semântico é garantir que o banco de dados reflita a realidade física da loja em tempo real.
--      1.O trigger `BEFORE INSERT` (`TRG_VerificarEstoqueAntesDaVenda`) atua como um "segurança", validando se a quantidade vendida é menor ou igual ao estoque atual.Se não for, ele bloqueia a venda e gera um erro, impedindo a venda de produtos inexistentes (estoque negativo).
--      2.O trigger `AFTER INSERT` (`TRG_AtualizarEstoqueAposVenda`) só é executado se o "segurança" (o trigger BEFORE) permitir a venda.Ele então atualiza a tabela `Produto`, assegurando que o estoque seja decrementado instantaneamente.
-- A combinação de ambos garante a consistência total dos dados de estoque.