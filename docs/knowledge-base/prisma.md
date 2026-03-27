# Prisma — Guia para Iniciantes

Prisma é a ferramenta que conecta seu código ao banco de dados. Em vez de escrever SQL na mão, você escreve código TypeScript e o Prisma traduz para o banco. Ele também garante que os dados que entram e saem têm o tipo correto — sem surpresas em produção.

***

## Como Funciona

```
schema.prisma         →   banco de dados
  (você descreve)           (Prisma cria)

prisma.user.findMany()  →   SELECT * FROM users
  (você escreve)              (Prisma traduz)
```

Tudo começa no `schema.prisma` — um arquivo onde você descreve as tabelas do banco. A partir dele, o Prisma gera o cliente TypeScript que você usa no código.

***

## O `schema.prisma`

Cada `model` vira uma tabela no banco. Cada campo vira uma coluna.

```prisma
// prisma/schema.prisma

generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model User {
  id        String   @id @default(cuid())   // chave primária gerada automaticamente
  name      String
  email     String   @unique                // não permite e-mails duplicados
  password  String
  role      Role     @default(SECRETARY)
  createdAt DateTime @default(now())        // preenchido automaticamente
  updatedAt DateTime @updatedAt             // atualizado automaticamente

  questions Question[]  // um usuário tem muitas perguntas (relação)
}

model Question {
  id        String         @id @default(cuid())
  text      String
  email     String
  status    QuestionStatus @default(OPEN)
  createdAt DateTime       @default(now())

  userId    String?        // chave estrangeira (opcional — ? significa nullable)
  user      User?   @relation(fields: [userId], references: [id])
}

// Enums — lista de valores fixos permitidos
enum Role {
  ADMIN
  SECRETARY
}

enum QuestionStatus {
  OPEN
  ANSWERED
}
```

Depois de alterar o schema, você roda dois comandos:

```bash
# Cria a migração e aplica no banco
pnpm prisma migrate dev --name descricao-da-mudanca

# Regenera o cliente TypeScript
pnpm prisma generate
```

***

## Conectando ao Banco

Crie uma instância única do Prisma e reutilize em todo o projeto. Nunca crie `new PrismaClient()` em vários arquivos — o banco abre uma conexão por instância:

```ts
// src/lib/prisma.ts
import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient }

export const prisma =
  globalForPrisma.prisma ?? new PrismaClient()

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma
}
```

```ts
// Em qualquer lugar do backend
import { prisma } from '@/lib/prisma'

const users = await prisma.user.findMany()
```

***

## Buscando Dados

### Buscar todos

```ts
// Todos os usuários
const users = await prisma.user.findMany()

// Com ordenação
const users = await prisma.user.findMany({
  orderBy: { createdAt: 'desc' },  // mais recentes primeiro
})

// Com filtro
const openQuestions = await prisma.question.findMany({
  where: { status: 'OPEN' },
})
```

### Buscar um único registro

```ts
// Por ID — retorna null se não encontrar
const user = await prisma.user.findUnique({
  where: { id: userId },
})

// Por qualquer campo único
const user = await prisma.user.findUnique({
  where: { email: 'admin@fatec.sp.gov.br' },
})

// Lança erro se não encontrar (útil em rotas que exigem que exista)
const user = await prisma.user.findUniqueOrThrow({
  where: { id: userId },
})
```

### Selecionando só os campos que você precisa

Por padrão o Prisma retorna todos os campos — incluindo a senha. Sempre selecione explicitamente:

```ts
// ❌ retorna a senha junto
const user = await prisma.user.findUnique({
  where: { id: userId },
})

// ✅ só os campos necessários
const user = await prisma.user.findUnique({
  where: { id: userId },
  select: {
    id: true,
    name: true,
    email: true,
    role: true,
    // password: false — não precisa declarar, só omita
  },
})
```

### Buscando dados relacionados

```ts
// Perguntas com os dados do usuário que enviou
const questions = await prisma.question.findMany({
  include: {
    user: {
      select: { name: true, email: true },
    },
  },
})

// questions[0].user.name → funciona com tipagem correta
```

***

## Filtrando

```ts
// Igual
where: { status: 'OPEN' }

// Diferente
where: { status: { not: 'ANSWERED' } }

// Contém texto (busca parcial — equivale ao LIKE do SQL)
where: { text: { contains: 'matrícula', mode: 'insensitive' } }
// mode: 'insensitive' = ignora maiúsculas e minúsculas

// Maior que / Menor que (útil para datas)
where: { createdAt: { gte: new Date('2026-01-01') } }
// gte = greater than or equal (maior ou igual)
// lte = less than or equal (menor ou igual)
// gt  = greater than (maior que)
// lt  = less than (menor que)

// Combinando filtros com AND (todos precisam ser verdadeiros)
where: {
  status: 'OPEN',
  createdAt: { gte: new Date('2026-01-01') },
}

// Combinando filtros com OR (pelo menos um precisa ser verdadeiro)
where: {
  OR: [
    { email: { contains: '@fatec' } },
    { email: { contains: '@sp.gov' } },
  ],
}
```

***

## Paginação

```ts
const page = 1
const limit = 10

const questions = await prisma.question.findMany({
  skip: (page - 1) * limit,  // quantos registros pular
  take: limit,               // quantos pegar
  orderBy: { createdAt: 'desc' },
})

// Total para calcular quantas páginas existem
const total = await prisma.question.count({
  where: { status: 'OPEN' },
})

// Retorne os dois juntos
return {
  data: questions,
  total,
  page,
  limit,
}
```

***

## Criando Dados

```ts
// Criar um registro
const question = await prisma.question.create({
  data: {
    text: 'Como solicitar trancamento?',
    email: 'aluno@fatec.sp.gov.br',
    status: 'OPEN',
  },
})

// question.id → gerado automaticamente pelo banco
// question.createdAt → preenchido automaticamente
```

***

## Atualizando Dados

```ts
// Atualizar por ID
const question = await prisma.question.update({
  where: { id: questionId },
  data: { status: 'ANSWERED' },
})

// Atualizar e retornar os dados atualizados
const user = await prisma.user.update({
  where: { id: userId },
  data: { name: 'Novo Nome' },
  select: { id: true, name: true, email: true },
})
```

***

## Deletando Dados

```ts
// Deletar por ID
await prisma.user.delete({
  where: { id: userId },
})

// Deletar vários de uma vez
await prisma.question.deleteMany({
  where: { status: 'ANSWERED' },
})
```

***

## Verificando se já Existe

```ts
// Antes de criar, verifique duplicatas
const emailJaExiste = await prisma.user.findUnique({
  where: { email },
})

if (emailJaExiste) {
  throw new Error('Este e-mail já está cadastrado')
}
```

***

## Tratando Erros do Prisma

O Prisma lança erros com códigos específicos. Os mais comuns:

```ts
import { Prisma } from '@prisma/client'

try {
  await prisma.user.create({ data: { email, name, password } })
} catch (error) {
  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    if (error.code === 'P2002') {
      // P2002 = campo único duplicado (ex: e-mail já cadastrado)
      throw new Error('Este e-mail já está em uso')
    }
    if (error.code === 'P2025') {
      // P2025 = registro não encontrado (ex: update em ID que não existe)
      throw new Error('Registro não encontrado')
    }
  }
  throw error  // outros erros sobem normalmente
}
```

***

## Ferramentas Úteis

```bash
# Abre uma interface visual para ver e editar os dados do banco
pnpm prisma studio

# Aplica as migrações no banco sem criar arquivo de migração (só em dev)
pnpm prisma db push

# Roda o arquivo de seed (dados iniciais para desenvolvimento)
pnpm prisma db seed

# Reseta o banco e roda tudo do zero (cuidado — apaga os dados)
pnpm prisma migrate reset
```

***

## Boas Práticas

**Nunca retorne a senha do usuário** — sempre use `select` para escolher explicitamente os campos que vão sair da query.

**Use `findUniqueOrThrow` quando o registro deve existir** — ele já lança o erro certo se não encontrar, sem precisar checar manualmente:

```ts
// ❌ manual e verboso
const node = await prisma.node.findUnique({ where: { id } })
if (!node) throw new Error('Nó não encontrado')

// ✅ Prisma já faz isso
const node = await prisma.node.findUniqueOrThrow({ where: { id } })
```

**Não deixe queries dentro de loops** — isso abre uma conexão com o banco para cada item e fica lento com muitos dados:

```ts
// ❌ uma query por item do loop
for (const id of ids) {
  const node = await prisma.node.findUnique({ where: { id } })
}

// ✅ uma query só que busca todos de uma vez
const nodes = await prisma.node.findMany({
  where: { id: { in: ids } },
})
```

**Sempre rode `prisma generate` depois de alterar o schema** — sem isso o TypeScript não vai enxergar os novos campos e você vai ter erros de tipo que parecem bugs mas são só o cliente desatualizado.

***

> _Próximo documento: [`axios.md`](./axios.md)_
