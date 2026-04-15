# Rule: Arquitetura de Negócio — Motor de Vitrine Digital (Always On)

> Este projeto é um **Ecossistema de E-commerce Modular** desenhado como ativo comercial (SaaS/Produto).
> Toda decisão arquitetural deve suportar os 3 casos de uso sem refatoração massiva.

## Os 3 Casos de Uso (Roadmap Comercial)

| Caso | Admin | Vitrine | Fonte de Dados |
|------|-------|---------|----------------|
| **1 - SaaS Padrão** | ✅ Meu Admin | ✅ Minha Vitrine | MongoDB local |
| **2 - White Label** | ✅ Meu Admin | 🎨 Vitrine customizada | MongoDB local |
| **3 - Enterprise** | ✅ Meu Admin | 🔌 Vitrine integrada | ERP externo via API |

## Os 2 Domínios do Sistema

### (admin) — Painel do Lojista
- Acesso restrito: **role `admin` obrigatória**
- Layout: Sidebar fixa + área de conteúdo
- Funcionalidades: Dashboard, CRUD Produtos, Gestão Usuários, Gestão Pedidos
- Autenticação: JWT no header/cookie verificado pelo `middleware.ts`

### (storefront) — Vitrine do Cliente
- Acesso **público** por padrão (SEO first)
- Layout: Navbar + Carrinho flutuante
- Ponto de inflexão: `/checkout` → usuário anônimo vira cliente autenticado (role `client`)
- SEO: Usar `generateMetadata()` em todas as páginas de produto

## Regras Arquiteturais Obrigatórias

### Backend — Agnosticismo de Fonte de Dados

O `Service` deve ser agnóstico à fonte de dados para suportar o Caso 3 (ERP):

```typescript
// ✅ CORRETO: Service depende de uma interface, não do Mongoose diretamente
interface IProductRepository {
  findAll(): Promise<Product[]>;
  findById(id: string): Promise<Product | null>;
  create(data: CreateProductDTO): Promise<Product>;
  update(id: string, data: UpdateProductDTO): Promise<Product | null>;
  delete(id: string): Promise<void>;
}

class ProductService {
  constructor(private repository: IProductRepository) {}
  // Lógica de negócio aqui — sem import de Model do Mongoose
}
```

- `MongoProductRepository` implementa `IProductRepository` para o Caso 1 e 2
- `ErpProductRepository` implementará a mesma interface para o Caso 3 (futuro)

### Frontend — Camada de Services Isolada

A camada `services/` deve ser o único ponto de contato com a API:

```typescript
// services/product.service.ts
export const productService = {
  getAll: () => api.get<Product[]>('/produtos'),
  getById: (id: string) => api.get<Product>(`/produtos/${id}`),
  create: (data: CreateProductDTO) => api.post<Product>('/produtos', data),
  update: (id: string, data: UpdateProductDTO) => api.put(`/produtos/${id}`, data),
  delete: (id: string) => api.delete(`/produtos/${id}`),
};
```

> Motivo: Se Admin e Vitrine forem separados em repos distintos, apenas `services/` precisa ser copiado/ajustado.

### Middleware.ts — O Cérebro da Separação

O `middleware.ts` do Next.js é responsável por:
1. Redirecionar `/admin/**` para `/login` se não houver token válido com `role: admin`
2. Redirecionar `/checkout` para `/login` se não houver token com `role: client`
3. Redirecionar usuário já logado de `/login` para seu domínio correto

```typescript
// Lógica de decisão do middleware.ts
if (path.startsWith('/admin')) → exige role 'admin'
if (path === '/checkout')     → exige role 'client' ou 'admin'
if (path === '/login' && autenticado) → redireciona para domínio correto
```

## Separação de Componentes

- `components/admin/` → NUNCA importar em páginas da `(storefront)`
- `components/storefront/` → NUNCA importar em páginas da `(admin)`
- `components/ui/` → Pode ser usado por qualquer domínio

## Design da Vitrine (Storefront)

- **Performance:** Priorizar `Server Components` no Next.js para SEO e velocidade
- **Carrinho:** Estado gerenciado via Context API ou Zustand (client-side)
- **Checkout:** Transição suave de anônimo → cliente autenticado
- **Imagens:** Usar `next/image` com `priority` nas imagens acima do fold

## Escalabilidade Futura (Pensar Hoje, Implementar Depois)

Ao tomar decisões de código, sempre perguntar:
- "Se amanhã o Admin virar um repositório separado, essa mudança quebraria algo?"
- "Se o Caso 3 precisar de um `ErpRepository`, o Service já está preparado para receber isso?"
- "Essa decisão amarra a Vitrine ao MongoDB, ou ela é agnóstica?"
