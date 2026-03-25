# 📁 src/middlewares/

Middlewares são funções que ficam entre a requisição e o controller. Todo request que chega na API passa por aqui antes de chegar no módulo de destino. Esta pasta contém os middlewares globais — usados em múltiplas rotas ou em toda a aplicação.

***

## Estrutura

```
middlewares/
├── auth.middleware.ts    # Valida o token JWT e popula req.user
├── rbac.middleware.ts    # Verifica se o role do usuário tem permissão
├── error.middleware.ts   # Captura todos os erros e formata a resposta
└── logger.middleware.ts  # Loga cada requisição recebida
```

***

## `auth.middleware.ts`

Extrai o token JWT do cabeçalho `Authorization: Bearer <token>`, valida a assinatura e a expiração, e adiciona os dados do usuário em `req.user`.

Se o token não existir, estiver malformado ou expirado, responde `401` imediatamente — a requisição não avança.

```ts
// req.user disponível em todos os handlers após este middleware
req.user.sub   // ID do usuário
req.user.role  // 'ADMIN' | 'SECRETARY'
```

**Usado em:** todas as rotas autenticadas, sempre antes do `rbac.middleware`.

***

## `rbac.middleware.ts`

Verifica se o `role` do usuário autenticado tem permissão para acessar a rota. Deve sempre vir **depois** do `auth.middleware` — depende do `req.user` que ele popula.

```ts
// Uso nas rotas
router.get('/', authMiddleware, authorize('ADMIN', 'SECRETARY'), controller.list)
router.delete('/:id', authMiddleware, authorize('ADMIN'), controller.remove)
```

Se o role não estiver na lista permitida, responde `403` — sem chegar no controller.

**A diferença entre 401 e 403:**
- `401` — "quem é você?" — sem token ou token inválido — responsabilidade do `auth.middleware`
- `403` — "eu sei quem você é, mas não pode entrar" — role insuficiente — responsabilidade do `rbac.middleware`

***

## `error.middleware.ts`

O único lugar da aplicação que responde com erro. Captura tudo que chega via `next(error)` e formata a resposta de acordo com o tipo do erro:

| Tipo de erro | Status | Comportamento |
|---|---|---|
| `AppError` | Definido no erro | Responde com a mensagem controlada |
| `ZodError` | `422` | Responde com os erros por campo |
| `PrismaClientKnownRequestError` | Varia | Trata P2002, P2025 e similares |
| Qualquer outro | `500` | Loga internamente, responde mensagem genérica |

Erros inesperados nunca vazam stack trace ou detalhes internos para o cliente — apenas são logados no servidor.

**Deve ser registrado por último no `server.ts`** — depois de todas as rotas. O Express o reconhece pelos quatro parâmetros `(err, req, res, next)`.

***

## `logger.middleware.ts`

Loga cada requisição recebida com método, caminho e timestamp. Útil para depuração em desenvolvimento e rastreabilidade em produção.

```
POST /api/v1/auth/login — 2026-03-25T10:00:00.000Z
GET  /api/v1/questions  — 2026-03-25T10:00:01.234Z
```

**Deve ser registrado primeiro no `server.ts`** — antes de todas as rotas, para garantir que toda requisição seja logada independente do resultado.

***

## Ordem de registro no `server.ts`

A ordem importa — middlewares são executados na sequência em que são registrados:

```
1. loggerMiddleware      → loga tudo, inclusive erros
2. cors                  → libera o frontend antes de qualquer processamento
3. express.json()        → sem isso, req.body chega undefined
4. rotas (/api/v1)       → auth e rbac são aplicados por rota dentro dos módulos
5. errorMiddleware       → último — captura erros de todos os anteriores
```

***

## Regras de contribuição

- Middlewares específicos de um módulo ficam **dentro do módulo** — esta pasta é só para os globais
- O `errorMiddleware` deve sempre ser o último registrado no `server.ts`
- O `loggerMiddleware` deve sempre ser o primeiro
- Nunca responda com `res.json()` de erro fora do `errorMiddleware` — use sempre `next(error)`