# 🏛️ Visão Geral da Aplicação

> Este documento descreve a arquitetura geral do **FatecBot**: seus perfis de usuário,
> o modelo de dados, o fluxo de navegação do chatbot e a topologia de containers.
> É o ponto de partida para qualquer novo membro da equipe entender o sistema como um todo.

---

## 📑 Índice

- [Perfis e Permissões](#perfis-e-permissões)
- [Arquitetura dos Containers](#arquitetura-dos-containers)
- [Modelo de Dados](#modelo-de-dados)
- [Fluxo do Chatbot](#fluxo-do-chatbot)
- [Fluxo de Autenticação](#fluxo-de-autenticação)
- [Fluxo de Encaminhamento de Pergunta](#fluxo-de-encaminhamento-de-pergunta)

---

## 👤 Perfis e Permissões <a id="perfis-e-permissões"></a>

O sistema implementa controle de acesso baseado em papéis (**RBAC — RF10**).
Existem três perfis com escopos distintos:

| Perfil                   | Autenticação |  Papel JWT  | O que pode fazer                                                                 |
| ------------------------ | :----------: | :---------: | -------------------------------------------------------------------------------- |
| **Aluno / Visitante**    |  ❌ Pública  |      —      | Navegar no chatbot, enviar pergunta à secretaria, avaliar satisfação             |
| **Secretária Acadêmica** |    ✅ JWT    | `SECRETARY` | Listar perguntas recebidas, atualizar status (aberta / respondida)               |
| **Administrador**        |    ✅ JWT    |   `ADMIN`   | CRUD de nós, documentos e usuários da secretaria; visualizar logs de atendimento |

> ⚠️ O controle de acesso **deve ser aplicado no backend** via middleware.
> Proteção apenas no frontend (esconder botões) **não é suficiente** e viola o RF10/RF11.

---

## 🐳 Arquitetura dos Containers <a id="arquitetura-dos-containers"></a>

O sistema é executado com **3 containers obrigatórios** (RNF05/RNF06),
orquestrados via `docker-compose.yml` com inicialização em comando único.

```
┌─────────────────────────────────────────────────────────────────┐
│                        docker-compose                           │
│                                                                 │
│  ┌──────────────┐    HTTP     ┌──────────────────┐             │
│  │              │ ──────────► │                  │             │
│  │   frontend   │             │     backend      │             │
│  │  (React/Vite)│ ◄────────── │  (Node/Express)  │             │
│  │  :5173       │   JSON      │  :3333           │             │
│  └──────────────┘             └────────┬─────────┘             │
│                                        │ Prisma                │
│                                        │ Client                │
│                               ┌────────▼─────────┐             │
│                               │                  │             │
│                               │    postgres      │             │
│                               │  (PostgreSQL 16) │             │
│                               │  :5432           │             │
│                               └──────────────────┘             │
└─────────────────────────────────────────────────────────────────┘
```

### Responsabilidades de cada container

| Container  | Imagem base          | Porta | Função                                                 |
| ---------- | -------------------- | :---: | ------------------------------------------------------ |
| `frontend` | `node:20-alpine`     | 5173  | Serve a SPA React em modo dev (ou Nginx em prod)       |
| `backend`  | `node:20-alpine`     | 3333  | API REST com Express + Prisma; valida JWT; aplica RBAC |
| `postgres` | `postgres:16-alpine` | 5432  | Banco de dados relacional; dados persistidos em volume |

### Comunicação

- **Frontend → Backend:** requisições HTTP REST com header `Authorization: Bearer <token>` quando autenticado
- **Backend → Postgres:** conexão via Prisma Client usando `DATABASE_URL` (definida em `.env`)
- **Frontend → Postgres:** **nunca direta** — toda operação de dados passa pelo backend

---

## 🗄️ Modelo de Dados <a id="modelo-de-dados"></a>

### Diagrama Entidade-Relacionamento

```
┌──────────────────┐        ┌───────────────────────┐
│      User        │        │       ChatNode         │
├──────────────────┤        ├───────────────────────┤
│ id (UUID) PK     │        │ id (UUID) PK           │
│ name             │        │ title                  │
│ email (unique)   │        │ content (resposta)     │
│ passwordHash     │        │ nodeType (MENU|ANSWER) │
│ role (ENUM)      │        │ parentId (FK → self)   │
│ createdAt        │        │ order (int)            │
│ updatedAt        │        │ isActive               │
└──────────────────┘        │ createdAt              │
         │                  └──────────┬────────────┘
         │                             │ 1
         │ 1                           │
         │                    ┌────────▼────────────┐
┌────────▼─────────┐          │    NodeDocument     │  (tabela pivô)
│    Question      │          ├─────────────────────┤
├──────────────────┤          │ nodeId (FK)         │
│ id (UUID) PK     │          │ documentChunkId (FK)│
│ text             │          └──────────┬──────────┘
│ email            │                     │ N
│ status (ENUM)    │          ┌──────────▼──────────┐
│ sessionLogId(FK) │          │   DocumentChunk     │
│ createdAt        │          ├─────────────────────┤
│ updatedAt        │          │ id (UUID) PK        │
└──────────────────┘          │ content (texto)     │
         │                    │ page                │
         │ N                  │ section             │
         │                    │ documentId (FK)     │
┌────────▼─────────┐          └──────────┬──────────┘
│   SessionLog     │                     │ N
├──────────────────┤          ┌──────────▼──────────┐
│ id (UUID) PK     │          │      Document       │
│ navigationPath   │          ├─────────────────────┤
│ (JSON — array    │          │ id (UUID) PK        │
│  de nodeIds)     │          │ name                │
│ satisfaction     │          │ type (ENUM)         │
│ (ENUM|null)      │          │ fileUrl             │
│ startedAt        │          │ createdAt           │
│ endedAt          │          └─────────────────────┘
└──────────────────┘
```

### Descrição das entidades

#### `User`

Representa os usuários autenticados do sistema (Secretária e Administrador).
O perfil Aluno não possui registro — acesso é público.

| Campo          | Tipo   | Descrição                                                                          |
| -------------- | ------ | ---------------------------------------------------------------------------------- |
| `id`           | UUID   | Identificador único gerado automaticamente                                         |
| `name`         | String | Nome completo do usuário                                                           |
| `email`        | String | E-mail institucional (único no sistema)                                            |
| `passwordHash` | String | Senha com hash Argon2id (memory-hard com 64 MiB por hash) — **nunca em plaintext** |
| `role`         | Enum   | `ADMIN` ou `SECRETARY`                                                             |

#### `ChatNode`

Representa cada nó da árvore de navegação do chatbot (menus, submenus e respostas).

| Campo      | Tipo   | Descrição                                                  |
| ---------- | ------ | ---------------------------------------------------------- |
| `nodeType` | Enum   | `MENU` (tem filhos/opções) ou `ANSWER` (é folha da árvore) |
| `parentId` | UUID?  | Referência ao nó pai. `null` indica nó raiz                |
| `order`    | Int    | Ordenação dos filhos dentro do mesmo pai                   |
| `content`  | String | Texto exibido ao usuário. Em nós `MENU`: pergunta/título   |

#### `DocumentChunk`

Fragmentos indexados de documentos oficiais, exibidos como evidência ao final do atendimento.

| Campo     | Tipo    | Descrição                                                  |
| --------- | ------- | ---------------------------------------------------------- |
| `content` | String  | Trecho do documento (máx. ~500 tokens)                     |
| `page`    | Int?    | Página do documento original de onde o trecho foi extraído |
| `section` | String? | Seção ou âncora do documento (ex: "Seção I, p. 25")        |

#### `SessionLog`

Registra cada sessão de atendimento completa (RF08).

| Campo            | Tipo  | Descrição                                          |
| ---------------- | ----- | -------------------------------------------------- |
| `navigationPath` | JSON  | Array de IDs de nós visitados em ordem cronológica |
| `satisfaction`   | Enum? | `LIKED`, `DISLIKED` ou `null` (não avaliado)       |

#### `Question`

Pergunta enviada pelo aluno à Secretaria Acadêmica (RF05/RF06).

| Campo          | Tipo   | Descrição                                     |
| -------------- | ------ | --------------------------------------------- |
| `text`         | String | Texto da dúvida enviada pelo aluno            |
| `email`        | String | E-mail institucional informado para resposta  |
| `status`       | Enum   | `OPEN` (em aberto) ou `ANSWERED` (respondida) |
| `sessionLogId` | UUID?  | Log da sessão em que a pergunta foi originada |

---

## 🤖 Fluxo do Chatbot <a id="fluxo-do-chatbot"></a>

O chatbot funciona como uma **árvore de navegação** armazenada no banco de dados.
Cada interação do usuário representa um passo na árvore.

```
[Usuário acessa a aplicação]
         │
         ▼
[GET /api/v1/nodes/root]
Carrega o nó raiz (pergunta inicial):
"Para qual curso você deseja atendimento?"
         │
         ▼
[Usuário seleciona uma opção]
ex: "1. Desenvolvimento de Software Multiplataforma"
         │
         ▼
[GET /api/v1/nodes/:id]
Carrega o nó filho com suas opções:
"1.1 AACC  1.2 Datas importantes  1.3 Disciplinas..."
         │
    (repete até atingir um nó ANSWER)
         │
         ▼
[Nó do tipo ANSWER alcançado]
Exibe:
  ✅ Resposta objetiva do bot
  📄 Trecho de evidência documental (se houver chunks vinculados)
         │
         ▼
[Avaliação de satisfação — RF07]
"Gostei 👍" / "Não gostei 👎"
         │
         ▼
[POST /api/v1/sessions/rating]
Salva SessionLog com:
  - navigationPath (array de IDs visitados)
  - satisfaction (LIKED | DISLIKED)
  - timestamps
         │
         ▼
[Opção: Enviar pergunta à secretaria — RF05]
  → Formulário: texto da dúvida + e-mail
  → POST /api/v1/questions
         │
         ▼
[Sessão encerrada]
```

---

## 🔐 Fluxo de Autenticação <a id="fluxo-de-autenticação"></a>

Aplicável aos perfis **Secretária Acadêmica** e **Administrador** (RF09, RNF08).

```
[Usuário acessa /login]
         │
         ▼
[Preenche e-mail + senha]
         │
         ▼
[POST /api/v1/auth/login]
  → Backend busca User por e-mail
  → Compara senha com argon2.verify() usando Argon2id (PHC 2015, superior ao bcrypt contra GPU/ASIC)
  → Se inválido: 401 Unauthorized
         │
         ▼
[Se válido: gera JWT]
  Payload: { sub: userId, role: 'ADMIN'|'SECRETARY', exp: ... }
  Assina com JWT_SECRET
  Retorna: { token, user: { id, name, role } }
         │
         ▼
[Frontend salva token no Zustand (auth.store)]
  → Axios interceptor adiciona automaticamente
    "Authorization: Bearer <token>" em toda requisição
         │
         ▼
[Redirecionamento por role]
  ADMIN      → /admin/dashboard
  SECRETARY  → /secretary/dashboard
         │
         ▼
[A cada requisição a rota protegida]
  → auth.middleware.ts verifica o token JWT
  → rbac.middleware.ts verifica se o role tem permissão
  → Se expirado ou inválido: 401 → frontend redireciona para /login
```

---

## ❓ Fluxo de Encaminhamento de Pergunta <a id="fluxo-de-encaminhamento-de-pergunta"></a>

Disponível ao fim de qualquer atendimento no chatbot (RF05/RF06).

```
[Aluno clica em "Enviar pergunta à secretaria"]
         │
         ▼
[Formulário: texto da dúvida + e-mail institucional]
         │
         ▼
[POST /api/v1/questions]
  Body: { text, email, sessionLogId? }
  → Salva Question com status: OPEN
  → Resposta: 201 Created
         │
         ▼
[Secretária acessa /secretary/questions]
  → GET /api/v1/questions  (requer role: SECRETARY)
  → Lista perguntas com status OPEN em destaque
         │
         ▼
[Secretária atualiza o status]
  → PATCH /api/v1/questions/:id
  Body: { status: 'ANSWERED' }
  → Requer role: SECRETARY
         │
         ▼
[Pergunta marcada como respondida]
  → Aluno recebe retorno por e-mail (fora do escopo do MVP)
```

---

> _Próximo documento: [`api-layer.md`](./api-layer.md) — documentação completa de todos os endpoints, com exemplos de request e response._
