# 🔑 features/auth — Autenticação

> Feature responsável pelo fluxo de login, logout e persistência do estado
> de autenticação em toda a aplicação. É a fonte de verdade para saber quem
> está logado, qual o seu role e se o token JWT ainda é válido (RF09).

***

## 📑 Índice

- [Responsabilidade](#responsabilidade)
- [Estrutura de Arquivos](#estrutura)
- [Camadas](#camadas)
- [Fluxo de Autenticação](#fluxo)
- [Regras de Contribuição](#regras)

***

## 🎯 Responsabilidade <a id="responsabilidade"></a>

Esta feature gerencia **tudo** relacionado a identidade do usuário no frontend:
desde o formulário de login até a limpeza do estado ao expirar o token.
Nenhuma outra feature decide se o usuário está autenticado — elas apenas
**consomem** o que `features/auth/` expõe.

| Responsabilidade                             | Onde vive              |
| -------------------------------------------- | ---------------------- |
| Chamada ao endpoint `POST /auth/login`       | `api/auth.api.ts`      |
| Estado global de autenticação (token + user) | `stores/auth.store.ts` |
| Formulário de login                          | `components/LoginForm` |
| Hook de login com feedback de erro           | `hooks/useLogin.ts`    |
| Tipagem do usuário autenticado               | `types/auth.types.ts`  |

***

## 📁 Estrutura de Arquivos <a id="estrutura"></a>

```
features/auth/
├── api/
│   └── auth.api.ts             # POST /auth/login
│
├── components/
│   └── LoginForm/              # Formulário de e-mail + senha com validação
│       └── index.tsx
│
├── hooks/
│   └── useLogin.ts             # useMutation: chama api, popula store em onSuccess
│
├── stores/
│   └── auth.store.ts           # Zustand: token, user, role, setAuth, clearAuth
│
└── types/
    └── auth.types.ts           # AuthUser, LoginDto, LoginResponse
```

***

## 🧱 Camadas <a id="camadas"></a>

### api/

Função pura que chama o endpoint de login e retorna o token JWT e os dados do usuário.

```ts
// ✅ Padrão adotado em api/
export const authApi = {
  login: (data: LoginDto) =>
    api.post<LoginResponse>('/auth/login', data).then(res => res.data),
}
```

### stores/

O `auth.store.ts` é a **única fonte de verdade** para o estado de autenticação.
Usa Zustand com persistência em `localStorage` para sobreviver a reloads de página.

```ts
// auth.store.ts
interface AuthStore {
  token: string | null
  user: AuthUser | null
  setAuth: (token: string, user: AuthUser) => void
  clearAuth: () => void
}

// ✅ Consumo correto em qualquer lugar da aplicação
const { user, clearAuth } = useAuthStore()

// ❌ Nunca leia o token do localStorage diretamente
const token = localStorage.getItem('token')
```

### hooks/

O `useLogin` encapsula o fluxo completo: chama a API, popula a store em caso de
sucesso e redireciona o usuário para o painel correto conforme o role.

```ts
// ✅ Padrão adotado em hooks/
export function useLogin() {
  const { setAuth } = useAuthStore()
  const navigate = useNavigate()

  return useMutation({
    mutationFn: authApi.login,
    onSuccess: ({ token, user }) => {
      setAuth(token, user)
      navigate(user.role === 'ADMIN' ? '/admin' : '/secretary')
    },
  })
}
```

### components/

O `LoginForm` é o único componente desta feature. Valida os campos com Zod
antes de disparar a mutation e exibe feedback de erro em caso de credenciais inválidas.

```tsx
// ✅ Componente correto — valida antes de mutar
const schema = z.object({
  email: z.string().email('E-mail inválido'),
  password: z.string().min(1, 'Senha obrigatória'),
})
```

***

## 🔄 Fluxo de Autenticação <a id="fluxo"></a>

```
Usuário preenche LoginForm
        ↓
Zod valida os campos client-side
        ↓
useLogin dispara POST /auth/login
        ↓
Backend valida senha com Argon2id + gera JWT
        ↓
onSuccess → setAuth(token, user) no Zustand
        ↓
Axios interceptor passa a injetar Bearer em todas as requests
        ↓
navigate('/admin' | '/secretary') conforme role
```

Em caso de token expirado ou inválido, o interceptor de resposta do Axios
chama `clearAuth()` e redireciona para `/login` automaticamente — sem
nenhuma ação manual necessária nos componentes.

***

## 📐 Regras de Contribuição <a id="regras"></a>

- **Nunca leia** `token` ou `user` do `localStorage` diretamente — use sempre `useAuthStore()`
- **Nunca importe** `auth.store.ts` fora de `features/auth/` e `lib/axios.ts` — se outra feature precisa saber o role, ela consome o hook `useAuthStore()`
- O redirecionamento pós-login **sempre** leva em conta o `role` — nunca direcione fixo para `/admin`
- Alterações no shape de `AuthUser` exigem atualização em `types/auth.types.ts` antes de qualquer outra mudança
- `clearAuth` deve ser chamado **apenas** pelo interceptor Axios (401) ou pelo botão de logout — nunca por lógica de feature

***

> _Este README deve ser atualizado sempre que o fluxo de autenticação,
> os roles disponíveis ou a estrutura do token JWT forem alterados._

> _Próximo documento: [`../chatbot/README.md`](../chatbot/README.md)_
