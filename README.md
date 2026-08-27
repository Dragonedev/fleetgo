Vehicle Rental API

REST API para locação e gerenciamento de veículos, desenvolvida com Java e Spring Boot.

🚀 Tecnologias
Java 21
Spring Boot
Spring Web
Spring Data JPA
PostgreSQL
Maven
Lombok
Bean Validation
⚙️ Funcionalidades
Cadastro e gerenciamento de clientes
Cadastro e gerenciamento de funcionários
Cadastro e gerenciamento de veículos
Gerenciamento de pedidos de locação
Controle de status dos veículos
Controle de pagamentos
Validação de dados e regras de negócio
Tratamento centralizado de exceções
Paginação nas consultas
🏗️ Estrutura

O projeto utiliza uma arquitetura em camadas, separando responsabilidades entre:

controller/
service/
database/
dto/
exception/
handler/

Essa organização facilita a manutenção, evolução e separação das responsabilidades da aplicação.

📚 Documentação

A pasta docs contém a documentação técnica do projeto, incluindo:

DER (Diagrama Entidade-Relacionamento) — representação da estrutura e dos relacionamentos do banco de dados.
Diagramas UML de classes — documentação das principais entidades do sistema:
Customer
Employee
Vehicle
RentalOrder
Documentação do projeto — informações complementares sobre a estrutura e funcionamento da aplicação.
▶️ Executando o projeto

Clone o repositório:

git clone https://github.com/Dragonedev/vehicle-rental-api.git
cd vehicle-rental-api

Configure o PostgreSQL e as variáveis de ambiente necessárias para a aplicação.

Execute com Maven:

./mvnw spring-boot:run

No Windows:

mvnw.cmd spring-boot:run
👨‍💻 Autor

Eduardo Dragone

Projeto desenvolvido para fins de estudo e portfólio em desenvolvimento backend com Java e Spring Boot.
