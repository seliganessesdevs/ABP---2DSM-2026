# ⚙️ Backend — FatecBot API

> API REST do **FatecBot**, responsável por toda a lógica de negócio, autenticação,
> controle de acesso e persistência de dados do sistema de autoatendimento da
> Secretaria Acadêmica da Fatec Jacareí.

---

<p align="center">
  <img src="https://img.shields.io/badge/Node.js-20-5FA04E?style=for-the-badge&logo=node.js&logoColor=white" />
  <img src="https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white" />
  <img src="https://img.shields.io/badge/Express-000000?style=for-the-badge&logo=express&logoColor=white" />
  <img src="https://img.shields.io/badge/Prisma-2D3748?style=for-the-badge&logo=prisma&logoColor=white" />
  <img src="https://img.shields.io/badge/PostgreSQL-4169E1?style=for-the-badge&logo=postgresql&logoColor=white" />
  <img src="https://img.shields.io/badge/JWT-000000?style=for-the-badge&logo=jsonwebtokens&logoColor=white" />
  <img src="https://img.shields.io/badge/Docker-2496ED?style=for-the-badge&logo=docker&logoColor=white" />
</p>

---

## 📑 Índice

- [Responsabilidades](#responsabilidades)
- [Estrutura de Pastas](#estrutura-de-pastas)
- [Primeiros Passos](#primeiros-passos)
- [Scripts Disponíveis](#scripts-disponíveis)
- [Variáveis de Ambiente](#variáveis-de-ambiente)
- [Endpoints](#endpoints)
- [Arquitetura e Decisões Técnicas](#arquitetura-e-decisões-técnicas)
- [Banco de Dados](#banco-de-dados)

---

## 🎯 Responsabilidades <a id="responsabilidades"></a>

Este serviço é o **único ponto de acesso ao banco de dados**.
O frontend nunca se conecta diretamente ao PostgreSQL.

| Responsabilidade                     | Tecnologia           |
|--------------------------------------|----------------------|
| Exposição de endpoints HTTP REST     | Express              |
| Validação de schema dos requests     | Zod                  |
| Autenticação com JWT                 | jsonwebtoken + bcrypt|
| Controle de acesso por papel (RBAC)  | Middleware customizado|
| Comunicação com o banco de dados     | Prisma Client        |
| Persistência dos dados               | PostgreSQL 16        |
| Execução containerizada              | Docker               |

---

## 📁 Estrutura de Pastas <a id="estrutura-de-pastas"></a>

```
backend/
├── prisma/
│   ├── schema.prisma        # Modelo de dados (DDL via Prisma)
│   ├── migrations/          # Histórico de migrations
│   └── seed.ts              # Dados iniciais: nós do chatbot + admin padrão
│
├── src/
│   ├── server.ts            # Cria e exporta o app Express (sem listen)
│   ├── index.ts             # Entry point: chama server.listen()
│   │
│   ├── config/
│   │   ├── env.ts           # Lê e valida variáveis de ambiente com Zod
│   │   └── database.ts      # Singleton do PrismaClient
│   │
│   ├── middlewares/
│   │   ├── auth.middleware.ts    # Valida JWT Bearer e popula req.user
│   │   ├── rbac.middleware.ts    # authorize('ADMIN' | 'SECRETARY')
│   │   ├── error.middleware.ts   # Handler global de erros → AppError → JSON
│   │   └── logger.middleware.ts  # Log de requisições HTTP
│   │
│   ├── modules/             # Módulos organizados por domínio de negócio
│   │   ├── auth/            # Login, geração de JWT
│   │   ├── chatbot/         # Navegação nos nós, registro de sessão e satisfação
│   │   ├── questions/       # Envio e gestão de perguntas à secretaria
│   │   ├── nodes/           # CRUD de nós de navegação (Admin)
│   │   ├── documents/       # Gestão de documentos e chunks (Admin)
│   │   ├── users/           # Gestão de usuários da secretaria (Admin)
│   │   └── logs/            # Visualização de logs de atendimento (Admin)
│   │
│   ├── routes/
│   │   └── index.ts         # Composição de todas as rotas com prefixo /api/v1
│   │
│   ├── errors/
│   │   └── AppError.ts      # Classe de erro customizada (statusCode + message)
│   │
│   └── utils/
│       ├── hash.utils.ts    # bcrypt: hashPassword, comparePassword
│       ├── jwt.utils.ts     # generateToken, verifyToken
│       └── pagination.utils.ts
│
├── tsconfig.json
├── eslint.config.ts
├── vitest.config.ts
├── .env.example
└── README.md                # Este arquivo
```

> Cada módulo em `src/modules/` segue a estrutura:
> `<modulo>.controller.ts` · `<modulo>.service.ts` · `<modulo>.routes.ts` · `<modulo>.types.ts`

---

## ⚡ Primeiros Passos <a id="primeiros-passos"></a>

### Via Docker (recomendado)

O backend sobe automaticamente junto com o banco via Docker Compose na raiz do projeto:

```bash
# Na raiz do monorepo
docker compose up --build
```

A API estará disponível em `http://localhost:3333`.

### Execução local (sem Docker)

> Requer Node.js >= 20.x, pnpm >= 9.x e um PostgreSQL local ou remoto.

```bash
# Na pasta do backend
cd apps/backend

# Instalar dependências
pnpm install

# Configurar variáveis de ambiente
cp .env.example .env
# Edite DATABASE_URL com sua connection string local

# Executar migrations e seed
pnpm db:migrate
pnpm db:seed

# Iniciar servidor em modo desenvolvimento
pnpm dev
```

### Verificar se a API está respondendo

```bash
curl http://localhost:3333/api/v1/health
# → { "success": true, "message": "API online" }
```

---

## 📜 Scripts Disponíveis <a id="scripts-disponíveis"></a>

| Script              | Comando                    | Descrição                                         |
|---------------------|----------------------------|---------------------------------------------------|
| Desenvolvimento     | `pnpm dev`                 | Inicia com hot reload via `ts-node-dev`           |
| Build               | `pnpm build`               | Compila TypeScript para `dist/`                   |
| Produção            | `pnpm start`               | Executa o build compilado                         |
| Testes              | `pnpm test`                | Executa todos os testes com Vitest                |
| Testes (watch)      | `pnpm test:watch`          | Modo watch — reexecuta ao salvar                  |
| Cobertura           | `pnpm test:coverage`       | Gera relatório HTML em `coverage/`                |
| Lint                | `pnpm lint`                | ESLint em todo o projeto                          |
| Lint (fix)          | `pnpm lint:fix`            | Corrige automaticamente o que for possível        |
| Typecheck           | `pnpm typecheck`           | Valida TypeScript sem compilar (`tsc --noEmit`)   |
| Migrations          | `pnpm db:migrate`          | Executa migrations pendentes com Prisma           |
| Seed                | `pnpm db:seed`             | Popula o banco com dados iniciais do chatbot      |
| Prisma Studio       | `pnpm db:studio`           | Abre UI visual do banco em `http://localhost:5555`|
| Reset do banco      | `pnpm db:reset`            | ⚠️ Apaga tudo e reaplica seed (só em dev)         |

---

## 🔐 Variáveis de Ambiente <a id="variáveis-de-ambiente"></a>

Copie `.env.example` para `.env` e preencha os valores:

```bash
# ── Banco de Dados ──────────────────────────────────────────────
# Formato: postgresql://USER:PASSWORD@HOST:PORT/DATABASE
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/fatecbot

# ── JWT ─────────────────────────────────────────────────────────
# Mínimo 32 caracteres — use um gerador aleatório em produção
JWT_SECRET=troque_por_um_segredo_forte_de_pelo_menos_32_chars
# Formatos válidos: 8h | 1d | 7d
JWT_EXPIRES_IN=8h

# ── Servidor ────────────────────────────────────────────────────
PORT=3333
NODE_ENV=development
```

> ⚠️ O `env.ts` valida estas variáveis com Zod no startup.
> Se uma variável obrigatória estiver faltando ou inválida, o processo **encerrará imediatamente**
> com uma mensagem de erro descritiva — antes de qualquer requisição ser aceita.

---

## 🔌 Endpoints <a id="endpoints"></a>

Documentação completa com exemplos de request/response em [`docs/api-layer.md`](../../docs/api-layer.md).

### Resumo rápido

| Método   | Rota                          | Acesso       | Descrição                              |
|----------|-------------------------------|:------------:|----------------------------------------|
| `POST`   | `/auth/login`                 | Público      | Autentica e retorna JWT                |
| `GET`    | `/nodes/root`                 | Público      | Retorna nó raiz do chatbot             |
| `GET`    | `/nodes/:id`                  | Público      | Retorna nó com filhos e chunks         |
| `POST`   | `/sessions/rating`            | Público      | Registra log de sessão e satisfação    |
| `POST`   | `/questions`                  | Público      | Envia pergunta à secretaria            |
| `GET`    | `/questions`                  | 🔒 SEC/ADMIN | Lista perguntas recebidas              |
| `PATCH`  | `/questions/:id`              | 🔒 SEC/ADMIN | Atualiza status da pergunta            |
| `GET`    | `/nodes`                      | 🔒 ADMIN     | Lista todos os nós                     |
| `POST`   | `/nodes`                      | 🔒 ADMIN     | Cria novo nó de navegação              |
| `PATCH`  | `/nodes/:id`                  | 🔒 ADMIN     | Atualiza nó existente                  |
| `DELETE` | `/nodes/:id`                  | 🔒 ADMIN     | Remove nó (bloqueado se tiver filhos)  |
| `GET`    | `/documents`                  | 🔒 ADMIN     | Lista documentos oficiais              |
| `POST`   | `/documents`                  | 🔒 ADMIN     | Cadastra documento com chunks          |
| `GET`    | `/users`                      | 🔒 ADMIN     | Lista usuários da secretaria           |
| `POST`   | `/users`                      | 🔒 ADMIN     | Cria usuário da secretaria             |
| `DELETE` | `/users/:id`                  | 🔒 ADMIN     | Remove usuário                         |
| `GET`    | `/logs`                       | 🔒 ADMIN     | Lista logs de atendimento              |
| `GET`    | `/health`                     | Público      | Health check da API                    |

---

## 🏗️ Arquitetura e Decisões Técnicas <a id="arquitetura-e-decisões-técnicas"></a>

### Separação `server.ts` / `index.ts`

O app Express é criado em `server.ts` e exportado **sem** chamar `.listen()`.
O `index.ts` importa o app e chama `.listen()` apenas em runtime.
Isso permite que os testes de integração importem `app` diretamente, sem subir um servidor real [ADR-002].

### Validação de entrada com Zod

Todo request body é validado por um schema Zod antes de chegar ao service.
Se a validação falhar, o middleware de erro retorna `422 Unprocessable Entity` com detalhes de campo.

```ts
// Exemplo em nodes.routes.ts
const createNodeSchema = z.object({
  title: z.string().min(1).max(255),
  content: z.string().min(1),
  nodeType: z.enum(['MENU', 'ANSWER']),
  parentId: z.string().uuid().nullable(),
  order: z.number().int().min(0),
})
```

### AppError e handler global

Todos os erros de negócio lançam `new AppError(message, statusCode)`.
O middleware `error.middleware.ts` captura qualquer erro não tratado e formata a resposta:

```
AppError           → statusCode definido + message customizada
ZodError           → 422 + detalhes de campo
Erro desconhecido  → 500 + "Erro interno do servidor" (sem vazar stack trace)
```

### RBAC no backend — nunca só no frontend

A proteção de rotas é feita em **duas camadas** no Express:

```
Requisição → authMiddleware (valida JWT) → authorize('ADMIN') (valida role) → Controller
```

O frontend esconde ou mostra elementos de UI baseado no role, mas **isso é apenas UX**.
A segurança real está nos middlewares do backend (RF10, RF11).

---

## 🗄️ Banco de Dados <a id="banco-de-dados"></a>

### Executar migrations

```bash
# Cria uma nova migration a partir de mudanças no schema.prisma
pnpm exec prisma migrate dev --name descricao-da-mudanca

# Aplica migrations pendentes (usado no Docker/CI)
pnpm exec prisma migrate deploy
```

### Inspecionar o banco visualmente

```bash
pnpm db:studio
# Abre o Prisma Studio em http://localhost:5555
```

### Modelo de dados

Documentação completa do modelo ER em [`docs/application-overview.md`](../../docs/application-overview.md).

Entidades principais:

| Entidade        | Descrição                                              |
|-----------------|--------------------------------------------------------|
| `User`          | Secretárias e administradores autenticados             |
| `ChatNode`      | Nós da árvore de navegação (menus e respostas)        |
| `DocumentChunk` | Trechos indexados de documentos oficiais              |
| `Document`      | Documentos oficiais (Regulamento, Manual de Estágio…) |
| `SessionLog`    | Registro de cada sessão de atendimento                 |
| `Question`      | Perguntas enviadas pelos alunos à secretaria           |

---

> _Este README deve ser atualizado sempre que novos endpoints, scripts ou variáveis
> de ambiente forem adicionados ao projeto._
