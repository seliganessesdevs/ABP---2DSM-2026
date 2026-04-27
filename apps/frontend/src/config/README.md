# 📁 src/config/

Configuração e validação de variáveis de ambiente. Esta pasta tem um único arquivo com uma única responsabilidade: garantir que a aplicação nunca suba com configuração inválida ou incompleta.

***

## Estrutura

```
config/
└── env.ts
```

***

## `env.ts`

Lê as variáveis de ambiente do Vite via `import.meta.env`, valida com Zod e exporta um objeto tipado `env`. Todo o restante da aplicação importa variáveis de ambiente **exclusivamente** daqui — nunca acessa `import.meta.env` diretamente.

```ts
import { z } from 'zod'

const envSchema = z.object({
  VITE_API_URL: z.string().url('VITE_API_URL deve ser uma URL válida'),
  VITE_ENABLE_DEVTOOLS: z
    .enum(['true', 'false'])
    .default('false'),
})

const parsed = envSchema.safeParse(import.meta.env)

if (!parsed.success) {
  console.error('Variáveis de ambiente inválidas:')
  console.error(parsed.error.flatten().fieldErrors)
  throw new Error('Configuração de ambiente inválida. Verifique o .env.')
}

export const env = parsed.data
```

**Por que não acessar `import.meta.env` diretamente nos componentes?**

Acessar `import.meta.env.VITE_API_URL` diretamente em qualquer arquivo da aplicação cria três problemas:

1. **Sem validação** — se a variável estiver ausente ou malformada, o erro aparece em runtime, não no startup
2. **Sem tipagem centralizada** — o TypeScript trata como `string | undefined` em cada ponto de uso
3. **Difícil de testar** — mockar `import.meta.env` em testes é trabalhoso; mockar `@/config/env` é trivial

Com `env.ts`, o erro é lançado **antes** de qualquer componente renderizar, com mensagem descritiva.

**Uso correto em qualquer parte da aplicação:**

```ts
// ✅
import { env } from '@/config/env'
const api = axios.create({ baseURL: env.VITE_API_URL })

// ❌
const api = axios.create({ baseURL: import.meta.env.VITE_API_URL })
```

***

## Adicionando uma nova variável

1. Adicione a variável no `.env.example` com valor de exemplo
2. Adicione o campo no schema Zod em `env.ts`
3. Se o time decidir tipar `import.meta.env` localmente, mantenha essa tipagem sincronizada com o schema
4. Documente a variável na seção de variáveis de ambiente do `apps/frontend/README.md`

***

## Regras de contribuição

- `import.meta.env` só pode ser acessado dentro deste arquivo
- Nunca exporte o schema Zod — apenas o objeto `env` validado
- Variáveis booleanas chegam como string (`'true'`/`'false'`) — use `z.enum(['true', 'false'])`, não `z.boolean()`

***

> _Próximo documento: [`../types/README.md`](../types/README.md)_
