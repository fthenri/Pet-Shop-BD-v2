# 🐾 Sistema de Gestão de Pet Shop (Full-Stack)

[![Licença](https://img.shields.io/badge/licen%C3%A7a-MIT-blue.svg)](https://github.com/fthenri/pet-shop-bd-v2/blob/main/LICENSE)
[![Stars](https://img.shields.io/github/stars/fthenri/pet-shop-bd-v2?style=social)](https://github.com/fthenri/pet-shop-bd-v2/stargazers)

Um sistema de gerenciamento de Pet Shop full-stack (Java/Spring + React/Next.js) com dashboard de BI, módulos de gerenciamento (CRUDs) e executor de SQL. Perfeito para estudos, portfólio e como base para novos projetos.

---

## 🚀 Em Ação

Nada vende melhor o projeto do que vê-lo funcionando. Aqui está o Dashboard de Business Intelligence em ação:

![SistemadeGerenciamento](https://github.com/user-attachments/assets/880bf3ef-435a-483d-bf80-8704cab5da76)

---

## 📖 Sobre o Projeto

Este é um projeto full-stack completo que simula um sistema de gestão (ERP) para um Pet Shop. O diferencial deste repositório é que ele não foi apenas codificado, mas sim **projetado** seguindo um processo formal de modelagem de banco de dados.

O objetivo é servir como um *boilerplate* robusto ou um projeto de estudo para desenvolvedores interessados.

Este Projeto:
* Conecta um backend **Java (Spring Boot com JDBC)** a um banco de dados **MySQL**.
* Consume uma API REST em um frontend moderno **React (Next.js)**.
* Implementa um **Dashboard de BI** com gráficos dinâmicos (Chart.js).
* Ve na prática como um **Esquema Relacional** bem definido se traduz em uma aplicação funcional.

---

## 🧭 Sumário

* [Sobre o Projeto](#-sobre-o-projeto)
* [Funcionalidades](#-funcionalidades-features)
    * [Dashboard de Business Intelligence (BI)](#-dashboard-de-business-intelligence-bi)
    * [Módulos de Gerenciamento (CRUDs)](#️-módulos-de-gerenciamento-cruds)
    * [Ferramentas de Admin e Auditoria](#️-ferramentas-de-admin-e-auditoria)
* [Tecnologias Utilizadas](#️-tecnologias-utilizadas-tech-stack)
* [Como Executar](#-como-executar-getting-started)
    * [Pré-requisitos](#pré-requisitos)
    * [1. Banco de Dados (MySQL)](#1-banco-de-dados-mysql)
    * [2. Backend (Java/Spring)](#2-backend-javaspring)
    * [3. Frontend (React/Next)](#3-frontend-reactnext)
* [Design e Artefatos do Banco de Dados](#️-design-e-artefatos-do-banco-de-dados)
* [Roadmap](#️-roadmap-próximas-features)
* [Licença](#-licença)

---

## ✨ Funcionalidades (Features)



### 📊 Dashboard de Business Intelligence (BI)

A tela principal do sistema é um dashboard analítico que consome dados agregados diretamente do banco de dados para fornecer insights sobre o negócio.

* **KPIs Dinâmicos:** Cards de resumo (Faturamento Total, Novos Clientes, etc.).
* **Filtros Globais:** Filtre todos os gráficos por período (dia, mês, ano).
* **Gráficos Interativos:**
    * Faturamento (Diário, Mensal, Anual).
    * Top 5 Clientes e Produtos.
    * Novos Clientes por Mês.
    * E muito mais...

> **[GALERIA DE IMAGENS DO DASHBOARD COM FILTROS APLICADOS]**

<details>
  <summary>Clique para expandir as imagens do Dashboard</summary>

  <img width="1920" height="1080" alt="image" src="https://github.com/user-attachments/assets/c96a2088-3780-4e57-8ef7-a223015b9669" />
  <img width="1920" height="1080" alt="image" src="https://github.com/user-attachments/assets/5272b181-4ef7-4e6a-9d4a-d456c0631040" />
  <img width="1920" height="1080" alt="image" src="https://github.com/user-attachments/assets/aa4c7404-a186-4930-9b55-b90935f9abb8" />
  <img width="1920" height="1080" alt="image" src="https://github.com/user-attachments/assets/ece19f06-6020-4e27-b58d-7049712cc93c" />
</details>

### 🛒 Frente de Caixa (PDV) & Vendas

O módulo de Ponto de Venda oferece uma interface ágil e segura para o registro de saídas de produtos, garantindo a consistência do estoque em tempo real através de transações ACID.

* **Fluxo de Caixa Dinâmico:** Seleção rápida de produtos com busca inteligente, montagem de carrinho e cálculo automático de subtotais e troco.
* **Controle de Estoque em Tempo Real:** O sistema valida a disponibilidade dos itens instantaneamente (via Triggers no banco), impedindo a venda de produtos sem saldo e baixando o estoque automaticamente após a confirmação.
* **Rastreabilidade Completa:** Cada venda é vinculada obrigatoriamente a um Cliente e ao Atendente responsável, gerando dados para relatórios de fidelidade e comissões.
* **Múltiplos Pagamentos:** Suporte nativo para registro de diferentes formas de pagamento (Crédito, Débito, PIX, Dinheiro).

> [GALERIA DE IMAGENS DA TELA DE CAIXA / PDV]

<details>
  <summary>Clique para expandir a imagem do PVD</summary>
   <img width="1920" height="1080" alt="image" src="https://github.com/user-attachments/assets/abb3349b-a9b8-486c-abef-36fad36e4484" />

</details>

🩺 Gestão Clínica & Registro de Serviços
Um módulo dedicado ao fluxo de atendimento veterinário, permitindo o registro ágil e detalhado de consultas, exames e procedimentos realizados.

* **Busca Inteligente de Pacientes:** Sistema de autocomplete que permite localizar o animal rapidamente pelo nome, pelo nome do tutor ou pelo CPF, agilizando o início do atendimento na recepção ou consultório.
* **Prontuário Digital Simplificado:** Ao selecionar um paciente, o sistema exibe instantaneamente um "Card de Resumo" com dados vitais do pet (espécie, raça) e contato do dono, garantindo a identificação correta antes do registro.
* **Registro Clínico Estruturado:** Formulário padronizado para documentação de Sintomas Relatados e Diagnóstico/Descrição do Serviço, vinculando cada atendimento obrigatoriamente a um Veterinário responsável (validado via banco de dados).
* **Histórico Unificado:** Cada registro alimenta a tabela Consulta_Atende, construindo um histórico clínico permanente e acessível para o animal.

> [GALERIA DE IMAGENS DA TELA DE REGISTRO DE SERVIÇOS]

<details>
  <summary>Clique para expandir a imagem do Registro de Serviços</summary>
   <img width="1920" height="1080" alt="image" src="https://github.com/user-attachments/assets/ddef17d4-fe26-4bbf-805f-ada3aadb1d10" />
</details>details>

### 🗃️ Módulos de Gerenciamento (CRUDs)

O sistema possui módulos de gerenciamento completos (Criar, Ler, Atualizar, Excluir) para todas as entidades de "dados mestres" do negócio.

* **Gerenciar Clientes**
* **Gerenciar Funcionários** (com lógica de especialização para Veterinários, Atendentes e Funcionários Gerais)
* **Gerenciar Produtos**
* **Gerenciar Fornecedores**
* **Gerenciar Pets** (associados aos seus donos)

> **[GALERIA DE IMAGENS DAS TELAS DE GERENCIAMENTO (CRUDs)]**

<details>
  <summary>Clique para expandir as imagens dos CRUDs</summary>
   <img width="1920" height="1080" alt="image" src="https://github.com/user-attachments/assets/f315d6b5-d4e8-4ed8-b018-8a2e56fad676" />
   <img width="1920" height="1080" alt="image" src="https://github.com/user-attachments/assets/cef113d2-b2d8-4a51-8e6f-3f1944aecab5" />
   <img width="1920" height="1080" alt="image" src="https://github.com/user-attachments/assets/72a018e6-a8a9-4d99-b397-c54ddfe33ecd" />
   <img width="1920" height="1080" alt="image" src="https://github.com/user-attachments/assets/bea0c3d1-47fd-4581-9f0c-3e359785bef0" />
   <img width="1920" height="1080" alt="image" src="https://github.com/user-attachments/assets/4188c4ec-551a-46f2-93d8-21ed434fc161" />


</details>

> **[GALERIA DE IMAGENS DE UM MODAL DE EDIÇÃO/CRIAÇÃO ABERTO]**

<details>
  <summary>Clique para expandir as imagens dos Modais</summary>

  <img width="1920" height="1080" alt="image" src="https://github.com/user-attachments/assets/90d3f516-cead-4e7b-ad3a-e86a6488664d" />
  <img width="1920" height="1080" alt="image" src="https://github.com/user-attachments/assets/a46bb587-6117-49e5-bbd2-18ebf68a2f4e" />
  <img width="1920" height="1080" alt="image" src="https://github.com/user-attachments/assets/34efdaa9-db23-41c1-8221-e869d0fc80bb" />
  <img width="1920" height="1080" alt="image" src="https://github.com/user-attachments/assets/e483ae9b-15c5-4de2-b5e8-fd01b7836963" />
</details>

### 🛠️ Ferramentas de Admin e Auditoria

Recursos avançados para gerenciamento e depuração do banco de dados.

* **Executor de Consultas SQL:** Uma interface que permite executar queries `SELECT` (e outras consultas seguras) diretamente no banco de dados e ver o resultado em uma tabela dinâmica.
* **Log de Auditoria:** Uma tela que exibe os logs de auditoria de alteração de preço, alimentada diretamente por uma `TRIGGER` no banco de dados.

> **[IMAGEM DA TELA DO EXECUTOR SQL COM UMA QUERY E RESULTADO]**

<details>
  <summary>Clique para expandir a imagem do Executor SQL</summary>

  <img width="1920" height="1080" alt="image" src="https://github.com/user-attachments/assets/28080ea1-334d-42fd-89ad-b3d74385d541" />
  <img width="1920" height="1080" alt="image" src="https://github.com/user-attachments/assets/87a345a4-ae35-4b53-8820-e966d1c1d37a" />
</details>

---

## 🛠️ Tecnologias Utilizadas (Tech Stack)

| Backend (Servidor) | Frontend (Cliente) | Banco de Dados |
| :--- | :--- | :--- |
| ![Java](https://img.shields.io/badge/Java-17-007396?logo=java) | ![React](https://img.shields.io/badge/React-18-61DAFB?logo=react) | ![MySQL](https://img.shields.io/badge/MySQL-8.0-4479A1?logo=mysql) |
| ![Spring](https://img.shields.io/badge/Spring_Boot-3.x-6DB33F?logo=spring) | ![Next.js](https://img.shields.io/badge/Next.js-14-black?logo=nextdotjs) | `JDBC` |
| ![Maven](https://img.shields.io/badge/Maven-3.8-C71A36?logo=apachemaven) | ![Chart.js](https://img.shields.io/badge/Chart.js-4.x-FF6384?logo=chartdotjs) | `Triggers` `Procedures` |
| `Spring Web` | `CSS Modules` | `Views` `Functions` |
| `Spring JDBC (Template)` | `React Icons` | `Índices` |

---

## 🚀 Como Executar (Getting Started)

Siga estes passos para configurar e executar o projeto localmente.

### Pré-requisitos

* [Git](https://git-scm.com/)
* [Java 17 (ou superior)](https://www.oracle.com/java/technologies/downloads/)
* [Node.js 18 (ou superior)](https://nodejs.org/)
* Um servidor MySQL (recomendo [XAMPP](https://www.apachefriends.org/index.html) ou [MySQL Workbench](https://www.mysql.com/products/workbench/))

### 1. Banco de Dados (MySQL)

Este é o coração do projeto. O setup é simplificado e requer a execução de apenas um arquivo.

1.  Navegue até a pasta `database/` na raiz deste projeto.
2.  Execute o script **`full_schema.sql`** no seu banco de dados recém-criado.

Este script único cuidará de tudo:
* Criação de todas as tabelas.
* Inserção de dados de teste (para popular o dashboard).
* Criação das Funções, Procedimentos, Views de BI e Triggers.

(Para fins de desenvolvimento e consulta, os scripts individuais também estão disponíveis nesta pasta.)

### 2. Backend (Java/Spring)

1.  Clone o repositório:
    ```bash
    git clone [https://github.com/fthenri/pet-shop-bd-v2.git](https://github.com/fthenri/pet-shop-bd-v2.git)
    cd pet-shop-bd-v2
    ```
2.  **Configure o Acesso ao BD:**
    Crie o arquivo `backend/src/main/resources/application.properties` (se não existir) e adicione suas credenciais do MySQL:
    ```properties
    spring.datasource.url=jdbc:mysql://localhost:3306/PetShop
    spring.datasource.username=seu_usuario_mysql
    spring.datasource.password=sua_senha_mysql
    spring.datasource.driver-class-name=com.mysql.cj.jdbc.Driver
    ```
3.  Navegue até a pasta do backend e execute:
    ```bash
    cd backend
    ./mvnw spring-boot:run
    ```
    O servidor estará rodando em `http://localhost:8080`.

### 3. Frontend (React/Next)

1.  Em um novo terminal, navegue até a pasta do frontend:
    ```bash
    cd frontend
    ```
2.  Instale as dependências:
    ```bash
    npm install
    ```
3.  Execute o servidor de desenvolvimento:
    ```bash
    npm run dev
    ```
    Abra `http://localhost:3000` no seu navegador para ver a aplicação.

---

## 🏗️ Design e Artefatos do Banco de Dados

Este projeto foi desenvolvido usando uma abordagem *Database-First*. Todo o design do sistema foi planejado antes da primeira linha de código, usando artefatos de modelagem.

### 1. Definição do Minimundo

A descrição textual que deu origem ao projeto, definindo as regras de negócio.

<details>
  <summary>Clique para expandir a Definição do Minimundo</summary>
<br>

**Descrição do Cenário:**<br> 
> Um Pet Shop oferece uma variedade de serviços (como banho, tosa, consultas veterinárias) e vende produtos (como ração, brinquedos e acessórios). A empresa precisa de um sistema para gerenciar as informações de clientes e seus pets, registrar vendas de produtos e analisar o desempenho do negócio para tomar decisões mais informadas.<br>

**Objetivos da Aplicação:**<br>
* Centralizar e organizar as informações sobre clientes, seus pets e funcionários.<br>
* Fornecer insights sobre as operações do negócio por meio de relatórios e um dashboard visual.<br>

**Perguntas/Relatórios Importantes:**<br>
* Quais são os serviços e produtos mais populares?<br>
* Qual é a receita mensal proveniente de serviços em comparação com a de produtos?<br>
* Qual é o perfil dos clientes mais frequentes?<br>

---

#### Entidades e Atributos

1.  **Cliente:** A pessoa física responsável pelos pets e pelas transações.<br>
    * **cpf** (chave primária)<br>
    * nome<br>
    * data_cadastro<br>
    * endereco (composto: logradouro, numero, bairro, cidade, estado, cep)<br>
    * telefone (multivalorado)<br>

2.  **Pet (Entidade Fraca):** O animal de estimação atendido no Pet Shop. Depende de um Cliente.<br>
    * **nome_pet** (chave parcial)<br>
    * especie<br>
    * raca<br>
    * data_nascimento<br>
    * observacoes (alergias, condições médicas)<br>

3.  **Funcionário (Generalista):** Representa qualquer pessoa que trabalhe no Pet Shop.<br>
    * **cod_funcionario** (chave primária)<br>
    * nome<br>
    * cpf<br>
    * data_admissao<br>
    * *Especializações: Veterinário, Atendente*<br>

4.  **Fornecedor:** A empresa que fornece os produtos.<br>
    * **cnpj** (chave primária)<br>
    * razao_social<br>
    * contato_principal<br>

5.  **Produto:** Itens físicos vendidos na loja.<br>
    * **cod_produto** (chave primária)<br>
    * nome_produto<br>
    * descricao<br>
    * preco_venda<br>
    * quantidade_estoque<br>

6.  **Consulta:** Registro de um atendimento clínico.<br>
    * **num_consulta** (chave primária)<br>
    * data_hora<br>
    * diagnostico<br>
    * sintomas_relatados<br>

7.  **Exame:** Exame solicitado durante uma consulta.<br>
    * **nome_exame** (chave parcial)<br>
    * data_solicitacao<br>
    * resultado<br>

8.  **Venda:** O registro mestre de uma transação comercial.<br>
    * **num_venda** (chave primária)<br>
    * data_hora<br>
    * valor_total<br>
    * forma_pagamento<br>

9.  **Pesquisa:** Pesquisas de satisfação realizadas com clientes.<br>
    * **id_pesquisa** (chave primária)<br>
    * *(diversos atributos de perfil)*<br>
    * id_client (chave estrangeira para Cliente)<br>

---

#### Relacionamentos e Cardinalidades

* **Cliente e Pet (1:N):** "possui" (Relacionamento de Identificação).<br>
* **Funcionário (1:N):** "supervisiona" (Auto-relacionamento).<br>
* **Fornecedor e Produto (1:N):** "fornecer".<br>
* **Venda e Produto (N:M):** "contem" (com atributo `quantidade`).<br>
* **Veterinário, Pet e Consulta (Ternário):** "Atende".<br>
* **Consulta e Exame (1:N):** "prescrever" (Relacionamento de Identificação).<br>
* **Atendente e Venda (1:N):** "registra".<br>
* **Cliente e Venda (1:N):** "efetua".<br>
* **Cliente e Pesquisa (1:N):** (Relacionamento para pesquisa).<br>

</details>

### 2. Modelo Conceitual (MER)
O diagrama Entidade-Relacionamento de alto nível.

> **[IMAGEM DO MODELO CONCEITUAL]**
<img width="1382" height="495" alt="conceitual" src="https://github.com/user-attachments/assets/1ef56f21-f1a6-415f-b9de-1faed6386882" />

### 3. Modelo Lógico
A transição do modelo conceitual para um rascunho do esquema relacional.

> **[IMAGEM DO MODELO LÓGICO]**
<img width="1292" height="864" alt="Lógico_1" src="https://github.com/user-attachments/assets/ccd8e700-334f-4f9e-ba81-f4d97962a5ef" />

### 4. Esquema Relacional

O esquema relacional derivado do MER, mostrando as tabelas, atributos e chaves estrangeiras.

> **[IMAGEM DO ESQUEMA RELACIONAL]**
<img width="711" height="632" alt="image" src="https://github.com/user-attachments/assets/79c566e2-797c-4309-b1ba-361172ad279c" />

<br>

### 5. Dicionário de Dados

A definição detalhada de cada atributo (tipo de dado, tamanho, restrições) para cada entidade do banco de dados.

<details>
  <summary>Clique para expandir o Dicionário de Dados</summary>

<br>

#### Entidade: Cliente
Representa os clientes donos dos pets. 

| Nome do Atributo | Tipo de Dado | Tamanho/Precisão | Descrição | Observações/Restrições |
| :--- | :--- | :--- | :--- | :--- |
| **cpf** | VARCHAR | 11 | CPF do cliente, usado para identificação única. | PK (Chave Primária), Obrigatório, Único |
| nome | VARCHAR | 150 | Nome completo do cliente. | Obrigatório |
| data_cadastro | DATE | | Data em que o cliente foi cadastrado no sistema. | Obrigatório |
| logradouro | VARCHAR | 200 | Nome da rua/avenida do endereço do cliente. | Opcional |
| numero | VARCHAR | 10 | Número do imóvel no endereço. | Opcional |
| bairro | VARCHAR | 50 | Bairro do endereço. | Opcional |
| cidade | VARCHAR | 50 | Cidade do endereço. | Opcional |
| estado | CHAR | 2 | Sigla do estado (UF). | Opcional |
| cep | VARCHAR | 8 | Código de Endereçamento Postal (sem formatação). | Opcional |
| telefone | VARCHAR | 15 | Telefone de contato do cliente. | Multivalorado |

<br>

#### Entidade: Pet
Representa os animais de estimação. É uma entidade fraca, dependente de Cliente. 

| Nome do Atributo | Tipo de Dado | Tamanho/Precisão | Descrição | Observações/Restrições |
| :--- | :--- | :--- | :--- | :--- |
| **cpf_cliente** | VARCHAR | 11 | CPF do cliente dono do pet. | PK (parte), FK para Cliente |
| **nome_pet** | VARCHAR | 50 | Nome do animal de estimação. | PK (parte), Chave Parcial |
| especie | VARCHAR | 30 | Espécie do animal (ex: 'Cachorro', 'Gato'). | Obrigatório |
| raca | VARCHAR | 50 | Raça do animal. | Obrigatório |
| data_nascimento | DATE | | Data de nascimento aproximada do pet. | Opcional |
| observacoes | TEXT | | Campo para informações relevantes (alergias, etc.). | Opcional |

<br>

#### Entidade: Funcionario
Representa os funcionários do Pet Shop (superclasse). 

| Nome do Atributo | Tipo de Dado | Tamanho/Precisão | Descrição | Observações/Restrições |
| :--- | :--- | :--- | :--- | :--- |
| **cod_funcionario** | INTEGER | | Código identificador único do funcionário. | PK. Auto-incremento |
| nome | VARCHAR | 150 | Nome completo do funcionário. | Obrigatório |
| cpf | VARCHAR | 11 | CPF do funcionário. | Obrigatório, Único |
| data_admissao | DATE | | Data em que o funcionário foi admitido. | Obrigatório |
| cod_supervisor | INTEGER | | Código do funcionário que o supervisiona. | FK para Funcionario, Opcional (Pode ser NULO) |

<br>

#### Entidades: Veterinario e Atendente
Subclasses de Funcionario. Elas herdam todos os atributos acima. 

| Entidade | Nome do Atributo | Tipo de Dado | Tamanho/Precisão | Descrição | Observações/Restrições |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Veterinario** | **cod_funcionario** | INTEGER | | Identificador herdado. | PK, FK para Funcionario |
| | CRMV | VARCHAR | 10 | Registro no Conselho Regional de Med. Veterinária. | Obrigatório, Único |
| **Atendente** | **cod_funcionario** | INTEGER | | Identificador herdado. | PK, FK para Funcionario |

<br>

#### Entidade: Fornecedor
Representa as empresas que fornecem produtos para o Pet Shop. 

| Nome do Atributo | Tipo de Dado | Tamanho/Precisão | Descrição | Observações/Restrições |
| :--- | :--- | :--- | :--- | :--- |
| **cnpj** | VARCHAR | 14 | CNPJ do fornecedor (sem formatação). | PK (Chave Primária), Obrigatório, Único |
| razao_social | VARCHAR | 200 | Nome empresarial do fornecedor. | Obrigatório |
| contato_principal | VARCHAR | 15 | Telefone de contato do Fornecedor. | Obrigatório |

<br>

#### Entidade: Produto
Representa os itens à venda. 

| Nome do Atributo | Tipo de Dado | Tamanho/Precisão | Descrição | Observações/Restrições |
| :--- | :--- | :--- | :--- | :--- |
| **cod_produto** | INTEGER | | Código identificador único do produto. | PK. Auto-incremento |
| nome_produto | VARCHAR | 100 | Nome/Título do produto. | Obrigatório |
| descricao | TEXT | | Descrição detalhada do produto. | Opcional |
| preco_venda | DECIMAL | 10, 2 | Preço unitário de venda do produto. | Obrigatório |
| quantidade_estoque | INTEGER | | Quantidade atual do produto em estoque. | Obrigatório |
| cod_fornecedor | INTEGER | | Código do fornecedor do produto. | FK para Fornecedor, Obrigatório |

<br>

#### Entidade: Venda
Registra cada transação de venda. 

| Nome do Atributo | Tipo de Dado | Tamanho/Precisão | Descrição | Observações/Restrições |
| :--- | :--- | :--- | :--- | :--- |
| **num_venda** | INTEGER | | Número identificador único da venda. | PK, Auto-incremento |
| data_hora | TIMESTAMP | | Data e hora exatas da transação. | Obrigatório |
| valor_total | DECIMAL | 10, 2 | Soma total dos itens da venda. | Obrigatório |
| forma_pagamento | VARCHAR | 50 | Método de pagamento (ex: 'Cartão de Crédito'). | Obrigatório |
| cpf_cliente | VARCHAR | 11 | Cliente que efetuou a compra. | FK para Cliente, Obrigatório |
| cod_funcionario | INTEGER | | Funcionário que registrou a venda. | FK para Funcionario, Obrigatório |

<br>

#### Entidade: Consulta
Registra os atendimentos veterinários. 

| Nome do Atributo | Tipo de Dado | Tamanho/Precisão | Descrição | Observações/Restrições |
| :--- | :--- | :--- | :--- | :--- |
| **num_consulta** | INTEGER | | Número identificador único da consulta. | PK. Auto-incremento |
| data_hora | TIMESTAMP | | Data e hora exatas da consulta. | Obrigatório |
| sintomas_relatados | TEXT | | Sintomas descritos pelo dono do pet. | Opcional |
| diagnostico | TEXT | | Diagnóstico fornecido pelo veterinário. | Opcional |
| cpf_cliente_pet | VARCHAR | 11 | CPF do dono do pet atendido. | FK para Pet, Obrigatório |
| nome_pet | VARCHAR | 50 | Nome do pet atendido. | FK para Pet, Obrigatório |
| cod_veterinario | INTEGER | | Veterinário que realizou a consulta. | FK para Veterinario, Obrigatório |

<br>

#### Entidade: Exame
Registra os exames solicitados em uma consulta. Entidade fraca, dependente de Consulta. 

| Nome do Atributo | Tipo de Dado | Tamanho/Precisão | Descrição | Observações/Restrições |
| :--- | :--- | :--- | :--- | :--- |
| **num_consulta** | INTEGER | | Consulta que originou o pedido de exame. | PK (parte), FK para Consulta |
| **nome_exame** | VARCHAR | 100 | Nome do exame solicitado (ex: 'Hemograma'). | PK (parte), Chave Parcial |
| data_solicitacao | DATE | | Data em que o exame foi solicitado. | Obrigatório |
| resultado | TEXT | | Laudo/Resultado do exame. | Opcional |

<br>

#### Entidade: Pesquisa
Registra os hábitos de consumo dos clientes e características dos pets no petshop. 

| Atributo | Descrição | Tipo de Dado | Observações |
| :--- | :--- | :--- | :--- |
| **Id_pesquisa** | Identificador único da pesquisa | INT (PK) | Chave primária da tabela |
| Idade_Cliente | Idade do cliente que respondeu | INT | Valor em anos |
| Genero | Gênero do cliente | VARCHAR(20) | Ex: "Masculino", "Feminino", "Outro" |
| Distancia_km | Distância da residência do cliente até o local (em km) | DECIMAL(5,2) | Ex: 12.35 km |
| Tipo_Pet_1 | Espécie do primeiro pet | VARCHAR(30) | Ex: "Cachorro", "Gato", "Ave" |
| Idade_Pet_1 | Idade do primeiro pet | INT | Valor em anos |
| Peso_kg_Pet_1 | Peso do primeiro pet | DECIMAL(5,2) | Ex: 8.50 kg |
| Possui_Segundo_Pet | Indica se o cliente tem um segundo pet | BOOLEAN | 0 = Não, 1 = Sim |
| Tipo_Pet_2 | Espécie do segundo pet | VARCHAR(30) | Preenchido apenas se Possui_Segundo_Pet = 1 |
| Idade_Pet_2 | Idade do segundo pet | INT | Valor em anos |
| Peso_kg_Pet_2 | Peso do segundo pet | DECIMAL(5,2) | Ex: 12.00 kg |
| Gasto_Mensal_BRL | Gasto médio mensal do cliente com pets (em R$) | DECIMAL(10,2) | Ex: 350.75 |
| Frequencia_Visitas | Frequência de visitas ao estabelecimento | VARCHAR(50) | Ex: "Semanal", "Mensal", "Trimestral" |
| Servico_Principal | Serviço mais utilizado pelo cliente | VARCHAR(50) | Ex: "Banho", "Consulta veterinária", "Hotelzinho" |
| Nota_Satisfacao | Nota de satisfação dada pelo cliente | INT | Escala de 0 a 10 (ou conforme definido) |
| Id_Client | Identificador do cliente que respondeu | INT (FK) | Chave estrangeira (referencia a entidade Cliente) |

</details>

---

## 🗺️ Roadmap (Próximas Features)

O sistema de gestão (CRUDs e BI) está completo, mas a fundação do banco de dados permite a implementação de módulos operacionais:

* [X] **Módulo de Ponto de Venda (PDV):** Uma interface para registrar `Vendas` e `Consultas` em tempo real, interagindo com as tabelas transacionais (`Venda`, `contem`, `Consulta_Atende`).
* [X] **Módulo de Registro de Serviços:** Interface para registrar `Consultas` em tempo real, interagindo com a tabela `Consulta_Atende`.
* [ ] **Adicionar Faturamento a Serviços:** Refatorar o banco de dados para adicionar uma coluna `valor` na tabela `Consulta_Atende`, permitindo que o módulo "Registrar Serviço" se torne também um fluxo financeiro.
* [ ] **Módulo de Agenda:** Uma tela de calendário para veterinários visualizarem e gerenciarem seus horários (`Consulta_Atende`).

---

## 📄 Licença

Distribuído sob a licença MIT. Veja `LICENSE` para mais informações.
