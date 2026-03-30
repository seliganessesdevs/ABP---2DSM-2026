# FatecBot — Sprint 1 · Tabela de Tasks

> **Sprint 1 — Fundação, Autenticação e Chatbot Público**
> Período: A definir · Status: 🔵 Planejado
>
> **Objetivo:** sistema funcional do ponto de vista do aluno — chatbot navegável, envio de pergunta e infraestrutura base autenticada.

---

## Princípios de Leitura

| Símbolo | Significado |
|---------|-------------|
| `[BE]` | Task de backend (`apps/backend/`) |
| `[FE]` | Task de frontend (`apps/frontend/`) |
| `[INFRA]` | Task de infraestrutura (raiz do monorepo) |
| `[FIGMA]` | Task de design de interface (Figma — sem arquivos de código) |

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

> 🎯 **Total Sprint 1: 112 pts** · 43 tasks

| Task | Tipo | Módulo | Nome | RFs | RNFs | Prioridade | Pts |
|------|------|--------|------|-----|------|------------|-----|
| TASK-001 | `[BE]` | Infra | Bootstrap do servidor Express | — | RNF05 · RNF06 | 🔴 Crítica | **2** |
| TASK-002 | `[BE]` | Infra | Configuração de ambiente e banco de dados | — | RNF05 · RNF09 | 🔴 Crítica | **2** |
| TASK-003 | `[BE]` | Infra | Classe AppError e middleware de erros | RF11 | RNF02 · RNF09 | 🔴 Crítica | **3** |
| TASK-004 | `[BE]` | Infra | Schema Prisma e migration inicial | RF01 · RF02 · RF03 · RF05 · RF07 · RF08 · RF09 | — | 🔴 Crítica | **5** |
| TASK-005 | `[BE]` | Infra | Seed de dados iniciais | RF02 · RF03 · RF09 | RNF09 | 🟡 Alta | **2** |
| TASK-006 | `[BE]` | Infra | Utils: hash e JWT | RF09 | RNF08 · RNF09 | 🔴 Crítica | **3** |
| TASK-007 | `[FIGMA]` | Design | Design System e tokens visuais | — | RNF01 | 🟡 Alta | **5** |
| TASK-008 | `[FIGMA]` | Design | Wireframes — Login e fluxo de autenticação | RF03 · RF09 | RNF01 | 🟡 Alta | **3** |
| TASK-009 | `[FIGMA]` | Design | Wireframes — Interface do Chatbot público | RF01 · RF02 · RF05 · RF07 | RNF01 | 🔴 Crítica | **5** |
| TASK-010 | `[FE]` | Infra | Bootstrap do projeto Vite + TypeScript | — | RNF01 · RNF05 | 🔴 Crítica | **2** |
| TASK-011 | `[FE]` | Infra | Tipos globais compartilhados | RF01 · RF03 · RF07 | — | 🔴 Crítica | **2** |
| TASK-012 | `[FE]` | Infra | Instância Axios e React Query client | RF09 · RF11 | RNF02 · RNF08 | 🔴 Crítica | **3** |
| TASK-013 | `[FE]` | Infra | Provider global e Router | RF03 · RF09 · RF10 · RF11 | — | 🔴 Crítica | **2** |
| TASK-014 | `[FE]` | Infra | Utils frontend | RF09 | RNF01 · RNF08 | 🟡 Alta | **2** |
| TASK-015 | `[FE]` | Infra | Componentes compartilhados base | — | RNF01 · RNF02 | 🟡 Alta | **2** |
| TASK-016 | `[FE]` | Infra | Hooks globais utilitários | — | RNF01 · RNF02 | 🟢 Média | **2** |
| TASK-017 | `[INFRA]` | Docker | Docker Compose e Dockerfiles | — | RNF05 · RNF06 | 🔴 Crítica | **3** |
| TASK-018 | `[BE]` | Auth | auth.types.ts — DTOs de autenticação | RF03 · RF09 | RNF08 | 🔴 Crítica | **1** |
| TASK-019 | `[BE]` | Auth | auth.service.ts — lógica de autenticação | RF03 · RF09 | RNF08 · RNF09 | 🔴 Crítica | **3** |
| TASK-020 | `[BE]` | Auth | auth.controller.ts + auth.routes.ts | RF09 · RF11 | — | 🔴 Crítica | **3** |
| TASK-021 | `[BE]` | Auth | auth.middleware.ts — validação JWT | RF09 · RF11 | RNF08 | 🔴 Crítica | **2** |
| TASK-022 | `[BE]` | Auth | rbac.middleware.ts — autorização por role | RF03 · RF10 · RF11 | — | 🔴 Crítica | **2** |
| TASK-023 | `[FE]` | Auth | auth.types.ts — tipos de autenticação | RF03 · RF09 | RNF08 | 🔴 Crítica | **1** |
| TASK-024 | `[FE]` | Auth | auth.store.ts — estado global (Zustand) | RF09 · RF10 · RF11 | — | 🔴 Crítica | **2** |
| TASK-025 | `[FE]` | Auth | auth.api.ts — chamadas de autenticação | RF09 | RNF08 | 🔴 Crítica | **1** |
| TASK-026 | `[FE]` | Auth | useLogin.ts — hook de login | RF03 · RF09 · RF10 | — | 🔴 Crítica | **3** |
| TASK-027 | `[FE]` | Auth | LoginForm.tsx — componente de formulário | RF09 | RNF01 | 🟡 Alta | **3** |
| TASK-028 | `[FE]` | Auth | ProtectedRoute.tsx + RoleGuard.tsx | RF03 · RF10 · RF11 | — | 🔴 Crítica | **2** |
| TASK-029 | `[BE]` | Chatbot | chatbot.types.ts — DTOs de navegação | RF01 · RF02 · RF07 · RF08 | — | 🔴 Crítica | **2** |
| TASK-030 | `[BE]` | Chatbot | chatbot.service.ts — lógica de navegação | RF01 · RF02 · RF07 · RF08 | — | 🔴 Crítica | **5** |
| TASK-031 | `[BE]` | Chatbot | chatbot.controller.ts + chatbot.routes.ts | RF01 · RF07 · RF08 | — | 🔴 Crítica | **3** |
| TASK-032 | `[FE]` | Chatbot | chatbot.types.ts — tipos de navegação | RF01 · RF02 · RF07 · RF08 | — | 🔴 Crítica | **2** |
| TASK-033 | `[FE]` | Chatbot | chatbot.api.ts — chamadas de navegação | RF01 · RF07 · RF08 | — | 🔴 Crítica | **2** |
| TASK-034 | `[FE]` | Chatbot | useChatNavigation.ts — hook de sessão | RF01 · RF07 · RF08 | RNF02 | 🔴 Crítica | **5** |
| TASK-035 | `[FE]` | Chatbot | MessageBubble.tsx + OptionButton.tsx | RF01 | RNF01 | 🟡 Alta | **3** |
| TASK-036 | `[FE]` | Chatbot | EvidenceCard.tsx | RF02 | RNF01 | 🟡 Alta | **2** |
| TASK-037 | `[FE]` | Chatbot | SatisfactionRating.tsx | RF07 · RF08 | RNF01 | 🟡 Alta | **3** |
| TASK-038 | `[FE]` | Chatbot | ChatWindow.tsx — orquestrador do chatbot | RF01 · RF02 · RF07 | RNF01 | 🟡 Alta | **5** |
| TASK-039 | `[BE]` | Questions | questions.types.ts — DTOs | RF05 · RF08 | — | 🟡 Alta | **1** |
| TASK-040 | `[BE]` | Questions | questions.service.ts — criação de pergunta | RF05 · RF08 | — | 🟡 Alta | **2** |
| TASK-041 | `[BE]` | Questions | questions.controller.ts + questions.routes.ts (POST público) | RF05 · RF11 | — | 🟡 Alta | **2** |
| TASK-042 | `[FE]` | Questions | QuestionForm.tsx — formulário de envio | RF05 · RF08 | RNF01 | 🟡 Alta | **3** |
| TASK-043 | `[BE]` | Infra | routes/index.ts — composição global de rotas | RF01 · RF05 · RF09 · RF11 | — | 🔴 Crítica | **1** |

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

## 📉 Burndown de Referência — Sprint 1

> Linha ideal: partindo de **112 pts** no dia 0, chegando a **0 pts** no último dia.
> Marque uma task como concluída assim que seu PR for mergeado em `develop`.

| Task | Pts | Pts Restantes (ideal) |
|------|-----|-----------------------|
| TASK-001 | 2 | 112 |
| TASK-002 | 2 | 110 |
| TASK-003 | 3 | 108 |
| TASK-004 | 5 | 105 |
| TASK-005 | 2 | 100 |
| TASK-006 | 3 | 98 |
| TASK-007 | 5 | 95 |
| TASK-008 | 3 | 90 |
| TASK-009 | 5 | 87 |
| TASK-010 | 2 | 82 |
| TASK-011 | 2 | 80 |
| TASK-012 | 3 | 78 |
| TASK-013 | 2 | 75 |
| TASK-014 | 2 | 73 |
| TASK-015 | 2 | 71 |
| TASK-016 | 2 | 69 |
| TASK-017 | 3 | 67 |
| TASK-018 | 1 | 64 |
| TASK-019 | 3 | 63 |
| TASK-020 | 3 | 60 |
| TASK-021 | 2 | 57 |
| TASK-022 | 2 | 55 |
| TASK-023 | 1 | 53 |
| TASK-024 | 2 | 52 |
| TASK-025 | 1 | 50 |
| TASK-026 | 3 | 49 |
| TASK-027 | 3 | 46 |
| TASK-028 | 2 | 43 |
| TASK-029 | 2 | 41 |
| TASK-030 | 5 | 39 |
| TASK-031 | 3 | 34 |
| TASK-032 | 2 | 31 |
| TASK-033 | 2 | 29 |
| TASK-034 | 5 | 27 |
| TASK-035 | 3 | 22 |
| TASK-036 | 2 | 19 |
| TASK-037 | 3 | 17 |
| TASK-038 | 5 | 14 |
| TASK-039 | 1 | 9 |
| TASK-040 | 2 | 8 |
| TASK-041 | 2 | 6 |
| TASK-042 | 3 | 4 |
| TASK-043 | 1 | 1 |

> **Total Sprint 1:** 112 pts · 43 tasks
> Escala Fibonacci: **1** tipo/config · **2** arquivo simples · **3** lógica média · **5** múltiplos arquivos ou lógica complexa

---