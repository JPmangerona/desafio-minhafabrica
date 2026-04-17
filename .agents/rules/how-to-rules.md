# Rule: Como Criar e Organizar Rules — Meta-Rule (Always On)

> Esta é a **meta-rule** do projeto: define o padrão de como todas as outras rules devem ser escritas.
> Sempre consultar este arquivo antes de criar ou editar qualquer rule neste workspace.

---

## O que é uma Rule?

Uma Rule é um arquivo Markdown que define **restrições e comportamentos** que o Agente deve seguir.
Rules não são sugestões — são **leis** dentro do contexto em que se aplicam.

- **Global Rules** (`~/.gemini/GEMINI.md`) → Aplicadas em **todos os workspaces**. Use para preferências pessoais (idioma, estilo de resposta, stack padrão).
- **Workspace Rules** (`.agents/rules/*.md`) → Aplicadas **apenas neste projeto**. Use para convenções específicas do repositório.

> **Regra de Ouro:** Se uma constraint é exclusiva deste projeto → Workspace Rule.
> Se é uma preferência pessoal que você quer em qualquer projeto → Global Rule.

---

## Modos de Ativação — Quando usar cada um

| Modo | Quando usar | Exemplo |
|------|-------------|---------|
| **Always On** | A regra deve ser seguida em **100% das interações** | Stack obrigatória, arquitetura, qualidade de código |
| **Model Decision** | A regra é relevante em **contextos específicos** | "Aplicar quando o agente for criar um novo módulo" |
| **Glob** | A regra se aplica a **arquivos específicos** | `src/**/*.service.ts` → padrão de services |
| **Manual** | A regra é ativada **só quando você menciona** com `@nome-da-rule` | Rules de troubleshooting, guias de deploy |

> **Atenção:** Evite excessos de `Always On`. Se tudo é Always On, o contexto fica poluído e o modelo perde foco. Use `Model Decision` para rules situacionais.

---

## Estrutura Padrão de uma Rule

Todo arquivo de rule neste workspace deve seguir esta estrutura:

```markdown
# Rule: [Nome Descritivo] — [Modo de Ativação]

> [Uma linha resumindo o propósito da rule]
> [Uma segunda linha com a restrição mais crítica, se houver]

---

## [Seção 1 — O que o Agente DEVE fazer]

- Regras positivas (o que fazer)

## [Seção 2 — O que o Agente NUNCA deve fazer]

- Restrições negativas (o que evitar)

## [Seção 3 — Exemplos de código, se aplicável]

```typescript
// ✅ CORRETO
// ❌ ERRADO
```
```

---

## Boas Práticas ao Escrever Rules

### ✅ Faça

1. **Seja específico e atômico.** Uma rule = um domínio de responsabilidade.
   - ✅ `tech-stack.md`, `security.md`, `code-quality.md`
   - ❌ `tudo-sobre-o-projeto.md` (muito genérico)

2. **Use exemplos de código.** Rules com `// ✅ CORRETO` e `// ❌ ERRADO` são muito mais eficazes.

3. **Priorize restrições negativas explícitas.** "Nunca use `any`" é mais forte que "prefira tipagem".

4. **Use `@mentions` para referenciar outros arquivos.**
   - `@tech-stack.md` → referencia outra rule do mesmo diretório
   - `@/src/modules/products/product.model.ts` → referencia um arquivo do projeto

5. **Mantenha o arquivo abaixo de 12.000 caracteres.** Esse é o limite do sistema.
   - Se passar, divida em duas rules menores com nomes complementares.

6. **Nomeie o arquivo com `kebab-case`** e um nome descritivo:
   - ✅ `code-quality.md`, `auth-patterns.md`, `api-contracts.md`
   - ❌ `regra1.md`, `misc.md`, `stuff.md`

### ❌ Nunca Faça

- **Nunca duplique conteúdo** entre rules. Se uma regra já existe em `security.md`, não a repita em `code-quality.md`. Use `@security.md` para referenciar.
- **Nunca escreva rules vagas** como "escreva código limpo" sem definir o que isso significa neste contexto.
- **Nunca misture domínios** em uma única rule. Stack e Segurança são rules separadas.
- **Nunca marque como `Always On`** uma rule que só é relevante para um tipo específico de tarefa.

---

## Inventário de Rules Deste Workspace

Mantenha este inventário atualizado ao criar novas rules:

| Arquivo | Modo | Responsabilidade |
|---------|------|-----------------|
| `our-project.md` | Always On | Contexto canônico — visão, módulos, glossário, decision log |
| `tech-stack.md` | Always On | Stack obrigatória, estrutura de pastas, arquitetura modular |
| `architecture.md` | Always On | 3 casos de uso, 2 domínios, Repository/Interface Pattern |
| `solid-dry-patterns.md` | Always On | SOLID, DRY, Clean Code, padrões de design do projeto |
| `code-quality.md` | Always On | Padrões REST, AppError, JWT, Mongoose, UI/UX |
| `security.md` | Always On | RBAC, CORS, variáveis de ambiente, operações atômicas |
| `testing.md` | Model Decision | Testes unitários e integração para features críticas |
| `delivery.md` | Always On | Checklist de entrega, prazo, funcionalidades obrigatórias |
| `local-workflow.md` | Always On | Fluxo padrão de execução local (sem Docker) — npm run dev direto na máquina |
| `how-to-rules.md` | Always On | Meta-rule — como criar e organizar rules (este arquivo) |

---

## Quando Criar uma Nova Rule vs. Editar uma Existente

**Criar nova rule** quando:
- O domínio é completamente novo (ex: "padrão de testes", "padrão de logging")
- O arquivo existente ficaria acima de 10.000 caracteres com a adição

**Editar rule existente** quando:
- A adição complementa o domínio já coberto pelo arquivo
- A mudança contradiz ou atualiza uma regra anterior

**Sempre** ao criar ou editar uma rule:
1. Atualizar o inventário neste arquivo (`how-to-rules.md`)
2. Verificar se há duplicação com rules existentes
3. Testar mentalmente: "O Agente entenderia o que NÃO fazer lendo só esta rule?"

---

## Sobre Workflows

Workflows são diferentes de Rules: eles definem **sequências de passos** para tarefas repetitivas.

- Ficam em `.agents/workflows/` e são invocados com `/nome-do-workflow`
- Use para: deploy, criação de módulos, revisão de código, seed de banco
- Um Workflow pode chamar outro: `/workflow-1` pode invocar `/workflow-2`
- Limite: 12.000 caracteres por arquivo

> **Quando devo criar um Workflow em vez de uma Rule?**
> - **Rule:** "Sempre faça X desta forma" (constraint permanente)
> - **Workflow:** "Quando eu pedir para criar um módulo, siga estes 5 passos" (processo repetível)
