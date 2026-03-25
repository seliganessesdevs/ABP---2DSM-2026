# 📁 src/lib/

Instâncias e configurações de bibliotecas externas usadas em toda a aplicação. Esta pasta não contém lógica de negócio — apenas inicialização, configuração e exportação das ferramentas de infraestrutura do frontend.

***

## Estrutura

```
lib/
├── axios.ts         # Instância Axios configurada com interceptors
├── queryClient.ts   # Instância do TanStack Query Client
└── utils.ts         # Utilitários gerados pelo shadcn/ui (função cn())
```

***

## `axios.ts`

Instância centralizada do Axios. Todo acesso à API passa por aqui — nenhum componente ou hook instancia o Axios diretamente.

**Configuração:**
- `baseURL` lida de `env.VITE_API_URL`
- Header `Content-Type: application/json` padrão em todas as requisições
- Timeout de 10 segundos

**Interceptor de request** — injeta o token JWT automaticamente:

```ts
api.interceptors.request.use(config => {
  const token = useAuthStore.getState().token
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})
```

**Interceptor de response** — trata erros globais:

```ts
api.interceptors.response.use(
  res => res,
  err => {
    if (err.response?.status === 401) {
      useAuthStore.getState().clearAuth()
      window.location.href = '/login'
    }
    return Promise.reject(err)
  },
)
```

O interceptor de 401 garante que qualquer token expirado em qualquer requisição da aplicação redireciona para `/login` automaticamente — sem precisar tratar isso em cada hook individualmente.

***

## `queryClient.ts`

Instância singleton do `QueryClient` do TanStack Query. Exportada aqui e passada para o `QueryClientProvider` em `app/provider.tsx`.

**Configuração de defaults:**

```ts
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,   // dados frescos por 5 minutos
      retry: 1,                    // 1 retry em caso de erro de rede
      refetchOnWindowFocus: false, // não refaz fetch ao focar a janela
    },
    mutations: {
      retry: 0,                    // mutations não fazem retry automático
    },
  },
})
```

**Por que `staleTime: 5 minutos`?**
Os dados do chatbot (nós de navegação) mudam raramente. Sem `staleTime`, o TanStack Query refaria a mesma requisição a cada remontagem do componente, gerando tráfego desnecessário. Com 5 minutos, o cache é reutilizado entre navegações na mesma sessão.

***

## `utils.ts`

Gerado automaticamente pelo shadcn/ui. Exporta a função `cn()`, que combina `clsx` e `tailwind-merge` para composição segura de classes Tailwind.

```ts
import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
```

**Por que `twMerge`?**
O Tailwind não remove classes conflitantes automaticamente. Sem `twMerge`, `cn('p-4', 'p-8')` geraria `p-4 p-8` no HTML e o comportamento dependeria da ordem no CSS. Com `twMerge`, a última classe vence: resultado é apenas `p-8`.

```ts
cn('p-4 text-sm', isLarge && 'p-8 text-lg')
// sem twMerge → 'p-4 text-sm p-8 text-lg'  (conflito)
// com twMerge → 'p-8 text-lg'              (correto)
```

> Não edite `utils.ts` — ele é regenerado pelo shadcn/ui ao adicionar novos componentes.

***

## Regras de contribuição

- Nunca instancie `axios.create()` ou `new QueryClient()` fora desta pasta
- Nunca importe `axios` diretamente nas features — sempre use `@/lib/axios`
- Nunca importe `queryClient` para invalidar queries manualmente fora de hooks — use `useQueryClient()` do TanStack Query dentro dos hooks
- Se uma nova biblioteca precisar de inicialização global, crie um arquivo dedicado aqui