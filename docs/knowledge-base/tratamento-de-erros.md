# Tratamento de Erros — Guia para Iniciantes

Tratar erros bem é o que separa uma API profissional de uma amateur. Uma API sem tratamento adequado vaza informações sensíveis, retorna respostas inconsistentes e é impossível de depurar. O objetivo é simples: erros esperados são controlados, erros inesperados são contidos.

***

## Dois Tipos de Erro

Todo erro na aplicação é de um desses dois tipos:

**Erro esperado** — você previu que poderia acontecer. E-mail já cadastrado, senha errada, recurso não encontrado. Você sabe o status code, você controla a mensagem.

**Erro inesperado** — você não previu. Banco de dados caiu, bug no código, serviço externo indisponível. Esses respondem sempre com `500` e uma mensagem genérica — nunca com detalhes internos.

***

## `AppError` — Erros Esperados

A classe `AppError` é o contrato entre o service e o middleware de erro. Quando você lança um `AppError`, está dizendo: "isso é uma situação prevista, responda com este status e esta mensagem."

```ts
// O service lança
throw new AppError('E-mail já cadastrado', 409)
throw new AppError('Pergunta não encontrada', 404)
throw new AppError('Senha incorreta', 401)

// O middleware de erro identifica e responde corretamente
if (err instanceof AppError) {
  return res.status(err.statusCode).json({
    success: false,
    error: err.message,
  })
}
```

Tudo que **não** é `AppError` é tratado como erro inesperado e responde com `500`.

***

## O Middleware de Erro

É o único lugar da aplicação que responde com erro. Todo `catch` do controller deve chamar `next(error)` — não responder diretamente.

O fluxo sempre segue esse caminho:

```
Service lança AppError
  → Controller chama next(error)
    → Middleware de erro recebe
      → Verifica se é AppError
        → Sim: responde com o status e mensagem controlados
        → Não: loga internamente, responde 500 com mensagem genérica
```

Centralizar assim garante que toda resposta de erro tem o mesmo formato — o frontend pode confiar que sempre vai receber `{ success: false, error: "..." }`.

***

## O que Nunca Vazar para o Cliente

Erros inesperados contêm informações que não podem sair da aplicação:

```ts
// ❌ vaza informação interna
res.status(500).json({
  error: err.message,  // "relation 'users' does not exist" — expõe o banco
  stack: err.stack,    // expõe o caminho dos arquivos no servidor
})

// ✅ mensagem genérica para o cliente, detalhe nos logs internos
console.error(err)     // você vê o detalhe no servidor
res.status(500).json({
  success: false,
  error: 'Erro interno do servidor',
})
```

Um atacante que vê nomes de tabela, caminhos de arquivo ou stack traces tem muito mais informação para explorar.

***

## Erros do Prisma

O Prisma lança seus próprios erros com códigos específicos. Trate-os no middleware de erro junto com o `AppError`:

| Código | Significado | Resposta adequada |
|---|---|---|
| `P2002` | Campo único duplicado (ex: e-mail já existe) | `409 Conflict` |
| `P2025` | Registro não encontrado | `404 Not Found` |
| `P2003` | Violação de chave estrangeira | `400 Bad Request` |

Sem esse tratamento, um e-mail duplicado gera um erro `500` genérico — quando o correto é `409` com uma mensagem clara.

***

## Erros do Zod

O Zod lança `ZodError` quando a validação falha. Se você usa um middleware de validação, esses erros são interceptados antes do controller. Mas se chegarem ao middleware de erro, trate-os como `422`:

O `error.flatten().fieldErrors` retorna os erros organizados por campo — pronto para o frontend exibir no formulário:

```ts
{
  "fieldErrors": {
    "email": ["Formato de e-mail inválido"],
    "password": ["Deve ter pelo menos 6 caracteres"]
  }
}
```

***

## Erros de JWT

`jwt.verify` lança exceções específicas quando o token é inválido:

| Exceção | Motivo |
|---|---|
| `JsonWebTokenError` | Token malformado ou assinatura inválida |
| `TokenExpiredError` | Token expirado |
| `NotBeforeError` | Token ainda não é válido |

Todos esses devem responder `401` — o cliente precisa fazer login novamente.

***

## Async/Await e o `next(error)`

Todo handler assíncrono precisa de `try/catch`. Se uma Promise rejeitar sem `catch`, o Express não captura — o processo Node.js emite um `UnhandledPromiseRejection` e pode travar.

```ts
// ❌ Promise rejeitada sem tratamento — o Express não captura
router.get('/', async (req, res) => {
  const data = await service.list() // se explodir, vai para o limbo
  res.json(data)
})

// ✅ erro capturado e passado para o middleware de erro
router.get('/', async (req, res, next) => {
  try {
    const data = await service.list()
    res.json(data)
  } catch (error) {
    next(error)
  }
})
```

***

## Logs

O `console.error` em produção não é suficiente para uma aplicação real, mas é o mínimo. O importante é logar o erro completo **no servidor** antes de responder com a mensagem genérica:

```ts
// Loga o erro completo internamente
console.error(`[${new Date().toISOString()}] ${err.message}`, err.stack)

// Responde com mensagem genérica para o cliente
res.status(500).json({ success: false, error: 'Erro interno do servidor' })
```

***

## Boas Práticas

**Centralize tudo no middleware de erro** — se você está respondendo com erro dentro do controller, está duplicando lógica que pertence a um lugar só.

**Sempre `next(error)` no catch, nunca `res.json()` de erro** — o middleware de erro existe para que o formato da resposta seja consistente em toda a aplicação.

**Não engula erros com catch vazio** — um `catch` que não faz nada esconde bugs reais:

```ts
// ❌ o erro sumiu — você nunca vai saber o que aconteceu
try {
  await service.create(data)
} catch (error) {}

// ✅
try {
  await service.create(data)
} catch (error) {
  next(error)
}
```

**Trate erros específicos do Prisma e do JWT** — sem isso, erros comuns como e-mail duplicado e token expirado chegam ao cliente como `500`, quando deveriam ser `409` e `401`.