# TypeScript — Guia para Iniciantes

TypeScript é JavaScript com tipos. Ele não muda como o código roda — no final tudo vira JavaScript. O que ele muda é o que acontece **antes** de rodar: o editor te avisa quando você usa um dado errado, chama uma função com argumentos errados ou acessa uma propriedade que não existe.

***

## Por que TypeScript?

Sem TypeScript, você só descobre erros quando o código roda — às vezes em produção. Com TypeScript, você descobre enquanto escreve:

```ts
// Sem TypeScript — explode em produção
const user = getUser()
console.log(user.nome) // undefined — a propriedade se chama "name"

// Com TypeScript — erro antes de rodar
const user: User = getUser()
console.log(user.nome) // ❌ Propriedade 'nome' não existe em 'User'
```

***

## Tipos Primitivos

```ts
const name: string = 'João'
const age: number = 25
const active: boolean = true
const nothing: null = null
const empty: undefined = undefined
```

Na prática, você raramente precisa anotar tipos em variáveis simples — o TypeScript **infere** automaticamente:

```ts
const name = 'João'   // TypeScript já sabe que é string
const age = 25        // TypeScript já sabe que é number
```

Anote tipos onde o TypeScript não consegue inferir — parâmetros de função, retornos complexos, dados externos.

***

## `interface` e `type`

São as formas de descrever o formato de um objeto. Use para documentar e garantir a estrutura dos dados:

```ts
// interface — preferida para objetos e contratos
interface User {
  id: string
  name: string
  email: string
  role: 'ADMIN' | 'SECRETARY'
}

// type — preferido para uniões, aliases e tipos computados
type QuestionStatus = 'OPEN' | 'ANSWERED'
type ID = string
```

Na dúvida, use `interface` para objetos e `type` para todo o resto.

***

## Union Types — Ou um, ou outro

Quando um valor pode ser de mais de um tipo:

```ts
type Status = 'OPEN' | 'ANSWERED'          // só esses dois valores
type ID = string | number                   // string ou number
type MaybeUser = User | null                // usuário ou nulo

// Muito usado em funções que podem não encontrar um resultado
function findUser(id: string): User | null {
  // ...
}
```

***

## Optional e Nullable

```ts
interface Question {
  id: string
  text: string
  userId?: string        // ? = campo opcional — pode não existir
  answeredAt: Date | null // pode ser null mas deve ser declarado
}

// userId pode não estar presente
const q: Question = { id: '1', text: 'Pergunta', answeredAt: null }
```

`?` e `| null` parecem iguais mas são diferentes: `?` significa que o campo pode não existir no objeto, `| null` significa que o campo existe mas pode ser nulo.

***

## Funções Tipadas

```ts
// Tipando parâmetros e retorno
function add(a: number, b: number): number {
  return a + b
}

// Arrow function
const greet = (name: string): string => `Olá, ${name}`

// Parâmetro opcional
function createUser(email: string, name?: string): User { ... }

// Parâmetro com valor padrão
function listQuestions(page: number = 1, limit: number = 10) { ... }

// Retorno assíncrono — sempre Promise<T>
async function getUser(id: string): Promise<User | null> { ... }
```

***

## Arrays e Objetos

```ts
// Arrays
const ids: string[] = ['abc', 'xyz']
const questions: Question[] = []

// Objeto com formato livre — evite, prefira interface
const data: Record<string, string> = { key: 'value' }

// Objeto com chaves de um union type
const statusLabel: Record<QuestionStatus, string> = {
  OPEN: 'Em aberto',
  ANSWERED: 'Respondida',
}
```

***

## `as const` — Valores Imutáveis

Quando você quer que o TypeScript trate um valor como literal fixo, não como tipo genérico:

```ts
// Sem as const — TypeScript infere string[]
const roles = ['ADMIN', 'SECRETARY']

// Com as const — TypeScript infere readonly ['ADMIN', 'SECRETARY']
const roles = ['ADMIN', 'SECRETARY'] as const

// Útil para gerar union types de arrays
type Role = typeof roles[number]  // 'ADMIN' | 'SECRETARY'
```

***

## Generics — Tipos Flexíveis

Generics permitem criar funções e tipos que funcionam com qualquer tipo, mantendo a segurança:

```ts
// Sem generic — perde a informação do tipo
function firstItem(array: any[]): any { ... }

// Com generic — mantém o tipo
function firstItem<T>(array: T[]): T {
  return array[0]
}

const first = firstItem(['a', 'b']) // TypeScript sabe que é string
const num = firstItem([1, 2, 3])    // TypeScript sabe que é number
```

O `T` é só um nome — por convenção usa-se `T`, mas pode ser qualquer coisa.

***

## Utility Types — Os Mais Usados

TypeScript tem tipos utilitários prontos que transformam interfaces existentes:

```ts
interface User {
  id: string
  name: string
  email: string
  password: string
}

Partial<User>         // todos os campos viram opcionais
Required<User>        // todos os campos viram obrigatórios
Pick<User, 'id' | 'name'>     // só id e name
Omit<User, 'password'>        // tudo menos password
Record<string, User>          // objeto com chaves string e valores User

// Muito usado em DTOs
type CreateUserDto = Omit<User, 'id'>       // tudo menos o id
type UpdateUserDto = Partial<Omit<User, 'id'>> // tudo menos id, tudo opcional
type PublicUser = Omit<User, 'password'>    // nunca exponha a senha
```

***

## `unknown` vs `any`

A diferença mais importante para segurança de tipos:

```ts
// any — desliga o TypeScript completamente
const data: any = response.data
data.qualquerCoisa  // sem erro — perigoso

// unknown — TypeScript força você a verificar antes de usar
const data: unknown = response.data
data.qualquerCoisa  // ❌ erro — você precisa verificar o tipo primeiro

if (typeof data === 'string') {
  data.toUpperCase() // ✅ agora o TypeScript sabe que é string
}
```

Use `unknown` quando não sabe o tipo. Nunca use `any` — ele anula toda proteção.

***

## Type Guards — Verificando Tipos em Runtime

TypeScript garante tipos em desenvolvimento, mas em runtime os dados podem ser qualquer coisa. Type guards verificam o tipo de forma que o TypeScript entende:

```ts
// instanceof — para classes
if (error instanceof AppError) {
  // TypeScript sabe que error é AppError aqui
}

// typeof — para primitivos
if (typeof value === 'string') {
  // TypeScript sabe que value é string aqui
}

// Propriedade específica — para objetos
function isUser(obj: unknown): obj is User {
  return typeof obj === 'object' && obj !== null && 'email' in obj
}
```

***

## TypeScript no Express

O Express tem alguns padrões específicos que confundem iniciantes:

```ts
import { Request, Response, NextFunction } from 'express'

// Tipando handler de rota
const handler = (req: Request, res: Response, next: NextFunction) => { ... }

// Adicionando propriedades ao req — faça em express.d.ts
declare global {
  namespace Express {
    interface Request {
      user: { sub: string; role: string }
    }
  }
}

// Tipando req.params e req.query
const handler = (req: Request<{ id: string }>, res: Response) => {
  req.params.id  // tipado como string
}
```

***

## Boas Práticas

**Nunca use `any`** — se não sabe o tipo, use `unknown` e faça a verificação. `any` é tecnicamente dívida técnica.

**Não anote o óbvio** — o TypeScript infere a maioria dos tipos. Anotar `const name: string = 'João'` é ruído:

```ts
// ❌ redundante
const name: string = 'João'
const items: Question[] = []

// ✅ inferência automática
const name = 'João'
const items: Question[] = []  // aqui faz sentido — array vazio não tem como inferir
```

**Use `Omit` e `Partial` para DTOs** — evita duplicar interfaces e mantém tudo sincronizado com o tipo base.

**Prefira `interface` para objetos que serão extendidos** — `interface` suporta `extends` e merge de declaração, `type` não:

```ts
interface AdminUser extends User {
  permissions: string[]
}
```

**Ative o `strict` no `tsconfig.json`** — ele habilita as verificações mais importantes, incluindo `strictNullChecks`, que força você a tratar `null` e `undefined` explicitamente.