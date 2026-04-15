# Rule: Testes — Unitários e de Integração (Model Decision)

> **Quando aplicar:** Sempre que for criar ou modificar features classificadas como "perigosas" ou "críticas".
> Features críticas = aquelas que se falharem causam perda financeira, de dados ou de segurança.

---

## Features Que OBRIGATORIAMENTE Precisam de Testes

| Feature | Por Que é Perigosa | Prioridade |
|--------|-------------------|-----------|
| Decremento de estoque no pedido | Race condition em alta concorrência pode vender produto sem estoque | 🔴 Crítico |
| Autenticação JWT | Token inválido com acesso concedido = brecha de segurança | 🔴 Crítico |
| Autorização por Role | Admin acessando rota de client ou vice-versa | 🔴 Crítico |
| Criação de pedido | Pedido criado sem descontar estoque = inconsistência de dados | 🔴 Crítico |
| Hash de senha | Senha salva em texto puro = vazamento total em caso de breach | 🔴 Crítico |
| Validação de preço e estoque (Zod) | Preço negativo ou estoque negativo aceitos = inconsistência | 🟠 Alto |
| Cancelamento de pedido | Estoque não restaurado após cancelamento = perda financeira | 🟠 Alto |
| Remoção de produto com pedidos ativos | Produto deletado que aparece em pedidos históricos | 🟡 Médio |

---

## Stack de Testes

```
backend/
├── src/
│   └── modules/
│       └── products/
│           └── __tests__/
│               ├── product.service.test.ts    # Unitário (mock do repository)
│               └── product.routes.test.ts     # Integração (supertest)
```

**Dependências obrigatórias:**
- `jest` + `ts-jest` — runner e suporte TypeScript
- `supertest` — testes de integração da API HTTP
- `mongodb-memory-server` — MongoDB em memória (sem depender de banco real)

---

## Anatomia de um Teste Unitário (Service com Repository Mockado)

```typescript
// products/__tests__/product.service.test.ts
import { ProductService } from '../product.service';
import { IProductRepository } from '../product.repository';

// Mock do Repository — o Service não sabe que é falso
const mockRepository: jest.Mocked<IProductRepository> = {
  findAll: jest.fn(),
  findById: jest.fn(),
  create: jest.fn(),
  update: jest.fn(),
  delete: jest.fn(),
  decrementStock: jest.fn(),
};

const service = new ProductService(mockRepository);

describe('ProductService', () => {
  beforeEach(() => jest.clearAllMocks());

  // ✅ TESTE 1: Estoque insuficiente deve lançar AppError
  describe('decrementStock', () => {
    it('deve lançar AppError quando estoque for insuficiente', async () => {
      mockRepository.findById.mockResolvedValue({
        _id: '123', name: 'Produto X', stock: 2
      } as any);

      await expect(service.decrementStock('123', 5))
        .rejects.toMatchObject({ statusCode: 409, message: expect.stringContaining('Estoque') });
    });

    it('deve chamar decrementStock atômico quando estoque for suficiente', async () => {
      mockRepository.findById.mockResolvedValue({ _id: '123', stock: 10 } as any);
      mockRepository.decrementStock.mockResolvedValue({ _id: '123', stock: 7 } as any);

      await service.decrementStock('123', 3);

      expect(mockRepository.decrementStock).toHaveBeenCalledWith('123', 3);
    });
  });

  // ✅ TESTE 2: Produto não encontrado deve lançar 404
  describe('findById', () => {
    it('deve lançar AppError 404 quando produto não existir', async () => {
      mockRepository.findById.mockResolvedValue(null);

      await expect(service.findById('id-inexistente'))
        .rejects.toMatchObject({ statusCode: 404 });
    });
  });
});
```

---

## Anatomia de um Teste de Integração (Rota HTTP com Supertest)

```typescript
// auth/__tests__/auth.routes.test.ts
import request from 'supertest';
import app from '../../../app';

describe('POST /api/v1/auth/login', () => {
  it('deve retornar 401 para senha incorreta', async () => {
    const res = await request(app)
      .post('/api/v1/auth/login')
      .send({ email: 'admin@test.com', password: 'senhaErrada' });

    expect(res.status).toBe(401);
    expect(res.body.success).toBe(false);
  });

  it('deve retornar token JWT para credenciais válidas', async () => {
    const res = await request(app)
      .post('/api/v1/auth/login')
      .send({ email: 'admin@test.com', password: 'Admin@123' });

    expect(res.status).toBe(200);
    expect(res.body.data).toHaveProperty('token');
  });

  it('deve retornar 400 para email inválido (Zod)', async () => {
    const res = await request(app)
      .post('/api/v1/auth/login')
      .send({ email: 'nao-e-um-email', password: '123' });

    expect(res.status).toBe(400);
  });
});
```

---

## Testes de Autorização por Role (RBAC)

```typescript
// products/__tests__/product.routes.test.ts
describe('DELETE /api/v1/produtos/:id', () => {
  it('deve retornar 401 sem token', async () => {
    const res = await request(app).delete('/api/v1/produtos/123');
    expect(res.status).toBe(401);
  });

  it('deve retornar 403 para role client tentando deletar produto', async () => {
    const clientToken = generateTestToken({ role: 'client' });
    const res = await request(app)
      .delete('/api/v1/produtos/123')
      .set('Authorization', `Bearer ${clientToken}`);

    expect(res.status).toBe(403);
  });

  it('deve retornar 200 para admin deletando produto', async () => {
    const adminToken = generateTestToken({ role: 'admin' });
    // ...
  });
});
```

---

## Testes de Validação Zod nos DTOs

```typescript
// products/__tests__/product.dto.test.ts
import { CreateProductSchema } from '../dtos/product.dto';

describe('CreateProductSchema', () => {
  it('deve rejeitar preço negativo', () => {
    const result = CreateProductSchema.safeParse({
      name: 'Produto', price: -10, stock: 5, category: 'Teste'
    });
    expect(result.success).toBe(false);
  });

  it('deve rejeitar estoque negativo', () => {
    const result = CreateProductSchema.safeParse({
      name: 'Produto', price: 10, stock: -1, category: 'Teste'
    });
    expect(result.success).toBe(false);
  });

  it('deve aceitar dados válidos', () => {
    const result = CreateProductSchema.safeParse({
      name: 'Produto', price: 10.99, stock: 100, category: 'Eletrônicos'
    });
    expect(result.success).toBe(true);
  });
});
```

---

## Regras de Teste

1. **Nomenclatura:** Use `describe` para agrupar por feature e `it` com frase em português descrevendo o comportamento esperado.
2. **Unitários:** Sempre mockar o Repository. O Service deve ser testável sem banco real.
3. **Integração:** Use `mongodb-memory-server` para não depender de banco externo.
4. **Cobertura mínima:** 80% nas features classificadas como 🔴 Crítico.
5. **AAA Pattern:** Cada teste segue Arrange → Act → Assert.
6. **Não testar implementação:** Testar comportamento (o que o código faz), não como ele faz.
7. **Helper de token:** Criar `test/helpers/generateTestToken.ts` para não duplicar lógica de JWT nos testes.

---

## Comandos

```bash
# Rodar todos os testes
npm test

# Com cobertura
npm test -- --coverage

# Apenas testes unitários
npm test -- --testPathPattern=service.test

# Watch mode durante desenvolvimento
npm test -- --watch
```
