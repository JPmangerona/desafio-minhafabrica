# Rule: Segurança e Escalabilidade — MinhaFabrica (Always On)

> Regras de segurança pensadas para um produto SaaS multi-tenant com dois perfis de usuário.

## RBAC (Role-Based Access Control)

### Roles do Sistema

| Role | Acesso | Criação |
|------|--------|---------|
| `admin` | Painel Admin completo + Vitrine | Apenas via seed ou por outro admin |
| `client` | Vitrine + Área de Cliente (pedidos) | Auto-registro ou via checkout |

### Como Implementar no Backend

```typescript
// shared/middlewares/authMiddleware.ts
export const authenticate = (req, res, next) => {
  // 1. Extrai token do header Authorization
  // 2. Verifica e decodifica o JWT
  // 3. Busca usuário no banco (confirma que ainda existe)
  // 4. Anexa em req.user
};

export const authorize = (...roles: Role[]) => (req, res, next) => {
  if (!roles.includes(req.user.role)) {
    throw new AppError('Acesso negado.', 403);
  }
  next();
};

// Uso nas rotas:
router.delete('/:id', authenticate, authorize('admin'), productController.delete);
```

## Segurança HTTP

- **CORS:** Em produção, definir `origin` explicitamente (nunca `*`)
  ```typescript
  cors({ origin: process.env.FRONTEND_URL, credentials: true })
  ```
- **Helmet.js:** Usar para definir headers de segurança HTTP
- **Rate Limiting:** Aplicar em rotas de auth (`/api/v1/auth/login`) para prevenir brute force
- **Sanitização:** Nunca inserir `req.body` diretamente no Mongoose sem passar pelo Zod primeiro

## Variáveis de Ambiente (`.env.example` obrigatório)

```env
# Backend
PORT=3001
MONGODB_URI=mongodb+srv://...
JWT_SECRET=sua_chave_super_secreta_aqui
JWT_EXPIRES_IN=7d
FRONTEND_URL=http://localhost:3000

# Frontend
NEXT_PUBLIC_API_URL=http://localhost:3001/api/v1
```

> **Regra:** Todo secret deve ter um placeholder no `.env.example`. Nunca commitar o `.env` real.

## Deploy e Infraestrutura

### Backend → Render ou Railway
- Configurar `PORT`, `MONGODB_URI`, `JWT_SECRET`, `FRONTEND_URL` nas variáveis de ambiente
- Usar MongoDB Atlas (não MongoDB local em produção)
- Script de seed para criar o admin inicial

### Frontend → Vercel
- Configurar `NEXT_PUBLIC_API_URL` apontando para o backend em produção
- Configurar domínio custom se disponível

### Separação de Repositórios (Futura)
- Backend e Frontend devem estar em **repositórios separados** no GitHub desde o início
- Isso facilita o Caso 2 (White Label) e o Caso 3 (Enterprise)

## Concorrência e Estoque

- Toda operação que reduz estoque DEVE usar operações atômicas do MongoDB (`$inc`)
- Verificar disponibilidade (`stock >= quantity`) na mesma query da atualização
- Em caso de estoque insuficiente, retornar `AppError` com `statusCode: 409 (Conflict)`

## Auditoria (Pensar Hoje)

- Todos os schemas devem ter `timestamps: true` (criação e atualização automáticas)
- Logs de erros críticos devem ser registrados (ao menos `console.error` estruturado por enquanto)
- Futuro: Implementar sistema de audit log para ações admin (quem deletou, quem editou)
