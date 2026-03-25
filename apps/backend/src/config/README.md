# 📁 src/config/

Esta pasta centraliza a inicialização de infraestrutura da aplicação. Seus arquivos rodam antes de qualquer requisição ser aceita e falham intencionalmente se algo estiver mal configurado — é melhor o servidor não subir do que subir com configuração errada.

***

## Estrutura

```
config/
├── env.ts        # Lê e valida variáveis de ambiente com Zod
└── database.ts   # Singleton do PrismaClient
```

***

## `env.ts`

Lê as variáveis de ambiente e valida com Zod no momento em que o servidor inicia. Se qualquer variável obrigatória estiver faltando ou com formato inválido, o processo encerra imediatamente com uma mensagem descritiva — antes de aceitar qualquer requisição.

```ts
// Importado assim em qualquer lugar do projeto
import { env } from '@/config/env'

env.JWT_SECRET   // string garantida
env.PORT         // number garantido
env.DATABASE_URL // string garantida
```

**Por que não usar `process.env` diretamente?**

`process.env` retorna `string | undefined` para qualquer variável — o TypeScript não sabe se ela existe ou qual o tipo. O `env.ts` resolve isso: após a validação, todas as variáveis têm tipo garantido e você sabe que existem.

```ts
// ❌ sem validação — pode ser undefined, explode em runtime
const secret = process.env.JWT_SECRET
jwt.sign(payload, secret) // TypeScript reclama: secret pode ser undefined

// ✅ com env.ts — tipo garantido
const secret = env.JWT_SECRET
jwt.sign(payload, secret) // seguro
```

***

## `database.ts`

Exporta uma instância única do `PrismaClient` compartilhada em toda a aplicação. Instanciar o Prisma múltiplas vezes abre várias connection pools desnecessárias — com o singleton, todo o projeto usa a mesma conexão.

```ts
// Importado assim em qualquer módulo que precisa do banco
import { prisma } from '@/config/database'

const questions = await prisma.question.findMany()
```

**Por que singleton?**

O `PrismaClient` mantém um pool de conexões com o banco. Cada `new PrismaClient()` abre um novo pool. Em desenvolvimento com hot reload, isso pode esgotar as conexões disponíveis rapidamente. O singleton garante uma única instância independente de quantas vezes o módulo for importado.

***

## Regras de contribuição

- **Não** adicione lógica de negócio aqui — esta pasta é só infraestrutura
- Toda nova variável de ambiente **deve** ser adicionada ao schema do `env.ts` e ao `.env.example`
- Nunca importe `process.env` diretamente em outros módulos — sempre passe por `env.ts`