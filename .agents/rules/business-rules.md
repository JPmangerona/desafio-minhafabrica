# Rule: Business Rules — Regras de Negócio (Always On)

> Define as leis fundamentais de funcionamento do sistema, permissões de acesso (RBAC) e integridade de dados.
> O Agente deve garantir que qualquer alteração no código respeite estas definições.

---

## 👥 Papéis e Permissões (RBAC)

O sistema possui quatro papéis distintos. A permissão é definida pelo campo `role` na coleção `users`.

### 1. Admin (Administrador)
*   **Criação**: Deve existir um Admin padrão criado no início do sistema (Seed).
*   **Permissões**: Acesso total a todas as funções do sistema.
*   **Gestão de Pessoas**: É o único que acessa a tela de "Usuários".
*   **Ações em Usuários**: 
    *   Criar novos usuários com papéis `editor` ou `viewer`.
    *   Atualizar permissões de usuários existentes.
    *   Inativar usuários (Soft Delete).
    *   Listar todos os funcionários.

### 2. Editor
*   **Permissões**: Pode visualizar e editar produtos e categorias no painel administrativo.
*   **Restrições**: **NÃO** tem acesso à tela de "Usuários".

### 3. Viewer (Visualizador)
*   **Permissões**: Pode visualizar produtos e categorias no painel administrativo (apenas leitura).
*   **Restrições**: **NÃO** pode editar nada e **NÃO** tem acesso à tela de "Usuários".

### 4. Client (Cliente)
*   **Permissões**: Pode apenas visualizar os produtos listados na vitrine (Storefront).
*   **Restrições**: Não tem acesso a nenhuma parte do painel administrativo.

---

## 🛠️ Regras de Integridade de Dados

### Soft Delete (Inativação)
*   Nenhum dado de `users`, `products` ou `categories` deve ser deletado fisicamente do banco de dados.
*   Deve-se sempre utilizar o campo `ativo: false` para "remover" um item.

### Usuário e Login
*   **Login**: A busca de usuário no login deve sempre filtrar por `ativo: true`. Apenas usuários ativos podem acessar o sistema.
*   **Gestão (Painel Admin)**: No painel administrativo, a listagem de usuários **DEVE incluir os usuários inativos**, permitindo que o Admin veja quem foi desativado e, se necessário, reative-os.
*   O campo `email` é o identificador único para o login.

### Produtos e Categorias
*   Um **Produto** pode ser criado mesmo sem estar vinculado a uma **Categoria** (campo opcional).
*   Se uma **Categoria** for inativada (`ativo: false`), seus produtos vinculados devem ter sua visibilidade tratada (não aparecer na vitrine).

---

## 🚀 Implementação Técnica Esperada

- **Middleware**: As rotas devem ser protegidas verificando não apenas o Token, mas também o `role` do usuário logado.
- **Frontend**: Menus e botões devem ser escondidos ou desativados com base no `role` retornado no Token/Sessão.
