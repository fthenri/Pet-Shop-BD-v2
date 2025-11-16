/*
 * =======================================================
 * PARTE 1: CRIAÇÃO DA ESTRUTURA (DDL)
 * (Conteúdo do arquivo 01_PetShop_Estrutura.sql)
 * =======================================================
 */

CREATE DATABASE PetShop
CHARACTER SET utf8mb4 
COLLATE utf8mb4_unicode_ci;

USE PetShop;

CREATE TABLE Fornecedor (
    cnpj VARCHAR(14) PRIMARY KEY,
    razao_social VARCHAR(200) NOT NULL, 
    contato_principal VARCHAR(15) NOT NULL
);

CREATE TABLE Cliente (
    cpf VARCHAR(11) PRIMARY KEY, 
    nome VARCHAR(150) NOT NULL, 
    data_cadastro DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    logradouro VARCHAR(200), 
    numero VARCHAR(10), 
    bairro VARCHAR(50), 
    cidade VARCHAR(50), 
    estado CHAR(2), 
    cep VARCHAR(8), 
    telefone1 varchar(15) NOT NULL,
    telefone2 varchar(15)
);

CREATE TABLE Produto (
    cod_produto INT PRIMARY KEY AUTO_INCREMENT, 
    nome_produto VARCHAR(100) NOT NULL,
    descricao TEXT, 
    preco_venda DECIMAL(10, 2) NOT NULL CHECK (preco_venda >= 0), 
    quantidade_estoque INT NOT NULL DEFAULT 0 CHECK (quantidade_estoque >= 0),
    cnpjFornecedor VARCHAR(14) NOT NULL,
    FOREIGN KEY (cnpjFornecedor) REFERENCES Fornecedor(cnpj) 
);

CREATE TABLE Funcionario (
    cod_funcionario INT PRIMARY KEY AUTO_INCREMENT,
    nome VARCHAR(150) NOT NULL,
    cpf VARCHAR(11) NOT NULL UNIQUE,
    data_admissao DATE NOT NULL,
    supervisor INT,
    FOREIGN KEY (supervisor) REFERENCES Funcionario(cod_funcionario)
);

CREATE TABLE Atendente (
    cod_funcionario INT PRIMARY KEY,
    FOREIGN KEY (cod_funcionario) REFERENCES Funcionario(cod_funcionario) ON DELETE CASCADE
);

CREATE TABLE Veterinario (
    cod_funcionario INT PRIMARY KEY,
    CRMV VARCHAR(10) NOT NULL UNIQUE,
    FOREIGN KEY (cod_funcionario) REFERENCES Funcionario(cod_funcionario) ON DELETE CASCADE
);

CREATE TABLE Pet (
    cod_pet INT PRIMARY KEY AUTO_INCREMENT,
    cpfCliente VARCHAR(11) NOT NULL,
    nome_pet VARCHAR(100) NOT NULL,
    especie VARCHAR(50) NOT NULL,
    raca VARCHAR(50),
    data_nascimento DATE,
    observacoes TEXT,
    FOREIGN KEY (cpfCliente) REFERENCES Cliente(cpf) ON DELETE CASCADE
);

CREATE TABLE Venda (
    num_venda INT PRIMARY KEY AUTO_INCREMENT,
    cpfCliente VARCHAR(11) NOT NULL,
    cod_funcionario INT NOT NULL,
    data_hora DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    valor_total DECIMAL(10, 2) NOT NULL,
    forma_pagamento VARCHAR(50) NOT NULL,
    FOREIGN KEY (cpfCliente) REFERENCES Cliente(cpf),
    FOREIGN KEY (cod_funcionario) REFERENCES Funcionario(cod_funcionario)
);

CREATE TABLE contem (
    cod_produto INT NOT NULL,
    num_venda INT NOT NULL,
    quantidade INT NOT NULL CHECK (quantidade > 0),
    PRIMARY KEY (cod_produto, num_venda),
    FOREIGN KEY (cod_produto) REFERENCES Produto(cod_produto),
    FOREIGN KEY (num_venda) REFERENCES Venda(num_venda) ON DELETE CASCADE
);

CREATE TABLE Consulta_Atende (
    num_consulta INT PRIMARY KEY AUTO_INCREMENT,
    cod_pet INT NOT NULL,
    cod_funcionario INT NOT NULL,
    data_hora DATETIME NOT NULL,
    sintomas_relatados TEXT,
    diagnostico TEXT,
    FOREIGN KEY (cod_pet) REFERENCES Pet(cod_pet),
    FOREIGN KEY (cod_funcionario) REFERENCES Veterinario(cod_funcionario)
);

CREATE TABLE Exame (
    cod_exame INT PRIMARY KEY AUTO_INCREMENT,
    num_consulta INT NOT NULL,
    nome_exame VARCHAR(100) NOT NULL,
    data_solicitacao DATE NOT NULL,
    resultado TEXT,
    FOREIGN KEY (num_consulta) REFERENCES Consulta_Atende(num_consulta) ON DELETE CASCADE
);

-- Tabela de Log para Trigger de Auditoria de Preço
CREATE TABLE Log_AuditoriaPreco (
    id_log INT PRIMARY KEY AUTO_INCREMENT,
    cod_produto_afetado INT NOT NULL,
    preco_antigo DECIMAL(10, 2) NOT NULL,
    preco_novo DECIMAL(10, 2) NOT NULL,
    data_hora_alteracao TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    usuario_db VARCHAR(100) NOT NULL,
    
    FOREIGN KEY (cod_produto_afetado) REFERENCES Produto(cod_produto) ON DELETE CASCADE
);

/*
 * =======================================================
 * PARTE 1.5: CRIAÇÃO DOS TRIGGERS
 * =======================================================
 */

-- TRIGGER 1: Auditoria de Preço
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

-- TRIGGER 2 (Parte A): Verificação de Estoque (BEFORE)
DELIMITER $$
CREATE TRIGGER TRG_VerificarEstoqueAntesDaVenda
BEFORE INSERT ON contem
FOR EACH ROW
BEGIN
    DECLARE v_estoque_atual INT;

    SELECT quantidade_estoque INTO v_estoque_atual
    FROM Produto
    WHERE cod_produto = NEW.cod_produto;

    IF v_estoque_atual < NEW.quantidade THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Estoque insuficiente para o produto. Venda cancelada.';
    END IF;
END$$
DELIMITER ;

-- TRIGGER 2 (Parte B): Baixa de Estoque (AFTER)
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


/*
 * =======================================================
 * PARTE 2: INSERÇÃO DOS DADOS BASE (DML)
 * =======================================================
 */

-- Inserção de Fornecedores (CORRIGIDO COM TELEFONES)
INSERT INTO Fornecedor (cnpj, razao_social, contato_principal) VALUES
('11223344000155', 'Distribuidora Pet Forte Ltda.', '11988776655'),
('55667788000199', 'Pet Food & Cia S.A.', '1133221144'),
('99887766000133', 'Saude Animal Atacadista', '81999887766'),
('12345678000100', 'Brinquedos Pet World', '2134567890'),
('87654321000111', 'Higiene e Beleza Pet Eireli', '41988112233'),
('23456789000122', 'Acessorios Caninos e Felinos', '11912345678'),
('98765432000133', 'Mundo Aquatico Distribuidora', '8134657890'),
('34567890000144', 'Vida de Passaro Comercio', '31987654321'),
('89012345000155', 'Roedores & Cia', '71999112233'),
('45678901000166', 'Farmapet Medicamentos Veterinarios', '1140040001'),
('10203040000177', 'Nutricao Animal Premium', '21981828384'),
('50607080000188', 'Pet Toys Importadora', '5132334455'),
('90807060000199', 'Conforto Pet Camas e Casinhas', '81985554433'),
('11122233000144', 'Exotic Pets Suprimentos', '11988889999'),
('44455566000155', 'Aquarios e Equipamentos Ocean Blue', '8132224444'),
('66677788000166', 'Grooming Master Tesouras e Maquinas', '11977665544'),
('88899900000177', 'Snacks & Treats Delicias Pet', '21988771122'),
('00011122000188', 'VetMed Equipamentos Medicos', '3132215566'),
('22233344000199', 'Pet Wear Roupas e Acessorios', '11966554433'),
('33344455000100', 'Pet Clean Produtos de Limpeza', '81981234567'),
('77788899000111', 'Sementes & Graos Aves Fortes', '6133224455'),
('88899911000122', 'Terrarios e Cia para Repteis', '11987651234'),
('99911122000133', 'Farmacia Veterinaria Central', '8132417788'),
('11133355000144', 'Petisco Natural Organicos', '48999887766'),
('33355577000155', 'Brinquedos Interativos PetMind', '11955443322'),
('55577799000166', 'Aquarismo Profissional Ltda', '8132001000'),
('77799911000177', 'Coleiras & Guias Estilo Pet', '21988887777'),
('99911133000188', 'Petiscos Hipoalergenicos Vida Leve', '11966665555'),
('11122244000199', 'Areias Higienicas Clean Cat', '81977778888'),
('22244466000100', 'Vitaminas e Suplementos VetPower', '1130304040');

-- Inserção de Produtos
INSERT INTO Produto (nome_produto, descricao, preco_venda, quantidade_estoque, cnpjFornecedor) VALUES
('Ração Golden Power 15kg', 'Ração premium para cães adultos de porte médio.', 189.90, 150, '55667788000199'),
('Ração Whiskas Gatos Castrados 3kg', 'Ração seca para gatos adultos castrados sabor carne.', 89.90, 200, '55667788000199'),
('Shampoo Antipulgas 500ml', 'Shampoo medicamentoso para cães e gatos.', 120.00, 80, '87654321000111'),
('Areia Higiênica Pipicat 4kg', 'Areia sanitária biodegradável para gatos.', 50.00, 300, '11122244000199'),
('Coleira de Couro M', 'Coleira de couro marrom para cães de porte médio.', 75.50, 120, '23456789000122'),
('Brinquedo Osso de Borracha', 'Brinquedo de borracha atóxica para cães.', 35.00, 250, '12345678000100'),
('Vermífugo VetPlus 4 comprimidos', 'Vermífugo de amplo espectro para cães e gatos.', 65.00, 100, '45678901000166'),
('Ração Royal Canin Renal Gatos 1.5kg', 'Ração coadjuvante para gatos com problemas renais.', 210.00, 60, '55667788000199'),
('Gaiola para Hamster 2 andares', 'Gaiola completa com tubos e rodinha.', 180.00, 40, '89012345000155'),
('Ração Golden Filhotes 10kg', 'Ração premium para cães filhotes de porte pequeno.', 150.00, 130, '55667788000199'),
('Ração Premier Gatos Obesos 1.5kg', 'Ração para gatos adultos com sobrepeso.', 85.00, 70, '10203040000177'),
('Aquário 50L com Filtro', 'Aquário de vidro 50 litros com sistema de filtragem.', 350.50, 30, '44455566000155'),
('Ração Alcon Papagaio 5kg', 'Alimento extrusado para papagaios e araras.', 130.00, 50, '34567890000144'),
('Suplemento Vitamínico Pet A-Z', 'Suplemento vitamínico para cães e gatos.', 95.00, 90, '22244466000100'),
('Ração Golden Gatos Castrados 10kg', 'Ração premium para gatos castrados sabor salmão.', 320.00, 100, '55667788000199'),
('Pente de Aço para Pelo', 'Pente de aço para remover nós de cães e gatos.', 45.00, 150, '66677788000166'),
('Antipulgas Bravecto 10-20kg', 'Comprimido mastigável contra pulgas e carrapatos.', 160.00, 80, '99911122000133'),
('Ração de Coelho NutriRoedores 5kg', 'Ração balanceada para coelhos adultos.', 70.00, 50, '89012345000155'),
('Lâmpada Aquecedora para Répteis', 'Lâmpada UVA/UVB para terrários.', 110.00, 30, '88899911000122'),
('Petisco Natural Cães 150g', 'Bifinho de carne 100% natural.', 25.00, 400, '11133355000144');

-- Inserção de Funcionários
INSERT INTO Funcionario (nome, cpf, data_admissao, supervisor) VALUES
('Ricardo Mendes', '10010010011', '2019-05-10', NULL),
('Beatriz Lima', '20020020022', '2019-05-10', 1),
('Sergio Matos', '30030030033', '2019-11-01', 1),
('Vanessa Campos', '40040040044', '2020-03-15', 2),
('Eduardo Pereira', '50050050055', '2020-03-15', 2),
('Dr. Carlos Andrade', '11011011011', '2020-01-20', 4),
('Dra. Amanda Costa', '12012012022', '2020-02-15', 4),
('Dr. Bruno Farias', '13013013033', '2020-06-01', 4),
('Dra. Clara Ribeiro', '14014014044', '2021-02-10', 4),
('Dr. Diego Martins', '15015015055', '2021-03-20', 4),
('Dra. Elisa Gomes', '16016016066', '2021-07-30', 5),
('Dr. Fabio Azevedo', '17017017077', '2022-01-05', 5),
('Dra. Gabriela Nunes', '18018018088', '2022-04-11', 5),
('Dr. Heitor Alves', '19019019099', '2023-05-25', 5),
('Dra. Isis Moreira', '21021021011', '2023-11-10', 5),
('Larissa Andrade', '31031031011', '2020-07-01', 3),
('Marcos Oliveira', '32032032022', '2020-07-01', 3),
('Natalia Sousa', '33033033033', '2020-09-15', 3),
('Otavio Rocha', '34034034044', '2021-04-01', 3),
('Patricia Barros', '35035035055', '2021-04-01', 3),
('Quintino Santos', '36036036066', '2021-10-10', 3),
('Renata Farias', '37037037077', '2022-02-20', 3),
('Silvio Nogueira', '38038038088', '2022-08-01', 3),
('Tatiana Azevedo', '39039039099', '2023-01-15', 3),
('Ulisses Tavares', '41041041011', '2023-06-05', 3),
('Vinicius Morais', '42042042022', '2023-09-20', 3),
('Waleska Pinto', '43043043033', '2024-01-10', 3),
('Xavier Dantas', '44044044044', '2024-03-15', 3),
('Yara Medeiros', '45045045055', '2024-07-01', 3),
('Zacarias Morais', '46046046066', '2024-07-01', 3);

-- Inserção de Atendentes (Especialização)
INSERT INTO Atendente (cod_funcionario) VALUES
(16), (17), (18), (19), (20), (21), (22), (23), (24), (25), (26), (27), (28), (29), (30);

-- Inserção de Veterinários (Especialização)
INSERT INTO Veterinario (cod_funcionario, CRMV) VALUES
(6, 'PE1234'), (7, 'PE2345'), (8, 'SP3456'), (9, 'RJ4567'), (10, 'MG5678'),
(11, 'PE6789'), (12, 'SP7890'), (13, 'RJ8901'), (14, 'MG9012'), (15, 'PE0123');

-- Inserção de Clientes
INSERT INTO Cliente (cpf, nome, data_cadastro, logradouro, numero, bairro, cidade, estado, cep, telefone1, telefone2)
VALUES
('01010101010', 'Maria Silva', '2020-01-15 10:30:00', 'Rua dos Aflitos', '100', 'Aflitos', 'Recife', 'PE', '52050000', '81988887777', '8132681122'),
('12121212121', 'Joao Santos', '2020-02-20 11:00:00', 'Avenida Boa Viagem', '2030', 'Boa Viagem', 'Recife', 'PE', '51020000', '81999998888', NULL),
('23232323232', 'Pedro Almeida', '2020-03-10 14:15:00', 'Rua da Aurora', '500', 'Boa Vista', 'Recife', 'PE', '50050000', '81977776666', NULL),
('34343434343', 'Sofia Costa', '2020-05-05 09:00:00', 'Rua do Futuro', '700', 'Jaqueira', 'Recife', 'PE', '52050010', '81966665555', '8134412233'),
('45454545454', 'Lucas Pereira', '2020-07-12 16:45:00', 'Avenida 17 de Agosto', '1500', 'Casa Forte', 'Recife', 'PE', '52061540', '81955554444', NULL),
('56565656565', 'Ana Oliveira', '2020-10-25 08:30:00', 'Rua da Harmonia', '300', 'Casa Amarela', 'Recife', 'PE', '52050020', '81944443333', NULL),
('67676767676', 'Rafaela Gomes', '2021-01-30 13:00:00', 'Estrada do Arraial', '4000', 'Casa Amarela', 'Recife', 'PE', '52051380', '81933332222', NULL),
('78787878787', 'Felipe Barros', '2021-04-18 10:00:00', 'Rua Amélia', '550', 'Espinheiro', 'Recife', 'PE', '52020210', '81922221111', '8132223344'),
('89898989898', 'Mariana Lima', '2021-06-02 17:10:00', 'Avenida Parnamirim', '200', 'Parnamirim', 'Recife', 'PE', '52060000', '81911110000', NULL),
('90909090909', 'Rodrigo Nunes', '2021-09-11 11:00:00', 'Rua das Graças', '120', 'Graças', 'Recife', 'PE', '52011040', '81998989898', NULL),
('02020202020', 'Amanda Correia', '2021-11-05 14:00:00', 'Avenida Herculano Bandeira', '425', 'Pina', 'Recife', 'PE', '51110131', '81997979797', '8133267788'),
('03030303030', 'Bruno Rocha', '2022-01-20 15:30:00', 'Rua de Apipucos', '150', 'Apipucos', 'Recife', 'PE', '52071000', '81996969696', NULL),
('04040404040', 'Clara Lima', '2022-03-15 09:45:00', 'Avenida Conselheiro Aguiar', '3500', 'Boa Viagem', 'Recife', 'PE', '51020020', '81995959595', NULL),
('05050505050', 'Diego Alves', '2022-05-30 08:00:00', 'Rua do Rosário', '100', 'Santo Amaro', 'Recife', 'PE', '50050090', '81994949494', NULL),
('13131313131', 'Laura Martins', '2022-07-14 12:00:00', 'Rua Jerônimo de Albuquerque', '80', 'Casa Forte', 'Recife', 'PE', '52061030', '81993939393', '8132690011'),
('24242424242', 'Gabriela Dias', '2022-09-01 16:00:00', 'Rua da Soledade', '220', 'Boa Vista', 'Recife', 'PE', '50070040', '81992929292', NULL),
('35353535353', 'Lucas Costa', '2022-11-10 10:00:00', 'Avenida Beberibe', '1000', 'Beberibe', 'Recife', 'PE', '52120000', '81991919191', NULL),
('46464646464', 'Ricardo Sousa', '2023-01-05 11:20:00', 'Rua da Moeda', '50', 'Recife Antigo', 'Recife', 'PE', '50030040', '81989898989', NULL),
('57575757575', 'Beatriz Lima', '2023-03-22 13:00:00', 'Rua Dom Bosco', '700', 'Boa Vista', 'Recife', 'PE', '50070070', '81987878787', '8132214455'),
('68686868686', 'Waleska Pinto', '2023-05-18 15:00:00', 'Praca de Casa Forte', '300', 'Casa Forte', 'Recife', 'PE', '52061420', '81986878889', '8132689012'),
('79797979797', 'Xavier Dantas', '2023-07-20 09:30:00', 'Avenida Norte', '6000', 'Macaxeira', 'Recife', 'PE', '52090000', '81996979899', NULL),
('80808080808', 'Yara Medeiros', '2023-09-14 10:00:00', 'Rua da Harmonia', '250', 'Casa Amarela', 'Recife', 'PE', '52050020', '81988899000', NULL),
('91919191919', 'Zacarias Morais', '2023-11-30 14:00:00', 'Rua do Riachuelo', '105', 'Boa Vista', 'Recife', 'PE', '50050400', '81999900111', '8132212233'),
('10101010101', 'Antonio Carlos', '2024-01-15 11:00:00', 'Avenida Cruz Cabugá', '150', 'Santo Amaro', 'Recife', 'PE', '50040000', '81981818181', NULL),
('11111111111', 'Bernardo Silva', '2024-02-28 16:30:00', 'Rua do Hospício', '300', 'Boa Vista', 'Recife', 'PE', '50050050', '81982828282', NULL),
('22222222222', 'Carolina Ferraz', '2024-04-10 09:00:00', 'Rua 21 de Abril', '1000', 'Afogados', 'Recife', 'PE', '50830000', '81983838383', '8132256677'),
('33333333333', 'Davi Moreira', '2024-05-25 10:30:00', 'Estrada dos Remédios', '200', 'Madalena', 'Recife', 'PE', '50610000', '81984848484', NULL),
('44444444444', 'Elisa Brandão', '2024-07-05 14:00:00', 'Rua Real da Torre', '500', 'Torre', 'Recife', 'PE', '50620000', '81985858585', NULL),
('55555555555', 'Fernando Costa', '2024-09-18 08:00:00', 'Rua da Angustura', '10', 'Aflitos', 'Recife', 'PE', '52020150', '81994959697', NULL);

-- Inserção de Pets
INSERT INTO Pet (cod_pet, cpfCliente, nome_pet, especie, raca, data_nascimento, observacoes)
VALUES
(1, '01010101010', 'Thor', 'Cachorro', 'Golden Retriever', '2018-03-10', 'Alergia a frango'),
(2, '01010101010', 'Bigode', 'Gato', 'Siamês', '2019-07-15', 'Arisco com estranhos'),
(3, '12121212121', 'Mel', 'Cachorro', 'Shih Tzu', '2021-01-20', 'Muito dócil'),
(4, '23232323232', 'Nina', 'Gato', 'Persa', '2017-11-05', 'Necessita escovação diária'),
(5, '34343434343', 'Max', 'Cachorro', 'Labrador', '2022-05-30', 'Filhote muito agitado'),
(6, '45454545454', 'Bela', 'Gato', 'Angorá', '2016-02-14', 'Idosa, problemas renais'),
(7, '56565656565', 'Luke', 'Cachorro', 'Bulldog Francês', '2020-10-01', 'Problemas respiratórios'),
(8, '67676767676', 'Loki', 'Cachorro', 'Vira-lata', '2019-04-22', 'Resgatado, muito medroso'),
(9, '78787878787', 'Simba', 'Gato', 'Maine Coon', '2021-08-10', NULL),
(10, '89898989898', 'Molly', 'Cachorro', 'Poodle', '2015-12-25', 'Idosa, cega de um olho'),
(11, '90909090909', 'Fred', 'Cachorro', 'Dachshund', '2022-02-10', 'Teimoso'),
(12, '02020202020', 'Apolo', 'Gato', 'Vira-lata', '2021-05-01', NULL),
(13, '03030303030', 'Bob', 'Cachorro', 'Beagle', '2021-11-11', 'Adora petiscos'),
(14, '04040404040', 'Cacau', 'Cachorro', 'Spitz Alemão', '2022-08-20', NULL),
(15, '05050505050', 'Duda', 'Gato', 'Ragdoll', '2020-09-15', 'Muito calma'),
(16, '13131313131', 'Einstein', 'Cachorro', 'Border Collie', '2022-07-10', 'Muito inteligente'),
(17, '24242424242', 'Fiona', 'Cachorro', 'Vira-lata', '2018-06-01', 'Resgatada'),
(18, '35353535353', 'George', 'Gato', 'British Shorthair', '2022-10-10', NULL),
(19, '46464646464', 'Hulk', 'Cachorro', 'Pitbull', '2019-03-03', 'Extremamente dócil'),
(20, '57575757575', 'Jade', 'Gato', 'Siberiano', '2017-05-20', 'Idosa'),
(21, '68686868686', 'Kiko', 'Cachorro', 'Chihuahua', '2023-01-30', NULL),
(22, '79797979797', 'Lala', 'Cachorro', 'Lhasa Apso', '2023-04-15', NULL),
(23, '80808080808', 'Milo', 'Gato', 'Vira-lata', '2023-06-01', 'Filhote'),
(24, '91919191919', 'Nala', 'Cachorro', 'Rottweiler', '2021-03-25', 'Cão de guarda'),
(25, '10101010101', 'Otto', 'Cachorro', 'Schnauzer', '2023-10-10', 'Filhote'),
(26, '11111111111', 'Pandora', 'Gato', 'Sphynx', '2022-12-01', 'Requer cuidados com a pele'),
(27, '22222222222', 'Pingo', 'Cachorro', 'Pinscher', '2024-01-15', 'Muito agitado'),
(28, '33333333333', 'Romeu', 'Gato', 'Vira-lata', '2021-07-20', NULL),
(29, '44444444444', 'Stella', 'Cachorro', 'Dálmata', '2023-11-05', 'Surda'),
(30, '55555555555', 'Toby', 'Cachorro', 'Yorkshire', '2024-03-01', 'Filhote'),
(31, '01010101010', 'Zoe', 'Cachorro', 'Pastor Alemão', '2022-04-01', NULL),
(32, '12121212121', 'Zeca', 'Gato', 'Vira-lata', '2020-01-01', 'Resgatado'),
(33, '34343434343', 'Billy', 'Cachorro', 'Golden Retriever', '2023-08-15', 'Filhote'),
(34, '45454545454', 'Kiara', 'Gato', 'Siamês', '2021-09-10', NULL),
(35, '56565656565', 'Jack', 'Cachorro', 'Vira-lata', '2017-10-30', 'Idoso'),
(36, '89898989898', 'Maggie', 'Cachorro', 'Cocker Spaniel', '2022-06-20', NULL),
(37, '02020202020', 'Oliver', 'Gato', 'Vira-lata', '2021-12-12', NULL),
(38, '05050505050', 'Penelope', 'Gato', 'Persa', '2022-03-18', NULL),
(39, '13131313131', 'Rocky', 'Cachorro', 'Bulldog Inglês', '2021-10-05', NULL),
(40, '35353535353', 'Sushi', 'Gato', 'Vira-lata', '2022-11-20', 'Adotado'),
(41, '68686868686', 'Wendy', 'Cachorro', 'Maltês', '2023-09-01', 'Muito branca'),
(42, '91919191919', 'Zeus', 'Cachorro', 'Doberman', '2022-01-01', 'Cão de guarda');

-- Inserção de Vendas
INSERT INTO Venda (data_hora, valor_total, forma_pagamento, cpfCliente, cod_funcionario)
VALUES
('2022-01-10 10:00:00', 189.90, 'Cartão de Crédito', '01010101010', 16),
('2022-01-15 11:30:00', 120.00, 'PIX', '12121212121', 17),
('2022-02-01 14:00:00', 89.90, 'Débito', '23232323232', 18),
('2022-02-10 09:00:00', 350.50, 'Cartão de Crédito', '34343434343', 19),
('2022-03-05 16:00:00', 75.50, 'Dinheiro', '45454545454', 20),
('2022-03-20 10:30:00', 210.00, 'PIX', '56565656565', 16),
('2022-04-10 11:00:00', 50.00, 'Débito', '67676767676', 17),
('2022-04-15 14:15:00', 150.00, 'Cartão de Crédito', '78787878787', 18),
('2022-05-02 09:30:00', 35.00, 'Dinheiro', '89898989898', 19),
('2022-05-10 17:00:00', 85.00, 'PIX', '90909090909', 20),
('2022-06-01 10:00:00', 189.90, 'Cartão de Crédito', '02020202020', 21),
('2022-06-05 11:00:00', 130.00, 'Débito', '03030303030', 22),
('2022-07-10 14:00:00', 320.00, 'PIX', '04040404040', 23),
('2022-07-15 15:30:00', 95.00, 'Cartão de Crédito', '05050505050', 24),
('2022-08-01 09:00:00', 75.50, 'Dinheiro', '13131313131', 25),
('2022-08-05 16:30:00', 160.00, 'PIX', '24242424242', 21),
('2022-09-10 10:00:00', 120.00, 'Débito', '35353535353', 22),
('2022-09-15 11:00:00', 89.90, 'Cartão de Crédito', '46464646464', 23),
('2022-10-01 14:00:00', 210.00, 'PIX', '57575757575', 24),
('2022-10-10 09:00:00', 50.00, 'Dinheiro', '68686868686', 25),
('2023-01-20 10:00:00', 379.80, 'Cartão de Crédito', '01010101010', 16),
('2023-02-15 11:00:00', 150.00, 'PIX', '12121212121', 17),
('2023-03-10 14:00:00', 160.00, 'Débito', '34343434343', 18),
('2023-04-05 09:00:00', 151.00, 'Cartão de Crédito', '45454545454', 19),
('2023-05-01 16:00:00', 210.00, 'PIX', '56565656565', 20),
('2023-06-10 10:30:00', 100.00, 'Dinheiro', '89898989898', 21),
('2023-07-15 11:00:00', 189.90, 'Débito', '02020202020', 22),
('2023-08-01 14:00:00', 85.00, 'Cartão de Crédito', '04040404040', 23),
('2023-09-20 09:30:00', 75.50, 'PIX', '13131313131', 24),
('2023-10-05 17:00:00', 120.00, 'Dinheiro', '46464646464', 25),
('2024-01-15 10:00:00', 189.90, 'Cartão de Crédito', '01010101010', 16),
('2024-02-01 11:00:00', 320.00, 'PIX', '34343434343', 17),
('2024-03-10 14:00:00', 160.00, 'Débito', '56565656565', 18),
('2024-04-05 09:00:00', 89.90, 'Cartão de Crédito', '89898989898', 19),
('2024-05-15 16:00:00', 150.00, 'PIX', '13131313131', 20),
('2024-06-01 10:30:00', 70.00, 'Dinheiro', '68686868686', 21),
('2024-07-20 11:00:00', 189.90, 'Débito', '79797979797', 22),
('2024-09-05 14:00:00', 85.00, 'Cartão de Crédito', '80808080808', 23),
('2024-10-10 09:30:00', 95.00, 'PIX', '91919191919', 24),
('2024-11-25 17:00:00', 210.00, 'Dinheiro', '01010101010', 25);

-- Inserção de Itens da Venda (contem)
INSERT INTO contem (num_venda, cod_produto, quantidade)
VALUES
(1, 1, 1),
(2, 3, 1),
(3, 2, 1),
(4, 12, 1),
(5, 5, 1),
(6, 8, 1),
(7, 4, 1),
(8, 10, 1),
(9, 6, 1),
(10, 11, 1),
(11, 1, 1),
(12, 13, 1),
(13, 15, 1),
(14, 14, 1),
(15, 5, 1),
(16, 17, 1),
(17, 3, 1),
(18, 2, 1),
(19, 8, 1),
(20, 4, 1),
(21, 1, 2),
(22, 10, 1),
(23, 17, 1),
(24, 5, 2),
(25, 8, 1),
(26, 4, 2),
(27, 1, 1),
(28, 11, 1),
(29, 5, 1),
(30, 3, 1),
(31, 1, 1),
(32, 15, 1),
(33, 17, 1),
(34, 2, 1),
(35, 10, 1),
(36, 6, 2),
(37, 1, 1),
(38, 11, 1),
(39, 14, 1),
(40, 8, 1);

-- Inserção de Consultas
INSERT INTO Consulta_Atende (data_hora, sintomas_relatados, diagnostico, cod_pet, cod_funcionario)
VALUES
('2021-10-26 10:00:00', 'Apatia e falta de apetite', 'Problemas renais iniciais. Solicitar exames.', 6, 6),
('2022-01-15 11:00:00', 'Check-up e vacinação', 'Saudável, vacina V10 aplicada.', 1, 7),
('2022-02-05 14:00:00', 'Coceira intensa', 'Dermatite alérgica (DAPE)', 3, 8),
('2022-03-10 09:30:00', 'Tosse e espirros', 'Gripe felina (rinotraqueíte)', 2, 9),
('2022-04-12 16:00:00', 'Check-up de filhote', 'Saudável, vermifugado.', 5, 10),
('2022-05-20 10:00:00', 'Dificuldade respiratória', 'Síndrome braquicefálica', 7, 11),
('2022-06-15 11:30:00', 'Vômito após comer', 'Gastrite. Mudar ração.', 8, 12),
('2022-07-01 14:00:00', 'Check-up anual', 'Saudável', 9, 13),
('2022-08-10 09:00:00', 'Manchas na pele', 'Dermatite fúngica', 12, 14),
('2022-09-05 15:00:00', 'Consulta de rotina', 'Saudável', 13, 15),
('2023-01-30 10:00:00', 'Check-up e vacinação', 'Saudável, vacina V10 reforço.', 1, 6),
('2023-03-15 11:00:00', 'Revisão renal', 'Função renal estável, manter medicação.', 6, 6),
('2023-05-10 14:00:00', 'Limpeza de tártaro', 'Procedimento realizado com sucesso.', 4, 7),
('2023-07-20 09:30:00', 'Filhote com diarreia', 'Giárdia', 21, 8),
('2023-09-01 16:00:00', 'Vacinação filhote', 'Primeira dose V4.', 23, 9),
('2023-11-10 10:00:00', 'Cuidados com a pele', 'Hidratação e rotina de banhos.', 26, 10),
('2024-01-20 11:00:00', 'Check-up', 'Saudável', 31, 11),
('2024-03-05 14:00:00', 'Corte na pata', 'Sutura e antibiótico.', 19, 12),
('2024-05-15 09:30:00', 'Consulta de filhote', 'Vacinas em dia.', 30, 13),
('2024-07-01 16:00:00', 'Alergia de pele (revisão)', 'Melhora significativa', 3, 14);

-- Inserção de Exames
INSERT INTO Exame (num_consulta, nome_exame, data_solicitacao, resultado)
VALUES
(1, 'Exame de Sangue (Ureia e Creatinina)', '2021-10-26', 'Ureia: 80 mg/dL, Creatinina: 2.1 mg/dL (Elevados)'),
(1, 'Ultrassom Abdominal', '2021-10-26', 'Rins com alteração de ecotextura.'),
(2, 'Hemograma Completo', '2022-01-15', 'Todos os parâmetros normais.'),
(3, 'Raspagem de Pele', '2022-02-05', 'Negativo para ácaros. Positivo para Malassezia.'),
(4, 'PCR para Rinotraqueíte', '2022-03-10', 'Positivo para Herpesvírus Felino.'),
(6, 'Raio-X de Tórax', '2022-05-20', 'Palato mole alongado.'),
(9, 'Cultura Fúngica', '2022-08-10', 'Positivo para Microsporum canis.'),
(12, 'Exame de Sangue (Revisão Renal)', '2023-03-15', 'Ureia: 75 mg/dL, Creatinina: 1.9 mg/dL (Estável)'),
(14, 'Exame de Fezes (Flutuação)', '2023-07-20', 'Positivo para cistos de Giardia.'),
(18, 'Hemograma', '2024-03-05', 'Leve leucocitose.');

/*
 * =======================================================
 * PARTE 3: EXPANSÃO DE DADOS (NOVOS INSERTS)
 * Adiciona mais volume de dados para o Dashboard de BI.
 * =======================================================
 */

-- =======================================================
-- NOVOS CLIENTES (20 Novos)
-- Espalhados entre 2022 e 2023 para dar volume histórico
-- =======================================================

INSERT INTO Cliente (cpf, nome, data_cadastro, logradouro, numero, bairro, cidade, estado, cep, telefone1, telefone2)
VALUES
('11122233344', 'Beatriz Costa', '2022-03-15 10:00:00', 'Rua das Orquídeas', '101', 'Jardim', 'São Paulo', 'SP', '01001000', '11988887777', NULL),
('22233344455', 'Carlos Eduardo', '2022-04-20 11:30:00', 'Avenida Central', '202', 'Centro', 'Belo Horizonte', 'MG', '30110000', '31977776666', NULL),
('33344455566', 'Daniela Fernandes', '2022-05-10 14:00:00', 'Travessa das Flores', '303', 'Floresta', 'Porto Alegre', 'RS', '90010000', '51966665555', NULL),
('44455566677', 'Eduardo Martins', '2022-07-01 09:00:00', 'Rua da Praia', '404', 'Litorâneo', 'Salvador', 'BA', '40010000', '71955554444', NULL),
('55566677788', 'Fernanda Lima', '2022-09-12 16:45:00', 'Alameda dos Bosques', '505', 'Bosque', 'Curitiba', 'PR', '80010000', '41944443333', NULL),
('66677788899', 'Gustavo Ribeiro', '2022-11-25 08:20:00', 'Rua Principal', '606', 'Centro', 'Manaus', 'AM', '69005000', '92933332222', NULL),
('77788899900', 'Helena Souza', '2023-01-18 13:00:00', 'Avenida das Nações', '707', 'Norte', 'Brasília', 'DF', '70002000', '61922221111', NULL),
('88899900011', 'Igor Almeida', '2023-02-14 10:10:00', 'Rua do Sol', '808', 'Leste', 'Fortaleza', 'CE', '60015000', '85911110000', NULL),
('99900011122', 'Juliana Nogueira', '2023-03-30 17:00:00', 'Largo da Matriz', '909', 'Centro', 'Goiânia', 'GO', '74003000', '62999998888', NULL),
('00011122233', 'Kaique Oliveira', '2023-05-05 11:00:00', 'Rua da Passagem', '1010', 'Oeste', 'Campo Grande', 'MS', '79002000', '67988887777', NULL),
('11211211244', 'Larissa Pereira', '2023-06-22 15:20:00', 'Avenida Litorânea', '1111', 'Praia', 'Recife', 'PE', '51011000', '81977776666', NULL),
('22322322355', 'Marcos Vinícius', '2023-08-10 09:30:00', 'Rua da Moeda', '1212', 'Recife Antigo', 'Recife', 'PE', '50030040', '81966665555', NULL),
('33433433466', 'Natália Costa', '2023-10-02 14:15:00', 'Estrada do Arraial', '1313', 'Casa Amarela', 'Recife', 'PE', '52051380', '81955554444', NULL),
('44544544577', 'Otávio Mendes', '2023-11-19 11:00:00', 'Rua da Aurora', '1414', 'Boa Vista', 'Recife', 'PE', '50050000', '81944443333', NULL),
('55655655688', 'Patrícia Barros', '2023-12-28 16:00:00', 'Rua Amélia', '1515', 'Espinheiro', 'Recife', 'PE', '52020210', '81933332222', NULL),
('66766766799', 'Quintino Rocha', '2024-02-10 10:00:00', 'Avenida Boa Viagem', '1616', 'Boa Viagem', 'Recife', 'PE', '51020000', '81922221111', NULL),
('77877877800', 'Renata Farias', '2024-04-05 13:30:00', 'Rua do Futuro', '1717', 'Aflitos', 'Recife', 'PE', '52050010', '81911110000', NULL),
('88988988911', 'Sérgio Cavalcanti', '2024-06-15 08:00:00', 'Rua das Graças', '1818', 'Graças', 'Recife', 'PE', '52011040', '81999887766', NULL),
('99099099022', 'Tatiana Azevedo', '2024-08-20 14:45:00', 'Avenida Parnamirim', '1919', 'Parnamirim', 'Recife', 'PE', '52060000', '81988776655', NULL),
('01201201233', 'Ulisses Tavares', '2024-10-30 10:00:00', 'Rua do Rosário', '2020', 'Santo Amaro', 'Recife', 'PE', '50050090', '81977665544', NULL);

-- =======================================================
-- NOVOS PETS (31 Novos)
-- Adicionando pets para os clientes novos e antigos
-- O último pet_id no script original é 42. Começaremos do 43.
-- =======================================================

INSERT INTO Pet (cod_pet, cpfCliente, nome_pet, especie, raca, data_nascimento, observacoes)
VALUES
-- Pets para clientes novos (2022)
(43, '11122233344', 'Bolinha', 'Cachorro', 'Pug', '2021-01-10', 'Alergia a poeira'),
(44, '22233344455', 'Frajola', 'Gato', 'Siamês', '2020-05-15', NULL),
(45, '33344455566', 'Max', 'Cachorro', 'Golden Retriever', '2022-01-20', 'Muito dócil'),
(46, '44455566677', 'Mimi', 'Gato', 'Persa', '2019-11-11', 'Não gosta de outros gatos'),
(47, '55566677788', 'Spike', 'Cachorro', 'Bulldog', '2021-07-07', NULL),
(48, '66677788899', 'Paçoca', 'Cachorro', 'Vira-lata', '2020-03-01', 'Resgatado'),
(49, '77788899900', 'Lua', 'Gato', 'Angorá', '2022-02-02', NULL),
(50, '88899900011', 'Sol', 'Cachorro', 'Labrador', '2021-12-25', 'Adora água'),
(51, '99900011122', 'Pipoca', 'Cachorro', 'Shih Tzu', '2022-08-30', NULL),
(52, '00011122233', 'Shadow', 'Gato', 'Bombaim', '2021-10-31', 'Muito arisco'),
-- Pets para clientes novos (2023)
(53, '11211211244', 'Belinha', 'Cachorro', 'Poodle', '2023-01-15', NULL),
(54, '22322322355', 'Nino', 'Gato', 'Vira-lata', '2022-05-20', NULL),
(55, '33433433466', 'Zeus', 'Cachorro', 'Rottweiler', '2020-02-10', 'Cão de guarda'),
(56, '44544544577', 'Apolo', 'Cachorro', 'Doberman', '2021-04-12', NULL),
(57, '55655655688', 'Mia', 'Gato', 'Maine Coon', '2023-03-03', NULL),
(58, '66766766799', 'Chico', 'Cachorro', 'Buldogue Francês', '2023-09-01', 'Ronca muito'),
(59, '77877877800', 'Duque', 'Cachorro', 'Pastor Alemão', '2019-06-10', NULL),
(60, '88988988911', 'Princesa', 'Gato', 'Ragdoll', '2022-11-05', NULL),
(61, '99099099022', 'Simba', 'Cachorro', 'Chow Chow', '2023-07-20', NULL),
(62, '01201201233', 'Teco', 'Calopsita', 'Ave', '2023-01-01', 'Canta o hino'),
-- Adicionando mais pets para clientes ANTIGOS
(63, '01010101010', 'Fofoca', 'Gato', 'Vira-lata', '2021-05-10', 'Irmão do Bigode'), -- Maria Silva
(64, '01010101010', 'Bartholomeu', 'Cachorro', 'Dachshund', '2022-06-15', 'Novo pet da Maria'), -- Maria Silva
(65, '12121212121', 'Azeitona', 'Gato', 'Vira-lata', '2020-08-01', 'Preto e branco'), -- Joao Santos
(66, '34343434343', 'Manchinha', 'Cachorro', 'Dálmata', '2022-10-10', 'Filhote'), -- Sofia Costa
(67, '45454545454', 'Hulk', 'Cachorro', 'Pitbull', '2019-01-20', 'Muito dócil'), -- Lucas Pereira
(68, '56565656565', 'Jasmine', 'Gato', 'Persa', '2018-03-14', 'Idosa'), -- Ana Oliveira
(69, '02020202020', 'Amora', 'Cachorro', 'Lhasa Apso', '2023-05-01', NULL), -- Amanda Correia (Cliente existente)
(70, '03030303030', 'Bidu', 'Cachorro', 'Schnauzer', '2022-12-01', NULL), -- Bruno Rocha (Cliente existente)
(71, '04040404040', 'Cookie', 'Gato', 'British Shorthair', '2023-02-14', NULL), -- Clara Lima (Cliente existente)
(72, '05050505050', 'Dolly', 'Cachorro', 'Beagle', '2023-11-11', NULL), -- Diego Alves (Cliente existente)
(73, '13131313131', 'Penélope', 'Gato', 'Sphynx', '2022-07-07', 'Pet exótico'); -- Laura Martins (Cliente existente)


-- =======================================================
-- NOVAS VENDAS (100 Vendas)
-- Distribuídas entre 2022, 2023, 2024 e 2025
-- Com clientes de alta e baixa frequência
-- **NÃO INCLUI** produtos 18, 19, 20 (para mantê-los encalhados)
-- =======================================================

-- CLIENTE DE ALTA FREQUÊNCIA: Maria Silva ('01010101010')
INSERT INTO Venda (data_hora, valor_total, forma_pagamento, cpfCliente, cod_funcionario)
VALUES
('2022-03-20 10:15:00', 189.90, 'Cartão de Crédito', '01010101010', 16),
('2022-05-15 14:30:00', 75.50, 'Débito', '01010101010', 17),
('2022-07-22 09:00:00', 210.00, 'PIX', '01010101010', 18),
('2022-09-05 11:00:00', 89.90, 'Dinheiro', '01010101010', 16),
('2022-11-10 16:00:00', 150.00, 'Cartão de Crédito', '01010101010', 19),
('2023-01-15 10:00:00', 189.90, 'PIX', '01010101010', 17),
('2023-03-10 13:00:00', 50.00, 'Débito', '01010101010', 20),
('2023-05-12 15:00:00', 320.00, 'Cartão de Crédito', '01010101010', 18),
('2023-07-18 09:30:00', 75.50, 'PIX', '01010101010', 21),
('2023-09-20 17:00:00', 189.90, 'Cartão de Crédito', '01010101010', 16),
('2023-11-25 11:00:00', 210.00, 'Débito', '01010101010', 22),
('2024-01-30 14:00:00', 89.90, 'Dinheiro', '01010101010', 17),
('2024-03-05 16:30:00', 150.00, 'PIX', '01010101010', 23),
('2024-05-10 10:00:00', 189.90, 'Cartão de Crédito', '01010101010', 18),
('2024-07-15 12:00:00', 75.50, 'Débito', '01010101010', 24),
('2024-09-18 15:00:00', 320.00, 'PIX', '01010101010', 19),
('2024-11-20 09:00:00', 50.00, 'Dinheiro', '01010101010', 25),
('2025-01-10 11:30:00', 210.00, 'Cartão de Crédito', '01010101010', 20);

-- CLIENTE DE MÉDIA FREQUÊNCIA: Joao Santos ('12121212121')
INSERT INTO Venda (data_hora, valor_total, forma_pagamento, cpfCliente, cod_funcionario)
VALUES
('2022-06-10 11:00:00', 150.00, 'PIX', '12121212121', 19),
('2022-10-15 15:00:00', 85.00, 'Débito', '12121212121', 20),
('2023-02-20 10:00:00', 150.00, 'Cartão de Crédito', '12121212121', 21),
('2023-06-25 14:00:00', 75.50, 'PIX', '12121212121', 16),
('2023-10-30 16:00:00', 85.00, 'Débito', '12121212121', 22),
('2024-02-05 11:00:00', 150.00, 'Cartão de Crédito', '12121212121', 17),
('2024-06-10 13:00:00', 210.00, 'PIX', '12121212121', 23),
('2024-10-15 15:00:00', 85.00, 'Débito', '12121212121', 18),
('2025-01-20 10:00:00', 75.50, 'Cartão de Crédito', '12121212121', 24);

-- CLIENTE DE ALTA FREQUÊNCIA (NOVO): Beatriz Costa ('11122233344')
INSERT INTO Venda (data_hora, valor_total, forma_pagamento, cpfCliente, cod_funcionario)
VALUES
('2022-03-16 11:00:00', 50.00, 'Débito', '11122233344', 16),
('2022-04-20 12:30:00', 89.90, 'PIX', '11122233344', 17),
('2022-06-15 10:00:00', 150.00, 'Cartão de Crédito', '11122233344', 18),
('2022-08-10 14:00:00', 75.50, 'Débito', '11122233344', 19),
('2022-10-05 16:00:00', 320.00, 'PIX', '11122233344', 20),
('2023-01-20 11:00:00', 50.00, 'Cartão de Crédito', '11122233344', 21),
('2023-04-15 09:00:00', 89.90, 'Débito', '11122233344', 22),
('2023-07-10 13:00:00', 150.00, 'PIX', '11122233344', 23),
('2023-10-05 15:00:00', 75.50, 'Cartão de Crédito', '11122233344', 24),
('2024-01-15 10:00:00', 320.00, 'Débito', '11122233344', 25),
('2024-04-20 12:00:00', 50.00, 'PIX', '11122233344', 16),
('2024-07-18 14:00:00', 89.90, 'Cartão de Crédito', '11122233344', 17),
('2024-10-10 16:00:00', 150.00, 'Débito', '11122233344', 18),
('2025-01-05 11:00:00', 75.50, 'PIX', '11122233344', 19);

-- VENDAS ESPARSAS (OUTROS CLIENTES NOVOS E ANTIGOS)
INSERT INTO Venda (data_hora, valor_total, forma_pagamento, cpfCliente, cod_funcionario)
VALUES
-- 2022
('2022-04-21 10:00:00', 120.00, 'Cartão de Crédito', '22233344455', 20), -- Carlos Eduardo
('2022-05-11 14:30:00', 350.50, 'PIX', '33344455566', 21), -- Daniela Fernandes
('2022-07-02 09:30:00', 45.00, 'Dinheiro', '44455566677', 22), -- Eduardo Martins
('2022-08-01 10:00:00', 89.90, 'Cartão de Crédito', '23232323232', 23), -- Pedro Almeida
('2022-09-13 10:00:00', 75.50, 'Débito', '55566677788', 24), -- Fernanda Lima
('2022-10-01 11:00:00', 189.90, 'PIX', '34343434343', 25), -- Sofia Costa
('2022-11-26 09:00:00', 150.00, 'Cartão de Crédito', '66677788899', 16), -- Gustavo Ribeiro
('2022-12-10 14:00:00', 320.00, 'Débito', '45454545454', 17), -- Lucas Pereira
('2022-12-20 15:00:00', 50.00, 'PIX', '56565656565', 18), -- Ana Oliveira
-- 2023
('2023-01-19 13:30:00', 85.00, 'Dinheiro', '77788899900', 19), -- Helena Souza
('2023-02-15 10:30:00', 210.00, 'Cartão de Crédito', '88899900011', 20), -- Igor Almeida
('2023-03-01 11:00:00', 189.90, 'Débito', '67676767676', 21), -- Rafaela Gomes
('2023-03-31 17:30:00', 45.00, 'PIX', '99900011122', 22), -- Juliana Nogueira
('2023-04-10 09:00:00', 75.50, 'Cartão de Crédito', '78787878787', 23), -- Felipe Barros
('2023-05-06 11:30:00', 150.00, 'Dinheiro', '00011122233', 24), -- Kaique Oliveira
('2023-05-20 10:00:00', 320.00, 'PIX', '89898989898', 25), -- Mariana Lima
('2023-06-15 14:00:00', 89.90, 'Débito', '90909090909', 16), -- Rodrigo Nunes
('2023-06-23 15:40:00', 50.00, 'Cartão de Crédito', '11211211244', 17), -- Larissa Pereira
('2023-07-05 16:00:00', 189.90, 'PIX', '02020202020', 18), -- Amanda Correia
('2023-07-20 09:00:00', 210.00, 'Débito', '23232323232', 19), -- Pedro Almeida
('2023-08-11 09:45:00', 85.00, 'Dinheiro', '22322322355', 20), -- Marcos Vinícius
('2023-08-25 10:00:00', 75.50, 'Cartão de Crédito', '45454545454', 21), -- Lucas Pereira
('2023-09-10 11:00:00', 150.00, 'PIX', '03030303030', 22), -- Bruno Rocha
('2023-09-28 14:00:00', 320.00, 'Débito', '34343434343', 23), -- Sofia Costa
('2023-10-03 14:45:00', 89.90, 'Cartão de Crédito', '33433433466', 24), -- Natália Costa
('2023-10-15 15:00:00', 50.00, 'PIX', '04040404040', 25), -- Clara Lima
('2023-11-05 10:00:00', 189.90, 'Dinheiro', '56565656565', 16), -- Ana Oliveira
('2023-11-20 11:30:00', 210.00, 'Débito', '44544544577', 17), -- Otávio Mendes
('2023-12-01 13:00:00', 85.00, 'Cartão de Crédito', '05050505050', 18), -- Diego Alves
('2023-12-29 16:30:00', 45.00, 'PIX', '55655655688', 19), -- Patrícia Barros
-- 2024
('2024-01-10 09:00:00', 75.50, 'Dinheiro', '67676767676', 20), -- Rafaela Gomes
('2024-01-25 10:00:00', 150.00, 'Débito', '13131313131', 21), -- Laura Martins
('2024-02-11 10:30:00', 320.00, 'Cartão de Crédito', '66766766799', 22), -- Quintino Rocha
('2024-02-20 11:00:00', 89.90, 'PIX', '24242424242', 23), -- Gabriela Dias
('2024-03-05 14:00:00', 50.00, 'Débito', '78787878787', 24), -- Felipe Barros
('2024-03-15 15:00:00', 189.90, 'Cartão de Crédito', '35353535353', 25), -- Lucas Costa
('2024-04-01 10:00:00', 210.00, 'PIX', '89898989898', 16), -- Mariana Lima
('2024-04-06 13:45:00', 85.00, 'Dinheiro', '77877877800', 17), -- Renata Farias
('2024-04-15 14:00:00', 45.00, 'Débito', '46464646464', 18), -- Ricardo Sousa
('2024-05-02 16:00:00', 75.50, 'Cartão de Crédito', '90909090909', 19), -- Rodrigo Nunes
('2024-05-10 09:00:00', 150.00, 'PIX', '57575757575', 20), -- Beatriz Lima
('2024-05-20 10:00:00', 320.00, 'Débito', '02020202020', 21), -- Amanda Correia
('2024-06-05 11:00:00', 89.90, 'Cartão de Crédito', '68686868686', 22), -- Waleska Pinto
('2024-06-16 08:30:00', 50.00, 'PIX', '88988988911', 23), -- Sérgio Cavalcanti
('2024-06-25 14:00:00', 189.90, 'Dinheiro', '79797979797', 24), -- Xavier Dantas
('2024-07-05 15:00:00', 210.00, 'Débito', '03030303030', 25), -- Bruno Rocha
('2024-07-15 10:00:00', 85.00, 'Cartão de Crédito', '80808080808', 16), -- Yara Medeiros
('2024-08-01 11:00:00', 45.00, 'PIX', '04040404040', 17), -- Clara Lima
('2024-08-21 15:00:00', 75.50, 'Débito', '99099099022', 18), -- Tatiana Azevedo
('2024-09-05 16:00:00', 150.00, 'Cartão de Crédito', '91919191919', 19), -- Zacarias Morais
('2024-09-15 10:00:00', 320.00, 'PIX', '05050505050', 20), -- Diego Alves
('2024-10-01 11:00:00', 89.90, 'Dinheiro', '13131313131', 21), -- Laura Martins
('2024-10-10 14:00:00', 50.00, 'Débito', '22233344455', 22), -- Carlos Eduardo
('2024-10-20 15:00:00', 189.90, 'Cartão de Crédito', '24242424242', 23), -- Gabriela Dias
('2024-11-01 10:00:00', 210.00, 'PIX', '33344455566', 24), -- Daniela Fernandes
('2024-11-10 11:00:00', 85.00, 'Débito', '35353535353', 25), -- Lucas Costa
('2024-11-20 14:00:00', 45.00, 'Cartão de Crédito', '44455566677', 16), -- Eduardo Martins
('2024-12-05 15:00:00', 75.50, 'PIX', '46464646464', 17), -- Ricardo Sousa
('2024-12-15 10:00:00', 150.00, 'Dinheiro', '55566677788', 18), -- Fernanda Lima
('2024-12-25 11:00:00', 320.00, 'Débito', '57575757575', 19), -- Beatriz Lima
-- 2025
('2025-01-05 14:00:00', 89.90, 'Cartão de Crédito', '66677788899', 20), -- Gustavo Ribeiro
('2025-01-15 15:00:00', 50.00, 'PIX', '68686868686', 21), -- Waleska Pinto
('2025-01-25 10:00:00', 189.90, 'Débito', '77788899900', 22), -- Helena Souza
('2025-02-01 11:00:00', 210.00, 'Cartão de Crédito', '79797979797', 23), -- Xavier Dantas
('2025-02-10 14:00:00', 85.00, 'PIX', '88899900011', 24); -- Igor Almeida

-- =======================================================
-- NOVOS ITENS DE VENDA (para as 100 Vendas)
-- **NÃO INCLUI** produtos 18, 19, 20
-- =======================================================
-- NOTA: Os IDs de Venda (num_venda) são auto-incrementados.
-- Os IDs abaixo (41 a 140) assumem que as 40 vendas originais
-- ocuparam os IDs 1 a 40.
-- =======================================================

-- Vendas 41-58 (Maria Silva)
INSERT INTO contem (num_venda, cod_produto, quantidade) VALUES
(41, 1, 1), (42, 5, 1), (43, 8, 1), (44, 2, 1), (45, 10, 1), (46, 1, 1), (47, 4, 2), (48, 15, 1),
(49, 5, 1), (50, 1, 1), (51, 8, 1), (52, 2, 1), (53, 10, 1), (54, 1, 1), (55, 5, 1), (56, 15, 1),
(57, 4, 2), (58, 8, 1);
-- Vendas 59-67 (Joao Santos)
INSERT INTO contem (num_venda, cod_produto, quantidade) VALUES
(59, 10, 1), (60, 11, 1), (61, 10, 1), (62, 5, 1), (63, 11, 1), (64, 10, 1), (65, 8, 1), (66, 11, 1), (67, 5, 1);
-- Vendas 68-81 (Beatriz Costa)
INSERT INTO contem (num_venda, cod_produto, quantidade) VALUES
(68, 4, 2), (69, 2, 1), (70, 10, 1), (71, 5, 1), (72, 15, 1), (73, 4, 2), (74, 2, 1), (75, 10, 1),
(76, 5, 1), (77, 15, 1), (78, 4, 2), (79, 2, 1), (80, 10, 1), (81, 5, 1);
-- Vendas 82-140 (Vendas Esparsas)
INSERT INTO contem (num_venda, cod_produto, quantidade) VALUES
(82, 3, 1), (83, 16, 1), (83, 7, 1), (84, 12, 1), (85, 2, 1), (86, 5, 1), (87, 1, 1), (88, 10, 1),
(89, 15, 1), (90, 4, 2), (91, 11, 1), (92, 8, 1), (93, 12, 1), (94, 5, 1), (95, 10, 1), (96, 15, 1),
(97, 2, 1), (98, 8, 1), (99, 1, 1), (100, 11, 1), (101, 10, 1), (102, 15, 1), (103, 2, 1),
(104, 12, 1), (105, 4, 2), (106, 1, 1), (107, 8, 1), (108, 11, 1), (109, 10, 1), (110, 15, 1),
(111, 5, 1), (112, 1, 1), (113, 3, 1), (114, 12, 1), (115, 4, 2), (116, 8, 1), (117, 1, 1),
(118, 11, 1), (119, 10, 1), (120, 15, 1), (121, 5, 1), (122, 12, 1), (123, 2, 1), (124, 8, 1),
(125, 1, 1), (126, 11, 1), (127, 10, 1), (128, 15, 1), (129, 5, 1), (130, 3, 1), (131, 12, 1),
(132, 2, 1), (133, 8, 1), (134, 1, 1), (135, 11, 1), (136, 10, 1), (137, 15, 1), (138, 4, 2),
(139, 8, 1), (140, 11, 1);

-- =======================================================
-- NOVAS CONSULTAS (40 Novas)
-- Distribuídas entre 2022, 2023, 2024 e 2025
-- =======================================================
-- IDs de Veterinários: 6, 7, 8, 9, 10, 11, 12, 13, 14, 15

INSERT INTO Consulta_Atende (data_hora, sintomas_relatados, diagnostico, cod_pet, cod_funcionario)
VALUES
-- 2022
('2022-03-20 11:00:00', 'Vômito e diarreia', 'Gastroenterite viral', 1, 6),
('2022-04-10 09:30:00', 'Apatia e falta de apetite', 'Indigestão', 2, 7),
('2022-05-15 14:00:00', 'Tosse seca e espirros', 'Gripe canina', 3, 8),
('2022-06-05 10:00:00', 'Coceira intensa nas orelhas', 'Otite (infecção de ouvido)', 4, 9),
('2022-07-12 16:00:00', 'Check-up anual e vacinação', 'Saudável, vacinas atualizadas', 5, 10),
('2022-08-18 11:30:00', 'Dificuldade para urinar', 'Infecção do trato urinário', 6, 11),
('2022-09-25 09:00:00', 'Pata machucada, mancando', 'Entorse leve', 7, 12),
('2022-10-30 15:00:00', 'Queda de pelo excessiva', 'Alergia alimentar', 8, 13),
('2022-11-15 13:00:00', 'Check-up de filhote', 'Saudável', 45, 14), -- Pet novo
('2022-12-20 10:00:00', 'Olhos lacrimejando', 'Conjuntivite alérgica', 10, 15),
-- 2023
('2023-01-22 10:00:00', 'Vômito', 'Gastroenterite', 1, 6),
('2023-02-18 11:00:00', 'Check-up', 'Saudável', 11, 7),
('2023-03-14 14:30:00', 'Alergia de pele', 'Dermatite atópica', 12, 8),
('2023-04-20 09:00:00', 'Vacinação de reforço', 'Vacinas aplicadas', 13, 9),
('2023-05-10 16:00:00', 'Tosse persistente', 'Bronquite', 14, 10),
('2023-06-05 11:30:00', 'Diarreia', 'Intoxicação alimentar leve', 15, 11),
('2023-07-15 09:30:00', 'Check-up sênior', 'Artrose leve', 20, 12),
('2023-08-20 15:00:00', 'Corte na pata', 'Curativo e anti-inflamatório', 50, 13), -- Pet novo
('2023-09-10 13:00:00', 'Não para de se coçar', 'Pulgas', 22, 14),
('2023-10-05 10:00:00', 'Vacina V10', 'Vacina aplicada', 53, 15), -- Pet novo
('2023-11-12 11:00:00', 'Check-up e tártaro', 'Necessita limpeza de tártaro', 2, 6),
('2023-12-15 14:00:00', 'Apatia', 'Em observação', 54, 7), -- Pet novo
-- 2024
('2024-01-10 09:00:00', 'Vacinação filhote', 'Primeira dose V5', 57, 8), -- Pet novo
('2024-02-15 10:30:00', 'Tosse', 'Gripe felina', 4, 9),
('2024-03-20 11:00:00', 'Check-up anual', 'Saudável', 5, 10),
('2024-04-05 14:00:00', 'Fratura na pata', 'Imobilização', 7, 11),
('2024-05-10 15:00:00', 'Revisão da fratura', 'Recuperando bem', 7, 11),
('2024-06-15 09:00:00', 'Dificuldade respiratória', 'Asma felina', 6, 12),
('2024-07-01 13:00:00', 'Vacinação', 'Vacina Antirrábica', 8, 13),
('2024-07-20 10:00:00', 'Alergia severa', 'Dermatite alérgica (DAPE)', 10, 14),
('2024-08-05 11:00:00', 'Check-up', 'Saudável', 59, 15), -- Pet novo
('2024-08-22 14:00:00', 'Exame de rotina', 'Coleta de sangue', 1, 6),
('2024-09-10 15:00:00', 'Limpeza de tártaro', 'Procedimento realizado', 2, 7),
('2024-09-25 10:00:00', 'Dor ao caminhar', 'Displasia', 55, 8), -- Pet novo
('2024-10-10 11:00:00', 'Vacinação', 'Reforço V10', 58, 9), -- Pet novo
('2024-11-05 14:00:00', 'Cio', 'Orientação sobre castração', 60, 10), -- Pet novo
('2024-11-20 15:00:00', 'Check-up', 'Saudável', 3, 11),
('2024-12-10 10:00:00', 'Unha encravada', 'Procedimento simples', 63, 12), -- Pet novo
-- 2025
('2025-01-15 09:00:00', 'Check-up anual', 'Saudável', 64, 13), -- Pet novo
('2025-01-20 11:00:00', 'Espirros constantes', 'Rinotraqueíte', 65, 14), -- Pet novo
('2025-02-05 14:00:00', 'Consulta de rotina', 'Saudável', 73, 15); -- Pet novo

-- =======================================================
-- NOVOS EXAMES (para as Consultas)
-- =======================================================
-- IDs de Consulta (num_consulta) são auto-incrementados.
-- Os IDs abaixo (21 a 60) assumem que as 20 consultas originais
-- ocuparam os IDs 1 a 20.
-- =======================================================

INSERT INTO Exame (num_consulta, nome_exame, data_solicitacao, resultado)
VALUES
(21, 'Exame de Fezes', '2022-03-20', 'Positivo para Giardia'),
(26, 'Urinálise', '2022-08-18', 'Infecção bacteriana'),
(28, 'Raspagem de Pele', '2022-10-30', 'Negativo para ácaros'),
(31, 'Exame de Sangue (Check-up)', '2023-02-18', 'Hemograma normal'),
(32, 'Cultura (Pele)', '2023-03-14', 'Staphylococcus'),
(37, 'Raio-X (Tórax)', '2023-07-15', 'Sinais de artrose'),
(38, 'Exame de Sangue', '2023-08-20', 'Hemograma normal'),
(40, 'Exame de Fezes', '2023-10-05', 'Negativo'),
(42, 'Exame de Sangue', '2023-12-15', 'Anemia leve'),
(43, 'Teste Rápido (V5 Felina)', '2024-01-10', 'Negativo'),
(46, 'Raio-X (Pata)', '2024-04-05', 'Fratura na tíbia'),
(47, 'Raio-X (Pata)', '2024-05-10', 'Calo ósseo em formação'),
(48, 'Raio-X (Tórax)', '2024-06-15', 'Padrão brônquico'),
(50, 'Teste de Alergia', '2024-07-20', 'Positivo para pulga (DAPE)'),
(52, 'Exame de Sangue (Completo)', '2024-08-22', 'Colesterol levemente alto'),
(54, 'Raio-X (Quadril)', '2024-09-25', 'Displasia coxofemoral'),
(59, 'PCR (Rinotraqueíte)', '2025-01-20', 'Positivo para Calicivírus');

-- =======================================================

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

-- =======================================================

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

-- =======================================================

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

-- =======================================================

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