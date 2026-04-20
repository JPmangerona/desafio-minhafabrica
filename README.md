# MinhaFábrica - Desafio Técnico

Este repositório contém a solução para o desafio técnico "MinhaFábrica", uma plataforma completa de gerenciamento e visualização de produtos e categorias, com controle de acesso, painel administrativo e interface pública.

## 🚀 Tecnologias

### Backend
- **Node.js** com **TypeScript**
- **Express.js** (Framework Web)
- **MongoDB** com **Mongoose** (Banco de dados NoSQL)
- **JWT** (JSON Web Tokens) para autenticação segura
- **Bcrypt** para hashing de senhas
- **Multer** para upload de imagens
- **TypeORM** (Integrado para suporte a padrões de repositório)

### Frontend
- **React 19**
- **Next.js 16** (App Router)
- **TypeScript**
- **Tailwind CSS 4** (Estilização moderna e dinâmica)
- **Lucide React** (Ícones)
- **Axios** (Consumo de API)

---

## 🏗️ Estrutura do Projeto

O projeto é dividido em um monorepo simples:

- `/backend`: API RESTful contendo toda a lógica de negócio, autenticação e integração com banco de dados.
- `/frontend`: Aplicação Client-side com área pública e painel administrativo protegido.

---

## ✨ Funcionalidades Principais

- **Autenticação e Autorização**: Sistema de login com JWT e controle de permissões por cargos (`admin`, `editor`).
- **Painel Administrativo**:
    - **Dashboard**: Estatísticas resumidas do sistema.
    - **Gestão de Usuários**: CRUD completo de usuários (apenas para administradores).
    - **Gestão de Categorias**: Criação, edição, listagem e exclusão de categorias com suporte a upload de imagem.
    - **Gestão de Produtos**: CRUD de produtos com vínculo a categorias e upload de fotos.
- **Área Pública**:
    - Listagem de categorias e produtos.
    - Busca global de itens.
    - Navegação intuitiva e responsiva.
- **Segurança**:
    - Proteção de rotas no backend via middlewares.
    - Proteção de rotas no frontend via Next.js Middleware.
    - Tratamento de erros centralizado.

---

## 🛠️ Como Executar o Projeto

### Pré-requisitos
- Node.js (versão 20 ou superior recomendada)
- Instância do MongoDB (local ou Atlas)

### Configuração do Backend

1. Navegue até a pasta do backend:
   ```bash
   cd backend
   ```
2. Instale as dependências:
   ```bash
   npm install
   ```
3. Crie um arquivo `.env` na raiz da pasta `backend` seguindo o modelo:
   ```env
   MONGO_URI=seu_link_do_mongodb
   JWT_SECRET=sua_chave_secreta
   ```
4. Inicie o servidor em modo de desenvolvimento:
   ```bash
   npm run dev
   ```

### Configuração do Frontend

1. Navegue até a pasta do frontend:
   ```bash
   cd ../frontend
   ```
2. Instale as dependências:
   ```bash
   npm install
   ```
3. Inicie a aplicação Next.js:
   ```bash
   npm run dev
   ```
4. Acesse a aplicação em `http://localhost:3000`.

---

## 🌐 Acesso à Aplicação

A aplicação está disponível publicamente no seguinte endereço:
👉 **[https://minhafabrica.up.railway.app/](https://minhafabrica.up.railway.app/)**

> [!IMPORTANT]
> As **credenciais de acesso** (e-mail e senha) para os diferentes níveis de permissão foram enviadas diretamente por e-mail para avaliação.

---

## 🔐 Níveis de Acesso

1. **Público**: Pode visualizar produtos e categorias e realizar buscas.
2. **Visualizador**: Acesso para consulta ao painel administrativo e detalhes internos, sem permissão de alteração.
3. **Editor**: Pode gerenciar (Criar/Editar) produtos e categorias, mas não tem acesso à gestão de usuários.
4. **Admin**: Acesso total ao sistema, incluindo dashboard e gestão de usuários.

---

## 📝 Documentação da API (Principais Rotas)

| Método | Rota | Descrição | Acesso |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/v1/auth/login` | Realiza o login | Público |
| `GET` | `/api/v1/dashboard` | Estatísticas do sistema | Admin |
| `GET` | `/api/v1/users` | Lista todos os usuários | Admin |
| `GET` | `/api/v1/products` | Lista produtos públicos | Público |
| `POST` | `/api/v1/categories` | Cria nova categoria | Admin/Editor |

---

Desenvolvido como parte de um desafio técnico para demonstrar habilidades em desenvolvimento Fullstack, arquitetura limpa e UI/UX moderna.
