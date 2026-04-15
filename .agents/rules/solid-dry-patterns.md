# Rule: Boas Práticas — SOLID, DRY, Clean Code (Always On)

> Todo o código deste projeto deve demonstrar senioridade técnica.
> Estes princípios não são opcionais — são o padrão mínimo de qualidade.

---

## SOLID no Contexto deste Projeto

### S — Single Responsibility Principle (SRP)

Cada arquivo/classe tem **uma única razão para mudar**.

```typescript
// ❌ ERRADO: Controller fazendo lógica de negócio
class ProductController {
  async create(req, res) {
    const existing = await Product.findOne({ name: req.body.name });
    if (existing) throw new AppError('Produto já existe', 409);
    await Product.create(req.body); // direto no Model!
    res.status(201).json({ success: true });
  }
}

// ✅ CORRETO: Responsabilidades separadas
class ProductController {
  constructor(private service: ProductService) {}
  async create(req: Request, res: Response) {
    const dto = CreateProductSchema.parse(req.body); // valida input
    const product = await this.service.create(dto);  // delega lógica
    res.status(201).json({ success: true, data: product });
  }
}
```

**Aplicação no projeto:**
- `controller` → apenas HTTP (req/res, status codes)
- `service` → apenas lógica de negócio
- `repository` → apenas queries ao banco
- `dto/` → apenas validação de entrada

### O — Open/Closed Principle (OCP)

Aberto para extensão, fechado para modificação.

```typescript
// ✅ CORRETO: IProductRepository pode ser implementado por Mongo ou ERP
// sem modificar o ProductService (ver architecture.md)
interface IProductRepository { /* ... */ }
class MongoProductRepository implements IProductRepository { /* ... */ }
class ErpProductRepository implements IProductRepository { /* ... */ }
// ProductService não muda ao trocar de MongoRepository para ErpRepository
```

### L — Liskov Substitution Principle (LSP)

Qualquer `MongoProductRepository` deve poder ser substituído por `ErpProductRepository`
sem quebrar o `ProductService`.

> **Aplicação prática:** Sempre que criar um Repository, implementar a interface `IRepository<T>` completa.

### I — Interface Segregation Principle (ISP)

Interfaces pequenas e específicas:

```typescript
// ❌ ERRADO: Interface gigante que força implementar métodos desnecessários
interface IRepository<T> {
  findAll, findById, create, update, delete,
  findByCategory, findByPriceRange, aggregateSales // ← muito específico
}

// ✅ CORRETO: Interface base + extensões específicas
interface IBaseRepository<T> {
  findAll(): Promise<T[]>;
  findById(id: string): Promise<T | null>;
  create(data: Partial<T>): Promise<T>;
  update(id: string, data: Partial<T>): Promise<T | null>;
  delete(id: string): Promise<void>;
}

interface IProductRepository extends IBaseRepository<Product> {
  findByCategory(category: string): Promise<Product[]>;
  decrementStock(id: string, quantity: number): Promise<Product | null>;
}
```

### D — Dependency Inversion Principle (DIP)

Módulos de alto nível não dependem de módulos de baixo nível. Ambos dependem de abstrações.

```typescript
// ❌ ERRADO: Service acopla diretamente ao Mongoose
import ProductModel from '../models/product.model';
class ProductService {
  async findAll() { return ProductModel.find(); }
}

// ✅ CORRETO: Service depende da interface (abstração)
class ProductService {
  constructor(private repository: IProductRepository) {}
  async findAll() { return this.repository.findAll(); }
}
```

---

## DRY (Don't Repeat Yourself)

### Evitar Duplicação de Lógica

```typescript
// ❌ ERRADO: Validação de "produto existe?" repetida em update e delete
async update(id, data) {
  const product = await this.repository.findById(id);
  if (!product) throw new AppError('Produto não encontrado', 404);
  // ...
}
async delete(id) {
  const product = await this.repository.findById(id);
  if (!product) throw new AppError('Produto não encontrado', 404);
  // ...
}

// ✅ CORRETO: Extrair para método privado do service
private async findOrFail(id: string): Promise<Product> {
  const product = await this.repository.findById(id);
  if (!product) throw new AppError('Produto não encontrado', 404);
  return product;
}
async update(id, data) { const product = await this.findOrFail(id); }
async delete(id)       { await this.findOrFail(id); }
```

### Schemas Zod Reutilizáveis

```typescript
// dtos/product.dto.ts — única fonte de verdade para validação
export const CreateProductSchema = z.object({
  name: z.string().min(3),
  price: z.number().positive('Preço deve ser positivo'),
  stock: z.number().int().min(0, 'Estoque não pode ser negativo'),
  category: z.string().min(1),
});

export const UpdateProductSchema = CreateProductSchema.partial(); // reutiliza!
export type CreateProductDTO = z.infer<typeof CreateProductSchema>;
export type UpdateProductDTO = z.infer<typeof UpdateProductSchema>;
```

### Tipos TypeScript Compartilhados

- Nunca duplicar types entre Frontend e Backend na mesma entidade.
- Considerar uma pasta `shared/types/` ou um pacote compartilhado se os repos se separarem.

---

## Clean Code — Regras Práticas

### Nomenclatura Clara

```typescript
// ❌ ERRADO
const u = await repo.find(id);
const p = u.price * 0.9;
async function process(data: any) { }

// ✅ CORRETO
const user = await userRepository.findById(userId);
const discountedPrice = product.price * (1 - DISCOUNT_RATE);
async function applyDiscount(product: Product, discountRate: number): Promise<number> { }
```

### Funções Pequenas e Focadas

- Máximo de **20 linhas** por função. Se passar, extrair.
- Uma função = uma ação. Nome deve ser um verbo: `createProduct`, `validateStock`, `generateToken`.

### Evitar Magic Numbers e Strings

```typescript
// ❌ ERRADO
if (user.role === 'admin') { }
const token = jwt.sign(payload, 'secret123', { expiresIn: '7d' });

// ✅ CORRETO
const ROLES = { ADMIN: 'admin', CLIENT: 'client' } as const;
const JWT_SECRET = process.env.JWT_SECRET!;
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN ?? '7d';
if (user.role === ROLES.ADMIN) { }
```

### Early Return (Evitar Else Desnecessário)

```typescript
// ❌ ERRADO: Aninhamento desnecessário
async function validateStock(id, quantity) {
  const product = await repo.findById(id);
  if (product) {
    if (product.stock >= quantity) {
      return true;
    } else {
      throw new AppError('Estoque insuficiente', 409);
    }
  } else {
    throw new AppError('Produto não encontrado', 404);
  }
}

// ✅ CORRETO: Early returns
async function validateStock(id: string, quantity: number): Promise<Product> {
  const product = await repo.findById(id);
  if (!product) throw new AppError('Produto não encontrado', 404);
  if (product.stock < quantity) throw new AppError('Estoque insuficiente', 409);
  return product;
}
```

---

## Padrões de Design Utilizados no Projeto

| Padrão | Onde | Implementação |
|--------|------|---------------|
| **Repository Pattern** | Backend | `IProductRepository` + `MongoProductRepository` |
| **Service Layer** | Backend | `product.service.ts` — lógica de negócio isolada |
| **DTO Pattern** | Backend | `dtos/product.dto.ts` com Zod |
| **Middleware Chain** | Backend | `authenticate` → `authorize` → Controller |
| **Factory / DI simples** | Backend | Service recebe Repository via construtor |
| **Custom Hook** | Frontend | `useAuth`, `useCart` encapsulam lógica de estado |
| **Service Layer** | Frontend | `services/product.service.ts` encapsula chamadas HTTP |
| **Compound Components** | Frontend | Componentes `ui/` compostos e reutilizáveis |
