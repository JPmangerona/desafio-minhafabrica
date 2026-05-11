# Plano de Implementação: Permissões Granulares (ACL)

Este plano descreve como substituir o controle de acesso atual (que é apenas por Cargo/Role) por um modelo de Permissões Granulares, onde o Admin pode marcar checkboxes definindo exatamente o que cada funcionário (como Visualizadores ou Editores) pode fazer no sistema.

---

## FASE 1: Backend (Configuração do Token e Tipos)

O objetivo desta fase é garantir que o array de permissões (que já está no `UserModel`) chegue até o token JWT e seja injetado no Request do Express.

1.  **`src/@types/express/index.d.ts`**
    *   Adicionar `permissions?: string[]` dentro do objeto `user` da interface `Request`.
2.  **`src/repositories/UserRepository.ts`**
    *   Na função `findByEmailWithPassword`, alterar o `select()` para incluir as permissões: `.select('+password +tenant_id +permissions')`.
3.  **`src/services/UserServices.ts`**
    *   Na função `getToken`, adicionar `permissions: user.permissions || []` no payload que é assinado pelo `jwt.sign()`.
4.  **`src/shared/middlewares/authenticated.ts`**
    *   Adicionar `permissions: string[]` na interface `TokenPayload`.
    *   Ao decodificar o token, extrair o array de `permissions` e injetá-lo em `req.user`.

---

## FASE 2: Backend (Middleware de Validação e Rotas)

O objetivo desta fase é criar o "porteiro" das permissões e aplicá-lo nas rotas.

1.  **Criar `src/shared/middlewares/hasPermission.ts`**
    *   Criar um middleware que recebe uma string (ex: `products.write`).
    *   **Regra 1:** Se `req.user.role` for `admin` ou `superadmin`, permite o acesso direto (`next()`), pois donos podem tudo.
    *   **Regra 2:** Se for outro role, verificar se `req.user.permissions.includes(requiredPermission)`. Se sim, `next()`. Se não, retorna erro `403 Acesso Negado`.
2.  **Atualizar `src/routes.ts`**
    *   Substituir (ou usar em conjunto com) o middleware `authorized` pelo novo `hasPermission`.
    *   Exemplo para listagem: `hasPermission('products.read')`
    *   Exemplo para criação/edição/exclusão: `hasPermission('products.write')`
    *   *Permissões sugeridas para criar:* `products.read`, `products.write`, `categories.read`, `categories.write`, `users.read`, `users.write`, `dashboard.read`.

---

## FASE 3: Frontend (UI de Checkboxes)

O objetivo desta fase é permitir que o Admin selecione as permissões na tela de Gestão de Usuários.

1.  **`src/types/index.ts`**
    *   Adicionar `permissions?: string[]` na interface `User`.
2.  **`src/app/admin/usuarios/page.tsx`**
    *   Criar um objeto/array constante definindo as permissões disponíveis (ex: `const availablePermissions = [{ id: 'products.read', label: 'Ver Produtos' }, ...]`).
    *   No estado `newUser` e `editingUser`, adicionar um array `permissions: []`.
    *   **Nos Modais (Adicionar e Editar):** Criar uma seção de Checkboxes renderizada através de um `.map()` do `availablePermissions`.
    *   **Lógica de UI:** Essa seção de checkboxes só deve aparecer (ou ficar habilitada) se o usuário selecionado no `<select>` de função **NÃO** for Administrador (já que admins têm todas as permissões por padrão).
    *   Ao marcar/desmarcar um checkbox, atualizar o array `permissions` do estado correspondente.
    *   Garantir que as chamadas da API (`userService.create` e `userService.update`) enviem esse novo array no body.
3.  **Restrição Visual (Opcional, mas recomendado)**
    *   Nos componentes de listagem (ex: página de Produtos), ler o token JWT decodificado (ou as variáveis do localStorage) para esconder os botões de "Adicionar/Editar/Excluir" caso o usuário logado não possua a permissão `.write` correspondente.
