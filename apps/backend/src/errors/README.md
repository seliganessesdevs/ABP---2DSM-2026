# 📁 src/errors/

Esta pasta centraliza a definição de erros controlados da aplicação. Um erro "controlado" é aquele que você lança intencionalmente — regra de negócio violada, recurso não encontrado, permissão negada — em oposição a um erro inesperado como falha de banco ou bug de código.

***

## Estrutura

```
errors/
└── AppError.ts   # Classe base para todos os erros controlados
```

***

## `AppError.ts`

Estende a classe nativa `Error` do JavaScript adicionando um `statusCode` HTTP. Toda vez que o código precisa encerrar um fluxo com um erro esperado, lança um `AppError` — o `errorMiddleware` sabe como tratá-lo.

```ts
throw new AppError('Pergunta não encontrada.', 404)
throw new AppError('Email ou senha inválidos.', 401)
throw new AppError('Você não tem permissão para esta ação.', 403)
throw new AppError('Já existe um usuário com este email.', 409)
```

**O que o `AppError` contém:**

| Propriedade | Tipo | Descrição |
|---|---|---|
| `message` | `string` | Mensagem legível, enviada ao cliente |
| `statusCode` | `number` | Status HTTP da resposta |
| `isOperational` | `boolean` | Sempre `true` — marca como erro controlado |

A propriedade `isOperational` é o que permite ao `errorMiddleware` distinguir um erro seu (lançado intencionalmente) de um erro do Node/Prisma/biblioteca (inesperado). Se `isOperational` for `true`, responde com a mensagem. Se for `false` ou não existir, loga internamente e responde `500` com mensagem genérica.

***

## Por que ter uma classe própria?

Sem `AppError`, você teria duas opções ruins:

```ts
// ❌ Opção 1 — responder direto no service (errado, service não conhece HTTP)
res.status(404).json({ success: false, message: 'Não encontrado' })

// ❌ Opção 2 — lançar Error nativo (sem statusCode, vira 500)
throw new Error('Não encontrado')
```

Com `AppError`:
```ts
// ✅ Service lança, errorMiddleware trata corretamente
throw new AppError('Não encontrado.', 404)
```

O service fica limpo de lógica HTTP, e o `errorMiddleware` tem todas as informações para responder corretamente.

***

## Regras de contribuição

- **Nunca** lance `new Error()` diretamente no código da aplicação — sempre use `AppError`
- A mensagem deve ser **legível pelo cliente** — não exponha detalhes técnicos ou de banco
- Se os erros crescerem, considere criar subclasses (`NotFoundError`, `UnauthorizedError`) que estendem `AppError` com o status já fixo

***

> _Próximo documento: [`../utils/README.md`](../utils/README.md)_
