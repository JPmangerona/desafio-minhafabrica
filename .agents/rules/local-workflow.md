# Rule: Local Workflow — Execução de Serviços e Comandos (Always On)

> Define o fluxo padrão para iniciar os serviços (frontend e backend) **localmente**, sem Docker.
> O agente NUNCA deve usar Docker Compose ou docker exec neste momento — os serviços rodam diretamente na máquina.

---

## 🚀 Como Iniciar o Projeto

Os serviços devem ser iniciados diretamente na máquina local, cada um em um terminal separado.

### Backend

```bash
cd backend
npm run dev
```

### Frontend

```bash
cd frontend
npm run dev
```

---

## 💻 Como Executar Comandos (npm, dependências, testes)

Todos os comandos devem ser executados **localmente**, `cd` no diretório do serviço e executar diretamente.

### ✅ Exemplos CORRETOS de Execução:

- **Instalar uma nova dependência no backend:**
  ```bash
  // ✅ CORRETO
  cd backend && npm install express
  ```

- **Instalar uma dependência no frontend:**
  ```bash
  // ✅ CORRETO
  cd frontend && npm install axios
  ```

- **Rodar os testes do frontend:**
  ```bash
  // ✅ CORRETO
  cd frontend && npm test
  ```

### ❌ Exemplos ERRADOS (Não Fazer!):

- **Usar Docker Compose para subir os serviços:**
  ```bash
  // ❌ ERRADO — Docker não está sendo usado agora
  docker-compose up -d
  ```

- **Instalar dependências via docker exec:**
  ```bash
  // ❌ ERRADO
  docker compose exec backend npm install express
  ```

---

## 📝 Resumo de Serviços e Portas (Padrão Local)

| Serviço   | Porta | Comando            |
|-----------|-------|--------------------|
| Frontend  | 3000  | `npm run dev`      |
| Backend   | 3001  | `npm run dev`      |
| MongoDB   | 27017 | Instância local    |

> **Nota:** O banco de dados MongoDB deve estar rodando localmente (via `mongod` ou MongoDB Community Server instalado na máquina).
> A string de conexão deve apontar para `mongodb://localhost:27017/minhafabrica`.
