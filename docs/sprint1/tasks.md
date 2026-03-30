# FatecBot — Sprint 1 · Tabela de Tasks

> **Sprint 1 — Fundação, Autenticação e Chatbot Público**
> Período: A definir · Status: 🔵 Planejado
>
> **Objetivo:** sistema funcional do ponto de vista do aluno — chatbot navegável, envio de pergunta e infraestrutura base autenticada.

---

## Legenda de Requisitos

### Funcionais

| Código | Descrição resumida |
|--------|-------------------|
| RF01 | Navegação conversacional — menus e submenus hierárquicos |
| RF02 | Repositório de conhecimento — nós, documentos, chunks e metadados |
| RF03 | Perfis de usuário — Aluno (público), Secretária e Administrador |
| RF05 | Encaminhamento de pergunta — texto + e-mail institucional |
| RF07 | Avaliação de satisfação — "Gostei" / "Não gostei" ao fim do atendimento |
| RF08 | Registro de logs — navigationPath, satisfação, timestamps |
| RF09 | Autenticação — login/senha para Secretária e Administrador |
| RF10 | Autorização por papel (RBAC) — controle de acesso no backend |
| RF11 | Proteção de rotas — middleware JWT obrigatório em rotas sensíveis |

### Não Funcionais

| Código | Descrição resumida |
|--------|-------------------|
| RNF01 | Interface simples, clara e responsiva (mobile e desktop) |
| RNF02 | Tempo de resposta adequado ao uso interativo |
| RNF05 | Containerização com Docker — 3 containers |
| RNF06 | Orquestração via Docker Compose com comando único |
| RNF08 | Autenticação JWT com `sub`, `role` e `exp` via `Authorization: Bearer` |
| RNF09 | Senhas com Argon2id; segredos em variáveis de ambiente; sem exposição de dados sensíveis |

> RF04, RF06, RF08 (painel admin/secretária) e RNF03/RNF04/RNF07 não são cobertos na Sprint 1.

---

## Tabela de Rastreabilidade — Sprint 1

| Task | Tipo | Módulo | Nome | RFs | RNFs | Prioridade |
|------|------|--------|------|-----|------|------------|
| TASK-001 | `[BE]` | Infra | Bootstrap do servidor Express | — | RNF05 · RNF06 | 🔴 Crítica |
| TASK-002 | `[BE]` | Infra | Configuração de ambiente e banco de dados | — | RNF05 · RNF09 | 🔴 Crítica |
| TASK-003 | `[BE]` | Infra | Classe AppError e middleware de erros | RF11 | RNF02 · RNF09 | 🔴 Crítica |
| TASK-004 | `[BE]` | Infra | Schema Prisma e migration inicial | RF01 · RF02 · RF03 · RF05 · RF07 · RF08 · RF09 | — | 🔴 Crítica |
| TASK-005 | `[BE]` | Infra | Seed de dados iniciais | RF02 · RF03 · RF09 | RNF09 | 🟡 Alta |
| TASK-006 | `[BE]` | Infra | Utils: hash e JWT | RF09 | RNF08 · RNF09 | 🔴 Crítica |
| TASK-007 | `[FIGMA]` | Design | Design System e tokens visuais | — | RNF01 | 🟡 Alta |
| TASK-008 | `[FIGMA]` | Design | Wireframes — Login e fluxo de autenticação | RF03 · RF09 | RNF01 | 🟡 Alta |
| TASK-009 | `[FIGMA]` | Design | Wireframes — Interface do Chatbot público | RF01 · RF02 · RF05 · RF07 | RNF01 | 🔴 Crítica |
| TASK-010 | `[FE]` | Infra | Bootstrap do projeto Vite + TypeScript | — | RNF01 · RNF05 | 🔴 Crítica |
| TASK-011 | `[FE]` | Infra | Tipos globais compartilhados | RF01 · RF03 · RF07 | — | 🔴 Crítica |
| TASK-012 | `[FE]` | Infra | Instância Axios e React Query client | RF09 · RF11 | RNF02 · RNF08 | 🔴 Crítica |
| TASK-013 | `[FE]` | Infra | Provider global e Router | RF03 · RF09 · RF10 · RF11 | — | 🔴 Crítica |
| TASK-014 | `[FE]` | Infra | Utils frontend | RF09 | RNF01 · RNF08 | 🟡 Alta |
| TASK-015 | `[FE]` | Infra | Componentes compartilhados base | — | RNF01 · RNF02 | 🟡 Alta |
| TASK-016 | `[FE]` | Infra | Hooks globais utilitários | — | RNF01 · RNF02 | 🟢 Média |
| TASK-017 | `[INFRA]` | Docker | Docker Compose e Dockerfiles | — | RNF05 · RNF06 | 🔴 Crítica |
| TASK-018 | `[BE]` | Auth | auth.types.ts — DTOs de autenticação | RF03 · RF09 | RNF08 | 🔴 Crítica |
| TASK-019 | `[BE]` | Auth | auth.service.ts — lógica de autenticação | RF03 · RF09 | RNF08 · RNF09 | 🔴 Crítica |
| TASK-020 | `[BE]` | Auth | auth.controller.ts + auth.routes.ts | RF09 · RF11 | — | 🔴 Crítica |
| TASK-021 | `[BE]` | Auth | auth.middleware.ts — validação JWT | RF09 · RF11 | RNF08 | 🔴 Crítica |
| TASK-022 | `[BE]` | Auth | rbac.middleware.ts — autorização por role | RF03 · RF10 · RF11 | — | 🔴 Crítica |
| TASK-023 | `[FE]` | Auth | auth.types.ts — tipos de autenticação | RF03 · RF09 | RNF08 | 🔴 Crítica |
| TASK-024 | `[FE]` | Auth | auth.store.ts — estado global (Zustand) | RF09 · RF10 · RF11 | — | 🔴 Crítica |
| TASK-025 | `[FE]` | Auth | auth.api.ts — chamadas de autenticação | RF09 | RNF08 | 🔴 Crítica |
| TASK-026 | `[FE]` | Auth | useLogin.ts — hook de login | RF03 · RF09 · RF10 | — | 🔴 Crítica |
| TASK-027 | `[FE]` | Auth | LoginForm.tsx — componente de formulário | RF09 | RNF01 | 🟡 Alta |
| TASK-028 | `[FE]` | Auth | ProtectedRoute.tsx + RoleGuard.tsx | RF03 · RF10 · RF11 | — | 🔴 Crítica |
| TASK-029 | `[BE]` | Chatbot | chatbot.types.ts — DTOs de navegação | RF01 · RF02 · RF07 · RF08 | — | 🔴 Crítica |
| TASK-030 | `[BE]` | Chatbot | chatbot.service.ts — lógica de navegação | RF01 · RF02 · RF07 · RF08 | — | 🔴 Crítica |
| TASK-031 | `[BE]` | Chatbot | chatbot.controller.ts + chatbot.routes.ts | RF01 · RF07 · RF08 | — | 🔴 Crítica |
| TASK-032 | `[FE]` | Chatbot | chatbot.types.ts — tipos de navegação | RF01 · RF02 · RF07 · RF08 | — | 🔴 Crítica |
| TASK-033 | `[FE]` | Chatbot | chatbot.api.ts — chamadas de navegação | RF01 · RF07 · RF08 | — | 🔴 Crítica |
| TASK-034 | `[FE]` | Chatbot | useChatNavigation.ts — hook de sessão | RF01 · RF07 · RF08 | RNF02 | 🔴 Crítica |
| TASK-035 | `[FE]` | Chatbot | MessageBubble.tsx + OptionButton.tsx | RF01 | RNF01 | 🟡 Alta |
| TASK-036 | `[FE]` | Chatbot | EvidenceCard.tsx | RF02 | RNF01 | 🟡 Alta |
| TASK-037 | `[FE]` | Chatbot | SatisfactionRating.tsx | RF07 · RF08 | RNF01 | 🟡 Alta |
| TASK-038 | `[FE]` | Chatbot | ChatWindow.tsx — orquestrador do chatbot | RF01 · RF02 · RF07 | RNF01 | 🟡 Alta |
| TASK-039 | `[BE]` | Questions | questions.types.ts — DTOs | RF05 · RF08 | — | 🟡 Alta |
| TASK-040 | `[BE]` | Questions | questions.service.ts — criação de pergunta | RF05 · RF08 | — | 🟡 Alta |
| TASK-041 | `[BE]` | Questions | questions.controller.ts + questions.routes.ts (POST público) | RF05 · RF11 | — | 🟡 Alta |
| TASK-042 | `[FE]` | Questions | QuestionForm.tsx — formulário de envio | RF05 · RF08 | RNF01 | 🟡 Alta |
| TASK-043 | `[BE]` | Infra | routes/index.ts — composição global de rotas | RF01 · RF05 · RF09 · RF11 | — | 🔴 Crítica |

---

## Cobertura de Requisitos por Task

A tabela abaixo mostra, para cada RF/RNF coberto na Sprint 1, **quais tasks o implementam**.
Use para verificar se um requisito tem cobertura completa antes do Sprint Review.

### Requisitos Funcionais

| Requisito | Descrição | Tasks que implementam |
|-----------|-----------|----------------------|
| **RF01** | Navegação conversacional | TASK-004 · TASK-009 · TASK-011 · TASK-029 · TASK-030 · TASK-031 · TASK-032 · TASK-033 · TASK-034 · TASK-035 · TASK-038 · TASK-043 |
| **RF02** | Repositório de conhecimento | TASK-004 · TASK-009 · TASK-011 · TASK-029 · TASK-030 · TASK-032 · TASK-036 · TASK-038 |
| **RF03** | Perfis de usuário | TASK-004 · TASK-008 · TASK-011 · TASK-013 · TASK-018 · TASK-019 · TASK-022 · TASK-023 · TASK-026 · TASK-028 |
| **RF05** | Encaminhamento de pergunta | TASK-004 · TASK-009 · TASK-039 · TASK-040 · TASK-041 · TASK-042 · TASK-043 |
| **RF07** | Avaliação de satisfação | TASK-004 · TASK-009 · TASK-011 · TASK-029 · TASK-030 · TASK-031 · TASK-032 · TASK-033 · TASK-034 · TASK-037 · TASK-038 |
| **RF08** | Registro de logs | TASK-004 · TASK-029 · TASK-030 · TASK-031 · TASK-032 · TASK-033 · TASK-034 · TASK-037 · TASK-039 · TASK-040 · TASK-042 |
| **RF09** | Autenticação | TASK-002 · TASK-004 · TASK-005 · TASK-006 · TASK-008 · TASK-012 · TASK-013 · TASK-014 · TASK-018 · TASK-019 · TASK-020 · TASK-021 · TASK-023 · TASK-024 · TASK-025 · TASK-026 · TASK-027 · TASK-043 |
| **RF10** | Autorização por papel (RBAC) | TASK-013 · TASK-022 · TASK-024 · TASK-026 · TASK-028 |
| **RF11** | Proteção de rotas | TASK-003 · TASK-012 · TASK-013 · TASK-020 · TASK-021 · TASK-022 · TASK-024 · TASK-028 · TASK-041 · TASK-043 |

### Requisitos Não Funcionais

| Requisito | Descrição | Tasks que implementam |
|-----------|-----------|----------------------|
| **RNF01** | Interface responsiva | TASK-007 · TASK-008 · TASK-009 · TASK-010 · TASK-014 · TASK-015 · TASK-016 · TASK-027 · TASK-035 · TASK-036 · TASK-037 · TASK-038 · TASK-042 |
| **RNF02** | Tempo de resposta adequado | TASK-003 · TASK-012 · TASK-015 · TASK-016 · TASK-034 |
| **RNF05** | Containerização Docker | TASK-001 · TASK-002 · TASK-010 · TASK-017 |
| **RNF06** | Docker Compose — comando único | TASK-001 · TASK-017 |
| **RNF08** | JWT com sub · role · exp via Bearer | TASK-006 · TASK-012 · TASK-014 · TASK-018 · TASK-019 · TASK-021 · TASK-023 · TASK-025 |
| **RNF09** | Argon2id · segredos em env · sem leak sensível | TASK-002 · TASK-003 · TASK-005 · TASK-006 · TASK-019 |

---

## Visão por Módulo

### 🏗️ Infraestrutura — 17 tasks (TASK-001 a TASK-017)

Tasks sem RF direto: são **pré-condição técnica** para a entrega de todos os outros requisitos.
Focam em RNF05 (Docker), RNF06 (Compose), RNF01 (frontend), RNF08/RNF09 (segurança base).

| Task | Entrega chave | Desbloqueia |
|------|---------------|-------------|
| TASK-001 | Servidor Express rodando em `:3333` com `/health` | Todas as tasks `[BE]` |
| TASK-002 | `env.ts` validado + `db` Prisma singleton | TASK-004 · TASK-006 · TASK-018+ |
| TASK-003 | `AppError` + `errorMiddleware` + `loggerMiddleware` | Todos os services e controllers |
| TASK-004 | Schema completo + migrations aplicadas | Todos os services (lê o banco) |
| TASK-005 | Admin + Secretária + nó raiz no banco | Testes end-to-end da Sprint 1 |
| TASK-006 | `hashPassword` · `comparePassword` · `generateToken` · `verifyToken` | TASK-019 (auth.service) |
| TASK-007 | Design System Figma — paleta, tipografia, componentes base | TASK-008 · TASK-009 |
| TASK-008 | Wireframes Login Figma — frames com estados de erro e loading | TASK-027 (LoginForm) |
| TASK-009 | Wireframes Chatbot Figma — ChatWindow, EvidenceCard, SatisfactionRating, QuestionForm | TASK-035 a TASK-038 · TASK-042 |
| TASK-010 | Vite + TS + Tailwind + alias `@/` | Todas as tasks `[FE]` |
| TASK-011 | Tipos `ApiResponse` · `Role` · `NodeType` · `Satisfaction` | Todas as features FE |
| TASK-012 | Axios com interceptor JWT + `queryClient` | TASK-025 · TASK-033 · TASK-040+ |
| TASK-013 | `provider.tsx` + `router.tsx` com rotas `/`, `/login`, `/admin/*`, `/secretary/*` | Páginas de todas as features |
| TASK-014 | `formatDate` · `decodeJWT` · `isTokenExpired` | TASK-026 (hook de login) |
| TASK-015 | `LoadingSpinner` · `ErrorBoundary` | TASK-027 · TASK-035+ |
| TASK-016 | `useDebounce` · `usePagination` | Sprint 2/3 (listas paginadas) |
| TASK-017 | `docker-compose.yml` + Dockerfiles — 3 containers em `docker compose up` | Ambiente integrado |

### 🔐 Módulo Auth — 11 tasks (TASK-018 a TASK-028)

Cobre: **RF09** (autenticação), **RF10** (RBAC), **RF11** (proteção de rotas), **RF03** (perfis).

```
[BE] TASK-018 → TASK-019 → TASK-020
               ↓
[BE] TASK-006 ↗
               TASK-021 (auth.middleware) → todas as rotas protegidas
               TASK-022 (rbac.middleware) → rotas ADMIN/SECRETARY

[FE] TASK-023 → TASK-024 → TASK-025 → TASK-026 → TASK-027
                              ↓
                         TASK-012 (axios injeta token de TASK-024)
                              TASK-028 (ProtectedRoute + RoleGuard)
```

### 🤖 Módulo Chatbot — 10 tasks (TASK-029 a TASK-038)

Cobre: **RF01** (navegação), **RF02** (evidência documental), **RF07** (satisfação), **RF08** (log de sessão).

```
[BE] TASK-029 → TASK-030 → TASK-031

[FE] TASK-032 → TASK-033 → TASK-034 ──► TASK-035 (MessageBubble + OptionButton)
                                    ├──► TASK-036 (EvidenceCard)
                                    ├──► TASK-037 (SatisfactionRating)
                                    └──► TASK-038 (ChatWindow ← orquestra tudo)
```

### ❓ Módulo Questions — 4 tasks (TASK-039 a TASK-042) + TASK-043

Cobre: **RF05** (encaminhamento de pergunta público), **RF08** (vínculo com SessionLog).
`TASK-043` fecha o ciclo montando todas as rotas no Express.

---

## Tasks em Paralelo — Sem Conflito de Arquivo

O quadro abaixo permite alocar dois desenvolvedores simultaneamente sem risco de merge conflict.

| Dev A (Backend / Design) | Dev B (Frontend) | Podem rodar em paralelo? |
|--------------------------|-----------------|--------------------------|
| TASK-007 `Design System [FIGMA]` | TASK-001 a TASK-006 (BE Infra) | ✅ Sim — artefatos distintos |
| TASK-008 `Wireframes Login [FIGMA]` | TASK-018 `auth.types.ts [BE]` | ✅ Sim |
| TASK-009 `Wireframes Chatbot [FIGMA]` | TASK-029 `chatbot.types.ts [BE]` | ✅ Sim |
| TASK-018 `auth.types.ts [BE]` | TASK-023 `auth.types.ts [FE]` | ✅ Sim — arquivos distintos |
| TASK-019 `auth.service.ts` | TASK-024 `auth.store.ts` | ✅ Sim |
| TASK-020 `auth.controller + routes` | TASK-025 `auth.api.ts` | ✅ Sim |
| TASK-021 `auth.middleware.ts` | TASK-026 `useLogin.ts` | ✅ Sim |
| TASK-022 `rbac.middleware.ts` | TASK-027 `LoginForm.tsx` | ✅ Sim |
| TASK-029 `chatbot.types.ts [BE]` | TASK-032 `chatbot.types.ts [FE]` | ✅ Sim — arquivos distintos |
| TASK-030 `chatbot.service.ts` | TASK-033 `chatbot.api.ts` | ✅ Sim |
| TASK-031 `chatbot.controller + routes` | TASK-034 `useChatNavigation.ts` | ✅ Sim |
| TASK-039 `questions.types.ts [BE]` | TASK-035 `MessageBubble + OptionButton` | ✅ Sim |
| TASK-040 `questions.service.ts` | TASK-036 `EvidenceCard.tsx` | ✅ Sim |
| TASK-041 `questions.controller + routes` | TASK-037 `SatisfactionRating.tsx` | ✅ Sim |
| TASK-043 `routes/index.ts` | TASK-038 `ChatWindow.tsx` | ✅ Sim |

> ⚠️ **Arquivo compartilhado de atenção:** `routes/index.ts` (TASK-043) — atualizado apenas quando
> TASK-020, TASK-031 e TASK-041 estiverem concluídas. Nunca editar junto com outra task de routes.

---

> Documento gerado com base no backlog `fatecbot-backlog.md` e nos requisitos do `README.md`.
> Próximo: `docs/sprint1/README.md` com critérios de aceite por task.
