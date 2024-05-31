<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="200" alt="Nest Logo" /></a>
</p>

# My Finance API

![NestJS](https://img.shields.io/badge/NestJS-E0234E?style=for-the-badge&logo=nestjs&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white)
![JWT](https://img.shields.io/badge/JWT-000000?style=for-the-badge&logo=JSON%20web%20tokens&logoColor=white)

My Finance API é uma aplicação de gerenciamento financeiro desenvolvida com NestJS. Ela permite gerenciar transações financeiras, categorias e usuários.

## Funcionalidades

- **Autenticação**: Cadastro e login de usuários.
- **Transações**: CRUD de transações financeiras.
- **Categorias**: CRUD de categorias de transações.
- **Relatórios**: Geração de relatórios financeiros.

## Tecnologias

- **Framework**: [NestJS](https://nestjs.com/)
- **Linguagem**: [TypeScript](https://www.typescriptlang.org/)
- **Banco de Dados**: [MongoDB](https://www.mongodb.com/)
- **Autenticação**: [JWT](https://jwt.io/)
- **ORM**: [Mongoose](https://mongoosejs.com/)

## Instalação

1. Clone o repositório:
    ```bash
    git clone https://github.com/Jonatas-Serra/api-my-finance-2.git
    ```
2. Instale as dependências:
    ```bash
    cd api-my-finance-2
    npm install
    ```
3. Configure as variáveis de ambiente:
    - Renomeie o arquivo `.env.example` para `.env` e preencha com suas configurações.

4. Inicie a aplicação:
    ```bash
    npm run start
    ```

## Uso

Após iniciar a aplicação, a API estará disponível em `http://localhost:4000`. Use um cliente REST como Postman para interagir com os endpoints.

## Documentação

A documentação completa da API pode ser acessada [aqui](https://api-myfinance-326ee4ab2f67.herokuapp.com/api).

## Endpoints Principais

- **POST /auth/register**: Registrar um novo usuário.
- **POST /auth/login**: Autenticar um usuário.
- **GET /transactions**: Listar todas as transações.
- **POST /transactions**: Criar uma nova transação.
- **PUT /transactions/:id**: Atualizar uma transação.
- **DELETE /transactions/:id**: Excluir uma transação.

## Dicas

- **MongoDB**: Você pode usar a versão gratuita do MongoDB em nuvem. Basta se cadastrar em [mongodb.com](https://www.mongodb.com/) e criar um novo cluster.
- **Mailgun**: Para testes de envio de e-mails, utilize o [Mailgun](https://www.mailgun.com/), que oferece um plano gratuito.

## Contribuição

1. Faça um fork do projeto.
2. Crie uma nova branch:
    ```bash
    git checkout -b minha-nova-feature
    ```
3. Faça suas alterações e commit:
    ```bash
    git commit -m 'Adiciona nova feature'
    ```
4. Envie para a branch principal:
    ```bash
    git push origin minha-nova-feature
    ```
5. Abra um Pull Request.

## Licença

Este projeto está licenciado sob a Licença MIT.
