# 🚗 Vehicle Rental API

REST API para **locação e gerenciamento de veículos**, desenvolvida com **Java e Spring Boot**, seguindo uma arquitetura em camadas e aplicando boas práticas de desenvolvimento backend.

O projeto foi desenvolvido com foco em **organização, validação de dados, regras de negócio, persistência de dados e tratamento de exceções**, servindo como projeto de estudo e portfólio.

---

## 🚀 Tecnologias

* **Java 21**
* **Spring Boot**
* **Spring Web**
* **Spring Data JPA**
* **PostgreSQL**
* **Maven**
* **Lombok**
* **Bean Validation**

---

## ⚙️ Funcionalidades

### 👤 Clientes

* Cadastro de clientes
* Consulta de clientes
* Atualização de dados
* Validação de documentos
* Gerenciamento do status de cadastro

### 👨‍💼 Funcionários

* Cadastro de funcionários
* Consulta de funcionários
* Busca por código do funcionário
* Atualização de dados
* Desativação e reativação de funcionários

### 🚘 Veículos

* Cadastro de veículos
* Consulta de veículos
* Atualização de dados
* Validação de placa
* Controle de status do veículo
* Gerenciamento de disponibilidade

### 📄 Pedidos de Locação

* Gerenciamento de pedidos de locação
* Associação entre cliente, funcionário e veículo
* Controle do status da locação
* Controle de pagamentos
* Definição do método de pagamento

### 🛡️ Validações e Regras de Negócio

* Validação de dados utilizando Bean Validation
* Validação de entidades duplicadas
* Aplicação de regras de negócio
* Tratamento de operações não permitidas
* Tratamento centralizado de exceções

### 📑 Consultas

* Paginação dos resultados
* Busca de registros ativos
* Consultas por identificadores específicos

---

## 🏗️ Arquitetura

O projeto utiliza uma **arquitetura em camadas**, buscando separar as responsabilidades de cada parte da aplicação.

```text
src/
└── main/
    └── java/
        └── com/
            └── dragone/
                └── vehicle_rental_api/
                    ├── controller/
                    ├── service/
                    ├── database/
                    ├── dto/
                    ├── exception/
                    └── handler/
```

### 📂 Principais camadas

| Camada        | Responsabilidade                                        |
| ------------- | ------------------------------------------------------- |
| `controller/` | Recebe e processa as requisições HTTP                   |
| `service/`    | Contém as regras de negócio da aplicação                |
| `database/`   | Entidades e repositórios responsáveis pela persistência |
| `dto/`        | Objetos utilizados para entrada e saída de dados        |
| `exception/`  | Exceções específicas da aplicação                       |
| `handler/`    | Tratamento centralizado das exceções                    |

Essa organização facilita a **manutenção, evolução, testes e separação de responsabilidades** da aplicação.

---

## 🗄️ Modelo de Dados

O sistema possui como principais entidades:

* **Customer** — Cliente
* **Employee** — Funcionário
* **Vehicle** — Veículo
* **RentalOrder** — Pedido de locação

Os relacionamentos e a estrutura do banco de dados estão documentados através do **Diagrama Entidade-Relacionamento (DER)**.

---

## 📚 Documentação

A pasta `docs/` contém a documentação técnica do projeto.

```text
docs/
├── DER - vehicle-rental-api.pdf
├── UML - Customer.pdf
├── UML - Employee.pdf
├── UML - Vehicle.pdf
├── UML - RentalOrder.pdf
└── documentação-do-projeto.pdf
```

A documentação inclui:

* **DER (Diagrama Entidade-Relacionamento)**
* **Diagramas UML de classes**
* Documentação das principais entidades
* Informações complementares sobre a estrutura e funcionamento da aplicação

---

## ▶️ Executando o projeto

### 1. Clone o repositório

```bash
git clone https://github.com/Dragonedev/vehicle-rental-api.git
```

### 2. Acesse o diretório

```bash
cd vehicle-rental-api
```

### 3. Configure o PostgreSQL

Crie o banco de dados PostgreSQL e configure as variáveis de ambiente utilizadas pela aplicação.

Exemplo:

```text
DATABASE_URL=jdbc:postgresql://localhost:5432/vehicle_rental
DATABASE_USERNAME=seu_usuario
DATABASE_PASSWORD=sua_senha
```

> Não coloque senhas ou outras informações sensíveis diretamente no repositório.

### 4. Execute a aplicação

No Linux/macOS:

```bash
./mvnw spring-boot:run
```

No Windows:

```bash
mvnw.cmd spring-boot:run
```

Após iniciar, a API estará disponível localmente na porta configurada pela aplicação.

---

## 🔌 Endpoints

A API possui endpoints organizados por recurso:

```text
/v1/customers
/v1/employees
/v1/vehicles
/v1/rental-orders
```

Os endpoints permitem realizar operações de cadastro, consulta, atualização e gerenciamento dos recursos da aplicação.

---

## 📌 Objetivo do Projeto

Este projeto foi desenvolvido para praticar e consolidar conhecimentos em:

* Desenvolvimento de APIs REST
* Java e Spring Boot
* Spring Data JPA
* PostgreSQL
* Arquitetura em camadas
* DTOs
* Validação de dados
* Regras de negócio
* Tratamento de exceções
* Paginação
* Modelagem de banco de dados
* Documentação de software

---

## 👨‍💻 Autor

**Eduardo Dragone**

Projeto desenvolvido para **fins de estudo e portfólio**, com foco no desenvolvimento backend utilizando **Java e Spring Boot**.

---

## 📄 Licença

Este projeto foi desenvolvido para fins educacionais e de portfólio.

