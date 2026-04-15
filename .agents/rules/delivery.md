# Rule: Requisitos de Entrega — MinhaFabrica (Always On)

> Regras críticas de entrega. Prazo: **19 de Abril de 2026 às 23:59**.

## Checklist de Entrega

Antes de finalizar, verificar:

- [ ] Repositório **público** no GitHub
- [ ] `README.md` completo com:
  - Descrição do projeto
  - Tecnologias utilizadas
  - Pré-requisitos
  - Passo a passo para rodar localmente (backend e frontend)
  - Variáveis de ambiente necessárias (`.env.example`)
  - Link do deploy
  - Credenciais de admin para teste
- [ ] Deploy do **backend** funcionando (Render ou Railway)
- [ ] Deploy do **frontend** funcionando (Vercel)
- [ ] Credenciais de administrador criadas e testadas
- [ ] E-mail de entrega enviado para: `caio.basdao@minhafabrica.com`

## E-mail de Entrega

O e-mail deve conter:
1. Link do repositório GitHub
2. Link da aplicação em produção
3. Login e senha do usuário admin para avaliação

## Funcionalidades Obrigatórias (não negociáveis)

- [x] Tela de Login com JWT
- [x] Dashboard com contadores (total de usuários e total de produtos)
- [x] CRUD completo de Usuários (listar, criar, editar, deletar)
- [x] CRUD completo de Produtos (listar, criar, editar, deletar)
  - Campos obrigatórios: nome, descrição, preço, estoque, categoria
- [x] Proteção de rotas (autenticação obrigatória)
- [x] Validação de formulários (frontend e backend)
- [x] Interface responsiva

## Diferenciais (pontos extras)

- Paginação nas listagens
- Filtros e busca
- Upload de imagem para produtos
- Testes automatizados
