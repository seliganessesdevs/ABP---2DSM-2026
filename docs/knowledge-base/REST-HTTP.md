# REST e HTTP — Guia para Iniciantes

REST é um estilo de organizar APIs. Não é uma tecnologia, não é uma biblioteca — é um conjunto de convenções que o mundo todo adotou para que APIs sejam previsíveis. Quando você segue REST, qualquer desenvolvedor consegue entender sua API sem ler a documentação.

***

## O Modelo Mental Correto

REST gira em torno de **recursos** — as "coisas" da sua aplicação. Perguntas, usuários, nós, documentos são recursos. Você age sobre esses recursos usando métodos HTTP.

A URL identifica **o quê**. O método HTTP identifica **o que fazer**:

```
GET    /questions        → listar perguntas
GET    /questions/abc    → ver uma pergunta específica
POST   /questions        → criar uma pergunta
PATCH  /questions/abc    → atualizar uma pergunta
DELETE /questions/abc    → remover uma pergunta
```

***

## Métodos HTTP

| Método | Significado | Tem body? |
|---|---|---|
| `GET` | Buscar — nunca modifica dados | Não |
| `POST` | Criar um recurso novo | Sim |
| `PATCH` | Atualizar parcialmente — só os campos enviados | Sim |
| `PUT` | Substituir completamente | Sim |
| `DELETE` | Remover | Não |

**`PATCH` vs `PUT`** — a diferença que mais confunde iniciantes: `PATCH` atualiza só o que você manda, `PUT` substitui o recurso inteiro. Na prática, quase sempre use `PATCH`.

`GET` nunca deve modificar dados — se um endpoint `GET` cria ou altera algo, está errado.

***

## Estrutura de URLs

Boas URLs são legíveis, previsíveis e refletem a hierarquia dos recursos:

```
/api/v1/users                    → coleção de usuários
/api/v1/users/:id                → um usuário específico
/api/v1/users/:id/questions      → perguntas de um usuário
```

**Convenções:**
- Sempre plural para coleções — `/questions`, não `/question`
- Sempre minúsculo — `/admin/nodes`, não `/Admin/Nodes`
- Hífens para separar palavras — `/node-types`, não `/nodeTypes`
- Nunca verbos na URL — a ação é o método HTTP

```
❌ /getQuestions
❌ /createUser
❌ /deleteQuestion/abc

✅ GET    /questions
✅ POST   /users
✅ DELETE /questions/abc
```

***

## Versionamento

O `/v1` na URL protege os clientes quando você precisa fazer mudanças incompatíveis na API. Se um dia você mudar o formato da resposta, cria `/v2` sem quebrar quem usa `/v1`:

```
/api/v1/questions   → versão atual
/api/v2/questions   → versão futura com breaking changes
```

***

## Status Codes

O código de status é a forma do servidor dizer o que aconteceu — sem o cliente precisar ler o corpo da resposta. Use sempre o código correto:

**2xx — Sucesso**

| Código | Quando usar |
|---|---|
| `200 OK` | Sucesso com dados |
| `201 Created` | Recurso criado com sucesso |
| `204 No Content` | Sucesso sem corpo — comum no DELETE |

**4xx — Erro do cliente**

| Código | Quando usar |
|---|---|
| `400 Bad Request` | Dados mal formados |
| `401 Unauthorized` | Sem token ou token inválido |
| `403 Forbidden` | Token válido mas sem permissão |
| `404 Not Found` | Recurso não existe |
| `409 Conflict` | Conflito — e-mail já cadastrado |
| `422 Unprocessable Entity` | Dados válidos mas que violam uma regra |

**5xx — Erro do servidor**

| Código | Quando usar |
|---|---|
| `500 Internal Server Error` | Erro inesperado — nunca deveria chegar no cliente |

A diferença entre `400` e `422` é sutil mas importante: `400` é para dados mal formados (JSON inválido, campo errado), `422` é para dados bem formados mas que violam uma regra de validação (senha muito curta, e-mail inválido).

***

## Estrutura de Resposta Consistente

Toda rota deve responder no mesmo formato. O frontend vai depender disso para saber o que esperar:

```ts
// Sucesso
{
  "success": true,
  "data": { ... }
}

// Sucesso com lista e paginação
{
  "success": true,
  "data": [ ... ],
  "total": 42,
  "page": 1,
  "limit": 10
}

// Erro esperado
{
  "success": false,
  "error": "Pergunta não encontrada"
}

// Erro de validação
{
  "success": false,
  "error": "Dados inválidos",
  "fields": {
    "email": ["Formato de e-mail inválido"],
    "password": ["Deve ter pelo menos 6 caracteres"]
  }
}
```

Sem consistência, o frontend precisa tratar formatos diferentes em cada chamada — o que gera bugs difíceis de rastrear.

***

## Query Strings vs Parâmetros de Rota

A dúvida mais comum: quando usar `/:id` e quando usar `?param=valor`?

**Parâmetro de rota** — identifica um recurso específico:
```
/questions/abc123   → a pergunta abc123
/users/xyz          → o usuário xyz
```

**Query string** — filtra, pagina ou ordena uma coleção:
```
/questions?status=OPEN          → só as abertas
/questions?page=2&limit=10      → segunda página
/questions?orderBy=createdAt    → ordenado por data
```

Nunca use query string para identificar um recurso e nunca use parâmetro de rota para filtrar.

***

## Idempotência

Conceito importante que aparece em entrevistas e discussões de design de API:

Uma operação é **idempotente** quando você pode executá-la várias vezes e o resultado é sempre o mesmo.

- `GET` — idempotente: chamar 10 vezes não muda nada
- `DELETE` — idempotente: deletar o mesmo recurso 10 vezes tem o mesmo efeito que deletar uma
- `POST` — **não** idempotente: chamar 10 vezes cria 10 recursos

Isso importa quando o cliente não sabe se a requisição chegou (timeout) e decide tentar de novo. Um `GET` ou `DELETE` repetido é seguro. Um `POST` repetido pode criar duplicatas.

***

## Boas Práticas

**Use sempre o status code correto** — responder `200` em um erro ou `500` em um conflito de e-mail dificulta o tratamento no frontend e esconde bugs.

**URLs são substantivos, métodos são verbos** — a ação está no método, não na URL. Se a URL tem um verbo, está errado.

**Seja consistente no formato da resposta** — defina um padrão e siga em todos os endpoints. O frontend vai agradecer.

**Não exponha detalhes internos na URL** — `/api/v1/questions` é bom. `/api/v1/postgres/public/questions` expõe sua infraestrutura.