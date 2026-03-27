# 📁 src/

Diretório raiz do código-fonte da aplicação. Toda a lógica do servidor vive aqui — da configuração inicial ao tratamento de erros, passando por todos os domínios de negócio.

***

## Estrutura Geral

```
src/
├── config/         # Variáveis de ambiente e conexão com o banco
├── middlewares/    # Interceptadores globais de requisição
├── modules/        # Domínios de negócio da aplicação
├── routes/         # Registro central de todas as rotas
├── errors/         # Classe base para erros controlados
├── utils/          # Funções puras reutilizáveis
├── server.ts       # Cria e exporta o app Express
└── index.ts        # Sobe o servidor HTTP e inicia a aplicação
```

***

## `server.ts`

Inicializa a aplicação Express, registra middlewares globais e monta as rotas.
Ele **não** chama `.listen()`; essa responsabilidade fica em `index.ts`, o que
mantém o app importável por testes de integração.

```ts
app.use(loggerMiddleware)       // 1. loga tudo
app.use(cors())                 // 2. libera o frontend
app.use(express.json())         // 3. habilita req.body
app.use('/api/v1', routes)      // 4. monta as rotas
app.use(errorMiddleware)        // 5. captura todos os erros
```

A ordem importa — middlewares são executados na sequência em que são registrados.

## `index.ts`

É o arquivo que lê `env.PORT`, importa o `app` exportado por `server.ts` e
efetivamente sobe o processo HTTP:

```ts
import { env } from '@/config/env'
import { app } from '@/server'

app.listen(env.PORT, () => {
  console.log(`HTTP server running on port ${env.PORT}`)
})
```

***

## Pastas

### `config/`

Infraestrutura que precisa estar pronta antes de qualquer requisição. Contém a validação de variáveis de ambiente com Zod (`env.ts`) e o singleton do `PrismaClient` (`database.ts`).

→ Veja [`config/README.md`](./config/README.md)

***

### `middlewares/`

Funções executadas entre a requisição e o controller. Contém os middlewares globais: autenticação JWT, controle de acesso por role (RBAC), tratamento centralizado de erros e logging de requisições.

→ Veja [`middlewares/README.md`](./middlewares/README.md)

***

### `modules/`

O coração da aplicação. Cada módulo representa um domínio de negócio e segue a estrutura `routes → controller → service → types`. Nenhuma lógica de negócio existe fora desta pasta.

```
modules/
├── auth/        # Login e geração de JWT
├── chatbot/     # Navegação na árvore de nós e sessões
├── questions/   # Perguntas enviadas pelos alunos
├── nodes/       # CRUD dos nós do chatbot (ADMIN)
├── documents/   # Documentos e chunks indexados (ADMIN)
├── users/       # Usuários da secretaria (ADMIN)
└── logs/        # Visualização de sessões (ADMIN)
```

→ Veja [`modules/README.md`](./modules/README.md)

***

### `routes/`

Arquivo único (`index.ts`) que agrega os roteadores de todos os módulos e os monta nos seus prefixos. É o único ponto de acoplamento entre `server.ts` e os módulos.

→ Veja [`routes/README.md`](./routes/README.md)

***

### `errors/`

Define o `AppError` — classe que estende `Error` com um `statusCode` HTTP. Todo erro de regra de negócio lança um `AppError`, que o `errorMiddleware` converte em resposta JSON formatada.

→ Veja [`errors/README.md`](./errors/README.md)

***

### `utils/`

Funções puras sem estado e sem dependência de Express ou Prisma. Contém utilitários de hash de senha (`hash.utils.ts`), geração e validação de JWT (`jwt.utils.ts`) e cálculo de paginação (`pagination.utils.ts`).

→ Veja [`utils/README.md`](./utils/README.md)

***

## Fluxo de uma Requisição

```
Cliente
  └─► Express (server.ts)
        ├─ loggerMiddleware       — loga método + path
        ├─ authMiddleware         — valida JWT, popula req.user
        ├─ rbacMiddleware         — verifica role
        ├─ routes/index.ts        — direciona ao módulo correto
        │     └─ module.routes    — valida body com Zod
        │           └─ controller — extrai req, chama service
        │                 └─ service — lógica + Prisma
        └─ errorMiddleware        — formata qualquer erro em JSON
```

***

## Regras Gerais

- Lógica de negócio **somente** em `modules/<modulo>/service.ts`
- Acesso ao Prisma **somente** em services — nunca em controllers, middlewares ou utils
- Variáveis de ambiente **somente** via `env.ts` — nunca `process.env` direto
- Erros controlados **sempre** com `AppError` — nunca `new Error()` ou `res.status()` no service
- Novos módulos devem ser registrados em `src/routes/index.ts`

***

> _Próximo documento: [`config/README.md`](./config/README.md)_
