# 🔌 Camada de API

> Documentação completa de todos os endpoints REST do **FatecBot**.
> Base URL: `http://localhost:3333/api/v1`
>
> Todas as rotas protegidas exigem o header:
>
> ```
> Authorization: Bearer <token_jwt>
> ```

***

## 📑 Índice

- [Convenções](#convenções)
- [Health Check](#health-check)
- [Autenticação](#autenticação)
- [Chatbot](#chatbot)
- [Perguntas](#perguntas)
- [Nós de Navegação (Admin)](#nós-de-navegação-admin)
- [Usuários (Admin)](#usuários-admin)
- [Logs (Admin)](#logs-admin)
- [Códigos de Status](#códigos-de-status)

***

## 📐 Convenções <a id="convenções"></a>

### Envelope padrão de sucesso

O envelope mínimo de sucesso do projeto é:

```json
{
  "success": true,
  "data": {}
}
```

Campos adicionais podem existir quando fizerem sentido, mas o frontend deve poder
confiar sempre em `success` + `data`.

### Envelope padrão de erro

Em erro, o formato canônico é:

```json
{
  "success": false,
  "message": "Descrição do erro",
  "errors": [
    {
      "field": "email",
      "message": "E-mail inválido"
    }
  ]
}
```

O campo `errors` é opcional e aparece quando a API precisa detalhar falhas por campo.

### Paginação

Endpoints de listagem aceitam, quando aplicável:

```text
?page=1&limit=20
```

E retornam metadados em `meta`:

```json
{
  "success": true,
  "data": [],
  "meta": {
    "total": 87,
    "page": 1,
    "limit": 20
  }
}
```

### Filtros e query params

Os query params previstos neste documento são:

- `GET /questions`: `status`, `page`, `limit`
- `GET /logs`: `flag`, `from`, `to`, `page`, `limit`
- Endpoints sem query params documentados aqui não devem aceitar filtros implícitos sem atualização deste contrato

***

## ❤️ Health Check <a id="health-check"></a>

### `GET /health`

Valida se a API está operacional.

- **Acesso:** Público
- **Role exigida:** —

**Request**

```http
GET /api/v1/health
```

**Response `200 OK`**

```json
{
  "success": true,
  "data": {}
}
```

***

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
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": 1,
      "name": "Carolina Silva",
      "email": "secretaria@fatec.sp.gov.br",
      "role": "SECRETARIA"
    }
  }
}
```

**Response `401 Unauthorized`** — credenciais inválidas

```json
{
  "success": false,
  "message": "E-mail ou senha inválidos"
}
```

***

## 🤖 Chatbot <a id="chatbot"></a>

### `GET /nodes/root`

Retorna o nó raiz da árvore de navegação (prompt inicial do chatbot).

- **Acesso:** Público
- **Role exigida:** —

**Response `200 OK`**

```json
{
  "success": true,
  "data": {
    "id": 1,
    "title": "Início",
    "slug": "root",
    "prompt": "Para qual curso você deseja atendimento?",
    "children": [
      {
        "id": 2,
        "title": "Desenvolvimento de Software Multiplataforma",
        "slug": "dsm",
        "display_order": 1
      },
      {
        "id": 3,
        "title": "Geoprocessamento",
        "slug": "geo",
        "display_order": 2
      },
      {
        "id": 4,
        "title": "Meio Ambiente e Recursos Hídricos",
        "slug": "marh",
        "display_order": 3
      },
      {
        "id": 5,
        "title": "Não sou aluno",
        "slug": "externo",
        "display_order": 4
      }
    ]
  }
}
```

***

### `GET /nodes/:id`

Retorna um nó específico com seus filhos diretos. Nós folha (sem filhos) retornam `answer_summary` e evidência inline.

- **Acesso:** Público
- **Role exigida:** —

**Parâmetros**

| Parâmetro | Tipo | Descrição             |
| --------- | ---- | --------------------- |
| `id`      | Int  | ID do nó de navegação |

**Response `200 OK` — nó de menu (com filhos)**

```json
{
  "success": true,
  "data": {
    "id": 2,
    "title": "Desenvolvimento de Software Multiplataforma",
    "slug": "dsm",
    "prompt": "Escolha o assunto:",
    "answer_summary": null,
    "evidence_excerpt": null,
    "evidence_source": null,
    "parent_id": 1,
    "children": [
      {
        "id": 6,
        "title": "Atividades Complementares (AACC)",
        "slug": "dsm-aacc",
        "display_order": 1
      },
      {
        "id": 7,
        "title": "Datas importantes do semestre",
        "slug": "dsm-datas",
        "display_order": 2
      },
      {
        "id": 8,
        "title": "Disciplinas com atividades de extensão",
        "slug": "dsm-extensao",
        "display_order": 3
      },
      { "id": 9, "title": "Estágio", "slug": "dsm-estagio", "display_order": 4 }
    ]
  }
}
```

**Response `200 OK` — nó folha sem evidência**

```json
{
  "success": true,
  "data": {
    "id": 6,
    "title": "Atividades Complementares (AACC)",
    "slug": "dsm-aacc",
    "prompt": null,
    "answer_summary": "O curso de Desenvolvimento de Software Multiplataforma não possui Atividades Acadêmico-Científico-Culturais (AACC) previstas em sua matriz curricular.",
    "evidence_excerpt": null,
    "evidence_source": null,
    "parent_id": 2,
    "children": []
  }
}
```

**Response `200 OK` — nó folha com evidência**

```json
{
  "success": true,
  "data": {
    "id": 14,
    "title": "Aproveitamento de estudos",
    "slug": "dsm-aproveitamento",
    "prompt": null,
    "answer_summary": "A solicitação deve ser realizada pelo SIGA, anexando histórico escolar e ementas. Similaridade ≥ 70%: aprovação direta. Entre 50–70%: exame de proficiência.",
    "evidence_excerpt": "Art. 76 – O aproveitamento de estudos [...] similaridade mínima de 70% para aprovação direta.",
    "evidence_source": "Regulamento Geral dos Cursos Superiores das Fatecs, Seção I, p. 25",
    "parent_id": 13,
    "children": []
  }
}
```

**Response `404 Not Found`**

```json
{
  "success": false,
  "message": "Nó não encontrado"
}
```

***

### `POST /sessions/log`

Registra o log de atendimento e a avaliação de satisfação ao encerrar uma sessão.

- **Acesso:** Público
- **Role exigida:** —

**Request**

```json
{
  "navigation_flow": ["root", "dsm", "dsm-estagio", "dsm-estagio-duracao"],
  "flag": "ATENDEU"
}
```

**Response `201 Created`**

```json
{
  "success": true,
  "data": {
    "interactionLogId": 1
  }
}
```

***

## ❓ Perguntas <a id="perguntas"></a>

### `POST /questions`

Envia uma pergunta do aluno à Secretaria Acadêmica.

- **Acesso:** Público
- **Role exigida:** —

**Request** — sem anexo

```json
{
  "requester_name": "João Silva",
  "question": "Posso solicitar aproveitamento de uma disciplina cursada em 2015?",
  "requester_email": "joao.silva@fatec.sp.gov.br"
}
```

**Request** — com anexo (multipart/form-data)

```
requester_name: João Silva
question: Posso solicitar aproveitamento de uma disciplina cursada em 2015?
requester_email: joao.silva@fatec.sp.gov.br
attachment: [arquivo PDF/JPG/PNG — máx. 5MB]
```

**Response `201 Created`**

```json
{
  "success": true,
  "data": {
    "id": 1,
    "status": "ABERTA",
    "created_at": "2026-03-27T20:18:00.000Z"
  }
}
```

**Response `422 Unprocessable Entity`** — validação falhou

```json
{
  "success": false,
  "message": "Dados inválidos",
  "errors": [{ "field": "requester_email", "message": "E-mail inválido" }]
}
```

***

### `GET /questions`

Lista todas as perguntas recebidas.

- **Acesso:** 🔒 Protegido
- **Role exigida:** `SECRETARIA` ou `ADMIN`

**Query Params**

| Param    | Tipo                     | Padrão | Descrição          |
| -------- | ------------------------ | ------ | ------------------ |
| `status` | `ABERTA` \| `RESPONDIDA` | —      | Filtrar por status |
| `page`   | number                   | `1`    | Página atual       |
| `limit`  | number                   | `20`   | Itens por página   |

**Request**

```http
GET /api/v1/questions?status=ABERTA&page=1&limit=20
Authorization: Bearer <token>
```

**Response `200 OK`**

```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "requester_name": "João Silva",
      "question": "Posso solicitar aproveitamento de uma disciplina cursada em 2015?",
      "requester_email": "joao.silva@fatec.sp.gov.br",
      "status": "ABERTA",
      "created_at": "2026-03-27T20:18:00.000Z",
      "updated_at": "2026-03-27T20:18:00.000Z"
    }
  ],
  "meta": {
    "total": 1,
    "page": 1,
    "limit": 20
  }
}
```

***

### `PATCH /questions/:id`

Atualiza o status de uma pergunta.

- **Acesso:** 🔒 Protegido
- **Role exigida:** `SECRETARIA` ou `ADMIN`

> A única transição válida é `ABERTA → RESPONDIDA`.
> O endpoint não deve aceitar retorno para `ABERTA` nem novos status sem atualização deste contrato.

**Request**

```http
PATCH /api/v1/questions/1
Authorization: Bearer <token>
Content-Type: application/json
```

```json
{
  "status": "RESPONDIDA"
}
```

**Response `200 OK`**

```json
{
  "success": true,
  "data": {
    "id": 1,
    "status": "RESPONDIDA",
    "updated_at": "2026-03-27T21:00:00.000Z"
  }
}
```

***

## 🌿 Nós de Navegação (Admin) <a id="nós-de-navegação-admin"></a>

> Todas as rotas abaixo exigem `role: ADMIN`.

### `POST /nodes`

Cria um novo nó na árvore de navegação.

**Request**

```json
{
  "title": "Novo tópico",
  "slug": "dsm-novo-topico",
  "prompt": "Qual é sua dúvida sobre este tópico?",
  "answer_summary": "Resposta objetiva do bot para este nó.",
  "evidence_excerpt": null,
  "evidence_source": null,
  "parent_id": 2,
  "display_order": 5,
  "is_active": true
}
```

**Response `201 Created`**

```json
{
  "success": true,
  "data": {
    "id": 20,
    "title": "Novo tópico",
    "slug": "dsm-novo-topico",
    "parent_id": 2,
    "display_order": 5,
    "is_active": true,
    "created_at": "2026-03-28T10:00:00.000Z"
  }
}
```

***

### `PATCH /nodes/:id`

Atualiza parcialmente um nó existente.

**Request**

```json
{
  "answer_summary": "Conteúdo atualizado com novas informações do calendário.",
  "is_active": true
}
```

**Response `200 OK`**

```json
{
  "success": true,
  "data": {
    "id": 20,
    "answer_summary": "Conteúdo atualizado com novas informações do calendário."
  }
}
```

***

### `DELETE /nodes/:id`

Remove um nó. Se o nó possuir filhos, a operação é bloqueada.

**Response `200 OK`**

```json
{
  "success": true,
  "data": null
}
```

**Response `409 Conflict`** — nó possui filhos

```json
{
  "success": false,
  "message": "Não é possível remover um nó que possui filhos ativos. Remova os filhos primeiro."
}
```

---

## 👤 Usuários (Admin) <a id="usuários-admin"></a>

> Todas as rotas abaixo exigem `role: ADMIN`.

### `GET /users`

Lista os usuários com perfil `SECRETARIA`.

**Response `200 OK`**

```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "name": "Carolina Silva",
      "email": "secretaria@fatec.sp.gov.br",
      "role": "SECRETARIA",
      "created_at": "2026-02-01T00:00:00.000Z"
    }
  ],
  "meta": {
    "total": 1,
    "page": 1,
    "limit": 20
  }
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
  "role": "SECRETARIA"
}
```

**Response `201 Created`**

```json
{
  "success": true,
  "data": {
    "id": 2,
    "name": "Ana Paula",
    "email": "ana.paula@fatec.sp.gov.br",
    "role": "SECRETARIA"
  }
}
```

### `DELETE /users/:id`

Remove um usuário. Um administrador não pode remover a si próprio.

**Response `403 Forbidden`** — tentativa de auto-remoção

```json
{
  "success": false,
  "message": "Um administrador não pode remover sua própria conta."
}
```

***

## 📊 Logs (Admin) <a id="logs-admin"></a>

> Todas as rotas abaixo exigem `role: ADMIN`.

### `GET /logs`

Lista os logs de atendimento com filtros opcionais.

**Query Params**

| Param   | Tipo                       | Descrição                     |
| ------- | -------------------------- | ----------------------------- |
| `flag`  | `ATENDEU` \| `NAO_ATENDEU` | Filtrar por avaliação         |
| `from`  | ISO 8601 date              | Data de início do intervalo   |
| `to`    | ISO 8601 date              | Data de fim do intervalo      |
| `page`  | number                     | Página atual (padrão: 1)      |
| `limit` | number                     | Itens por página (padrão: 20) |

**Request**

```http
GET /api/v1/logs?from=2026-03-01&to=2026-03-31&flag=NAO_ATENDEU
Authorization: Bearer <token>
```

**Response `200 OK`**

```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "navigation_flow": ["root", "dsm", "dsm-estagio"],
      "flag": "NAO_ATENDEU",
      "created_at": "2026-03-27T20:17:43.000Z",
      "questions": [
        {
          "id": 1,
          "question": "Posso solicitar aproveitamento de uma disciplina cursada em 2015?",
          "status": "ABERTA"
        }
      ]
    }
  ],
  "meta": {
    "total": 1,
    "page": 1,
    "limit": 20
  }
}
```

***

## 📋 Códigos de Status <a id="códigos-de-status"></a>

| Código | Significado           | Quando ocorre                                               |
| :----: | --------------------- | ----------------------------------------------------------- |
| `200`  | OK                    | Requisição bem-sucedida (GET, PATCH, DELETE)                |
| `201`  | Created               | Recurso criado com sucesso (POST)                           |
| `400`  | Bad Request           | Body malformado ou faltando campos obrigatórios             |
| `401`  | Unauthorized          | Token ausente, inválido ou expirado                         |
| `403`  | Forbidden             | Token válido, mas role sem permissão para a operação        |
| `404`  | Not Found             | Recurso não encontrado pelo ID informado                    |
| `409`  | Conflict              | Operação bloqueada por regra de negócio (ex: nó com filhos) |
| `422`  | Unprocessable Entity  | Dados válidos no formato mas inválidos semanticamente (Zod) |
| `500`  | Internal Server Error | Erro não tratado no servidor — verificar logs do backend    |

---

> _Próximo documento: [`testing.md`](./testing.md)_
