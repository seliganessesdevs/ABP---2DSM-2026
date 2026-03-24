# 🔌 Camada de API

> Documentação completa de todos os endpoints REST do **FatecBot**.
> Base URL: `http://localhost:3333/api/v1`
>
> Todas as rotas protegidas exigem o header:
> ```
> Authorization: Bearer <token_jwt>
> ```

---

## 📑 Índice

- [Convenções](#convenções)
- [Autenticação](#autenticação)
- [Chatbot](#chatbot)
- [Perguntas](#perguntas)
- [Nós de Navegação (Admin)](#nós-de-navegação-admin)
- [Documentos (Admin)](#documentos-admin)
- [Usuários (Admin)](#usuários-admin)
- [Logs (Admin)](#logs-admin)
- [Códigos de Status](#códigos-de-status)

---

## 📐 Convenções <a id="convenções"></a>

### Formato padrão de resposta

Toda resposta da API segue o envelope:

```json
{
  "success": true,
  "message": "Descrição da operação",
  "data": { }
}
```

Em caso de erro:

```json
{
  "success": false,
  "message": "Descrição do erro",
  "error": "VALIDATION_ERROR | UNAUTHORIZED | FORBIDDEN | NOT_FOUND | INTERNAL_ERROR"
}
```

### Paginação

Endpoints de listagem aceitam query params:

```
?page=1&limit=20
```

E retornam:

```json
{
  "success": true,
  "message": "OK",
  "data": [ ],
  "total": 87,
  "page": 1,
  "limit": 20
}
```

---

## 🔐 Autenticação <a id="autenticação"></a>

### `POST /auth/login`

Autentica um usuário e retorna um token JWT.

- **Acesso:** Público
- **Role exigida:** —

**Request**

```http
POST /api/v1/auth/login
Content-Type: application/json
```

```json
{
  "email": "secretaria@fatec.sp.gov.br",
  "password": "senhaSegura123"
}
```

**Response `200 OK`**

```json
{
  "success": true,
  "message": "Login realizado com sucesso",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": "a3f1c2d4-...",
      "name": "Carolina Silva",
      "email": "secretaria@fatec.sp.gov.br",
      "role": "SECRETARY"
    }
  }
}
```

**Response `401 Unauthorized`** — credenciais inválidas

```json
{
  "success": false,
  "message": "E-mail ou senha inválidos",
  "error": "UNAUTHORIZED"
}
```

---

## 🤖 Chatbot <a id="chatbot"></a>

### `GET /nodes/root`

Retorna o nó raiz da árvore de navegação (pergunta inicial do chatbot).

- **Acesso:** Público
- **Role exigida:** —

**Response `200 OK`**

```json
{
  "success": true,
  "message": "OK",
  "data": {
    "id": "node-root-uuid",
    "title": "Bem-vindo ao autoatendimento da Secretaria Acadêmica da Fatec Jacareí.",
    "content": "Para qual curso você deseja atendimento?",
    "nodeType": "MENU",
    "children": [
      { "id": "node-dsm-uuid",  "title": "Desenvolvimento de Software Multiplataforma", "order": 1 },
      { "id": "node-geo-uuid",  "title": "Geoprocessamento", "order": 2 },
      { "id": "node-marh-uuid", "title": "Meio Ambiente e Recursos Hídricos", "order": 3 },
      { "id": "node-ext-uuid",  "title": "Não sou aluno", "order": 4 }
    ]
  }
}
```

---

### `GET /nodes/:id`

Retorna um nó específico com seus filhos diretos (próximas opções) e chunks de evidência vinculados.

- **Acesso:** Público
- **Role exigida:** —

**Parâmetros**

| Parâmetro | Tipo   | Descrição             |
|-----------|--------|-----------------------|
| `id`      | UUID   | ID do nó de navegação |

**Response `200 OK` — nó do tipo `MENU`**

```json
{
  "success": true,
  "message": "OK",
  "data": {
    "id": "node-dsm-uuid",
    "title": "Desenvolvimento de Software Multiplataforma",
    "content": "Escolha o assunto:",
    "nodeType": "MENU",
    "parentId": "node-root-uuid",
    "children": [
      { "id": "node-dsm-aacc-uuid",  "title": "Atividades Complementares (AACC)", "order": 1 },
      { "id": "node-dsm-dates-uuid", "title": "Datas importantes do semestre", "order": 2 },
      { "id": "node-dsm-ext-uuid",   "title": "Disciplinas com atividades de extensão", "order": 3 },
      { "id": "node-dsm-estag-uuid", "title": "Estágio", "order": 4 }
    ],
    "chunks": []
  }
}
```

**Response `200 OK` — nó do tipo `ANSWER`**

```json
{
  "success": true,
  "message": "OK",
  "data": {
    "id": "node-dsm-aacc-uuid",
    "title": "Atividades Complementares (AACC)",
    "content": "O curso de Desenvolvimento de Software Multiplataforma não possui Atividades Acadêmico-Científico-Culturais (AACC) previstas em sua matriz curricular.",
    "nodeType": "ANSWER",
    "parentId": "node-dsm-uuid",
    "children": [],
    "chunks": []
  }
}
```

**Response `200 OK` — nó com evidência documental**

```json
{
  "success": true,
  "message": "OK",
  "data": {
    "id": "node-dsm-aproveita-uuid",
    "title": "Aproveitamento de estudos",
    "content": "A solicitação deve ser realizada pelo SIGA, anexando histórico escolar e ementas. Similaridade ≥ 70%: aprovação direta. Entre 50–70%: exame de proficiência.",
    "nodeType": "ANSWER",
    "parentId": "node-dsm-dispensa-uuid",
    "children": [],
    "chunks": [
      {
        "id": "chunk-uuid-1",
        "content": "Art. 76 – O aproveitamento de estudos [...] similaridade mínima de 70% para aprovação direta.",
        "page": 25,
        "section": "Seção I",
        "document": {
          "id": "doc-uuid-1",
          "name": "Regulamento Geral dos Cursos Superiores das Fatecs",
          "type": "REGULAMENTO"
        }
      }
    ]
  }
}
```

**Response `404 Not Found`**

```json
{
  "success": false,
  "message": "Nó não encontrado",
  "error": "NOT_FOUND"
}
```

---

### `POST /sessions/rating`

Registra o log de atendimento e a avaliação de satisfação ao encerrar uma sessão.

- **Acesso:** Público
- **Role exigida:** —

**Request**

```json
{
  "navigationPath": [
    "node-root-uuid",
    "node-dsm-uuid",
    "node-dsm-estag-uuid",
    "node-dsm-estag-duracao-uuid"
  ],
  "satisfaction": "LIKED",
  "startedAt": "2026-03-27T20:15:00.000Z",
  "endedAt": "2026-03-27T20:17:43.000Z"
}
```

**Response `201 Created`**

```json
{
  "success": true,
  "message": "Sessão registrada com sucesso",
  "data": {
    "sessionLogId": "session-uuid-1"
  }
}
```

---

## ❓ Perguntas <a id="perguntas"></a>

### `POST /questions`

Envia uma pergunta do aluno à Secretaria Acadêmica.

- **Acesso:** Público
- **Role exigida:** —

**Request**

```json
{
  "text": "Posso solicitar aproveitamento de uma disciplina cursada em 2015?",
  "email": "aluno@fatec.sp.gov.br",
  "sessionLogId": "session-uuid-1"
}
```

**Response `201 Created`**

```json
{
  "success": true,
  "message": "Pergunta enviada com sucesso. A secretaria responderá no e-mail informado.",
  "data": {
    "id": "question-uuid-1",
    "status": "OPEN",
    "createdAt": "2026-03-27T20:18:00.000Z"
  }
}
```

**Response `422 Unprocessable Entity`** — validação falhou

```json
{
  "success": false,
  "message": "Dados inválidos",
  "error": "VALIDATION_ERROR",
  "details": [
    { "field": "email", "message": "E-mail inválido" }
  ]
}
```

---

### `GET /questions`

Lista todas as perguntas recebidas.

- **Acesso:** 🔒 Protegido
- **Role exigida:** `SECRETARY` ou `ADMIN`

**Query Params**

| Param    | Tipo                      | Padrão | Descrição                 |
|----------|---------------------------|--------|---------------------------|
| `status` | `OPEN` \| `ANSWERED`      | —      | Filtrar por status        |
| `page`   | number                    | `1`    | Página atual              |
| `limit`  | number                    | `20`   | Itens por página          |

**Request**

```http
GET /api/v1/questions?status=OPEN&page=1&limit=20
Authorization: Bearer <token>
```

**Response `200 OK`**

```json
{
  "success": true,
  "message": "OK",
  "data": [
    {
      "id": "question-uuid-1",
      "text": "Posso solicitar aproveitamento de uma disciplina cursada em 2015?",
      "email": "aluno@fatec.sp.gov.br",
      "status": "OPEN",
      "createdAt": "2026-03-27T20:18:00.000Z",
      "updatedAt": "2026-03-27T20:18:00.000Z"
    }
  ],
  "total": 1,
  "page": 1,
  "limit": 20
}
```

---

### `PATCH /questions/:id`

Atualiza o status de uma pergunta.

- **Acesso:** 🔒 Protegido
- **Role exigida:** `SECRETARY` ou `ADMIN`

**Request**

```http
PATCH /api/v1/questions/question-uuid-1
Authorization: Bearer <token>
Content-Type: application/json
```

```json
{
  "status": "ANSWERED"
}
```

**Response `200 OK`**

```json
{
  "success": true,
  "message": "Status atualizado com sucesso",
  "data": {
    "id": "question-uuid-1",
    "status": "ANSWERED",
    "updatedAt": "2026-03-27T21:00:00.000Z"
  }
}
```

---

## 🌿 Nós de Navegação (Admin) <a id="nós-de-navegação-admin"></a>

> Todas as rotas abaixo exigem `role: ADMIN`.

### `POST /nodes`

Cria um novo nó na árvore de navegação.

**Request**

```json
{
  "title": "Novo tópico",
  "content": "Resposta ou pergunta do bot.",
  "nodeType": "ANSWER",
  "parentId": "node-dsm-uuid",
  "order": 5,
  "isActive": true
}
```

**Response `201 Created`**

```json
{
  "success": true,
  "message": "Nó criado com sucesso",
  "data": {
    "id": "node-novo-uuid",
    "title": "Novo tópico",
    "nodeType": "ANSWER",
    "parentId": "node-dsm-uuid",
    "order": 5,
    "isActive": true,
    "createdAt": "2026-03-28T10:00:00.000Z"
  }
}
```

---

### `PATCH /nodes/:id`

Atualiza parcialmente um nó existente.

**Request**

```json
{
  "content": "Conteúdo atualizado com novas informações do calendário.",
  "isActive": true
}
```

**Response `200 OK`**

```json
{
  "success": true,
  "message": "Nó atualizado com sucesso",
  "data": { "id": "node-novo-uuid", "content": "Conteúdo atualizado..." }
}
```

---

### `DELETE /nodes/:id`

Remove um nó. Se o nó possuir filhos, a operação é bloqueada.

**Response `200 OK`**

```json
{
  "success": true,
  "message": "Nó removido com sucesso",
  "data": null
}
```

**Response `409 Conflict`** — nó possui filhos

```json
{
  "success": false,
  "message": "Não é possível remover um nó que possui filhos ativos. Remova os filhos primeiro.",
  "error": "CONFLICT"
}
```

---

## 📄 Documentos (Admin) <a id="documentos-admin"></a>

> Todas as rotas abaixo exigem `role: ADMIN`.

### `GET /documents`

Lista todos os documentos oficiais cadastrados.

**Response `200 OK`**

```json
{
  "success": true,
  "message": "OK",
  "data": [
    {
      "id": "doc-uuid-1",
      "name": "Regulamento Geral dos Cursos Superiores das Fatecs",
      "type": "REGULAMENTO",
      "fileUrl": "https://storage.../regulamento.pdf",
      "createdAt": "2026-03-01T00:00:00.000Z",
      "_count": { "chunks": 42 }
    }
  ],
  "total": 4,
  "page": 1,
  "limit": 20
}
```

### `POST /documents`

Cadastra um novo documento e seus chunks indexados.

**Request**

```json
{
  "name": "Manual de Estágio",
  "type": "MANUAL",
  "fileUrl": "https://storage.../manual-estagio.pdf",
  "chunks": [
    {
      "content": "Art. 12 – O estágio supervisionado tem duração mínima de 240 horas...",
      "page": 8,
      "section": "Capítulo II"
    }
  ]
}
```

**Response `201 Created`**

```json
{
  "success": true,
  "message": "Documento cadastrado com sucesso",
  "data": {
    "id": "doc-uuid-2",
    "name": "Manual de Estágio",
    "chunksCreated": 1
  }
}
```

---

## 👤 Usuários (Admin) <a id="usuários-admin"></a>

> Todas as rotas abaixo exigem `role: ADMIN`.

### `GET /users`

Lista os usuários com perfil `SECRETARY`.

**Response `200 OK`**

```json
{
  "success": true,
  "message": "OK",
  "data": [
    {
      "id": "user-uuid-1",
      "name": "Carolina Silva",
      "email": "secretaria@fatec.sp.gov.br",
      "role": "SECRETARY",
      "createdAt": "2026-02-01T00:00:00.000Z"
    }
  ],
  "total": 1,
  "page": 1,
  "limit": 20
}
```

### `POST /users`

Cria um novo usuário da secretaria.

**Request**

```json
{
  "name": "Ana Paula",
  "email": "ana.paula@fatec.sp.gov.br",
  "password": "senhaTemporaria123",
  "role": "SECRETARY"
}
```

**Response `201 Created`**

```json
{
  "success": true,
  "message": "Usuário criado com sucesso",
  "data": {
    "id": "user-uuid-2",
    "name": "Ana Paula",
    "email": "ana.paula@fatec.sp.gov.br",
    "role": "SECRETARY"
  }
}
```

### `DELETE /users/:id`

Remove um usuário. Um administrador não pode remover a si próprio.

**Response `403 Forbidden`** — tentativa de auto-remoção

```json
{
  "success": false,
  "message": "Um administrador não pode remover sua própria conta.",
  "error": "FORBIDDEN"
}
```

---

## 📊 Logs (Admin) <a id="logs-admin"></a>

> Todas as rotas abaixo exigem `role: ADMIN`.

### `GET /logs`

Lista os logs de atendimento com filtros opcionais.

**Query Params**

| Param          | Tipo                        | Descrição                             |
|----------------|-----------------------------|---------------------------------------|
| `satisfaction` | `LIKED` \| `DISLIKED`       | Filtrar por avaliação                 |
| `from`         | ISO 8601 date               | Data de início do intervalo           |
| `to`           | ISO 8601 date               | Data de fim do intervalo              |
| `page`         | number                      | Página atual (padrão: 1)              |
| `limit`        | number                      | Itens por página (padrão: 20)         |

**Request**

```http
GET /api/v1/logs?from=2026-03-01&to=2026-03-31&satisfaction=DISLIKED
Authorization: Bearer <token>
```

**Response `200 OK`**

```json
{
  "success": true,
  "message": "OK",
  "data": [
    {
      "id": "session-uuid-1",
      "navigationPath": [
        "node-root-uuid",
        "node-dsm-uuid",
        "node-dsm-estag-uuid"
      ],
      "satisfaction": "DISLIKED",
      "startedAt": "2026-03-27T20:15:00.000Z",
      "endedAt": "2026-03-27T20:17:43.000Z",
      "question": {
        "id": "question-uuid-1",
        "text": "Posso solicitar aproveitamento de uma disciplina cursada em 2015?",
        "status": "OPEN"
      }
    }
  ],
  "total": 1,
  "page": 1,
  "limit": 20
}
```

---

## 📋 Códigos de Status <a id="códigos-de-status"></a>

| Código | Significado         | Quando ocorre                                                |
|:------:|---------------------|--------------------------------------------------------------|
| `200`  | OK                  | Requisição bem-sucedida (GET, PATCH, DELETE)                 |
| `201`  | Created             | Recurso criado com sucesso (POST)                            |
| `400`  | Bad Request         | Body malformado ou faltando campos obrigatórios              |
| `401`  | Unauthorized        | Token ausente, inválido ou expirado                          |
| `403`  | Forbidden           | Token válido, mas role sem permissão para a operação         |
| `404`  | Not Found           | Recurso não encontrado pelo ID informado                     |
| `409`  | Conflict            | Operação bloqueada por regra de negócio (ex: nó com filhos)  |
| `422`  | Unprocessable Entity| Dados válidos no formato mas inválidos semanticamente (Zod)  |
| `500`  | Internal Server Error | Erro não tratado no servidor — verificar logs do backend   |

---

> _Próximo documento: [`testing.md`](./testing.md) — estratégia de testes, pirâmide de qualidade e exemplos por camada._
