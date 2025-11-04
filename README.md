# Sistema de Gestão para Pet Shop

![Status do Projeto](https://img.shields.io/badge/status-em--desenvolvimento-yellow)
![Java](https://img.shields.io/badge/java-17%2B-blue)
![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3.x-brightgreen)
![Maven](https://img.shields.io/badge/build-Maven-red)

## 📄 Descrição do Projeto

Este projeto consiste no desenvolvimento do backend para um sistema de gestão de Pet Shop. O objetivo é criar uma aplicação robusta para modelar e gerenciar as principais operações do negócio, como cadastro de clientes, pets, funcionários e controle de vendas e consultas.

O sistema está sendo construído com foco em uma arquitetura limpa, utilizando classes de modelo (POJOs) para representar as entidades do domínio, servindo como base para a implementação das regras de negócio e da camada de persistência.

## ✨ Entidades Modeladas

O núcleo do sistema é composto pelas seguintes entidades de domínio:

* **Cliente**: Donos dos animais de estimação.
* **Pet**: Animais de estimação dos clientes.
* **Funcionario**: Classe base para os colaboradores do Pet Shop.
    * **Veterinario**: Funcionário com especialização veterinária (CRMV).
    * **Atendente**: Funcionário responsável pelo atendimento geral.
* **Fornecedor**: Empresas que fornecem produtos para o Pet Shop.
* **Venda**: Registros de transações comerciais.
* **Consulta**: Registros de atendimentos veterinários.
* **Exame**: Exames solicitados durante uma consulta.

## 🛠️ Tecnologias Utilizadas

* **Java 17**: Linguagem de programação principal.
* **Spring Boot**: Framework para criação da aplicação e serviços web.
* **Maven**: Ferramenta para gerenciamento de dependências e build do projeto.

## 📁 Estrutura do Projeto

O projeto segue a estrutura padrão do Maven, com o código-fonte localizado em `src/main/java`. As principais pastas são:

* `com.pet_shop.pet_shop.Model`: Contém as classes de domínio (POJOs) que representam as entidades do sistema, como `Cliente`, `Pet`, `Funcionario`, etc.
* `com.pet_shop.pet_shop.Controller`: (A ser criado) Responsável por expor os endpoints da API REST.
* `com.pet_shop.pet_shop.Service`: (A ser criado) Onde a lógica de negócio será implementada.
* `com.pet_shop.pet_shop.Repository`: (A ser criado) Camada de acesso a dados (interação com o banco de dados).

## 🚀 Como Começar

Siga os passos abaixo para clonar e executar o projeto em seu ambiente local.

### Pré-requisitos

* **JDK 17** ou superior.
* **Apache Maven** instalado e configurado.
* Uma IDE de sua preferência (ex: IntelliJ IDEA, VS Code com extensões Java, Eclipse).

### Passos

1.  **Clone o repositório:**
    ```bash
    git clone [https://github.com/JuliaTBarros/Pet-Shop-BD.git](https://github.com/JuliaTBarros/Pet-Shop-BD.git)
    ```

2.  **Navegue até o diretório do projeto:**
    ```bash
    cd Pet-Shop-BD
    ```

3.  **Compile o projeto com o Maven:**
    (Este passo irá baixar todas as dependências)
    ```bash
    mvn clean install
    ```

4.  **Execute a aplicação:**
    ```bash
    mvn spring-boot:run
    ```

Após a execução, a aplicação estará rodando e pronta para receber requisições (assim que os Controllers forem implementados).

## 👩‍💻 Autores

**Julia T. Barros**

**Maria Clara Neves**

**Vinícius Bernardo**

**Henrique Figueireido**
