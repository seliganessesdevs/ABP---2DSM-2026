# FatecBot — Backlog Técnico de Tarefas

> Projeto: FatecBot — Autoatendimento da Secretaria Acadêmica · Fatec Jacareí
> Modelo de organização: baixo acoplamento, separação por módulo/camada, tasks autocontidas
> Cada task toca um conjunto de arquivos exclusivo, evitando conflitos simultâneos entre devs

---

## Princípios de Leitura

| Símbolo | Significado |
|---------|-------------|
| `[BE]` | Task de backend (`apps/backend/`) |
| `[FE]` | Task de frontend (`apps/frontend/`) |
| `[INFRA]` | Task de infraestrutura (raiz do monorepo) |
| **Entrada** | O que deve existir/estar pronto antes de iniciar |
| **Saída** | O que a task entrega como artefato testável |
| **Arquivos** | Arquivos exclusivamente criados/editados por esta task |

> **Regra de ouro:** arquivos de `types/`, `api/`, `service/` e `hooks/` são sempre tasks separadas.
> Isso garante que dois desenvolvedores nunca editem o mesmo arquivo ao mesmo tempo.

---

## 🗂️ SPRINT 1 — Fundação, Autenticação e Chatbot Público

> Objetivo: sistema funcional do ponto de vista do aluno (chatbot + envio de pergunta) e infraestrutura base.

---

### 🏗️ Infraestrutura — Backend

---

#### TASK-001 · [BE] Bootstrap do servidor Express

**Módulo:** Infra / `src/`
**Prioridade:** 🔴 Crítica (bloqueante para todas as tasks BE)

**Arquivos exclusivos desta task:**
- `apps/backend/src/server.ts`
- `apps/backend/src/index.ts`

**Entrada:**
- Repositório inicializado com `pnpm init` e dependências base instaladas (`express`, `typescript`)
- `tsconfig.json` presente

**Saída:**
- `server.ts` cria e exporta o app Express sem chamar `.listen()`
- `index.ts` importa o app e chama `.listen(PORT)`
- `GET /api/v1/health` retorna `{ "success": true }`
- Servidor responde em `http://localhost:3333`

**Contrato de saída (HTTP):**
```
GET /api/v1/health
→ 200 OK
→ { "success": true }
```

---

#### TASK-002 · [BE] Configuração de ambiente e banco de dados

**Módulo:** Infra / `src/config/`
**Prioridade:** 🔴 Crítica

**Arquivos exclusivos desta task:**
- `apps/backend/src/config/env.ts`
- `apps/backend/src/config/database.ts`
- `apps/backend/.env.example`

**Entrada:**
- `TASK-001` concluída (app Express existe)
- Dependências: `zod`, `@prisma/client`

**Saída:**
- `env.ts` lê e valida `DATABASE_URL`, `JWT_SECRET`, `JWT_EXPIRES_IN`, `PORT`, `NODE_ENV` com Zod; encerra o processo com mensagem descritiva em caso de variável ausente
- `database.ts` exporta singleton `PrismaClient`
- `.env.example` documentado

**Contrato de saída (módulo):**
```ts
// config/env.ts
export const env: {
  DATABASE_URL: string
  JWT_SECRET: string
  JWT_EXPIRES_IN: string
  PORT: number
  NODE_ENV: 'development' | 'production' | 'test'
}

// config/database.ts
export const db: PrismaClient
```

---

#### TASK-003 · [BE] Classe AppError e middleware de erros

**Módulo:** Infra / `src/errors/` + `src/middlewares/`
**Prioridade:** 🔴 Crítica

**Arquivos exclusivos desta task:**
- `apps/backend/src/errors/AppError.ts`
- `apps/backend/src/middlewares/error.middleware.ts`
- `apps/backend/src/middlewares/logger.middleware.ts`

**Entrada:**
- `TASK-001` concluída
- `TASK-002` concluída (env disponível)

**Saída:**
- `AppError` é classe que estende `Error` com `statusCode` e `message`
- `error.middleware.ts` captura `AppError` → JSON formatado; `ZodError` → 422 com detalhes; erros desconhecidos → 500 sem vazar stack trace
- `logger.middleware.ts` loga método, rota e status de cada requisição

**Contrato de saída (módulo):**
```ts
// errors/AppError.ts
export class AppError extends Error {
  constructor(message: string, public statusCode: number) {}
}

// middlewares/error.middleware.ts
export const errorMiddleware: ErrorRequestHandler
// Garante que QUALQUER erro resulta em:
// { success: false, message: string, errors?: FieldError[] }
```

---

#### TASK-004 · [BE] Schema Prisma e migration inicial

**Módulo:** Infra / `prisma/`
**Prioridade:** 🔴 Crítica (bloqueante para todos os services)

**Arquivos exclusivos desta task:**
- `apps/backend/prisma/schema.prisma`
- `apps/backend/prisma/migrations/` (gerado automaticamente)

**Entrada:**
- `TASK-002` concluída (`DATABASE_URL` disponível)
- PostgreSQL rodando (local ou Docker)

**Saída:**
- Schema com as entidades: `User`, `ChatNode`, `Document`, `DocumentChunk`, `NodeDocument` (pivô), `SessionLog`, `Question`
- Migration aplicada e banco criado
- Tipos Prisma gerados (`@prisma/client`)

**Contrato de saída (schema — entidades mínimas):**
```prisma
model User        { id String @id @default(uuid()), email String @unique, passwordHash String, role Role, name String, createdAt DateTime @default(now()), updatedAt DateTime @updatedAt }
model ChatNode    { id String @id @default(uuid()), title String, content String, nodeType NodeType, parentId String?, order Int, isActive Boolean @default(true), createdAt DateTime @default(now()) }
model Document    { id String @id @default(uuid()), name String, type DocumentType, fileUrl String?, createdAt DateTime @default(now()) }
model DocumentChunk { id String @id @default(uuid()), content String, page Int?, section String?, documentId String }
model SessionLog  { id String @id @default(uuid()), navigationPath Json, satisfaction Satisfaction?, startedAt DateTime, endedAt DateTime }
model Question    { id String @id @default(uuid()), text String, email String, status QuestionStatus @default(OPEN), sessionLogId String?, createdAt DateTime @default(now()), updatedAt DateTime @updatedAt }
```

---

#### TASK-005 · [BE] Seed de dados iniciais

**Módulo:** Infra / `prisma/`
**Prioridade:** 🟡 Alta

**Arquivos exclusivos desta task:**
- `apps/backend/prisma/seed.ts`

**Entrada:**
- `TASK-004` concluída (schema e migrations aplicados)

**Saída:**
- Admin padrão criado (`admin@fatec.sp.gov.br` / `admin123`) com hash Argon2id
- Secretária padrão criada (`secretaria@fatec.sp.gov.br` / `secretaria123`)
- Nó raiz do chatbot criado com pelo menos 2 nós filhos de exemplo
- Comando `pnpm db:seed` funcional

---

#### TASK-006 · [BE] Utils: hash e JWT

**Módulo:** Infra / `src/utils/`
**Prioridade:** 🔴 Crítica (bloqueante para auth.service)

**Arquivos exclusivos desta task:**
- `apps/backend/src/utils/hash.utils.ts`
- `apps/backend/src/utils/jwt.utils.ts`
- `apps/backend/src/utils/pagination.utils.ts`

**Entrada:**
- `TASK-002` concluída (`env.JWT_SECRET` disponível)
- Dependências: `argon2`, `jsonwebtoken`

**Saída:**
- `hash.utils.ts` exporta `hashPassword(plain: string): Promise<string>` e `comparePassword(plain: string, hash: string): Promise<boolean>` usando Argon2id
- `jwt.utils.ts` exporta `generateToken(payload: TokenPayload): string` e `verifyToken(token: string): TokenPayload`
- `pagination.utils.ts` exporta `paginate(page, limit)` retornando `{ skip, take }`

**Contrato de saída (módulo):**
```ts
// utils/hash.utils.ts
export async function hashPassword(plain: string): Promise<string>
export async function comparePassword(plain: string, hash: string): Promise<boolean>

// utils/jwt.utils.ts
export function generateToken(payload: { sub: string; role: string }): string
export function verifyToken(token: string): { sub: string; role: string; exp: number }

// utils/pagination.utils.ts
export function paginate(page: number, limit: number): { skip: number; take: number }
```

---

### 🏗️ Infraestrutura — Frontend

---

#### TASK-007 · [FE] Bootstrap do projeto Vite + TypeScript

**Módulo:** Infra / raiz do frontend
**Prioridade:** 🔴 Crítica (bloqueante para todas as tasks FE)

**Arquivos exclusivos desta task:**
- `apps/frontend/vite.config.ts`
- `apps/frontend/tsconfig.json`
- `apps/frontend/tsconfig.app.json`
- `apps/frontend/tailwind.config.ts`
- `apps/frontend/eslint.config.ts`
- `apps/frontend/vitest.config.ts`
- `apps/frontend/index.html`
- `apps/frontend/.env.example`

**Entrada:**
- Monorepo pnpm configurado
- Node.js >= 20.x

**Saída:**
- `pnpm dev` sobe o servidor Vite em `http://localhost:5173`
- Path alias `@/` configurado apontando para `src/`
- Tailwind CSS funcional
- Vitest configurado

---

#### TASK-008 · [FE] Tipos globais compartilhados

**Módulo:** Infra / `src/types/`
**Prioridade:** 🔴 Crítica

**Arquivos exclusivos desta task:**
- `apps/frontend/src/types/api.types.ts`
- `apps/frontend/src/types/common.types.ts`

**Entrada:**
- `TASK-007` concluída

**Saída:**
- `api.types.ts` define `ApiResponse<T>`, `PaginatedResponse<T>`, `ApiError`, `FieldError`
- `common.types.ts` define `Role` (`'ADMIN' | 'SECRETARY'`), `UUID`, `QuestionStatus`, `Satisfaction`, `NodeType`

**Contrato de saída (tipos):**
```ts
// types/api.types.ts
export interface ApiResponse<T> { success: boolean; data: T }
export interface PaginatedResponse<T> extends ApiResponse<T[]> { meta: { total: number; page: number; limit: number } }
export interface ApiError { success: false; message: string; errors?: FieldError[] }
export interface FieldError { field: string; message: string }

// types/common.types.ts
export type Role = 'ADMIN' | 'SECRETARY'
export type UUID = string
export type QuestionStatus = 'OPEN' | 'ANSWERED'
export type Satisfaction = 'LIKED' | 'DISLIKED'
export type NodeType = 'MENU' | 'ANSWER'
```

---

#### TASK-009 · [FE] Instância Axios e React Query client

**Módulo:** Infra / `src/lib/`
**Prioridade:** 🔴 Crítica

**Arquivos exclusivos desta task:**
- `apps/frontend/src/lib/axios.ts`
- `apps/frontend/src/lib/queryClient.ts`
- `apps/frontend/src/config/env.ts`

**Entrada:**
- `TASK-007` concluída
- `TASK-008` concluída (tipos disponíveis)
- Dependências: `axios`, `@tanstack/react-query`

**Saída:**
- `axios.ts` exporta instância `api` com `baseURL = VITE_API_URL`, interceptor de request que injeta `Authorization: Bearer <token>` a partir do Zustand store, e interceptor de resposta que redireciona para `/login` em caso de 401
- `queryClient.ts` exporta instância configurada com `staleTime: 60_000` e `retry: 1`
- `env.ts` valida `VITE_API_URL` com Zod

**Contrato de saída (módulo):**
```ts
// lib/axios.ts
export const api: AxiosInstance // instância com interceptors configurados

// lib/queryClient.ts
export const queryClient: QueryClient

// config/env.ts
export const env: { VITE_API_URL: string; VITE_ENABLE_DEVTOOLS: boolean }
```

---

#### TASK-010 · [FE] Provider global e Router

**Módulo:** Infra / `src/app/`
**Prioridade:** 🔴 Crítica

**Arquivos exclusivos desta task:**
- `apps/frontend/src/app/provider.tsx`
- `apps/frontend/src/app/router.tsx`
- `apps/frontend/src/main.tsx`

**Entrada:**
- `TASK-009` concluída
- Dependências: `react-router-dom`, `@tanstack/react-query`

**Saída:**
- `provider.tsx` compõe `QueryClientProvider`, `BrowserRouter` e futuro `AuthProvider`
- `router.tsx` define todas as rotas com placeholders de componente (`<div>TODO</div>`) para as páginas ainda não implementadas
- Rotas previstas: `/`, `/login`, `/admin/*`, `/secretary/*`

---

#### TASK-011 · [FE] Utils frontend

**Módulo:** Infra / `src/utils/`
**Prioridade:** 🟡 Alta

**Arquivos exclusivos desta task:**
- `apps/frontend/src/utils/date.utils.ts`
- `apps/frontend/src/utils/string.utils.ts`
- `apps/frontend/src/utils/token.utils.ts`

**Entrada:**
- `TASK-007` concluída

**Saída:**
- `date.utils.ts` exporta `formatDate(iso: string): string` em pt-BR e `formatRelative(iso: string): string`
- `string.utils.ts` exporta `truncate(str, max)` e `capitalize(str)`
- `token.utils.ts` exporta `decodeJWT(token): JWTPayload` e `isTokenExpired(token): boolean`

---

#### TASK-012 · [FE] Componentes compartilhados base

**Módulo:** Infra / `src/components/shared/`
**Prioridade:** 🟡 Alta

**Arquivos exclusivos desta task:**
- `apps/frontend/src/components/shared/LoadingSpinner.tsx`
- `apps/frontend/src/components/shared/ErrorBoundary.tsx`

**Entrada:**
- `TASK-007` concluída (Tailwind disponível)

**Saída:**
- `LoadingSpinner` é componente React que aceita `size?: 'sm' | 'md' | 'lg'`
- `ErrorBoundary` é class component que captura erros de renderização e exibe fallback

---

#### TASK-013 · [FE] Hooks globais utilitários

**Módulo:** Infra / `src/hooks/`
**Prioridade:** 🟢 Média

**Arquivos exclusivos desta task:**
- `apps/frontend/src/hooks/useDebounce.ts`
- `apps/frontend/src/hooks/usePagination.ts`

**Entrada:**
- `TASK-007` concluída

**Saída:**
- `useDebounce<T>(value: T, delay: number): T`
- `usePagination(initialPage?, initialLimit?): { page, limit, setPage, setLimit, nextPage, prevPage }`

---

### 🐳 Infraestrutura — Docker

---

#### TASK-014 · [INFRA] Docker Compose e Dockerfiles

**Módulo:** Raiz do monorepo
**Prioridade:** 🔴 Crítica

**Arquivos exclusivos desta task:**
- `docker-compose.yml`
- `apps/backend/Dockerfile`
- `apps/frontend/Dockerfile`
- `.env.example` (raiz)
- `pnpm-workspace.yaml`

**Entrada:**
- `TASK-001` e `TASK-007` concluídas (apps existem)

**Saída:**
- `docker compose up --build` sobe os 3 containers: `postgres:16-alpine`, `backend:node20-alpine` em `:3333`, `frontend:node20-alpine` em `:5173`
- Health check no backend container aguarda o Postgres estar pronto
- Variáveis de ambiente documentadas no `.env.example` da raiz

---

### 🔐 Módulo Auth

---

#### TASK-015 · [BE] auth.types.ts — DTOs e contratos de autenticação

**Módulo:** `src/modules/auth/`
**Prioridade:** 🔴 Crítica

**Arquivos exclusivos desta task:**
- `apps/backend/src/modules/auth/auth.types.ts`

**Entrada:**
- `TASK-004` concluída (modelo `User` no Prisma)

**Saída:**
- Tipos: `LoginDTO`, `TokenPayload`, `AuthUserResponse`

**Contrato de saída (tipos):**
```ts
export interface LoginDTO {
  email: string    // e-mail institucional
  password: string // senha em plaintext — só existe no request; nunca persiste
}

export interface TokenPayload {
  sub: string   // userId (UUID)
  role: 'ADMIN' | 'SECRETARY'
  exp: number   // Unix timestamp
}

export interface AuthUserResponse {
  id: string
  name: string
  email: string
  role: 'ADMIN' | 'SECRETARY'
}
```

---

#### TASK-016 · [BE] auth.service.ts — lógica de autenticação

**Módulo:** `src/modules/auth/`
**Prioridade:** 🔴 Crítica

**Arquivos exclusivos desta task:**
- `apps/backend/src/modules/auth/auth.service.ts`

**Entrada:**
- `TASK-015` concluída (tipos disponíveis)
- `TASK-006` concluída (`comparePassword`, `generateToken` disponíveis)
- `TASK-002` concluída (`db` disponível)
- `TASK-003` concluída (`AppError` disponível)

**Saída:**
- `login(dto: LoginDTO): Promise<{ token: string; user: AuthUserResponse }>`
- Lança `AppError('E-mail ou senha inválidos', 401)` se usuário não encontrado ou senha incorreta
- Usa `argon2.verify()` com Argon2id para comparar a senha
- Token JWT contém `{ sub: user.id, role: user.role }`

**Contrato de saída (módulo):**
```ts
export class AuthService {
  async login(dto: LoginDTO): Promise<{ token: string; user: AuthUserResponse }>
}
```

---

#### TASK-017 · [BE] auth.controller.ts + auth.routes.ts

**Módulo:** `src/modules/auth/`
**Prioridade:** 🔴 Crítica

**Arquivos exclusivos desta task:**
- `apps/backend/src/modules/auth/auth.controller.ts`
- `apps/backend/src/modules/auth/auth.routes.ts`

**Entrada:**
- `TASK-016` concluída (`AuthService` disponível)
- `TASK-003` concluída (error handler global)
- Dependência: `zod` (validação de schema)

**Saída:**
- `POST /auth/login` valida body com Zod, chama `AuthService.login()`, retorna `200` com `{ success: true, data: { token, user } }`
- Schema Zod: `{ email: z.string().email(), password: z.string().min(6) }`

**Contrato de saída (HTTP):**
```
POST /api/v1/auth/login
Body: { "email": string, "password": string }
→ 200: { "success": true, "data": { "token": string, "user": AuthUserResponse } }
→ 401: { "success": false, "message": "E-mail ou senha inválidos" }
→ 422: { "success": false, "message": "...", "errors": FieldError[] }
```

---

#### TASK-018 · [BE] auth.middleware.ts — validação JWT

**Módulo:** `src/middlewares/`
**Prioridade:** 🔴 Crítica (bloqueante para todas as rotas protegidas)

**Arquivos exclusivos desta task:**
- `apps/backend/src/middlewares/auth.middleware.ts`

**Entrada:**
- `TASK-006` concluída (`verifyToken` disponível)
- `TASK-003` concluída (`AppError` disponível)

**Saída:**
- Middleware Express que extrai `Authorization: Bearer <token>`, verifica com `verifyToken()`, e popula `req.user: TokenPayload`
- Lança `AppError('Token ausente ou inválido', 401)` se token inválido ou expirado

**Contrato de saída (módulo):**
```ts
// Popula req.user após validação
declare global {
  namespace Express {
    interface Request { user?: TokenPayload }
  }
}
export const authenticate: RequestHandler
```

---

#### TASK-019 · [BE] rbac.middleware.ts — autorização por role

**Módulo:** `src/middlewares/`
**Prioridade:** 🔴 Crítica

**Arquivos exclusivos desta task:**
- `apps/backend/src/middlewares/rbac.middleware.ts`

**Entrada:**
- `TASK-018` concluída (`req.user` disponível)
- `TASK-003` concluída (`AppError` disponível)

**Saída:**
- `authorize(...roles: Role[])` retorna middleware que verifica se `req.user.role` está nos roles permitidos
- Lança `AppError('Acesso negado', 403)` se role insuficiente

**Contrato de saída (módulo):**
```ts
export function authorize(...roles: Array<'ADMIN' | 'SECRETARY'>): RequestHandler
// Uso: router.get('/nodes', authenticate, authorize('ADMIN'), nodesController.list)
```

---

#### TASK-020 · [FE] auth.types.ts — tipos de autenticação

**Módulo:** `src/features/auth/types/`
**Prioridade:** 🔴 Crítica

**Arquivos exclusivos desta task:**
- `apps/frontend/src/features/auth/types/auth.types.ts`

**Entrada:**
- `TASK-008` concluída (tipos `Role`, `UUID` disponíveis)

**Saída:**
```ts
export interface AuthUser {
  id: UUID
  name: string
  email: string
  role: Role
}

export interface LoginPayload {
  email: string
  password: string
}

export interface JWTPayload {
  sub: UUID
  role: Role
  exp: number
}
```

---

#### TASK-021 · [FE] auth.store.ts — estado global de autenticação (Zustand)

**Módulo:** `src/features/auth/stores/`
**Prioridade:** 🔴 Crítica

**Arquivos exclusivos desta task:**
- `apps/frontend/src/features/auth/stores/auth.store.ts`

**Entrada:**
- `TASK-020` concluída (tipos `AuthUser` disponíveis)
- Dependência: `zustand`

**Saída:**
- Store Zustand com: `token: string | null`, `user: AuthUser | null`, `setAuth(token, user)`, `clearAuth()`
- Usado pelo interceptor Axios (`TASK-009`) via `useAuthStore.getState().token`

**Contrato de saída (módulo):**
```ts
interface AuthStore {
  token: string | null
  user: AuthUser | null
  setAuth: (token: string, user: AuthUser) => void
  clearAuth: () => void
}
export const useAuthStore: UseBoundStore<StoreApi<AuthStore>>
```

---

#### TASK-022 · [FE] auth.api.ts — chamadas de autenticação

**Módulo:** `src/features/auth/api/`
**Prioridade:** 🔴 Crítica

**Arquivos exclusivos desta task:**
- `apps/frontend/src/features/auth/api/auth.api.ts`

**Entrada:**
- `TASK-009` concluída (instância `api` disponível)
- `TASK-020` concluída (tipos disponíveis)

**Saída:**
```ts
export const authApi = {
  login(payload: LoginPayload): Promise<{ token: string; user: AuthUser }>
}
```

---

#### TASK-023 · [FE] useLogin.ts — hook de login

**Módulo:** `src/features/auth/hooks/`
**Prioridade:** 🔴 Crítica

**Arquivos exclusivos desta task:**
- `apps/frontend/src/features/auth/hooks/useLogin.ts`

**Entrada:**
- `TASK-022` concluída (`authApi` disponível)
- `TASK-021` concluída (`useAuthStore` disponível)

**Saída:**
- Hook que usa `useMutation` do TanStack Query
- Em `onSuccess`: chama `setAuth(token, user)` e redireciona por role (`ADMIN → /admin`, `SECRETARY → /secretary`)
- Em `onError`: expõe mensagem de erro para o formulário

**Contrato de saída (hook):**
```ts
export function useLogin(): {
  login: (payload: LoginPayload) => void
  isLoading: boolean
  error: string | null
}
```

---

#### TASK-024 · [FE] LoginForm.tsx — componente de formulário

**Módulo:** `src/features/auth/components/`
**Prioridade:** 🟡 Alta

**Arquivos exclusivos desta task:**
- `apps/frontend/src/features/auth/components/LoginForm.tsx`

**Entrada:**
- `TASK-023` concluída (`useLogin` disponível)
- shadcn/ui instalado (componentes `Input`, `Button`, `Label`)

**Saída:**
- Formulário com campos `email` e `password`, botão de submit
- Exibe `LoadingSpinner` durante a mutation
- Exibe mensagem de erro abaixo do formulário em caso de falha

---

#### TASK-025 · [FE] ProtectedRoute.tsx + RoleGuard.tsx

**Módulo:** `src/components/shared/`
**Prioridade:** 🔴 Crítica

**Arquivos exclusivos desta task:**
- `apps/frontend/src/components/shared/ProtectedRoute.tsx`
- `apps/frontend/src/components/shared/RoleGuard.tsx`

**Entrada:**
- `TASK-021` concluída (`useAuthStore` disponível)

**Saída:**
- `ProtectedRoute`: redireciona para `/login` se `token === null`
- `RoleGuard`: recebe `allowedRoles: Role[]`, redireciona para `/` se `user.role` não está na lista

**Contrato de saída (componentes):**
```tsx
// ProtectedRoute: envolve rotas que exigem autenticação
<ProtectedRoute><AdminDashboard /></ProtectedRoute>

// RoleGuard: restringe por role
<RoleGuard allowedRoles={['ADMIN']}><NodeEditorPage /></RoleGuard>
```

---

### 🤖 Módulo Chatbot

---

#### TASK-026 · [BE] chatbot.types.ts — DTOs de navegação

**Módulo:** `src/modules/chatbot/`
**Prioridade:** 🔴 Crítica

**Arquivos exclusivos desta task:**
- `apps/backend/src/modules/chatbot/chatbot.types.ts`

**Entrada:**
- `TASK-004` concluída (modelos `ChatNode`, `DocumentChunk`, `SessionLog` existem)

**Saída:**
```ts
export interface ChatNodeChildDTO {
  id: string
  title: string
  order: number
}

export interface ChunkWithDocumentDTO {
  id: string
  content: string
  page: number | null
  section: string | null
  document: { id: string; name: string; type: string }
}

export interface ChatNodeResponseDTO {
  id: string
  title: string
  content: string
  nodeType: 'MENU' | 'ANSWER'
  parentId: string | null
  children: ChatNodeChildDTO[]
  chunks: ChunkWithDocumentDTO[]
}

export interface CreateSessionLogDTO {
  navigationPath: string[]
  satisfaction: 'LIKED' | 'DISLIKED'
  startedAt: string  // ISO 8601
  endedAt: string    // ISO 8601
}
```

---

#### TASK-027 · [BE] chatbot.service.ts — lógica de navegação

**Módulo:** `src/modules/chatbot/`
**Prioridade:** 🔴 Crítica

**Arquivos exclusivos desta task:**
- `apps/backend/src/modules/chatbot/chatbot.service.ts`

**Entrada:**
- `TASK-026` concluída (tipos disponíveis)
- `TASK-002` concluída (`db` disponível)
- `TASK-003` concluída (`AppError` disponível)

**Saída:**
```ts
export class ChatbotService {
  async getRootNode(): Promise<ChatNodeResponseDTO>
  async getNodeById(id: string): Promise<ChatNodeResponseDTO>
  // lança AppError('Nó não encontrado', 404) se id inexistente
  async createSessionLog(dto: CreateSessionLogDTO): Promise<{ sessionLogId: string }>
}
```

---

#### TASK-028 · [BE] chatbot.controller.ts + chatbot.routes.ts

**Módulo:** `src/modules/chatbot/`
**Prioridade:** 🔴 Crítica

**Arquivos exclusivos desta task:**
- `apps/backend/src/modules/chatbot/chatbot.controller.ts`
- `apps/backend/src/modules/chatbot/chatbot.routes.ts`

**Entrada:**
- `TASK-027` concluída (`ChatbotService` disponível)

**Saída:**
- `GET /nodes/root` → `ChatbotService.getRootNode()`
- `GET /nodes/:id` → `ChatbotService.getNodeById(id)` 
- `POST /sessions/rating` → `ChatbotService.createSessionLog(body)` com validação Zod

**Contrato de saída (HTTP):**
```
GET  /api/v1/nodes/root     → 200: { success: true, data: ChatNodeResponseDTO }
GET  /api/v1/nodes/:id      → 200: { success: true, data: ChatNodeResponseDTO }
                            → 404: { success: false, message: "Nó não encontrado" }
POST /api/v1/sessions/rating → 201: { success: true, data: { sessionLogId: string } }
                             → 422: validação Zod
```

---

#### TASK-029 · [FE] chatbot.types.ts — tipos de navegação

**Módulo:** `src/features/chatbot/types/`
**Prioridade:** 🔴 Crítica

**Arquivos exclusivos desta task:**
- `apps/frontend/src/features/chatbot/types/chatbot.types.ts`

**Entrada:**
- `TASK-008` concluída (tipos base disponíveis)

**Saída:**
```ts
export interface ChatNodeChild { id: UUID; title: string; order: number }

export interface ChunkWithDocument {
  id: UUID; content: string; page: number | null; section: string | null
  document: { id: UUID; name: string; type: string }
}

export interface ChatNode {
  id: UUID; title: string; content: string
  nodeType: NodeType; parentId: UUID | null
  children: ChatNodeChild[]; chunks: ChunkWithDocument[]
}

export interface ChatMessage {
  id: string
  sender: 'bot' | 'user'
  text: string
  nodeId?: UUID
}

export interface SessionRatingPayload {
  navigationPath: UUID[]
  satisfaction: Satisfaction
  startedAt: string
  endedAt: string
}
```

---

#### TASK-030 · [FE] chatbot.api.ts — chamadas de navegação

**Módulo:** `src/features/chatbot/api/`
**Prioridade:** 🔴 Crítica

**Arquivos exclusivos desta task:**
- `apps/frontend/src/features/chatbot/api/chatbot.api.ts`

**Entrada:**
- `TASK-009` concluída (instância `api`)
- `TASK-029` concluída (tipos disponíveis)

**Saída:**
```ts
export const chatbotApi = {
  getRootNode(): Promise<ChatNode>
  getNode(id: UUID): Promise<ChatNode>
  submitRating(payload: SessionRatingPayload): Promise<{ sessionLogId: UUID }>
}
```

---

#### TASK-031 · [FE] useChatNavigation.ts — hook de estado da sessão

**Módulo:** `src/features/chatbot/hooks/`
**Prioridade:** 🔴 Crítica

**Arquivos exclusivos desta task:**
- `apps/frontend/src/features/chatbot/hooks/useChatNavigation.ts`

**Entrada:**
- `TASK-030` concluída (`chatbotApi` disponível)
- `TASK-009` concluída (`queryClient` disponível)

**Saída:**
- Hook que gerencia: nó atual, histórico de mensagens, caminho de navegação, timestamps de sessão
- Usa `useQuery` para buscar o nó raiz na inicialização e cada nó filho ao clicar

**Contrato de saída (hook):**
```ts
export function useChatNavigation(): {
  currentNode: ChatNode | null
  messages: ChatMessage[]
  navigationPath: UUID[]
  isLoading: boolean
  sessionStartedAt: string
  navigateTo: (nodeId: UUID) => void
  resetSession: () => void
}
```

---

#### TASK-032 · [FE] MessageBubble.tsx + OptionButton.tsx

**Módulo:** `src/features/chatbot/components/`
**Prioridade:** 🟡 Alta

**Arquivos exclusivos desta task:**
- `apps/frontend/src/features/chatbot/components/MessageBubble.tsx`
- `apps/frontend/src/features/chatbot/components/OptionButton.tsx`

**Entrada:**
- `TASK-029` concluída (tipos `ChatMessage`, `ChatNodeChild`)
- Tailwind disponível

**Saída:**
- `MessageBubble`: renderiza uma mensagem do bot (alinhada à esquerda) ou do usuário (alinhada à direita) com estilo distinto
- `OptionButton`: botão clicável que exibe `child.title`, chama `onClick(child.id)` ao clicar

---

#### TASK-033 · [FE] EvidenceCard.tsx

**Módulo:** `src/features/chatbot/components/`
**Prioridade:** 🟡 Alta

**Arquivos exclusivos desta task:**
- `apps/frontend/src/features/chatbot/components/EvidenceCard.tsx`

**Entrada:**
- `TASK-029` concluída (tipo `ChunkWithDocument`)

**Saída:**
- Componente que recebe `chunk: ChunkWithDocument` e exibe: trecho do documento em destaque, nome do documento, página e seção (quando disponíveis)

---

#### TASK-034 · [FE] SatisfactionRating.tsx

**Módulo:** `src/features/chatbot/components/`
**Prioridade:** 🟡 Alta

**Arquivos exclusivos desta task:**
- `apps/frontend/src/features/chatbot/components/SatisfactionRating.tsx`

**Entrada:**
- `TASK-029` concluída (tipo `Satisfaction`)
- `TASK-030` concluída (`chatbotApi.submitRating`)

**Saída:**
- Componente com botões "👍 Gostei" e "👎 Não gostei"
- Recebe `navigationPath: UUID[]` e `sessionStartedAt: string`
- Ao clicar, chama `chatbotApi.submitRating()` e exibe confirmação

---

#### TASK-035 · [FE] ChatWindow.tsx — orquestrador do chatbot

**Módulo:** `src/features/chatbot/components/`
**Prioridade:** 🟡 Alta

**Arquivos exclusivos desta task:**
- `apps/frontend/src/features/chatbot/components/ChatWindow.tsx`

**Entrada:**
- `TASK-031` concluída (`useChatNavigation`)
- `TASK-032` concluída (`MessageBubble`, `OptionButton`)
- `TASK-033` concluída (`EvidenceCard`)
- `TASK-034` concluída (`SatisfactionRating`)

**Saída:**
- Container principal da conversa
- Renderiza lista de `MessageBubble`
- Quando `currentNode.nodeType === 'MENU'`: renderiza lista de `OptionButton`
- Quando `currentNode.nodeType === 'ANSWER'`: renderiza `EvidenceCard` (se houver chunks) e `SatisfactionRating`

---

### ❓ Módulo Questions — Lado Público (Sprint 1)

---

#### TASK-036 · [BE] questions.types.ts — DTOs

**Módulo:** `src/modules/questions/`
**Prioridade:** 🟡 Alta

**Arquivos exclusivos desta task:**
- `apps/backend/src/modules/questions/questions.types.ts`

**Entrada:**
- `TASK-004` concluída (modelo `Question` existe)

**Saída:**
```ts
export interface CreateQuestionDTO {
  text: string
  email: string
  sessionLogId?: string | null
}

export interface UpdateQuestionStatusDTO {
  status: 'OPEN' | 'ANSWERED'
}

export interface QuestionResponseDTO {
  id: string; text: string; email: string
  status: 'OPEN' | 'ANSWERED'; createdAt: string
}
```

---

#### TASK-037 · [BE] questions.service.ts — criação de pergunta

**Módulo:** `src/modules/questions/`
**Prioridade:** 🟡 Alta

**Arquivos exclusivos desta task:**
- `apps/backend/src/modules/questions/questions.service.ts`

**Entrada:**
- `TASK-036` concluída
- `TASK-002` concluída (`db`)

**Saída:**
```ts
export class QuestionsService {
  async createQuestion(dto: CreateQuestionDTO): Promise<QuestionResponseDTO>
  // Sprint 3 — implementar depois:
  async listQuestions(filters: { status?: string; page: number; limit: number }): Promise<{ data: QuestionResponseDTO[]; meta: PaginationMeta }>
  async updateStatus(id: string, dto: UpdateQuestionStatusDTO): Promise<QuestionResponseDTO>
}
```
> **Nota:** na Sprint 1, implementar apenas `createQuestion`. Os demais métodos são esqueletos para Sprint 3.

---

#### TASK-038 · [BE] questions.controller.ts + questions.routes.ts (POST público)

**Módulo:** `src/modules/questions/`
**Prioridade:** 🟡 Alta

**Arquivos exclusivos desta task:**
- `apps/backend/src/modules/questions/questions.controller.ts`
- `apps/backend/src/modules/questions/questions.routes.ts`

**Entrada:**
- `TASK-037` concluída

**Saída:**
- `POST /questions` público, valida com Zod, chama `QuestionsService.createQuestion()`

**Contrato de saída (HTTP):**
```
POST /api/v1/questions
Body: { "text": string, "email": string, "sessionLogId"?: string }
→ 201: { "success": true, "data": QuestionResponseDTO }
→ 422: validação Zod
```

---

#### TASK-039 · [FE] QuestionForm.tsx — formulário de envio de pergunta

**Módulo:** `src/features/chatbot/components/`
**Prioridade:** 🟡 Alta

**Arquivos exclusivos desta task:**
- `apps/frontend/src/features/chatbot/components/QuestionForm.tsx`

**Entrada:**
- `TASK-030` concluída (`chatbotApi`) — ou criar função inline em `chatbot.api.ts`
- shadcn/ui instalado

**Saída:**
- Formulário com `text` (textarea) e `email` (input)
- Recebe `sessionLogId?: UUID` como prop opcional
- Exibe confirmação de envio após sucesso

---

### 🔗 Composição de Rotas (Backend)

---

#### TASK-040 · [BE] routes/index.ts — composição global de rotas

**Módulo:** `src/routes/`
**Prioridade:** 🔴 Crítica (deve ser atualizado a cada novo módulo)

**Arquivos exclusivos desta task:**
- `apps/backend/src/routes/index.ts`

**Entrada:**
- `TASK-017`, `TASK-028`, `TASK-038` concluídas (módulos com `.routes.ts`)

**Saída:**
- Router Express que monta todos os módulos com prefixo `/api/v1`
- Registra o health check
- Importa e usa: `auth.routes`, `chatbot.routes`, `questions.routes`

> **Regra:** toda vez que uma nova task de routes for concluída (Sprint 2, Sprint 3), esta task é atualizada — mas apenas este arquivo.

---

## 🗂️ SPRINT 2 — Painel Admin (CRUD Nós + Documentos + Usuários + RBAC)

---

### 🌳 Módulo Nodes (Admin)

---

#### TASK-041 · [BE] nodes.types.ts — DTOs de nós

**Módulo:** `src/modules/nodes/`
**Prioridade:** 🔴 Crítica

**Arquivos exclusivos desta task:**
- `apps/backend/src/modules/nodes/nodes.types.ts`

**Entrada:**
- `TASK-004` concluída (modelo `ChatNode`)

**Saída:**
```ts
export interface CreateNodeDTO {
  title: string; content: string
  nodeType: 'MENU' | 'ANSWER'
  parentId: string | null; order: number
}

export interface UpdateNodeDTO {
  title?: string; content?: string
  nodeType?: 'MENU' | 'ANSWER'
  parentId?: string | null; order?: number; isActive?: boolean
}

export interface NodeListItemDTO {
  id: string; title: string; nodeType: string
  parentId: string | null; order: number; isActive: boolean
  childrenCount: number
}
```

---

#### TASK-042 · [BE] nodes.service.ts — CRUD de nós

**Módulo:** `src/modules/nodes/`
**Prioridade:** 🔴 Crítica

**Arquivos exclusivos desta task:**
- `apps/backend/src/modules/nodes/nodes.service.ts`

**Entrada:**
- `TASK-041` concluída
- `TASK-002` concluída (`db`)
- `TASK-003` concluída (`AppError`)

**Saída:**
```ts
export class NodesService {
  async listNodes(): Promise<NodeListItemDTO[]>
  async getNodeById(id: string): Promise<ChatNodeResponseDTO>
  async createNode(dto: CreateNodeDTO): Promise<NodeListItemDTO>
  async updateNode(id: string, dto: UpdateNodeDTO): Promise<NodeListItemDTO>
  async deleteNode(id: string): Promise<void>
  // lança AppError('Nó possui filhos e não pode ser excluído', 409) se tiver filhos ativos
}
```

---

#### TASK-043 · [BE] nodes.controller.ts + nodes.routes.ts

**Módulo:** `src/modules/nodes/`
**Prioridade:** 🔴 Crítica

**Arquivos exclusivos desta task:**
- `apps/backend/src/modules/nodes/nodes.controller.ts`
- `apps/backend/src/modules/nodes/nodes.routes.ts`

**Entrada:**
- `TASK-042` concluída
- `TASK-018`, `TASK-019` concluídas (`authenticate`, `authorize`)

**Saída:**
- Todas as rotas protegidas com `authenticate + authorize('ADMIN')`

**Contrato de saída (HTTP):**
```
GET    /api/v1/nodes            → 200: { success: true, data: NodeListItemDTO[] }
POST   /api/v1/nodes            → 201: { success: true, data: NodeListItemDTO }
PATCH  /api/v1/nodes/:id        → 200: { success: true, data: NodeListItemDTO }
DELETE /api/v1/nodes/:id        → 200: { success: true }
                               → 409: { success: false, message: "Nó possui filhos..." }
```

---

#### TASK-044 · [FE] nodes.api.ts — chamadas CRUD

**Módulo:** `src/features/admin/api/`
**Prioridade:** 🔴 Crítica

**Arquivos exclusivos desta task:**
- `apps/frontend/src/features/admin/api/nodes.api.ts`

**Entrada:**
- `TASK-009` concluída (`api`)

**Saída:**
```ts
export const nodesApi = {
  list(): Promise<NodeListItemDTO[]>
  getById(id: UUID): Promise<ChatNode>
  create(dto: CreateNodePayload): Promise<NodeListItemDTO>
  update(id: UUID, dto: Partial<CreateNodePayload>): Promise<NodeListItemDTO>
  remove(id: UUID): Promise<void>
}
```

---

#### TASK-045 · [FE] useNodes.ts — hook de gerenciamento de nós

**Módulo:** `src/features/admin/hooks/`
**Prioridade:** 🔴 Crítica

**Arquivos exclusivos desta task:**
- `apps/frontend/src/features/admin/hooks/useNodes.ts`

**Entrada:**
- `TASK-044` concluída

**Saída:**
```ts
export function useNodes(): {
  nodes: NodeListItemDTO[]
  isLoading: boolean
  createNode: (dto: CreateNodePayload) => Promise<void>
  updateNode: (id: UUID, dto: Partial<CreateNodePayload>) => Promise<void>
  deleteNode: (id: UUID) => Promise<void>
}
```

---

#### TASK-046 · [FE] NodeTree.tsx — visualização hierárquica

**Módulo:** `src/features/admin/components/`
**Prioridade:** 🟡 Alta

**Arquivos exclusivos desta task:**
- `apps/frontend/src/features/admin/components/NodeTree.tsx`

**Entrada:**
- `TASK-045` concluída (`useNodes`)

**Saída:**
- Componente que renderiza a árvore de nós com indentação visual
- Cada item exibe: título, tipo (`MENU`/`ANSWER`), botões de editar e excluir
- Aceita `onEdit(node)` e `onDelete(id)` como callbacks

---

#### TASK-047 · [FE] NodeEditor.tsx — formulário de criação/edição

**Módulo:** `src/features/admin/components/`
**Prioridade:** 🟡 Alta

**Arquivos exclusivos desta task:**
- `apps/frontend/src/features/admin/components/NodeEditor.tsx`

**Entrada:**
- `TASK-045` concluída (`createNode`, `updateNode`)
- shadcn/ui (Dialog, Form, Select)

**Saída:**
- Modal/Dialog com campos: título, conteúdo, tipo (select `MENU`/`ANSWER`), nó pai (select), ordem
- Modo criação (sem `initialData`) e modo edição (com `initialData: NodeListItemDTO`)
- Chama `createNode` ou `updateNode` ao submeter

---

### 📄 Módulo Documents (Admin)

---

#### TASK-048 · [BE] documents.types.ts

**Módulo:** `src/modules/documents/`
**Prioridade:** 🟡 Alta

**Arquivos exclusivos desta task:**
- `apps/backend/src/modules/documents/documents.types.ts`

**Saída:**
```ts
export interface CreateDocumentDTO {
  name: string; type: 'REGULAMENTO' | 'MANUAL' | 'CALENDARIO' | 'PPC' | 'OUTRO'
  fileUrl?: string
  chunks: Array<{ content: string; page?: number; section?: string }>
}

export interface DocumentResponseDTO {
  id: string; name: string; type: string; fileUrl: string | null
  createdAt: string; chunksCount: number
}
```

---

#### TASK-049 · [BE] documents.service.ts + documents.controller.ts + documents.routes.ts

**Módulo:** `src/modules/documents/`
**Prioridade:** 🟡 Alta

**Arquivos exclusivos desta task:**
- `apps/backend/src/modules/documents/documents.service.ts`
- `apps/backend/src/modules/documents/documents.controller.ts`
- `apps/backend/src/modules/documents/documents.routes.ts`

**Entrada:**
- `TASK-048` concluída
- `TASK-002`, `TASK-003`, `TASK-018`, `TASK-019` concluídas

**Contrato de saída (HTTP):**
```
GET  /api/v1/documents     → 200: { success: true, data: DocumentResponseDTO[] }
POST /api/v1/documents     → 201: { success: true, data: DocumentResponseDTO }
  Body: CreateDocumentDTO  (inclui array de chunks aninhados)
DELETE /api/v1/documents/:id → 200: { success: true }
```

---

#### TASK-050 · [FE] documents.api.ts + useDocuments.ts + DocumentList.tsx

**Módulo:** `src/features/admin/`
**Prioridade:** 🟡 Alta

**Arquivos exclusivos desta task:**
- `apps/frontend/src/features/admin/api/documents.api.ts`
- `apps/frontend/src/features/admin/hooks/useDocuments.ts`
- `apps/frontend/src/features/admin/components/DocumentList.tsx`

**Entrada:**
- `TASK-049` concluída (endpoints disponíveis)

**Saída:**
- `documents.api.ts`: `list()`, `create(dto)`, `remove(id)`
- `useDocuments`: hook com `useQuery` + `useMutation`
- `DocumentList`: tabela com nome, tipo, data e botão excluir; inclui formulário de upload inline

---

### 👤 Módulo Users (Admin)

---

#### TASK-051 · [BE] users.types.ts + users.service.ts + users.controller.ts + users.routes.ts

**Módulo:** `src/modules/users/`
**Prioridade:** 🟡 Alta

**Arquivos exclusivos desta task:**
- `apps/backend/src/modules/users/users.types.ts`
- `apps/backend/src/modules/users/users.service.ts`
- `apps/backend/src/modules/users/users.controller.ts`
- `apps/backend/src/modules/users/users.routes.ts`

**Entrada:**
- `TASK-004`, `TASK-006` concluídas (`db`, `hashPassword`)
- `TASK-018`, `TASK-019` concluídas

**Contrato de saída (HTTP):**
```
GET    /api/v1/users       → 200: { success: true, data: UserResponseDTO[] }
POST   /api/v1/users       → 201: { success: true, data: UserResponseDTO }
  Body: { name, email, password, role: 'SECRETARY' }
DELETE /api/v1/users/:id   → 200: { success: true }
  → 409 se tentar excluir o único admin
```

---

#### TASK-052 · [FE] users.api.ts + UserList.tsx

**Módulo:** `src/features/admin/`
**Prioridade:** 🟡 Alta

**Arquivos exclusivos desta task:**
- `apps/frontend/src/features/admin/api/users.api.ts`
- `apps/frontend/src/features/admin/components/UserList.tsx`

**Saída:**
- `users.api.ts`: `list()`, `create(dto)`, `remove(id)`
- `UserList`: tabela com nome, e-mail, role, data e botão excluir; modal de criação

---

### 🖥️ Layouts e Páginas Admin

---

#### TASK-053 · [FE] AdminLayout.tsx + PublicLayout.tsx

**Módulo:** `src/components/layout/`
**Prioridade:** 🔴 Crítica

**Arquivos exclusivos desta task:**
- `apps/frontend/src/components/layout/AdminLayout.tsx`
- `apps/frontend/src/components/layout/PublicLayout.tsx`

**Entrada:**
- `TASK-021` concluída (`useAuthStore` para dados do usuário logado)

**Saída:**
- `AdminLayout`: sidebar com links para `/admin/nodes`, `/admin/documents`, `/admin/users`, `/admin/logs` + topbar com nome do usuário e botão logout
- `PublicLayout`: layout minimalista centralizado para o chatbot público

---

#### TASK-054 · [FE] Páginas do painel Admin

**Módulo:** `src/app/routes/admin/`
**Prioridade:** 🟡 Alta

**Arquivos exclusivos desta task:**
- `apps/frontend/src/app/routes/admin/dashboard.tsx`
- `apps/frontend/src/app/routes/admin/nodes.tsx`
- `apps/frontend/src/app/routes/admin/documents.tsx`
- `apps/frontend/src/app/routes/admin/users.tsx`

**Entrada:**
- `TASK-053` concluída (`AdminLayout`)
- `TASK-046`, `TASK-047` concluídas (componentes de nós)
- `TASK-050`, `TASK-052` concluídas (componentes de documentos e usuários)

**Saída:**
- Cada página é um componente que envolve `AdminLayout` e o componente de feature correspondente
- `dashboard.tsx`: cards com contagem de nós, perguntas abertas e documentos
- `nodes.tsx`: `NodeTree` + `NodeEditor`
- `documents.tsx`: `DocumentList`
- `users.tsx`: `UserList`

---

## 🗂️ SPRINT 3 — Painel Secretária, Logs, Satisfação e Ajustes Finais

---

### ❓ Módulo Questions — Lado Secretária

---

#### TASK-055 · [BE] questions.service.ts — extensão para listagem e status

**Módulo:** `src/modules/questions/` (extensão de `TASK-037`)
**Prioridade:** 🔴 Crítica

**Arquivos exclusivos desta task:**
- `apps/backend/src/modules/questions/questions.service.ts` *(adicionar métodos `listQuestions` e `updateStatus`)*

**Entrada:**
- `TASK-037` concluída (service com `createQuestion` já existe)

**Saída:**
- `listQuestions(filters)`: filtra por `status`, suporta paginação `?page&limit`
- `updateStatus(id, dto)`: altera `status` para `ANSWERED`; lança `AppError(404)` se não encontrado

---

#### TASK-056 · [BE] questions.controller.ts + questions.routes.ts — rotas protegidas

**Módulo:** `src/modules/questions/` (extensão de `TASK-038`)
**Prioridade:** 🔴 Crítica

**Arquivos exclusivos desta task:**
- `apps/backend/src/modules/questions/questions.controller.ts` *(adicionar handlers GET e PATCH)*
- `apps/backend/src/modules/questions/questions.routes.ts` *(adicionar rotas protegidas)*

**Entrada:**
- `TASK-055` concluída
- `TASK-018`, `TASK-019` concluídas

**Contrato de saída (HTTP):**
```
GET   /api/v1/questions?status=OPEN&page=1&limit=20
      Authorization: Bearer <SECRETARY|ADMIN>
→ 200: { success: true, data: QuestionResponseDTO[], meta: PaginationMeta }

PATCH /api/v1/questions/:id
      Authorization: Bearer <SECRETARY|ADMIN>
      Body: { "status": "ANSWERED" }
→ 200: { success: true, data: QuestionResponseDTO }
→ 404: { success: false, message: "Pergunta não encontrada" }
```

---

#### TASK-057 · [FE] questions.api.ts — chamadas para secretária

**Módulo:** `src/features/secretary/api/`
**Prioridade:** 🔴 Crítica

**Arquivos exclusivos desta task:**
- `apps/frontend/src/features/secretary/api/questions.api.ts`

**Entrada:**
- `TASK-009` concluída
- `TASK-056` concluída (endpoints disponíveis)

**Saída:**
```ts
export const questionsApi = {
  list(params: { status?: QuestionStatus; page?: number; limit?: number }): Promise<PaginatedResponse<QuestionResponseDTO>>
  updateStatus(id: UUID, status: QuestionStatus): Promise<QuestionResponseDTO>
}
```

---

#### TASK-058 · [FE] useQuestions.ts — hook de perguntas

**Módulo:** `src/features/secretary/hooks/`
**Prioridade:** 🔴 Crítica

**Arquivos exclusivos desta task:**
- `apps/frontend/src/features/secretary/hooks/useQuestions.ts`

**Entrada:**
- `TASK-057` concluída
- `TASK-013` concluída (`usePagination`)

**Saída:**
```ts
export function useQuestions(statusFilter?: QuestionStatus): {
  questions: QuestionResponseDTO[]
  meta: PaginationMeta | null
  isLoading: boolean
  updateStatus: (id: UUID, status: QuestionStatus) => Promise<void>
  page: number; setPage: (n: number) => void
}
```

---

#### TASK-059 · [FE] QuestionsTable.tsx + StatusBadge.tsx

**Módulo:** `src/features/secretary/components/`
**Prioridade:** 🟡 Alta

**Arquivos exclusivos desta task:**
- `apps/frontend/src/features/secretary/components/QuestionsTable.tsx`
- `apps/frontend/src/features/secretary/components/StatusBadge.tsx`

**Entrada:**
- `TASK-058` concluída (`useQuestions`)

**Saída:**
- `StatusBadge`: chip visual com cor distinta para `OPEN` (amarelo) e `ANSWERED` (verde)
- `QuestionsTable`: tabela com colunas texto, e-mail, status, data e ação "Marcar como respondida"

---

### 📊 Módulo Logs (Admin)

---

#### TASK-060 · [BE] logs.types.ts + logs.service.ts + logs.controller.ts + logs.routes.ts

**Módulo:** `src/modules/logs/`
**Prioridade:** 🟡 Alta

**Arquivos exclusivos desta task:**
- `apps/backend/src/modules/logs/logs.types.ts`
- `apps/backend/src/modules/logs/logs.service.ts`
- `apps/backend/src/modules/logs/logs.controller.ts`
- `apps/backend/src/modules/logs/logs.routes.ts`

**Entrada:**
- `TASK-002`, `TASK-003`, `TASK-018`, `TASK-019` concluídas

**Contrato de saída (HTTP):**
```
GET /api/v1/logs?satisfaction=DISLIKED&from=ISO&to=ISO&page=1&limit=20
    Authorization: Bearer <ADMIN>
→ 200: {
    success: true,
    data: SessionLogDTO[],  // inclui question vinculada se houver
    meta: PaginationMeta
  }
```

---

#### TASK-061 · [FE] logs.api.ts + useLogs.ts + LogTable.tsx

**Módulo:** `src/features/admin/`
**Prioridade:** 🟡 Alta

**Arquivos exclusivos desta task:**
- `apps/frontend/src/features/admin/api/logs.api.ts`
- `apps/frontend/src/features/admin/hooks/useLogs.ts`
- `apps/frontend/src/features/admin/components/LogTable.tsx`

**Entrada:**
- `TASK-060` concluída
- `TASK-011` concluída (`date.utils.ts`)

**Saída:**
- `logs.api.ts`: `list(params)` com filtros de satisfação, intervalo de datas e paginação
- `useLogs`: hook com `useQuery`, expõe filtros e paginação
- `LogTable`: tabela com caminho de navegação (resumido), satisfação, duração e perguntas vinculadas

---

### 🖥️ Páginas Secretária + Logs

---

#### TASK-062 · [FE] Páginas do painel Secretária + Logs Admin

**Módulo:** `src/app/routes/`
**Prioridade:** 🟡 Alta

**Arquivos exclusivos desta task:**
- `apps/frontend/src/app/routes/secretary/dashboard.tsx`
- `apps/frontend/src/app/routes/secretary/questions.tsx`
- `apps/frontend/src/app/routes/admin/logs.tsx`

**Entrada:**
- `TASK-053` concluída (`AdminLayout`)
- `TASK-059` concluída (`QuestionsTable`)
- `TASK-061` concluída (`LogTable`)

**Saída:**
- `secretary/dashboard.tsx`: cards com total de perguntas abertas e respondidas
- `secretary/questions.tsx`: `QuestionsTable` com filtro de status
- `admin/logs.tsx`: `LogTable` com filtros de data e satisfação

---

## 📋 Resumo — Mapa de Dependências Críticas

```
TASK-001 (Bootstrap BE)
  └─► TASK-002 (Config)
        └─► TASK-004 (Schema Prisma)
              ├─► TASK-005 (Seed)
              ├─► TASK-015 (auth.types)
              │     └─► TASK-016 (auth.service)
              │           └─► TASK-017 (auth.controller/routes) ──► TASK-040 (routes/index)
              ├─► TASK-026 (chatbot.types)
              │     └─► TASK-027 (chatbot.service)
              │           └─► TASK-028 (chatbot.controller/routes) ──► TASK-040
              └─► TASK-036 (questions.types)
                    └─► TASK-037 (questions.service)
                          └─► TASK-038 (questions.controller/routes) ──► TASK-040

TASK-006 (utils: hash/jwt) ──► TASK-016 (auth.service)

TASK-007 (Bootstrap FE)
  └─► TASK-008 (tipos globais)
        └─► TASK-009 (axios + queryClient)
              ├─► TASK-020 (auth.types FE) ──► TASK-021 (auth.store)
              │     └─► TASK-022 (auth.api) ──► TASK-023 (useLogin) ──► TASK-024 (LoginForm)
              └─► TASK-029 (chatbot.types) ──► TASK-030 (chatbot.api)
                    └─► TASK-031 (useChatNavigation)
                          └─► TASK-035 (ChatWindow)
```

---

## 🔒 Tabela de Propriedade de Arquivos por Task

| Task | Arquivos exclusivos | Pode ser desenvolvida em paralelo com |
|------|---------------------|---------------------------------------|
| TASK-015 | `auth.types.ts` [BE] | TASK-026, TASK-036, TASK-008 |
| TASK-016 | `auth.service.ts` [BE] | TASK-027, TASK-037 |
| TASK-017 | `auth.controller.ts`, `auth.routes.ts` [BE] | TASK-028, TASK-038 |
| TASK-020 | `auth.types.ts` [FE] | TASK-029, TASK-041 |
| TASK-021 | `auth.store.ts` [FE] | TASK-030, TASK-044 |
| TASK-022 | `auth.api.ts` [FE] | TASK-030, TASK-044 |
| TASK-023 | `useLogin.ts` [FE] | TASK-031, TASK-045 |
| TASK-024 | `LoginForm.tsx` [FE] | TASK-032, TASK-046 |
| TASK-026 | `chatbot.types.ts` [BE] | TASK-015, TASK-036 |
| TASK-027 | `chatbot.service.ts` [BE] | TASK-016, TASK-037 |
| TASK-028 | `chatbot.controller.ts`, `chatbot.routes.ts` [BE] | TASK-017, TASK-038 |
| TASK-029 | `chatbot.types.ts` [FE] | TASK-020, TASK-008 |
| TASK-030 | `chatbot.api.ts` [FE] | TASK-022, TASK-044 |
| TASK-031 | `useChatNavigation.ts` [FE] | TASK-023, TASK-045 |

---

> **Convenção de commits:** `feat(task-001): bootstrap Express app`
> Cada commit deve referenciar o ID da task para rastreabilidade no backlog.

