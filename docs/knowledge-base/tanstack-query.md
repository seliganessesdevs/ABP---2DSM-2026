# TanStack Query — Por que usar no lugar de `useEffect`

TanStack Query (antigo React Query) é uma biblioteca de gerenciamento de estado assíncrono para React. Ela substitui o padrão `useEffect + useState` para busca de dados por uma abordagem declarativa com cache, sincronização e controle de estado já embutidos.

***

## O Problema com `useEffect`

Para buscar dados com `useEffect`, você escreve manualmente tudo que envolve o ciclo de vida de uma requisição: [dev](https://dev.to/akhildas675/stop-using-useeffect-for-data-fetching-try-tanstack-query-instead-5ejd)

```ts
const [data, setData] = useState([])
const [loading, setLoading] = useState(true)
const [error, setError] = useState(null)

useEffect(() => {
  const controller = new AbortController()
  
  const fetchData = async () => {
    try {
      const res = await fetch('/api/users', { signal: controller.signal })
      setData(await res.json())
    } catch (err) {
      if (err.name !== 'AbortError') setError(err)
    } finally {
      setLoading(false)
    }
  }

  fetchData()
  return () => controller.abort() // cleanup manual
}, [])
```

Funciona em casos simples — mas escala mal. Ao crescer, você passa a lidar manualmente com: [dev](https://dev.to/akhildas675/stop-using-useeffect-for-data-fetching-try-tanstack-query-instead-5ejd)

- Race conditions (duas requisições paralelas, a mais antiga chega depois)
- Cache — cada componente busca os mesmos dados de novo
- Refetch ao voltar para a aba
- Retry automático em caso de falha de rede
- Sincronização de dados entre componentes

***

## A Abordagem com TanStack Query

O mesmo código com `useQuery`: [dev](https://dev.to/akhildas675/stop-using-useeffect-for-data-fetching-try-tanstack-query-instead-5ejd)

```ts
import { useQuery } from '@tanstack/react-query'

const fetchUsers = async () => {
  const res = await fetch('/api/users')
  if (!res.ok) throw new Error('Erro na requisição')
  return res.json()
}

const Users = () => {
  const { data, isLoading, error } = useQuery({
    queryKey: ['users'],
    queryFn: fetchUsers,
  })

  if (isLoading) return <p>Carregando...</p>
  if (error) return <p>Erro: {error.message}</p>

  return <ul>{data.map(u => <li key={u.id}>{u.name}</li>)}</ul>
}
```

Sem `useState`, sem `useEffect`, sem `AbortController`, sem cleanup manual. [dev](https://dev.to/akhildas675/stop-using-useeffect-for-data-fetching-try-tanstack-query-instead-5ejd)

***

## O que você ganha automaticamente

| Recurso | `useEffect` manual | TanStack Query |
|---|---|---|
| Cache entre componentes | ❌ Cada um busca de novo | ✅ Compartilhado pela `queryKey` |
| Loading / error state | ❌ Manual com `useState` | ✅ `isLoading`, `error` prontos |
| Refetch ao focar a aba | ❌ Não tem | ✅ Por padrão |
| Retry em falha de rede | ❌ Manual | ✅ 3 tentativas automáticas |
| Race condition | ❌ Você resolve | ✅ Resolvido internamente |
| Cancelamento de requisição | ❌ `AbortController` manual | ✅ Automático |
| Refetch por intervalo | ❌ `setInterval` manual | ✅ `refetchInterval` |
| Paginação / infinite scroll | ❌ Complexo | ✅ `useInfiniteQuery` |
| Devtools | ❌ Não tem | ✅ `@tanstack/react-query-devtools` |

***

## `queryKey` — O Conceito Central

A `queryKey` é o identificador único de um dado no cache. Quando dois componentes usam a mesma `queryKey`, eles compartilham o mesmo cache — só uma requisição é feita. [crazystack.com](https://www.crazystack.com.br/2025-3/o-segredo-do-data-fetching-no-)

```ts
// Componente A e B usam a mesma key — uma requisição só
useQuery({ queryKey: ['users'], queryFn: fetchUsers })

// Query com parâmetro — cache separado por ID
useQuery({ queryKey: ['user', userId], queryFn: () => fetchUser(userId) })
```

Quando você chama `queryClient.invalidateQueries({ queryKey: ['users'] })`, todos os componentes que usam essa key recebem os dados atualizados — sem prop drilling, sem Context manual. [crazystack.com](https://www.crazystack.com.br/2025-3/o-segredo-do-data-fetching-no-)

***

## Controlando Quando a Query Executa

O `useEffect` não tem um jeito limpo de condicionar a execução. O TanStack Query tem a prop `enabled`: [stackoverflow](https://stackoverflow.com/questions/78599978/tanstack-query-useeffect)

```ts
// Só busca se userId existir
useQuery({
  queryKey: ['user', userId],
  queryFn: () => fetchUser(userId),
  enabled: !!userId,
})
```

***

## Mutations — Para Criar, Editar e Deletar

Para operações de escrita, o TanStack Query oferece `useMutation`, que gerencia o estado da operação e permite invalidar o cache após o sucesso: [dev](https://dev.to/akhildas675/stop-using-useeffect-for-data-fetching-try-tanstack-query-instead-5ejd)

```ts
const mutation = useMutation({
  mutationFn: (newUser) => fetch('/api/users', { method: 'POST', body: JSON.stringify(newUser) }),
  onSuccess: () => {
    // Invalida o cache de 'users' — força refetch automático
    queryClient.invalidateQueries({ queryKey: ['users'] })
  },
})

mutation.mutate({ name: 'Gianluca', role: 'ADMIN' })
```

***

## Quando `useEffect` ainda faz sentido

TanStack Query resolve **estado de servidor** — dados que vêm de uma API. O `useEffect` ainda é a ferramenta certa para: [reddit](https://www.reddit.com/r/reactjs/comments/17k2z4v/are_we_supposed_to_use_useeffect_for_fetching_or/)

- Sincronizar com DOM (scroll, foco, animações)
- Integrar com bibliotecas externas (eventos, subscriptions)
- `localStorage` / `sessionStorage`
- WebSockets e streams contínuos

A regra prática: se você está fazendo `fetch`, use TanStack Query. Se você está reagindo a uma mudança de estado local ou sincronizando com o DOM, use `useEffect`.

***

## Setup mínimo

```ts
// main.tsx
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

const queryClient = new QueryClient()

root.render(
  <QueryClientProvider client={queryClient}>
    <App />
  </QueryClientProvider>
)
```

Em Next.js com App Router, o `QueryClientProvider` fica em um Client Component wrapper no `layout.tsx`.