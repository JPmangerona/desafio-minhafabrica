# Rule: Stack Tecnológica — MinhaFabrica (Always On)

> Esta regra define a stack obrigatória para o Desafio Técnico da MinhaFabrica.
> Nunca sugira alternativas fora das tecnologias listadas abaixo sem aprovação explícita do usuário.

## Backend

- **Runtime:** Node.js (versão LTS mais recente) + TypeScript
- **Framework:** Express.js
- **Banco de Dados:** MongoDB com Mongoose (ODM)
- **Autenticação:** JWT (jsonwebtoken) + bcryptjs (hash de senhas)
- **Validação de Entrada:** Zod (obrigatório — não usar express-validator)
- **Variáveis de Ambiente:** dotenv
- **CORS:** cors middleware (configurado para suportar Frontend em URL diferente)

### Arquitetura do Backend — Modular/Hexagonal (OBRIGATÓRIA)

```
backend/src/
├── @types/             # Extensões de tipos globais (ex: req.user)
├── config/             # Conexão MongoDB, variáveis de ambiente
├── shared/
│   ├── middlewares/    # authMiddleware.ts (valida JWT + Role)
│   ├── errors/         # AppError.ts (erro com statusCode + message)
│   └── utils/          # Helpers e validadores reutilizáveis
└── modules/
    ├── auth/           # Login + geração de Token JWT
    ├── users/
    │   ├── user.controller.ts
    │   ├── user.service.ts     # LÓGICA DE NEGÓCIO AQUI
    │   ├── user.repository.ts  # Fala com o MongoDB
    │   ├── user.model.ts       # Schema Mongoose
    │   ├── user.routes.ts
    │   └── dtos/               # Schemas Zod
    ├── products/       # Mesma estrutura
    └── orders/         # Mesma estrutura
```

> **Lei de Ouro:** O `service` nunca importa o `model` diretamente. Sempre usa o `repository`.
> O `controller` nunca contém lógica de negócio. Apenas recebe req/res e chama o `service`.

## Frontend

- **Framework:** Next.js 14+ com App Router
- **Linguagem:** TypeScript (obrigatório — nunca usar `any`)
- **Estilização:** Tailwind CSS
- **Requisições HTTP:** Axios com instância configurada em `services/api.ts`
- **Formulários:** React Hook Form + Zod
- **Estado Global:** React Context API ou Zustand (para auth e carrinho)

### Arquitetura do Frontend — Route Groups (OBRIGATÓRIA)

```
src/
├── app/
│   ├── (admin)/             # Domínio do Lojista
│   │   ├── layout.tsx       # Layout com Sidebar (Dashboard)
│   │   ├── dashboard/
│   │   └── produtos/
│   ├── (storefront)/        # Domínio do Cliente
│   │   ├── layout.tsx       # Layout com Navbar e Carrinho
│   │   ├── page.tsx         # Home da Vitrine
│   │   └── produto/[id]/
│   ├── login/               # Autenticação compartilhada
│   └── middleware.ts        # Proteção de rotas por Role
├── components/
│   ├── admin/               # Componentes exclusivos do Painel Admin
│   ├── storefront/          # Componentes exclusivos da Vitrine
│   └── ui/                  # Componentes base reutilizáveis
├── services/
│   ├── api.ts               # Instância Axios com BaseURL e interceptors
│   ├── product.service.ts
│   └── order.service.ts
└── hooks/                   # useAuth, useCart
```

> **Lei de Ouro:** Chamadas de API SEMPRE em `services/`. Nunca chamar `axios` diretamente dentro de um componente ou page.

## Regras de Código

1. **TypeScript:** Sempre tipar props, retornos de função e payloads de API. Nunca `any`.
2. **Nomenclatura:** `camelCase` variáveis/funções, `PascalCase` componentes/classes, `UPPER_SNAKE_CASE` constantes.
3. **Async/Await:** Sempre com `try/catch`. Nunca `.then()` sem tratamento de erro.
4. **Componentes:** Sempre funcionais. Zero class components.
5. **Variáveis de Ambiente:** Nunca expor secrets no frontend. `NEXT_PUBLIC_` apenas para valores públicos.
6. **Commits:** Mensagens em português: `feat:`, `fix:`, `refactor:`, `docs:`, `chore:`.
7. **Zod:** Toda entrada de dados no backend DEVE ter um schema Zod em `dtos/`. Nunca confiar no dado cru do `req.body`.
