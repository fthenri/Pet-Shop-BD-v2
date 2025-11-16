# 🐾 Sistema de Gestão de Pet Shop (Full-Stack)

[![Licença](https://img.shields.io/badge/licen%C3%A7a-MIT-blue.svg)](https://github.com/fthenri/pet-shop-bd-v2/blob/main/LICENSE)
[![Stars](https://img.shields.io/github/stars/fthenri/pet-shop-bd-v2?style=social)](https://github.com/fthenri/pet-shop-bd-v2/stargazers)

Um sistema de gerenciamento de Pet Shop full-stack (Java/Spring + React/Next.js) com dashboard de BI, módulos de gerenciamento (CRUDs) e executor de SQL. Perfeito para estudos, portfólio e como base para novos projetos.

---

## 🚀 Em Ação

Nada vende melhor o projeto do que vê-lo funcionando. Aqui está o Dashboard de Business Intelligence em ação:

![Dashboard](https://github.com/user-attachments/assets/749c61d4-f091-4fca-a23a-50f28394813f)

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

  <img width="1920" height="1080" alt="image" src="https://github.com/user-attachments/assets/109fce09-07a7-4e8a-9520-d61a0f7c6716" />
  <img width="1920" height="1080" alt="image" src="https://github.com/user-attachments/assets/5d18af3d-b083-4b13-8d06-038d24ee7da9" />
  <img width="1920" height="1080" alt="image" src="https://github.com/user-attachments/assets/931bf1ef-3272-41b0-aa1f-9f8707fb6ed7" />
  <img width="1920" height="1080" alt="image" src="https://github.com/user-attachments/assets/c8897d11-dc8c-4a9d-ac5e-b001f9c6c345" />
  <img width="1920" height="1080" alt="image" src="https://github.com/user-attachments/assets/6fa4446e-be84-47d8-9971-734b2e0eab68" />
  <img width="1920" height="1080" alt="image" src="https://github.com/user-attachments/assets/e19e0eac-c28e-41de-b393-5ed14ce44f30" />
  <img width="1920" height="1080" alt="image" src="https://github.com/user-attachments/assets/d4232685-19b0-480a-8ff7-460df774c3da" />
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

  <img width="1920" height="1080" alt="image" src="https://github.com/user-attachments/assets/a910db28-7c47-488e-8036-c0700b3a48c3" />
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

Este é o coração do projeto.

1.  Crie um novo database (schema) no seu servidor MySQL (ex: `petshop_db`).
2.  **IMPORTANTE:** Para facilitar os testes, estamos trabalhando em um script SQL unificado. Por enquanto, para ter a experiência completa (com dados robustos para o dashboard), execute os scripts SQL na seguinte ordem:
    1.  `PetShop_Criacao_Insercao.sql` (Cria tabelas e insere dados)
    2.  `Etapa04_Visoes.sql` (Cria as Views de BI)
    3.  `3-Triggers.sql` (Adiciona os gatilhos de auditoria e estoque)
    4.  `1-Funcoes.sql` (Adiciona as Funções de cálculo)
    5.  `2-Procedimentos.sql` (Adiciona os Procedimentos de manutenção)

### 2. Backend (Java/Spring)

1.  Clone o repositório:
    ```bash
    git clone [https://github.com/fthenri/pet-shop-bd-v2.git](https://github.com/fthenri/pet-shop-bd-v2.git)
    cd pet-shop-bd-v2
    ```
2.  **Configure o Acesso ao BD:**
    Crie o arquivo `backend/src/main/resources/application.properties` (se não existir) e adicione suas credenciais do MySQL:
    ```properties
    spring.datasource.url=jdbc:mysql://localhost:3306/petshop_db
    spring.datasource.username=seu_usuario_mysql
    spring.datasource.password=sua_senha_mysql
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

Você pode encontrar todos os arquivos de design na raiz do projeto.

### 1. Definição do Minimundo
A descrição textual que deu origem ao projeto, definindo as regras de negócio.
* **Arquivo:** `Definição do Minimundo (1).pdf`

### 2. Modelo Conceitual (MER)
O diagrama Entidade-Relacionamento de alto nível.

> **[IMAGEM DO MODELO CONCEITUAL]**
<img width="1382" height="495" alt="conceitual" src="https://github.com/user-attachments/assets/1ef56f21-f1a6-415f-b9de-1faed6386882" />

### 3. Modelo Lógico
A transição do modelo conceitual para um rascunho do esquema relacional.

> **[IMAGEM DO MODELO LÓGICO]**
<img width="1292" height="864" alt="Lógico_1" src="https://github.com/user-attachments/assets/ccd8e700-334f-4f9e-ba81-f4d97962a5ef" />

### 4. Esquema Relacional e Dicionário de Dados
Os documentos finais que descrevem as tabelas, colunas, tipos de dados e restrições.
* **Esquema:** `Esquema Relacional.pdf`
* **Dicionário:** `Dicionário de Dados - Sistema Pet Shop (2).pdf`

---

## 🗺️ Roadmap (Próximas Features)

O sistema de gestão (CRUDs e BI) está completo, mas a fundação do banco de dados permite a implementação de módulos operacionais:

* [ ] **Módulo de Ponto de Venda (PDV):** Uma interface para registrar `Vendas` e `Consultas` em tempo real, interagindo com as tabelas transacionais (`Venda`, `contem`, `Consulta_Atende`).
* [ ] **Módulo de Agenda e Prontuário:** Uma tela para veterinários visualizarem a agenda e preencherem diagnósticos (`Consulta_Atende`) e solicitarem `Exames`.

---

## 📄 Licença

Distribuído sob a licença MIT. Veja `LICENSE` para mais informações.
