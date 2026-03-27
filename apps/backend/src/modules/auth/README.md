# 🔑 modules/auth — Autenticação

> Módulo responsável pelo login e geração do token JWT.
> É o único ponto de entrada para obter um token válido no sistema —
> todas as rotas protegidas dependem do que este módulo emite (RF09, RNF08).

***

## 📑 Índice

- [Responsabilidade](#responsabilidade)
- [Estrutura de Arquivos](#estrutura)
- [Camadas](#camadas)
- [Fluxo de autenticação](#fluxo)
- [Endpoint](#endpoint)
- [Regras de Contribuição](#regras)

***

## 🎯 Responsabilidade <a id="responsabilidade"></a>

Este módulo faz **uma coisa apenas**: receber credenciais, validá-las e devolver
um token JWT. Ele não gerencia usuários (isso é responsabilidade de `modules/users/`)
e não controla acesso a rotas (isso é responsabilidade dos middlewares `auth` e `rbac`).

| Responsabilidade | Arquivo |
| ---------------- | ------- |
| Receber e validar o body da requisição | `auth.routes.ts` |
| Buscar usuário e verificar senha | `auth.service.ts` |
| Retornar o token JWT e dados do usuário | `auth.controller.ts` |
| Tipagem dos DTOs e responses | `auth.types.ts` |

***

## 📁 Estrutura de Arquivos <a id="estrutura"></a>

```
modules/auth/
├── auth.controller.ts   # Recebe req, chama service, devolve resposta HTTP
├── auth.service.ts      # Busca usuário no banco, verifica hash, gera JWT
├── auth.routes.ts       # Define POST /auth/login com validação Zod
└── auth.types.ts        # LoginDto, LoginResponse, AuthPayload (payload do JWT)
```

***

## 🧱 Camadas <a id="camadas"></a>

### auth.routes.ts

Define a rota `POST /auth/login` e aplica a validação do body com Zod
antes de passar para o controller. Se a validação falhar, o middleware
de erro retorna `422` com detalhes por campo — o controller nunca é chamado.

```ts
const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
})
```

### auth.service.ts

Contém toda a lógica de negócio da autenticação. Segue esta sequência:

1. Busca o usuário pelo e-mail no banco via Prisma
2. Se não encontrar, lança `AppError('Credenciais inválidas', 401)` — **nunca** informe se foi o e-mail ou a senha que errou
3. Verifica a senha com `comparePassword` de `utils/hash.utils.ts` (Argon2id)
4. Se a senha não bater, lança `AppError('Credenciais inválidas', 401)`
5. Gera o JWT com `generateToken` de `utils/jwt.utils.ts` contendo `id`, `role` e `exp`
6. Retorna o token e os dados públicos do usuário

```ts
// ✅ Mensagem de erro idêntica para e-mail e senha — nunca revele qual campo falhou
throw new AppError('Credenciais inválidas', 401)
```

### auth.controller.ts

Chama o service e formata a resposta HTTP. Não contém lógica de negócio:

```ts
// ✅ Controller fino — apenas orquestra
async login(req: Request, res: Response) {
  const result = await authService.login(req.body)
  res.status(200).json({ success: true, data: result })
}
```

### auth.types.ts

```ts
// Body esperado na requisição
interface LoginDto {
  email: string
  password: string
}

// Resposta retornada ao frontend
interface LoginResponse {
  token: string
  user: {
    id: string
    email: string
    role: 'ADMIN' | 'SECRETARY'
  }
}

// Payload decodificado do JWT
interface AuthPayload {
  id: string
  role: 'ADMIN' | 'SECRETARY'
  exp: number
}
```

***

## 🔄 Fluxo de autenticação <a id="fluxo"></a>

```
POST /auth/login { email, password }
        ↓
Zod valida o body → 422 se inválido
        ↓
authService.login()
        ↓
Prisma busca usuário por email → 401 se não encontrado
        ↓
Argon2id compara senha com hash → 401 se não bater
        ↓
JWT gerado com { id, role, exp }
        ↓
200 → { token, user: { id, email, role } }
```

> ⚠️ O token deve ser enviado pelo frontend em **todas** as requisições
> subsequentes via header `Authorization: Bearer <token>`.
> O middleware `auth.middleware.ts` valida o token antes de liberar
> qualquer rota protegida.

***

## 🔌 Endpoint <a id="endpoint"></a>

Documentação completa com exemplos de request/response em
[`docs/api-layer.md`](../../../../docs/api-layer.md).

| Método | Rota | Acesso | Descrição |
| ------ | ---- | :----: | --------- |
| `POST` | `/api/v1/auth/login` | Público | Autentica e retorna JWT |

***

## 📐 Regras de Contribuição <a id="regras"></a>

- A mensagem de erro para credenciais inválidas deve ser **sempre a mesma** — nunca diferencie e-mail de senha na resposta
- O controller **nunca** acessa o Prisma diretamente — isso é responsabilidade exclusiva do service
- Alterações no payload do JWT (`AuthPayload`) exigem atualização em `auth.types.ts` e em `middlewares/auth.middleware.ts`
- Não adicione lógica de criação ou edição de usuários aqui — isso pertence a `modules/users/`

***

> _Próximo módulo: [`../users/README.md`](../users/README.md)_