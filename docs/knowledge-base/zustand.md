# 🐻 Zustand — Estado Global do Cliente

> O essencial sobre Zustand para contribuir com o FatecBot.
> Foco exclusivo no que o projeto usa: gerenciamento do estado de autenticação
> e preferências de UI — sem cachear dados da API.

***

## 📑 Índice

- [O que é e por que usamos](#o-que-e)
- [Criando uma store](#criando)
- [Consumindo a store](#consumindo)
- [Persistência](#persistencia)
- [A store de auth do FatecBot](#store-auth)
- [Erros comuns](#erros)

***

## 🎯 O que é e por que usamos <a id="o-que-e"></a>

Zustand é uma biblioteca minimalista de estado global para React. No FatecBot
ele é usado **exclusivamente para estado do cliente** — dados que existem
apenas no browser e nunca vêm da API.

O motivo de não usar Context API para isso é simples: Context re-renderiza
**toda** a árvore de componentes que o consome quando qualquer valor muda.
Zustand é granular — o componente só re-renderiza quando o slice específico
que ele lê muda.

> ⚠️ **Zustand não substitui o TanStack Query.** Se o dado vem da API,
> ele pertence ao TanStack Query — não crie stores para cachear dados do servidor.
> Consulte [`state-management.md`](../state-management.md) para entender a divisão.

***

## 🧱 Criando uma store <a id="criando"></a>

Uma store é criada com `create()` e recebe uma função que define o estado
inicial e as ações para modificá-lo:

```ts
import { create } from 'zustand'

interface CounterStore {
  count: number
  increment: () => void
  reset: () => void
}

export const useCounterStore = create<CounterStore>((set) => ({
  count: 0,
  increment: () => set((state) => ({ count: state.count + 1 })),
  reset: () => set({ count: 0 }),
}))
```

O `set` substitui parcialmente o estado — você não precisa espalhar
o estado anterior manualmente como no `useState`:

```ts
// ✅ Zustand faz merge automático
set({ count: 0 })

// ❌ Desnecessário — não precisa de spread
set((state) => ({ ...state, count: 0 }))
```

***

## 🔍 Consumindo a store <a id="consumindo"></a>

Use o hook gerado pelo `create()` em qualquer componente. Para evitar
re-renders desnecessários, leia apenas o que o componente precisa:

```ts
// ✅ Lê apenas o que precisa — re-renderiza só quando count muda
const count = useCounterStore((state) => state.count)
const increment = useCounterStore((state) => state.increment)

// ⚠️ Lê a store inteira — re-renderiza quando qualquer coisa muda
const store = useCounterStore()
```

Fora de componentes React (como no interceptor do Axios), use `.getState()`:

```ts
// ✅ Leitura fora de componente — sem hook
const token = useAuthStore.getState().token
const clearAuth = useAuthStore.getState().clearAuth
```

***

## 💾 Persistência <a id="persistencia"></a>

O middleware `persist` salva a store no `localStorage` automaticamente,
fazendo o estado sobreviver a reloads de página:

```ts
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      token: null,
      user: null,
      setAuth: (token, user) => set({ token, user }),
      clearAuth: () => set({ token: null, user: null }),
    }),
    {
      name: 'fatecbot:auth', // chave no localStorage
    },
  ),
)
```

> ⚠️ Use `persist` apenas na store de auth. Outras stores **não devem
> persistir** — dados do servidor são sempre rebuscados da API quando necessário.

***

## 🔐 A store de auth do FatecBot <a id="store-auth"></a>

É a única store global do projeto. Vive em
`features/auth/stores/auth.store.ts` e é consumida em três lugares:

| Onde | Para quê |
| ---- | -------- |
| `hooks/useLogin.ts` | Popula a store após login bem-sucedido |
| `lib/axios.ts` | Lê o token para injetar no header `Authorization` |
| `components/shared/ProtectedRoute.tsx` | Lê o `user` para decidir se redireciona para `/login` |

```ts
// Tipagem completa da store
interface AuthStore {
  token: string | null
  user: AuthUser | null
  setAuth: (token: string, user: AuthUser) => void
  clearAuth: () => void
}

// AuthUser — shape do usuário dentro do JWT
interface AuthUser {
  id: string
  email: string
  role: 'ADMIN' | 'SECRETARY'
}
```

Exemplos de consumo correto:

```ts
// Em um componente — lê o usuário logado
const user = useAuthStore((state) => state.user)
const isAdmin = user?.role === 'ADMIN'

// No botão de logout
const clearAuth = useAuthStore((state) => state.clearAuth)
<button onClick={clearAuth}>Sair</button>

// No interceptor Axios — fora de componente
const token = useAuthStore.getState().token
if (token) config.headers.Authorization = `Bearer ${token}`
```

***

## 🚨 Erros comuns <a id="erros"></a>

**Lendo o token diretamente do `localStorage`**
```ts
// ❌ Nunca faça isso
const token = localStorage.getItem('fatecbot:auth')

// ✅ Sempre via store
const token = useAuthStore((state) => state.token)
```

***

**Criando store para cachear dados da API**
```ts
// ❌ Errado — dados do servidor não pertencem ao Zustand
interface WrongStore {
  nodes: Node[]
  setNodes: (nodes: Node[]) => void
}

// ✅ Correto — use TanStack Query para dados da API
const { data: nodes } = useQuery({
  queryKey: ['nodes'],
  queryFn: nodesApi.getAll,
})
```

***

**Chamando `clearAuth` fora do fluxo de logout**
```ts
// ❌ Nunca chame clearAuth em lógica de feature
if (someCondition) clearAuth()

// ✅ clearAuth é chamado apenas em dois lugares:
// 1. Interceptor Axios quando recebe 401
// 2. Botão de logout do usuário
```

***

> _Para entender como Zustand e TanStack Query se complementam no projeto,
> consulte [`../state-management.md`](../state-management.md)._