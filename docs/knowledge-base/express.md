# Express — Guia para Iniciantes

Express é o framework que transforma seu código Node.js em um servidor web. Quando o frontend faz uma requisição para `/api/v1/questions`, é o Express que recebe, processa e responde. Ele não faz nada sozinho — você define exatamente o que acontece com cada requisição.

***

## O Modelo Mental Correto

Pense em uma requisição como uma pessoa entrando em um prédio com vários andares. Ela passa pela recepção (log), pelo segurança (autenticação), pela catraca de acesso (permissão) e só então chega na sala certa (controller). Cada parada é um **middleware**.

```
Requisição → Logger → Auth → RBAC → Validação → Controller → Resposta
```

Se em qualquer parada algo der errado, a pessoa é barrada ali e recebe uma resposta de erro — o restante da fila não executa.

***

## Métodos HTTP

Cada operação tem um método correspondente. Isso é uma convenção que toda API REST segue:

| Método | O que significa | Exemplo |
|---|---|---|
| `GET` | Buscar dados | Listar perguntas |
| `POST` | Criar um recurso | Enviar uma pergunta |
| `PATCH` | Atualizar parcialmente | Mudar o status de uma pergunta |
| `PUT` | Substituir completamente | Raro — substitui o recurso inteiro |
| `DELETE` | Remover | Deletar um usuário |

`PATCH` e `PUT` confundem bastante. Na prática quase sempre use `PATCH` — você raramente quer substituir o recurso inteiro, só alguns campos.

***

## Rotas

Uma rota é a combinação de um **método HTTP** com um **caminho**. O Express só executa o handler quando os dois batem exatamente:

```ts
router.get('/questions', controller.list)
router.get('/questions/:id', controller.findOne)
router.post('/questions', controller.create)
router.patch('/questions/:id', controller.update)
router.delete('/questions/:id', controller.remove)
```

O `:id` é um parâmetro dinâmico — funciona como um espaço em branco que aceita qualquer valor. Uma requisição para `/questions/abc123` bate com `/questions/:id` e você lê o valor com `req.params.id`.

**O que vem de onde no `req`:**

| Dado | Propriedade | Quando usar |
|---|---|---|
| Parâmetro da rota | `req.params.id` | `/questions/:id` |
| Query string | `req.query.status` | `/questions?status=OPEN` |
| Corpo da requisição | `req.body` | JSON enviado no POST/PATCH |
| Cabeçalho | `req.headers.authorization` | Token JWT |

`req.query` é sempre string — se precisar de número, converta: `Number(req.query.page)`.

***

## Controller vs Service

Essa separação é onde a maioria dos iniciantes erra. A regra é direta:

**Controller** — recebe a requisição, chama o service, devolve a resposta. Não contém `if` de regra de negócio, não fala diretamente com o banco.

**Service** — contém toda a lógica. Valida regras de negócio, fala com o Prisma, lança erros.

```ts
// ❌ controller fazendo trabalho de service
const create = async (req, res) => {
  const exists = await prisma.user.findUnique({ where: { email: req.body.email } })
  if (exists) return res.status(409).json({ error: 'E-mail já existe' })
  const hash = await bcrypt.hash(req.body.password, 10)
  const user = await prisma.user.create({ data: { ...req.body, password: hash } })
  res.status(201).json(user)
}

// ✅ controller só orquestra
const create = async (req, res, next) => {
  try {
    const user = await this.service.create(req.body)
    res.status(201).json({ success: true, data: user })
  } catch (error) {
    next(error)
  }
}
```

Se você está escrevendo uma query do Prisma ou um `if` de regra de negócio dentro de um controller, pare — isso pertence ao service.

***

## Middlewares

Middleware é uma função com três parâmetros: `req`, `res` e `next`. O `next()` é o que passa a requisição para o próximo da fila — sem ele a requisição trava e nunca responde.

```ts
const meuMiddleware = (req, res, next) => {
  // faz algo com req ou res
  next() // obrigatório para continuar
}
```

Você pode aplicar um middleware em três escopos diferentes:

```ts
app.use(loggerMiddleware)                                // todas as rotas da aplicação
router.use(authMiddleware)                               // todas as rotas deste router
router.delete('/:id', authorize('ADMIN'), controller.remove) // só esta rota específica
```

**A ordem dos middlewares no `server.ts` importa muito.** `cors` e `express.json()` precisam vir antes das rotas, senão `req.body` chega `undefined` e o CORS bloqueia o frontend. O middleware de erro precisa ser o último de todos.

***

## Middleware de Autenticação

O middleware de auth lê o token JWT do cabeçalho `Authorization`, valida e adiciona os dados do usuário no `req`. Todas as rotas protegidas dependem disso para saber quem está fazendo a requisição.

O cabeçalho chega assim: `Authorization: Bearer eyJhbGci...`

Você extrai o token, valida, e se for válido adiciona `req.user` com os dados do payload. Se não tiver token ou for inválido, responde `401` e para ali — `next()` não é chamado.

***

## Middleware de RBAC

RBAC (Role-Based Access Control) controla o que cada perfil pode fazer. Depois do middleware de auth confirmar quem é o usuário, o RBAC verifica se esse usuário tem permissão para aquela rota específica.

```ts
// Exemplo de como usar nas rotas
router.get('/',    authMiddleware, authorize('ADMIN', 'SECRETARY'), controller.list)
router.delete('/:id', authMiddleware, authorize('ADMIN'), controller.remove)
```

A diferença entre `401` e `403` confunde bastante:
- **401 Unauthorized** — "quem é você?" — sem token ou token inválido
- **403 Forbidden** — "eu sei quem você é, mas você não pode entrar aqui" — token válido mas role errado

***

## Middleware de Erro

O middleware de erro tem **quatro parâmetros** — `err, req, res, next`. É assim que o Express o reconhece como tratador de erro, não como middleware comum. Ele precisa ser registrado depois de todas as rotas.

Todo erro deve chegar aqui via `next(error)` — isso centraliza o tratamento em um lugar só, sem repetir lógica de resposta em cada controller.

**Dois tipos de erro para tratar:**

**Erros esperados** — lançados pelo seu código com `AppError`. Você controla a mensagem e o status:
```ts
throw new AppError('Pergunta não encontrada', 404)
throw new AppError('E-mail já cadastrado', 409)
```

**Erros inesperados** — tudo que não é `AppError`. Esses respondem sempre com `500` e uma mensagem genérica. Nunca vaze stack trace, mensagem de banco ou nome de tabela para o cliente — isso é uma vulnerabilidade de segurança.

***

## Estrutura de Resposta Consistente

Toda rota deve responder no mesmo formato — o frontend vai depender disso:

```ts
// Sucesso
res.status(200).json({
  success: true,
  data: questions,
})

// Erro
res.status(404).json({
  success: false,
  error: 'Pergunta não encontrada',
})
```

Sem consistência, o frontend precisa tratar formatos diferentes em cada chamada — o que gera bugs difíceis de rastrear.

***

## Parâmetros Opcionais e Query Strings

Query strings são usadas para filtros, paginação e ordenação — nunca para identificar um recurso (isso é papel do `:id`):

```
/questions             → todas as perguntas
/questions?status=OPEN → só as abertas
/questions?page=2&limit=10 → paginação
/questions/abc123      → a pergunta específica abc123
```

Nunca use query string para passar dados sensíveis — elas aparecem na URL, nos logs do servidor e no histórico do browser.

***

## Status Codes — Os Mais Importantes

| Código | Nome | Quando usar |
|---|---|---|
| `200` | OK | Sucesso com dados |
| `201` | Created | Recurso criado com sucesso |
| `204` | No Content | Sucesso sem corpo — comum no DELETE |
| `400` | Bad Request | Dados inválidos enviados pelo cliente |
| `401` | Unauthorized | Sem token ou token inválido |
| `403` | Forbidden | Token válido mas sem permissão |
| `404` | Not Found | Recurso não encontrado |
| `409` | Conflict | Conflito — ex: e-mail já existe |
| `422` | Unprocessable Entity | Dados bem formados mas inválidos — erro de validação Zod |
| `500` | Internal Server Error | Erro inesperado — nunca deveria acontecer |

***

## Boas Práticas

**Sempre use `next(error)` no catch** — nunca trate o erro diretamente no controller. O middleware de erro existe para centralizar isso.

**Nunca confie no `req.body` sem validar** — qualquer dado que vem do cliente pode ser qualquer coisa. Um campo que você espera como string pode chegar como objeto, array ou vazio. Valide tudo com Zod antes de passar para o service.

**Separe `app` do `listen`** — crie o Express em `server.ts` e chame `.listen()` só no `index.ts`. Isso permite que os testes importem o app sem subir um servidor real na porta.

**Não misture responsabilidades** — controller orquestra, service tem regras, Prisma persiste. Quando cada camada sabe só o que precisa, fica muito mais fácil testar e manter.

**Proteja todas as rotas que precisam de autenticação** — nunca confie que o frontend "não vai mostrar o botão". A proteção real está no backend, sempre.