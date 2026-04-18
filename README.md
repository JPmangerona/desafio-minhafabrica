# Project Structure Overview

## Frontend (`frontend/src`)

```
src/
├─ app/                     # Next.js app routes (pages)
│   ├─ admin/               # Área administrativa
│   │   ├─ catalogos/
│   │   ├─ produtos/
│   │   ├─ usuarios/
│   │   └─ dashboard/
│   ├─ catalogos/           # Página pública de catálogo por ID
│   ├─ destaques/           # Página de destaques
│   └─ page.tsx             # Página inicial (storefront)
├─ components/              # Componentes reutilizáveis
│   ├─ layout/              # Layouts (Header, Sidebar, etc.)
│   └─ ui/                  # UI primitives (botões, cards, modais)
├─ services/                # Camada de services (API wrappers)
│   ├─ api.ts                # Configuração Axios + interceptors
│   ├─ auth.service.ts
│   ├─ category.service.ts
│   ├─ product.service.ts
│   ├─ user.service.ts
│   └─ dashboard.service.ts
├─ types/                    # Tipos TypeScript compartilhados
│   └─ index.ts
├─ utils/                    # Funções auxiliares (helpers, formatters)
│   └─ helpers.ts
└─ styles/                   # Estilos globais e tema
    ├─ globals.css
    └─ theme.ts
```

## Backend (`backend/src`)

```
src/
├─ @types/                  # Declarações de tipos customizados (e.g., Express Request)
├─ config/                  # Configurações (ex.: database, multer)
├─ controllers/             # Controllers MVC
├─ middleware/              # Middlewares genéricos (ex.: logger)
├─ models/                  # Schemas Mongoose
├─ repositories/            # Acesso ao banco de dados
├─ routes.ts                 # Definição de rotas (inclui prefixo /api/v1)
├─ services/                # Camada de serviço (lógica de negócio)
├─ shared/                  # Código compartilhado
│   ├─ errors/               # Classes de erro (AppError)
│   └─ middlewares/          # Middlewares de autenticação/autorização
├─ scripts/                 # Scripts auxiliares (ex.: createAdmin)
└─ utils/                   # Utilitários genéricos (helpers, validators)
```

## README

Este documento descreve a estrutura de pastas adotada para manter o código organizado, facilitando a navegação e a manutenção tanto no frontend quanto no backend. Não foram alterados arquivos de implementação; apenas foram criados diretórios auxiliares e um `README.md` central para documentação.

---

*Obs.: Caso deseje mover arquivos para as novas pastas, lembre‑se de atualizar os caminhos de importação correspondentes.*
