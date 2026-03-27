## 🗂️ Visão Geral do Monorepo

```
fatecbot/
├── apps/
│   ├── frontend/               # Aplicação React + TypeScript (Vite)
│   └── backend/                # API Node.js + TypeScript (Express + Prisma)
├── docs/                       # Documentação técnica completa
├── docker-compose.yml          # Orquestração dos 3 containers
├── .env.example                # Template de variáveis de ambiente
├── .gitignore
├── pnpm-workspace.yaml         # Configuração do monorepo pnpm
└── README.md                   # README principal do projeto
```

---

## 🖥️ Frontend — `apps/frontend/`

Aplicação React 18 com TypeScript, construída com Vite.
Organizada por **features** (domínios de negócio), não por tipo de arquivo.

```
apps/frontend/
├── public/                         # Arquivos estáticos públicos (favicon, robots.txt)
├── src/
│   ├── app/                        # Núcleo da aplicação
│   │   ├── router.tsx              # Definição de rotas (React Router v6)
│   │   ├── provider.tsx            # Composição de providers globais (Auth, Query, Theme)
│   │   └── routes/                 # Componentes de página mapeados por rota
│   │       ├── index.tsx           # Rota pública: chatbot principal
│   │       ├── admin/              # Rotas protegidas: painel do administrador
│   │       │   ├── dashboard.tsx
│   │       │   ├── nodes.tsx       # CRUD de nós de navegação
│   │       │   ├── documents.tsx   # Gestão de documentos oficiais
│   │       │   ├── users.tsx       # Gestão de usuários da secretaria
│   │       │   └── logs.tsx        # Visualização de logs de atendimento
│   │       └── secretary/          # Rotas protegidas: painel da secretária
│   │           ├── dashboard.tsx
│   │           └── questions.tsx   # Listagem e status das perguntas recebidas
│   │
│   ├── assets/                     # Imagens, ícones e fontes estáticas
│   │
│   ├── components/                 # Componentes UI genéricos e reutilizáveis
│   │   ├── ui/                     # Componentes base (shadcn/ui — não editar diretamente)
│   │   │   ├── button.tsx
│   │   │   ├── input.tsx
│   │   │   ├── dialog.tsx
│   │   │   └── ...
│   │   ├── layout/                 # Estruturas de layout da aplicação
│   │   │   ├── AdminLayout.tsx     # Layout com sidebar para painéis autenticados
│   │   │   └── PublicLayout.tsx    # Layout minimalista para o chatbot público
│   │   └── shared/                 # Componentes reutilizáveis com lógica própria
│   │       ├── ProtectedRoute.tsx  # Guard de rota: redireciona se não autenticado
│   │       ├── RoleGuard.tsx       # Guard de papel: bloqueia por role (RBAC)
│   │       ├── LoadingSpinner.tsx
│   │       └── ErrorBoundary.tsx
│   │
│   ├── config/                     # Variáveis de ambiente e configurações globais
│   │   └── env.ts                  # Exporta VITE_API_URL e demais envs com validação
│   │
│   ├── features/                   # ← Coração da aplicação: módulos por domínio
│   │   │
│   │   ├── chatbot/                # Domínio: navegação conversacional (RF01, RF02)
│   │   │   ├── api/
│   │   │   │   └── chatbot.api.ts  # Chamadas à API: buscar nó, enviar pergunta
│   │   │   ├── components/
│   │   │   │   ├── ChatWindow.tsx  # Container principal da conversa
│   │   │   │   ├── MessageBubble.tsx
│   │   │   │   ├── OptionButton.tsx
│   │   │   │   ├── EvidenceCard.tsx  # Exibe trecho de documento oficial
│   │   │   │   └── SatisfactionRating.tsx  # "Gostei / Não gostei" (RF07)
│   │   │   ├── hooks/
│   │   │   │   └── useChatNavigation.ts  # Lógica de navegação na árvore de nós
│   │   │   └── types/
│   │   │       └── chatbot.types.ts  # ChatNode, ChatMessage, NavigationStep
│   │   │
│   │   ├── auth/                   # Domínio: autenticação (RF09, RNF08)
│   │   │   ├── api/
│   │   │   │   └── auth.api.ts     # POST /auth/login
│   │   │   ├── components/
│   │   │   │   └── LoginForm.tsx
│   │   │   ├── hooks/
│   │   │   │   └── useLogin.ts     # Mutation de login e redirecionamento por role
│   │   │   ├── stores/
│   │   │   │   └── auth.store.ts   # Zustand: token JWT, user, role
│   │   │   └── types/
│   │   │       └── auth.types.ts   # AuthUser, LoginPayload, JWTPayload
│   │   │
│   │   ├── admin/                  # Domínio: painel do administrador (RF04)
│   │   │   ├── api/
│   │   │   │   ├── nodes.api.ts    # CRUD de nós de navegação
│   │   │   │   ├── documents.api.ts
│   │   │   │   ├── users.api.ts
│   │   │   │   └── logs.api.ts
│   │   │   ├── components/
│   │   │   │   ├── NodeEditor.tsx  # Formulário de criação/edição de nó
│   │   │   │   ├── NodeTree.tsx    # Visualização hierárquica da árvore
│   │   │   │   ├── DocumentList.tsx
│   │   │   │   ├── UserList.tsx
│   │   │   │   └── LogTable.tsx
│   │   │   └── hooks/
│   │   │       ├── useNodes.ts
│   │   │       ├── useDocuments.ts
│   │   │       └── useLogs.ts
│   │   │
│   │   └── secretary/              # Domínio: painel da secretária (RF06)
│   │       ├── api/
│   │       │   └── questions.api.ts  # GET /questions, PATCH /questions/:id/status
│   │       ├── components/
│   │       │   ├── QuestionsTable.tsx
│   │       │   └── StatusBadge.tsx
│   │       └── hooks/
│   │           └── useQuestions.ts
│   │
│   ├── hooks/                      # Hooks globais reutilizáveis
│   │   ├── useDebounce.ts
│   │   └── usePagination.ts
│   │
│   ├── lib/                        # Bibliotecas pré-configuradas
│   │   ├── axios.ts                # Instância do Axios com interceptors e baseURL
│   │   └── queryClient.ts          # Configuração do TanStack Query
│   │
│   ├── types/                      # Types TypeScript globais compartilhados
│   │   ├── api.types.ts            # ApiResponse<T>, PaginatedResponse<T>, ApiError
│   │   └── common.types.ts         # Role, Status, UUID
│   │
│   └── utils/                      # Funções puras utilitárias
│       ├── date.utils.ts           # Formatação de datas (pt-BR)
│       ├── string.utils.ts
│       └── token.utils.ts          # Decode JWT, verificar expiração
│
├── index.html
├── vite.config.ts
├── tsconfig.json
├── tsconfig.app.json
├── eslint.config.ts
├── .env.example
└── README.md                       # README específico do frontend
```

---

## ⚙️ Backend — `apps/backend/`

API REST em Node.js com TypeScript, Express e Prisma ORM.
Organizada por **camadas** dentro de cada **feature/domínio**.

```
apps/backend/
├── prisma/
│   ├── schema.prisma               # Definição do modelo de dados (DDL via Prisma)
│   ├── migrations/                 # Histórico de migrations geradas automaticamente
│   └── seed.ts                     # Seed inicial: nós do chatbot, admin padrão
│
├── src/
│   ├── server.ts                   # Entry point: cria e exporta o app Express
│   ├── index.ts                    # Inicializa o servidor e conecta ao banco
│   │
│   ├── config/                     # Configurações centralizadas
│   │   ├── env.ts                  # Lê e valida variáveis de ambiente (zod)
│   │   └── database.ts             # Instância do PrismaClient (singleton)
│   │
│   ├── middlewares/                # Middlewares Express globais
│   │   ├── auth.middleware.ts      # Valida JWT Bearer, popula req.user
│   │   ├── rbac.middleware.ts      # Verifica role: authorize('ADMIN') | authorize('SECRETARY')
│   │   ├── error.middleware.ts     # Handler global de erros (AppError → JSON)
│   │   └── logger.middleware.ts    # Log de requisições HTTP
│   │
│   ├── modules/                    # ← Módulos por domínio de negócio
│   │   │
│   │   ├── auth/                   # Autenticação (RF09, RNF08)
│   │   │   ├── auth.controller.ts  # POST /auth/login
│   │   │   ├── auth.service.ts     # Lógica: verificar senha com Argon2id, gerar JWT
│   │   │   ├── auth.routes.ts      # Definição das rotas do módulo
│   │   │   └── auth.types.ts       # LoginDTO, TokenPayload
│   │   │
│   │   ├── chatbot/                # Navegação conversacional (RF01, RF02, RF07, RF08)
│   │   │   ├── chatbot.controller.ts  # GET /nodes/:id, POST /session/end
│   │   │   ├── chatbot.service.ts     # Busca nó, registra log, registra satisfação
│   │   │   ├── chatbot.routes.ts
│   │   │   └── chatbot.types.ts       # ChatNodeResponse, SessionLogDTO
│   │   │
│   │   ├── questions/              # Perguntas à secretaria (RF05, RF06)
│   │   │   ├── questions.controller.ts  # POST /questions, GET /questions, PATCH /questions/:id
│   │   │   ├── questions.service.ts
│   │   │   ├── questions.routes.ts
│   │   │   └── questions.types.ts       # CreateQuestionDTO, UpdateStatusDTO
│   │   │
│   │   ├── nodes/                  # CRUD de nós de navegação (RF04 — Admin)
│   │   │   ├── nodes.controller.ts
│   │   │   ├── nodes.service.ts
│   │   │   ├── nodes.routes.ts
│   │   │   └── nodes.types.ts           # CreateNodeDTO, UpdateNodeDTO
│   │   │
│   │   ├── documents/              # Gestão de documentos oficiais (RF04 — Admin)
│   │   │   ├── documents.controller.ts  # CRUD + upload de chunks indexados
│   │   │   ├── documents.service.ts
│   │   │   ├── documents.routes.ts
│   │   │   └── documents.types.ts       # DocumentDTO, ChunkDTO
│   │   │
│   │   ├── users/                  # Gestão de usuários da secretaria (RF04 — Admin)
│   │   │   ├── users.controller.ts
│   │   │   ├── users.service.ts
│   │   │   ├── users.routes.ts
│   │   │   └── users.types.ts           # CreateUserDTO, UserResponse
│   │   │
│   │   └── logs/                   # Logs de atendimento (RF08 — Admin)
│   │       ├── logs.controller.ts   # GET /logs (com filtros por data/curso)
│   │       ├── logs.service.ts
│   │       ├── logs.routes.ts
│   │       └── logs.types.ts
│   │
│   ├── routes/
│   │   └── index.ts                # Composição de todas as rotas com prefixos (/api/v1)
│   │
│   ├── errors/
│   │   └── AppError.ts             # Classe de erro customizada com statusCode e message
│   │
│   └── utils/
│       ├── hash.utils.ts           # Argon2id: hashPassword, comparePassword
│       ├── jwt.utils.ts            # generateToken, verifyToken
│       └── pagination.utils.ts     # Helper para paginação de listagens
│
├── tsconfig.json
├── eslint.config.ts
├── .env.example
└── README.md                       # README específico do backend
```

---

## 📚 Documentação — `docs/`

```
docs/
├── assets/                         # Imagens e diagramas para a documentação
│   └── README.md                   # Inventário e convenções dos assets de documentação
│
├── first-steps.md                  # Ponto de entrada para quem vai contribuir com código
├── application-overview.md         # Visão geral: modelo de dados, fluxos, perfis
├── project-structure.md            # ← Este arquivo
├── project-standards.md            # Convenções: commits, nomenclatura, linting
├── api-layer.md                    # Endpoints, exemplos de request/response
├── state-management.md             # Zustand vs React Query: quando usar cada um
├── testing.md                      # Estratégia de testes e exemplos por camada
├── troubleshooting.md              # Problemas comuns durante setup e desenvolvimento
├── mvp-scope.md                    # Escopo do MVP e critérios de corte
├── seed-data.md                    # Credenciais e dados iniciais do banco
├── env-matrix.md                   # Variáveis de ambiente por app e ambiente
│
├── sprint1/
│   ├── README.md                   # Objetivos, entregáveis e resultados da Sprint 1
│   └── tasks.md                    # Tarefas detalhadas por integrante
├── sprint2/
│   ├── README.md
│   └── tasks.md                    # ⚠️ a criar
├── sprint3/
│   ├── README.md
│   └── tasks.md                    # ⚠️ a criar
│
└── adr/
    └── README.md                   # ADR-001 a ADR-003 centralizados em um único documento
```

---

## 📐 Princípios de Organização

### Feature-based, não Type-based

Cada feature encapsula seus próprios `api/`, `components/`, `hooks/` e `types/`.
Isso significa que **tudo relacionado ao chatbot vive em `features/chatbot/`** —
não espalhado entre pastas `components/`, `hooks/` e `services/` separadas.

```
# ❌ Organização por tipo (evitar)
src/
├── components/  ChatWindow.tsx, NodeEditor.tsx, LoginForm.tsx
├── hooks/       useChatNavigation.ts, useLogin.ts, useNodes.ts
└── services/    chatbot.service.ts, auth.service.ts

# ✅ Organização por feature (adotado)
src/
└── features/
    ├── chatbot/   components/ hooks/ api/ types/
    ├── auth/      components/ hooks/ api/ stores/ types/
    └── admin/     components/ hooks/ api/
```

### Regra de importação

Um módulo **nunca** deve importar de outro módulo via caminho relativo profundo.
Use alias de caminho (`@/features/auth`) para imports entre features.

```ts
// ❌ Proibido — acoplamento frágil entre features
import { useLogin } from "../../auth/hooks/useLogin";

// ✅ Correto — via alias configurado no tsconfig/vite
import { useLogin } from "@/features/auth/hooks/useLogin";
```

### Componentes `ui/` são intocáveis

Os arquivos em `components/ui/` são gerados pelo shadcn/ui e **não devem ser editados diretamente**.
Crie wrappers em `components/shared/` ou dentro da feature correspondente quando precisar de customização.

---

> _Próximo documento: [`project-standards.md`](./project-standards.md)_
