# Zod — Guia para Iniciantes

Zod resolve um problema simples: tudo que vem do cliente — o corpo de uma requisição, parâmetros da URL, query strings — chega como dado desconhecido. O TypeScript garante tipos em tempo de desenvolvimento, mas não consegue verificar o que realmente chega em runtime. O Zod preenche esse gap.

***

## Por que Validar?

Imagine que seu frontend envia um formulário com `email` e `password`. Sem validação, o cliente pode enviar:

- O campo `email` vazio
- Um número no lugar de uma string
- Um objeto malicioso no lugar de um texto

Sem Zod, esses dados chegam no service, são passados para o Prisma e geram erros confusos ou comportamentos inesperados. Com Zod, você barra isso na entrada — antes de qualquer processamento.

***

## A Ideia Central

Você descreve o formato que espera receber. O Zod compara com o que chegou. Se bater, você recebe o dado seguro e tipado. Se não bater, você recebe uma lista de erros por campo.

```ts
// Você descreve assim:
const schema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
})

// O Zod confere se o que chegou bate com isso
const result = schema.safeParse(req.body)

if (!result.success) {
  // não bateu — retorna os erros para o cliente
}

// bateu — result.data é seguro e tipado
const { email, password } = result.data
```

***

## Tipos Básicos

Cada campo do schema começa com um tipo:

```ts
z.string()    // texto
z.number()    // número
z.boolean()   // verdadeiro ou falso
z.date()      // data
```

***

## Adicionando Regras

Depois do tipo, você encadeia regras. Pense como "este campo é uma string E deve ser e-mail E ter no máximo 255 caracteres":

```ts
z.string().email()                  // deve ser um e-mail válido
z.string().min(1)                   // não pode estar vazio
z.string().min(6).max(100)          // entre 6 e 100 caracteres
z.string().uuid()                   // deve ser um UUID válido
z.number().int().positive()         // número inteiro maior que zero
z.number().min(1).max(50)           // entre 1 e 50
```

***

## Campos Opcionais

Por padrão, todo campo do schema é obrigatório. Para tornar opcional:

```ts
z.string().optional()   // pode não vir — undefined é aceito
z.string().nullable()   // pode vir como null
z.string().default('OPEN') // se não vier, usa 'OPEN'
```

***

## Valores Fixos com `enum`

Quando um campo só aceita valores específicos, use `z.enum()`. Ele rejeita qualquer coisa fora da lista:

```ts
z.enum(['OPEN', 'ANSWERED'])      // só aceita esses dois
z.enum(['ADMIN', 'SECRETARY'])
z.enum(['MENU', 'ANSWER'])
```

***

## Mensagens de Erro em Português

O Zod gera mensagens em inglês por padrão. Você personaliza assim:

```ts
z.string({ required_error: 'E-mail é obrigatório' })
  .email({ message: 'Formato de e-mail inválido' })
  .min(6, { message: 'Senha deve ter pelo menos 6 caracteres' })
```

O frontend recebe exatamente essa mensagem — pronta para exibir no formulário.

***

## `parse` vs `safeParse`

São duas formas de validar, com comportamentos diferentes quando o dado é inválido:

**`parse`** — lança uma exceção se inválido. Use quando quer que o erro suba (ex: validação de variáveis de ambiente no startup).

**`safeParse`** — nunca lança exceção. Retorna um objeto com `success: true` ou `success: false`. Use nas rotas, onde você quer responder `422` com os erros, não travar o servidor.

***

## Gerando o Tipo TypeScript Automaticamente

Essa é uma das maiores vantagens do Zod — você escreve o schema uma vez e o TypeScript infere o tipo automaticamente. Sem duplicação:

```ts
const createQuestionSchema = z.object({
  text:  z.string().min(1),
  email: z.string().email(),
})

type CreateQuestionDto = z.infer<typeof createQuestionSchema>
// resultado: { text: string; email: string }
```

Sem `z.infer`, você teria que criar a interface TypeScript separada e manter as duas em sincronia — o que inevitavelmente gera inconsistências.

***

## Query Strings São Sempre Strings

Um detalhe que pega muitos iniciantes: query strings chegam sempre como texto, mesmo que pareçam números:

```
/questions?page=2&limit=10
```

Aqui `page` chega como `"2"`, não como `2`. Se você passar isso direto para o Prisma no `skip`, vai dar erro. O Zod resolve com `.transform()`:

```ts
z.string().transform(Number)  // converte "2" para 2 antes de passar adiante
```

***

## Boas Práticas

**Valide na entrada, confie depois** — valide no momento em que o dado chega na rota. Depois da validação, trate o dado como confiável em todo o restante do código.

**Nunca use `z.any()`** — anula toda proteção que o Zod oferece. Se não sabe o tipo, use `z.unknown()`.

**Valide `params` e `query` também, não só o body** — um UUID malformado em `req.params.id` passado direto para o Prisma gera um erro genérico difícil de entender.

**Use `z.infer` sempre** — define o schema uma vez e deixa o Zod gerar o tipo. Manter schema e interface TypeScript separados é a receita para ficarem fora de sincronia.

***

> _Próximo documento: [`REST-HTTP.md`](./REST-HTTP.md)_
