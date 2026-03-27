# 📁 src/routes/

Ponto central de registro de todas as rotas da aplicação. Uma única responsabilidade: pegar os roteadores de cada módulo e montá-los no prefixo correto.

***

## Estrutura

```
routes/
└── index.ts   # Agrega e exporta todas as rotas com seus prefixos
```

***

## `index.ts`

Cria um roteador Express único, registra cada módulo no seu caminho base e o exporta para o `server.ts`. Nenhuma lógica vive aqui — apenas montagem.

```ts
router.use('/auth',      authRoutes)
router.use('/questions', questionRoutes)
router.use('/nodes',     nodeRoutes)
router.use('/documents', documentRoutes)
router.use('/users',     userRoutes)
router.use('/logs',      logRoutes)
```

No `server.ts`, o roteador inteiro é montado com o prefixo global da API:

```ts
app.use('/api/v1', routes)
```

O que resulta nos caminhos finais:

```
POST   /api/v1/auth/login
GET    /api/v1/questions
POST   /api/v1/nodes
GET    /api/v1/logs
...
```

***

## Por que ter esse arquivo?

Sem ele, o `server.ts` precisaria importar e registrar cada módulo diretamente — acoplando o servidor a todos os módulos. Com o `index.ts`, o `server.ts` conhece apenas um import (`routes`) e fica agnóstico a quantos módulos existem.

```ts
// ✅ server.ts limpo — não sabe quantos módulos existem
import routes from '@/routes'
app.use('/api/v1', routes)

// ❌ sem o index — server.ts cresce a cada novo módulo
app.use('/api/v1/auth',      authRoutes)
app.use('/api/v1/questions', questionRoutes)
app.use('/api/v1/nodes',     nodeRoutes)
// ...
```

***

## Regras de contribuição

- Todo novo módulo **deve** ser registrado aqui com seu prefixo
- Os prefixos devem ser **substantivos no plural** e em inglês — `/questions`, `/users`, `/nodes`
- Nenhuma rota é definida diretamente aqui — apenas montagem de roteadores externos

***

> _Próximo documento: [`../errors/README.md`](../errors/README.md)_
