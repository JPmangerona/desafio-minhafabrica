# Rule: Nosso Projeto — Contexto e Visão (Always On)

> Este é o contexto canônico do projeto. Leia antes de qualquer decisão arquitetural ou de produto.
> Cada linha de código deve servir esta visão.

---

## O Que é Este Sistema

**Motor de Vitrine Digital e Gestão de Inventário Desacoplado.**

Um ecossistema de e-commerce modular projetado para ser vendido como **Produto SaaS**.
Não é um CRUD simples — é uma plataforma com dois domínios de negócio distintos e independentes
que compartilham o mesmo Backend, mas possuem jornadas, layouts e audiências completamente diferentes.

---

## Os Dois Grandes Módulos

### 🛠️ Módulo Admin (Painel do Lojista)
- **Audiência:** O lojista (role `admin`)
- **Objetivo:** Gestão total do negócio — produtos, pedidos, usuários, relatórios
- **Acesso:** Restrito, autenticação JWT obrigatória com `role: admin`
- **Funcionalidades Atuais:**
  - Dashboard com KPIs (total de produtos, pedidos, usuários)
  - CRUD completo de Produtos (nome, descrição, preço, estoque, categoria, imagem)
  - CRUD completo de Usuários
  - Gestão de Pedidos

### 🛍️ Módulo Vitrine (Storefront do Cliente)
- **Audiência:** O cliente final (anônimo ou autenticado com `role: client`)
- **Objetivo:** Catálogo público e experiência de compra
- **Acesso:** Público por padrão. Checkout exige autenticação.
- **Funcionalidades Atuais:**
  - Home com catálogo de produtos
  - Página de detalhe de produto `/produto/[id]`
  - Carrinho de compras (client-side)
  - Checkout com autenticação (ponto de inflexão: anônimo → cliente)

---

## Os 3 Casos de Uso Comerciais (Roadmap de Venda)

```
Caso 1 — SaaS Padrão
  Lojista usa: Admin + Vitrine padrão
  Fonte de dados: MongoDB local
  Status: ✅ Implementar agora

Caso 2 — White Label
  Lojista usa: Admin (meu) + Vitrine (customizada para ele)
  Fonte de dados: MongoDB local
  Status: 🔄 Arquitetura preparada, implementação futura

Caso 3 — Enterprise / Integrado
  Lojista usa: Vitrine como interface de vendas
  Fonte de dados: ERP externo via API (não meu banco)
  Status: 🔄 Repository Pattern garante essa troca sem refatorar o Service
```

---

## Por Que Esta Arquitetura Existe

Cada decisão técnica responde a uma dessas razões:

| Decisão | Motivo |
|---------|--------|
| Route Groups `(admin)` / `(storefront)` | Separar os dois domínios para poder mover para repos distintos no futuro |
| Repository Pattern no Backend | Trocar MongoDB por ERP (Caso 3) sem tocar nos Services |
| Camada `services/` isolada no Frontend | Copiar apenas essa pasta ao separar Admin e Vitrine |
| `middleware.ts` centralizado | Única fonte de verdade para autorização de rotas no Frontend |
| Operações atômicas de estoque | Suportar alta concorrência sem race conditions |
| Zod em todos os DTOs | Garantir contrato de dados explícito entre Frontend e Backend |
| Roles `admin` / `client` | RBAC preparado para multi-tenant futuro |

---

## Contexto de Negócio da Entrevista

Este projeto é um **Desafio Técnico** para o cargo de **Assistente de Desenvolvimento** na **MinhaFabrica**.

- **Prazo:** 19 de Abril de 2026 às 23:59
- **E-mail de entrega:** caio.basdao@minhafabrica.com
- **O código deve ser explicável em entrevista** — nada de "caixa-preta"
- **IA é permitida**, mas o desenvolvedor deve dominar o que foi gerado

### O que demonstra senioridade neste projeto:
1. Separação clara de responsabilidades (Controller → Service → Repository)
2. Operações atômicas no MongoDB (`$inc` no estoque)
3. RBAC com middleware reutilizável
4. Repository Pattern com interface TypeScript
5. Frontend desacoplado do Backend (pode ter URLs diferentes)
6. Testes unitários nas features críticas (estoque, auth, pedidos)

---

## Stack Decision Log (Por que escolhemos cada tecnologia)

| Tecnologia | Decisão | Motivo |
|-----------|---------|--------|
| MongoDB | Obrigatório | Pedido pelo desafio + schema flexível para e-commerce |
| Mongoose | Obrigatório | ODM com validação e hooks |
| Express.js | Obrigatório | Controle total sobre a arquitetura (sem magic) |
| Next.js App Router | Obrigatório | SSR nativo para SEO da Vitrine + Server Components |
| TypeScript | Obrigatório | Contrato de tipos entre Frontend/Backend |
| Tailwind CSS | Obrigatório | Velocidade de desenvolvimento + consistência |
| Zod | Escolha nossa | Validação type-safe compartilhável entre FE e BE |
| JWT | Obrigatório | Stateless, ideal para Frontend/Backend separados |
| bcryptjs | Padrão de mercado | Hash seguro de senhas com salt configurável |

---

## Glossário do Projeto

| Termo | Significado |
|-------|-------------|
| **Vitrine** | O storefront público (domínio do cliente) |
| **Admin** | O painel de gestão (domínio do lojista) |
| **Ponto de inflexão** | Momento do checkout onde anônimo vira cliente autenticado |
| **DTO** | Data Transfer Object — schema Zod que valida entrada de dados |
| **Repository** | Camada que fala com o banco de dados (MongoDB via Mongoose) |
| **Service** | Camada de lógica de negócio (agnóstica ao banco) |
| **AppError** | Classe de erro customizada com `statusCode` e `message` |
| **Atômico** | Operação que não pode ser interrompida (ex: `$inc` no estoque) |
