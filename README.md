# 🎓 Sistema de Cadastro de Alunos (CRUD)
> **Atividade Prática · Desenvolvimento Web e Banco de Dados**  
> **Professor:** Celso Barreto · **SENAI Bahia**  
> **Tecnologias:** Node.js, TypeScript, Express, MySQL e HTML5/CSS3
> https://senaiba.my.canva.site/praticafs

---

## 📌 Sobre o Projeto

Este projeto é uma aplicação web completa desenvolvida para demonstrar na prática a integração entre um back-end em **Node.js com TypeScript** e um banco de dados relacional **MySQL**, com uma interface web interativa para o usuário.

A aplicação implementa todas as operações fundamentais de um **CRUD**:
* **C (Create):** Cadastro de novos alunos com validações e proteção contra e-mails duplicados (`UNIQUE`).
* **R (Read):** Consulta geral de alunos cadastrados e filtro de pesquisa em tempo real por nome.
* **U (Update):** Edição dos dados cadastrais (nome, e-mail e curso).
* **D (Delete):** Exclusão de registros com confirmação prévia na interface para evitar remoções acidentais.

---

## 🛡️ Boas Práticas e Segurança Aplicadas

* **Prevenção de SQL Injection:** Todas as consultas ao banco de dados utilizam consultas preparadas/parametrizadas com placeholders (`?`) via driver `mysql2/promise`.
* **Pool de Conexões:** Gerenciamento eficiente e reutilização de conexões com o MySQL.
* **Variáveis de Ambiente:** Credenciais e configurações sensíveis isoladas no arquivo `.env` (ignorado pelo Git).
* **Tipagem Estática:** Interfaces TypeScript dedicadas tanto no servidor quanto no cliente.

---

## 📋 Pré-requisitos

Antes de começar, certifique-se de ter instalado em sua máquina:

1. **[Node.js](https://nodejs.org/)** (versão LTS recomendada: 18 ou superior).
2. **[Git](https://git-scm.com/)** (caso vá clonar o repositório).
3. **[XAMPP](https://www.apachefriends.org/pt_br/index.html)** (ou servidor MySQL equivalente na porta 3306).
4. Um navegador moderno (Chrome, Edge, Firefox, etc.).

---

## 🚀 Como Executar o Projeto Passo a Passo

Siga os passos abaixo para rodar o projeto na sua máquina a partir do zero:

### 1. Clonar ou Baixar o Repositório

Se estiver usando o Git pelo terminal:
```bash
git clone https://github.com/caioba19/Roteiro-de-pratica-CRUD.git
cd Roteiro-de-pratica-CRUD
```
*(Caso tenha baixado em arquivo `.zip`, basta extrair a pasta e abrir o terminal dentro dela).*

---

### 2. Instalar as Dependências

No terminal do projeto, execute:
```bash
npm install
```
Isso instalará as bibliotecas necessárias: `express`, `mysql2`, `dotenv`, `typescript`, `@types/node`, `@types/express`, etc.

---

### 3. Iniciar o Banco de Dados (MySQL / XAMPP)

1. Abra o **XAMPP Control Panel**.
2. Clique no botão **Start** ao lado do módulo **MySQL** (ele deve ficar verde com a porta `3306`).
   *(Não é necessário iniciar o Apache, pois o nosso servidor é Node.js).*

---

### 4. Criar o Banco de Dados e a Tabela

Você pode executar o script [banco.sql](banco.sql) usando uma das opções:

* **Opção A (Pelo phpMyAdmin):**
  1. No painel do XAMPP, clique no botão **Admin** ao lado do MySQL (ou acesse `http://localhost/phpmyadmin`).
  2. Vá na aba **Importar**, selecione o arquivo `banco.sql` deste projeto e clique em **Executar**.

* **Opção B (Pelo Terminal do MySQL / XAMPP):**
  ```bash
  C:\xampp\mysql\bin\mysql.exe -u root -e "source banco.sql"
  ```

O script criará o banco `aula_mysql` e a tabela `alunos` com a seguinte estrutura:
* `id` (INT UNSIGNED AUTO_INCREMENT PRIMARY KEY)
* `nome` (VARCHAR 120)
* `email` (VARCHAR 160 UNIQUE)
* `curso` (VARCHAR 120)

---

### 5. Configurar as Variáveis de Ambiente (`.env`)

Crie uma cópia do arquivo `.env.example` chamada `.env`:

* **No Windows (PowerShell):**
  ```powershell
  Copy-Item .env.example .env
  ```
* **No Linux/Mac ou Git Bash:**
  ```bash
  cp .env.example .env
  ```

Abra o arquivo `.env` gerado e confira se as configurações coincidem com seu MySQL:
```env
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=
DB_NAME=aula_mysql
PORT=3000
```
> **Nota:** No XAMPP padrão, o usuário é `root` e a senha fica em branco (`DB_PASSWORD=`). Caso você tenha definido uma senha para o MySQL, informe-a nesse campo.

---

### 6. Compilar o Projeto (TypeScript)

Gere a compilação do TypeScript para JavaScript rodando:
```bash
npm run build
```
Esse comando compila os arquivos do backend (para a pasta `dist/`) e os scripts do front-end (para `public/js/`).

---

### 7. Iniciar a Aplicação

Para iniciar o servidor:
```bash
npm start
```
*(Ou, se preferir compilar e iniciar em um único passo, use `npm run dev`).*

Você verá no terminal:
```text
✔ Conexão com o banco de dados MySQL realizada com sucesso!
✔ Servidor rodando com sucesso!
✔ Acesse no navegador: http://localhost:3000
```

---

### 8. Acessar no Navegador

Abra seu navegador e acesse:
👉 **[http://localhost:3000](http://localhost:3000)**

Pronto! A interface estará disponível para cadastrar, pesquisar, editar e excluir alunos.

---

## 📁 Estrutura de Pastas do Projeto

```text
├── public/                 # Arquivos do Front-end (lado do cliente)
│   ├── css/
│   │   └── style.css       # Estilos da interface
│   ├── js/
│   │   └── app.js          # JavaScript compilado que roda no navegador
│   ├── ts/
│   │   └── app.ts          # Código fonte TypeScript do front-end
│   └── index.html          # Página principal da aplicação
│
├── src/                    # Arquivos do Back-end (lado do servidor)
│   ├── config/
│   │   └── database.ts     # Configuração e Pool de conexões do MySQL
│   ├── routes/
│   │   └── alunos.ts       # Rotas do CRUD (POST, GET, PUT, DELETE)
│   ├── types/
│   │   └── aluno.ts        # Interfaces TypeScript da entidade Aluno
│   └── server.ts           # Inicialização do Express e middlewares
│
├── banco.sql               # Script DDL de criação do banco e da tabela
├── .env.example            # Modelo de configuração de ambiente
├── package.json            # Scripts de execução e dependências do projeto
├── tsconfig.json           # Configuração do TypeScript para o backend
└── tsconfig.frontend.json  # Configuração do TypeScript para o frontend
```

---

## 🛠️ Endpoints da API REST

Caso queira testar a API via Postman, Insomnia ou cURL:

| Método | Endpoint | Descrição | Corpo da Requisição (JSON) |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/health` | Verifica status da aplicação | Nenhum |
| `GET` | `/api/alunos` | Lista alunos (ou busca com `?nome=texto`) | Nenhum |
| `POST` | `/api/alunos` | Cadastra um novo aluno | `{"nome": "...", "email": "...", "curso": "..."}` |
| `PUT` | `/api/alunos/:id`| Atualiza os dados de um aluno | `{"nome": "...", "email": "...", "curso": "..."}` |
| `DELETE` | `/api/alunos/:id`| Exclui o aluno pelo ID | Nenhum |

---

## ❓ Solução de Problemas Frequentes

* **Erro `ECONNREFUSED` ao iniciar:**
  Certifique-se de que o **MySQL está iniciado** no painel do XAMPP (botão Start verde).
* **Erro `ER_BAD_DB_ERROR`:**
  O banco de dados não foi encontrado. Execute o script `banco.sql` para criá-lo.
* **Erro de "MySQL shutdown unexpectedly" no XAMPP:**
  Pode indicar arquivos internos corrompidos do MySQL. Restaure os arquivos da pasta `C:\xampp\mysql\backup\mysql` para `C:\xampp\mysql\data\mysql`.
* **Porta 3000 já em uso:**
  Você pode alterar a porta editando a variável `PORT=3001` no seu arquivo `.env`.

---

Desenvolvido para fins educacionais. Bons estudos! 🚀
