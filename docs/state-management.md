# 🗂️ Gerenciamento de Estado

> Estratégia de estado do frontend do FatecBot.
> Define quando usar TanStack Query, quando usar Zustand e o que
> **nunca** deve virar estado — evitando as armadilhas mais comuns de
> aplicações React.

***

## 📑 Índice

- [A regra central](#regra)
- [TanStack Query — estado do servidor](#tanstack)
- [Zustand — estado do cliente](#zustand)
- [O que não deve virar estado](#nao-estado)
- [Fluxo completo](#fluxo)
- [Decisões e justificativas](#decisoes)

***

## 🎯 A regra central <a id="regra"></a>

Todo estado do frontend se enquadra em uma de duas categorias.
Saber a diferença é o passo mais importante antes de escrever qualquer hook:

| Categoria | Pergunta-chave | Ferramenta |
| --------- | -------------- | ---------- |
| **Estado do servidor** | Este dado vem da API e pode mudar no backend? | TanStack Query |
| **Estado do cliente** | Este dado existe apenas no browser e nunca vai para o banco? | Zustand |

> ⚠️ **Nunca misture as duas ferramentas para o mesmo dado.**
> Cachear dados da API no Zustand é o erro mais comum — ele cria duas
> fontes de verdade e gera bugs de sincronização difíceis de rastrear.

***

## ⚡ TanStack Query — estado do servidor <a id="tanstack"></a>

Qualquer dado que vem da API é gerenciado pelo TanStack Query — **nunca**
por `useState` + `useEffect` manual. Isso garante cache automático,
revalidação em background, estados de loading/error consistentes e
invalidação cirúrgica após mutations.

### useQuery — leitura de dados

```ts
// ✅ Padrão adotado — sempre use useQuery para fetch
const { data: nodes, isLoading, error } = useQuery({
  queryKey: ['nodes'],
  queryFn: nodesApi.getAll,
})

// ❌ Nunca faça isso
const [nodes, setNodes] = useState([])
useEffect(() => {
  nodesApi.getAll().then(setNodes)
}, [])
```

### useMutation — escrita de dados

```ts
// ✅ Padrão adotado — invalide o queryKey após sucesso
export function useCreateNode() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: nodesApi.create,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['nodes'] }),
  })
}

// ❌ Nunca atualize o estado local manualmente após uma mutation
onSuccess: (newNode) => setNodes(prev => [...prev, newNode])
```

### Convenção de queryKeys

O `queryKey` é o identificador do cache — deve ser **descritivo e consistente**
em toda a aplicação. Use sempre arrays:

| Dado | queryKey |
| ---- | -------- |
| Todos os nós | `['nodes']` |
| Um nó específico | `['node', nodeId]` |
| Todos os usuários | `['users']` |
| Todos os logs | `['logs']` |
| Perguntas recebidas | `['questions']` |
| Documentos oficiais | `['documents']` |

***

## 🐻 Zustand — estado do cliente <a id="zustand"></a>

Usado **exclusivamente** para estado que não vem do servidor e não precisa
de cache: token JWT, dados do usuário logado e preferências de UI.

A store de autenticação é a única store global do projeto e vive em
`features/auth/stores/auth.store.ts`.

```ts
// auth.store.ts — apenas o que é local ao cliente
interface AuthStore {
  token: string | null
  user: AuthUser | null
  setAuth: (token: string, user: AuthUser) => void
  clearAuth: () => void
}

// ✅ Consumo correto — em qualquer arquivo da aplicação
const { user, clearAuth } = useAuthStore()

// ❌ Nunca leia token do localStorage diretamente
const token = localStorage.getItem('token')

// ❌ Nunca guarde dados da API no Zustand
interface WrongStore {
  nodes: Node[]           // ← isso é estado do servidor, pertence ao TanStack Query
  setNodes: (n: Node[]) => void
}
```

### Persistência

A store de auth usa `persist` middleware do Zustand para sobreviver a reloads
de página. **Nenhuma outra store deve usar persistência** — dados do servidor
são sempre rebuscados da API quando necessário.

```ts
// ✅ Persistência apenas na store de auth
export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      token: null,
      user: null,
      setAuth: (token, user) => set({ token, user }),
      clearAuth: () => set({ token: null, user: null }),
    }),
    { name: 'fatecbot:auth' },
  ),
)
```

***

## 🚫 O que não deve virar estado <a id="nao-estado"></a>

Nem tudo precisa de `useState`. Antes de criar um estado, verifique se o valor
pode ser derivado de algo que já existe:

```ts
// ❌ Estado desnecessário
const [isAdmin, setIsAdmin] = useState(false)
useEffect(() => setIsAdmin(user?.role === 'ADMIN'), [user])

// ✅ Valor derivado — sem estado extra
const isAdmin = user?.role === 'ADMIN'
```

```ts
// ❌ Estado desnecessário
const [filteredNodes, setFilteredNodes] = useState<Node[]>([])
useEffect(() => {
  setFilteredNodes(nodes?.filter(n => n.type === 'MENU') ?? [])
}, [nodes])

// ✅ Valor derivado diretamente dos dados do TanStack Query
const menuNodes = nodes?.filter(n => n.type === 'MENU') ?? []
```

***

## 🔄 Fluxo completo <a id="fluxo"></a>

Como as duas ferramentas interagem em um fluxo real de autenticação e navegação:

```
Usuário faz login
      ↓
useMutation → POST /auth/login
      ↓
onSuccess → useAuthStore.setAuth(token, user)   ← Zustand
      ↓
Axios interceptor lê token do Zustand e injeta em todas as requests
      ↓
Usuário navega para /admin
      ↓
useQuery(['nodes']) → GET /nodes                ← TanStack Query
      ↓
Cache armazenado — próxima visita não refaz a request
      ↓
Admin cria um nó → useMutation → POST /nodes
      ↓
onSuccess → invalidateQueries(['nodes'])        ← cache sincronizado
```

***

## 🏛️ Decisões e justificativas <a id="decisoes"></a>

### Por que TanStack Query e não Redux/Context para dados da API?

Redux e Context exigem que o desenvolvedor gerencie manualmente loading, error,
cache, revalidação e invalidação. O TanStack Query resolve tudo isso
automaticamente, reduzindo código boilerplate e eliminando bugs de cache stale.

### Por que Zustand e não Context para estado de auth?

Context re-renderiza toda a árvore de componentes que o consome quando o valor
muda. Zustand é granular — componentes re-renderizam apenas quando o slice
específico que consomem muda, o que é crítico para a store de auth que é
consumida em toda a aplicação.

### Por que não usar o Zustand para tudo?

Zustand não tem cache, deduplicação de requests nem revalidação automática.
Usá-lo para dados do servidor exigiria reimplementar manualmente tudo que o
TanStack Query já entrega — com mais código e mais superfície de bug.

***

> _Próximo documento: [`testing.md`](./testing.md)_