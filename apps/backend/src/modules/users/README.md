# 👥 modules/users — Gestão de Usuários

> Módulo responsável pela criação e remoção dos usuários autenticados do sistema —
> Secretárias Acadêmicas e Administradores. Acesso restrito ao Administrador (RF04, RF03).

***

## 📑 Índice

- [Responsabilidade](#responsabilidade)
- [Estrutura de Arquivos](#estrutura)
- [Camadas](#camadas)
- [Modelo de dados](#modelo)
- [Endpoints](#endpoints)
- [Regras de Contribuição](#regras)

***

## 🎯 Responsabilidade <a id="responsabilidade"></a>

Este módulo gerencia o ciclo de vida dos usuários autenticados do sistema.
O perfil **Aluno não é um usuário cadastrado** — ele acessa o chatbot de forma
pública, sem autenticação. Apenas Secretárias e Administradores possuem conta.

O Administrador padrão **não é criado por este módulo** — ele é gerado
pelo seed em `prisma/seed.ts` e não pode ser removido por esta interface.

| Responsabilidade | Arquivo |
| ---------------- | ------- |
| Listar, criar e remover usuários | `users.routes.ts` |
| Lógica de criação e remoção | `users.service.ts` |
| Receber requests e formatar respostas | `users.controller.ts` |
| Tipagem dos DTOs e responses | `users.types.ts` |

***

## 📁 Estrutura de Arquivos <a id="estrutura"></a>

```
modules/users/
├── users.controller.ts  # Recebe req, chama service, devolve resposta HTTP
├── users.service.ts     # Lógica de listagem, criação e remoção de usuários
├── users.routes.ts      # Define rotas protegidas (🔒 ADMIN)
└── users.types.ts       # CreateUserDto, UserResponse
```

***

## 🧱 Camadas <a id="camadas"></a>

### users.routes.ts

Todas as rotas são protegidas por `authMiddleware` + `authorize('ADMIN')`:

```ts
router.use(authMiddleware)
router.use(authorize('ADMIN'))

router.get('/', usersController.getAll)
router.post('/', usersController.create)
router.delete('/:id', usersController.remove)
```

O body do `POST /users` é validado com Zod antes de chegar ao controller.

### users.service.ts

**`getAll`** — lista todos os usuários cadastrados exceto o administrador
padrão. Nunca retorna o campo `password` — mapeie sempre para `UserResponse`
antes de retornar:

```ts
// ✅ Nunca retorne o hash da senha
const users = await prisma.user.findMany({
  where: { role: 'SECRETARY' },
  select: { id: true, email: true, role: true, createdAt: true },
})
```

**`create`** — cria um novo usuário com role `SECRETARY`. O `role` nunca
é aceito no body — todos os usuários criados por esta interface são
Secretárias. A senha é hasheada com Argon2id via `hashPassword` de
`utils/hash.utils.ts` antes de persistir:

```ts
// ✅ Hash da senha antes de salvar
const hashedPassword = await hashPassword(dto.password)

await prisma.user.create({
  data: {
    email: dto.email,
    password: hashedPassword,
    role: 'SECRETARY',    // sempre SECRETARY — nunca aceite role no body
  },
})
```

**`remove`** — remove um usuário pelo `id`. Bloqueia a remoção se o
usuário for o administrador padrão ou se o `id` não existir:

```ts
// ✅ Proteção do admin padrão
if (user.role === 'ADMIN') {
  throw new AppError('O administrador padrão não pode ser removido.', 403)
}
```

### users.controller.ts

Chama o service e formata a resposta HTTP. Não contém lógica de negócio:

```ts
// ✅ Controller fino — apenas orquestra
async create(req: Request, res: Response) {
  const user = await usersService.create(req.body)
  res.status(201).json({ success: true, data: user })
}
```

### users.types.ts

```ts
// Body esperado no POST /users
interface CreateUserDto {
  email: string
  password: string    // senha em texto plano — hasheada no service
}

// Resposta retornada ao frontend — nunca inclui password
interface UserResponse {
  id: string
  email: string
  role: 'SECRETARY' | 'ADMIN'
  createdAt: string
}
```

***

## 🗄️ Modelo de dados <a id="modelo"></a>

```
User
├── id        String   @id
├── email     String   @unique
├── password  String   (hash Argon2id — nunca retornado pela API)
├── role      Role     (ADMIN | SECRETARY)
└── createdAt DateTime
```

> O campo `password` **nunca** deve aparecer em nenhuma resposta da API —
> nem em listagem, nem em criação, nem em erro. Sempre use `select` explícito
> no Prisma ou mapeie para `UserResponse` antes de retornar.

***

## 🔌 Endpoints <a id="endpoints"></a>

Documentação completa com exemplos de request/response em
[`docs/api-layer.md`](../../../../../docs/api-layer.md).

| Método | Rota | Acesso | Descrição |
| ------ | ---- | :----: | --------- |
| `GET` | `/api/v1/users` | 🔒 ADMIN | Lista usuários da secretaria |
| `POST` | `/api/v1/users` | 🔒 ADMIN | Cria usuário da secretaria |
| `DELETE` | `/api/v1/users/:id` | 🔒 ADMIN | Remove usuário |

***

## 📐 Regras de Contribuição <a id="regras"></a>

- O campo `password` **nunca** é retornado pela API — use sempre `select` explícito ou mapeie para `UserResponse`
- O `role` **nunca** é aceito no body do `POST` — todos os usuários criados aqui são `SECRETARY`
- A criação de novos Administradores **não é suportada** por esta interface — o admin padrão existe apenas via seed
- O administrador padrão **não pode ser removido** — bloqueie no service antes de chamar o Prisma
- Senhas são sempre hasheadas com Argon2id via `utils/hash.utils.ts` — nunca use bcrypt ou salve em texto plano
- Rotas deste módulo são **sempre protegidas** — nunca remova o `authMiddleware` ou o `authorize('ADMIN')`

***

> _Próximo documento: [`../logs/README.md`](../logs/README.md)_
