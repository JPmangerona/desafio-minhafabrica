# Análise de Conformidade - Desafio Técnico MinhaFabrica

Este documento detalha o estado atual do projeto em relação aos requisitos solicitados no PDF do processo seletivo (Londrina/PR — Abril 2026).

## 🚀 1. Resumo de Atendimento (Status Overall)
O projeto está em um estado **avançado**, com a stack tecnológica correta e a arquitetura solicitada (C-S-R-M) bem implementada. As funcionalidades principais de login e CRUDs estão operacionais, utilizando modais conforme o requisito mandatório.

---

## ✅ 2. O que JÁ FOI FEITO (Sucessos)

### 🏗️ Arquitetura e Stack
- **Stack Correta:** Node.js/Express/Mongoose no Backend e Next.js/TS/Tailwind/Axios no Frontend.
- **Arquitetura C-S-R-M:** Implementada de forma consistente em todo o Backend.
- **Versionamento de API:** Rotas iniciam com `/api/v1`.
- **Modais:** O Frontend utiliza modais para criação/edição em vez de páginas separadas (Requisito 2.2).

### 🔑 Autenticação & Segurança
- **Login:** Autenticação JWT funcionando.
- **Middleware:** Existência de `authenticated` e `authorized` no backend.
- **Hashing:** Uso de `bcrypt` para senhas de usuários.

### 📊 Funcionalidades
- **Dashboard:** Página com contadores de usuários e produtos.
- **CRUD Usuários:** Listagem em tabela, criação, edição e exclusão (com `window.confirm`).
- **CRUD Produtos:** Listagem em tabela, criação, edição e exclusão.
- **Diferenciais:** Upload de imagens integrado e busca/filtro global.

---

## ⚠️ 3. O que está ERRADO (Correções Necessárias)

| Item | Descrição | Impacto |
| :--- | :--- | :--- |
| **Rota DELETE Usuário** | No `routes.ts`, a rota está como `/api/v1/users` (sem `:id`). O PDF exige `/api/v1/users/:id`. | Inconformidade com a especificação da API. |
| **Proteção de Rotas (Front)** | O `admin/layout.tsx` não verifica se o usuário está logado antes de renderizar. | Falha de segurança/UX (deveria redirecionar para `/login`). |
| **Hardcoded URLs** | Arquivos como `destaques/page.tsx` usam `http://localhost:5000` diretamente em vez de variáveis de ambiente. | Quebrará no deploy em produção. |
| **Inconsistência de Tipos** | Algumas rotas importam arquivos `.js` dentro de arquivos `.ts` (ex: `routes.ts`), o que é confuso no desenvolvimento. | Manutenibilidade. |

---

## ❌ 4. O que NÃO FOI FEITO (Pendências)

- **README Completo:** O README atual não contém as instruções detalhadas de instalação, configuração de `.env` e como rodar (Requisito 3.1).
- **Feedback de Erro no Login:** Validar se o feedback visual para "credenciais inválidas" está sendo exibido de forma amigável no formulário.
- **Deploy:** A aplicação ainda não está online (Requisito 3.2).
- **Script de Seed:** Embora exista um script `createAdmin.ts`, não há uma rota `/api/v1/auth/seed` ou instrução clara de como popular o admin inicial via comando npm.

---

## ❓ 5. Perguntas para o Desenvolvedor

Para prosseguirmos com as correções e finalização, como você prefere que eu implemente os seguintes pontos?

1.  **Proteção de Rotas:** Deseja que eu crie um `Middleware` do Next.js ou que a verificação seja feita no `AdminLayout` usando um hook customizado?
2.  **Deploy:** Você já tem contas configuradas na Vercel (Front) e Render/Railway (Back)? Gostaria que eu preparasse os arquivos de configuração necessários?
3.  **README:** Posso gerar um README profissional com base no que analisei, ou você tem instruções específicas de ambiente que devo incluir?
4.  **Rota DELETE:** Posso ajustar as rotas do backend para seguirem **exatamente** o padrão REST solicitado (`/api/v1/users/:id`)?
5.  **Validações:** Deseja que eu adicione uma biblioteca de validação (ex: Zod) ou prefere manter as validações manuais atuais para manter o código mais "limpo"?

---

### Próximos Passos Recomendados:
1.  **Corrigir a rota DELETE de usuários.**
2.  **Centralizar as URLs da API** no Frontend via `.env`.
3.  **Implementar o Auth Guard** no layout de admin do Frontend.
4.  **Finalizar a documentação (README.md).**
