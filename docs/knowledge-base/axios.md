# 🌐 Axios — Requisições HTTP

> O essencial sobre Axios no FatecBot.
> Foco na instância configurada em `lib/axios.ts` — que injeta o token JWT
> automaticamente e trata erros de autenticação sem nenhuma ação manual
> nos componentes.

***

## 📑 Índice

- [O que é e por que usamos](#o-que-e)
- [A instância do FatecBot](#instancia)
- [Interceptors](#interceptors)
- [Fazendo requisições](#requisicoes)
- [Tratamento de erros](#erros)
- [Erros comuns](#erros-comuns)

***

## 🎯 O que é e por que usamos <a id="o-que-e"></a>

Axios é uma biblioteca HTTP para fazer requisições à API. No FatecBot usamos
uma **instância configurada centralmente** em `lib/axios.ts` — nunca o Axios
padrão importado diretamente do pacote.

Isso garante que **todas** as requisições da aplicação automaticamente:
- Apontam para a URL base correta (`VITE_API_URL`)
- Carregam o token JWT no header `Authorization`
- Redirecionam para `/login` quando recebem `401`

> ⚠️ **Nunca importe `axios` diretamente** em componentes, hooks ou arquivos
> de `api/`. Use sempre a instância exportada de `lib/axios.ts`.

***

## 🔧 A instância do FatecBot <a id="instancia"></a>

A instância vive em `src/lib/axios.ts` e é exportada como `api`:

```ts
import axios from 'axios'
import { env } from '@/config/env'

export const api = axios.create({
  baseURL: env.VITE_API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})
```

A `baseURL` é lida do `env.ts` — que valida as variáveis com Zod no startup.
Nunca hardcode a URL da API:

```ts
// ✅ Correto — lê do ambiente
export const api = axios.create({ baseURL: env.VITE_API_URL })

// ❌ Nunca hardcode
export const api = axios.create({ baseURL: 'http://localhost:3333' })
```

***

## 🔌 Interceptors <a id="interceptors"></a>

Os interceptors são configurados logo abaixo da criação da instância,
no mesmo arquivo `lib/axios.ts`.

### Request interceptor — injeta o token JWT

Antes de cada requisição, lê o token do Zustand e injeta no header
`Authorization`. Nenhum componente ou hook precisa se preocupar com isso:

```ts
api.interceptors.request.use((config) => {
  const token = useAuthStore.getState().token

  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }

  return config
})
```

### Response interceptor — trata 401 globalmente

Se qualquer requisição retornar `401 Unauthorized`, o interceptor limpa
o estado de autenticação e redireciona para `/login` automaticamente:

```ts
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      useAuthStore.getState().clearAuth()
      window.location.href = '/login'
    }

    return Promise.reject(error)
  },
)
```

> ⚠️ Por isso **nunca trate 401 manualmente** nos hooks ou componentes —
> o interceptor já cuida disso globalmente.

***

## 📡 Fazendo requisições <a id="requisicoes"></a>

Importe sempre a instância `api` de `lib/axios.ts`. As funções de cada
domínio vivem nos arquivos `api/` das features:

```ts
// ✅ Padrão adotado — função pura em features/*/api/
import { api } from '@/lib/axios'

export const nodesApi = {
  getAll: () =>
    api.get<Node[]>('/nodes').then((res) => res.data),

  getById: (id: string) =>
    api.get<Node>(`/nodes/${id}`).then((res) => res.data),

  create: (data: CreateNodeDto) =>
    api.post<Node>('/nodes', data).then((res) => res.data),

  update: (id: string, data: UpdateNodeDto) =>
    api.patch<Node>(`/nodes/${id}`, data).then((res) => res.data),

  remove: (id: string) =>
    api.delete(`/nodes/${id}`),
}
```

As funções de `api/` são consumidas pelos hooks do TanStack Query —
nunca diretamente por componentes:

```ts
// ✅ Componente consome hook — não chama api/ diretamente
const { data: nodes } = useNodes()

// ❌ Componente chamando api/ diretamente
const nodes = await nodesApi.getAll()
```

***

## 🚨 Tratamento de erros <a id="erros"></a>

O Axios lança um `AxiosError` quando a resposta tem status 4xx ou 5xx.
Nos hooks do TanStack Query, o `error` retornado pelo `useQuery` e
`useMutation` já é esse objeto — extraia a mensagem assim:

```ts
import type { AxiosError } from 'axios'

interface ApiError {
  message: string
}

// Em um hook ou componente
const { error } = useQuery({ queryKey: ['nodes'], queryFn: nodesApi.getAll })

if (error) {
  const message = (error as AxiosError<ApiError>).response?.data?.message
    ?? 'Erro inesperado'
}
```

Erros `401` nunca chegam até aqui — o interceptor de resposta os intercepta
antes e redireciona para `/login`.

***

## 🚫 Erros comuns <a id="erros-comuns"></a>

**Importando `axios` diretamente em vez da instância**
```ts
// ❌ Axios padrão — sem baseURL, sem interceptors, sem token
import axios from 'axios'
const res = await axios.get('/nodes')

// ✅ Instância configurada
import { api } from '@/lib/axios'
const res = await api.get('/nodes')
```

***

**Chamando `api/` diretamente dentro de um componente**
```ts
// ❌ Componente chamando api diretamente — sem cache, sem loading state
useEffect(() => {
  nodesApi.getAll().then(setNodes)
}, [])

// ✅ Via hook do TanStack Query
const { data: nodes, isLoading } = useNodes()
```

***

**Tratando 401 manualmente em um hook**
```ts
// ❌ Desnecessário — o interceptor já faz isso
if (error.response?.status === 401) {
  clearAuth()
  navigate('/login')
}

// ✅ Não precisa de nenhum tratamento — o interceptor cuida globalmente
```

***

**Hardcodando a URL base**
```ts
// ❌ Quebra em produção e em Docker
api.get('http://localhost:3333/nodes')

// ✅ Usa sempre o caminho relativo à baseURL
api.get('/nodes')
```

***

> _Para entender como o Axios se integra ao fluxo de autenticação,
> consulte [`../knowledge-base/jwt-argon2id.md`](./jwt-argon2id.md) e
> [`../state-management.md`](../state-management.md)._