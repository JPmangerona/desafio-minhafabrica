# Rule: Docker Workflow — Execução de Serviços e Comandos (Always On)

> Define o fluxo padrão para iniciar os serviços (frontend e backend) e como executar comandos contra eles utilizando Docker Compose.

---

## 🚀 Como Iniciar o Projeto

Para executar qualquer serviço da aplicação, o agente DEVE sempre utilizar o Docker Compose.

- **Comando padrão para subir a aplicação:**
  ```bash
  docker-compose up -d
  ```
  *(Sempre utilize a flag `-d` para executar em background, evitando travar o terminal).*

- **Para parar a aplicação e remover containers:**
  ```bash
  docker-compose down
  ```

---

## 💻 Como Executar Comandos (npm, dependências, testes)

Quando a aplicação estiver rodando via Docker, e for necessário executar comandos que alterem o ambiente de um serviço específico (como instalar pacotes, rodar scripts ou testes), o agente **NUNCA DEVE** executar o script localmente de forma direta.

A execução deve ocorrer **dentro** do contêiner apropriado usando `docker compose exec`.

### ✅ Exemplos CORRETOS de Execução:

- **Instalar uma nova dependência no backend:**
  ```bash
  // ✅ CORRETO
  docker compose exec backend npm install express
  ```

- **Rodar os testes do frontend:**
  ```bash
  // ✅ CORRETO
  docker compose exec frontend npm test
  ```

- **Acessar o shell do MongoDB (se necessário):**
  ```bash
  // ✅ CORRETO
  docker compose exec mongo mongosh
  ```

### ❌ Exemplos ERRADOS (Não Fazer!):

- **Instalação local de pacotes enquanto usa Docker:**
  ```bash
  // ❌ ERRADO (Roda na máquina local ao invés do container)
  cd backend && npm install express
  ```

- **Rodar a aplicação sem o Docker Compose:**
  ```bash
  // ❌ ERRADO
  cd frontend && npm run dev
  ```

---

## 📝 Resumo de Serviços Esperados (Padrão)

Assuma que o `docker-compose.yml` conterá ao menos estes serviços:
1. `backend` (Node.js/Express)
2. `frontend` (Next.js)
3. `mongo` (Banco de Dados)

> **Nota:** Se os nomes dos serviços forem diferentes no `docker-compose.yml`, ajuste o `docker compose exec <nome-do-serviço> ...` de acordo com o arquivo.
