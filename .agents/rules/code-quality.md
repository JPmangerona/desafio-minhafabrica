# Rule: Qualidade de Código — MinhaFabrica (Always On)

> Padrões de qualidade obrigatórios. O código deve ser explicável em entrevista.
> Demonstrar senioridade com RBAC, operações atômicas e Clean Architecture.

## API REST — Padrões

- Sempre usar status HTTP corretos:
  - `200` OK, `201` Created, `400` Bad Request, `401` Unauthorized,
    `403` Forbidden, `404` Not Found, `500` Internal Server Error
- Respostas JSON **sempre** no formato:
  ```json
  { "success": true, "data": {} }
  { "success": false, "message": "Descrição do erro" }
  ```
- Rotas REST com prefixo `/api/v1/`:
  - `GET    /api/v1/produtos`
  - `POST   /api/v1/produtos`
  - `GET    /api/v1/produtos/:id`
  - `PUT    /api/v1/produtos/:id`
  - `DELETE /api/v1/produtos/:id`

## Tratamento de Erros — Padrão AppError

- Toda a applicação usa a classe `AppError` de `shared/errors/AppError.ts`:
  ```typescript
  class AppError extends Error {
    constructor(
      public message: string,
      public statusCode: number = 400
    ) { super(message); }
  }
  ```
- O middleware global em `app.ts` captura todos os erros e formata a resposta.
- Nunca jogar `new Error()` diretamente dos controllers/services. Sempre `AppError`.

## Autenticação JWT + RBAC

- Roles obrigatórias: `'admin'` e `'client'`
- Token armazenado no frontend: `httpOnly cookie` (preferência) ou `localStorage`
- Header obrigatório: `Authorization: Bearer <token>`
- Middleware de auth deve:
  1. Verificar se o token existe e é válido
  2. Decodificar o payload e anexar em `req.user`
  3. Verificar se a role do usuário permite o acesso à rota
- Expiração padrão: `7d` (configurável via `JWT_EXPIRES_IN` no `.env`)
- Rotas da `(storefront)` são **públicas** exceto `/checkout` e `/meus-pedidos`
- Rotas da `(admin)` exigem role `admin` obrigatoriamente

## Estoque — Operações Atômicas (OBRIGATÓRIO)

> Este ponto demonstra senioridade. NÃO usar busca + save separados para atualizar estoque.

```typescript
// ❌ ERRADO — Race condition em alta concorrência
const product = await Product.findById(id);
product.stock -= quantity;
await product.save();

// ✅ CORRETO — Operação atômica no MongoDB
await Product.findOneAndUpdate(
  { _id: id, stock: { $gte: quantity } }, // Garante que há estoque
  { $inc: { stock: -quantity } },
  { new: true }
);
```

## Mongoose — Boas Práticas

- Sempre `timestamps: true` nos schemas
- `select: false` em campos sensíveis (`password`)
- Usar `lean()` em queries de leitura que não precisam de métodos Mongoose (performance)
- Validar campos no Zod (entrada) E no Schema (persistência) — duas camadas de defesa

## Segurança

- Hash de senha: `bcryptjs` com `saltRounds: 12`
- Nunca retornar `password` nas respostas (usar `.select('-password')`)
- Validar e sanitizar inputs via Zod antes de qualquer operação
- variáveis de ambiente para todos os secrets
- CORS configurado com `origin` explícito (não `*` em produção)

## UI/UX

- Loading states em TODAS as requisições assíncronas
- Mensagens de erro claras e em português
- Confirmação modal antes de qualquer DELETE
- Interface responsiva (mobile-first com Tailwind)
- Feedback visual após ações (toast de sucesso/erro)
- Vitrine (storefront): SEO-first — usar `generateMetadata()` do Next.js nas páginas de produto
