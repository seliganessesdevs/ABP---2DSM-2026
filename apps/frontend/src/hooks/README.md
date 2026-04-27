# 📁 src/hooks/

Hooks customizados de uso global — reutilizáveis por qualquer feature ou componente da aplicação. Diferente dos hooks dentro de `features/`, os hooks desta pasta **não pertencem a nenhum domínio de negócio** específico. São utilitários de comportamento genérico.

***

## Estrutura

```
hooks/
├── useDebounce.ts
├── useLocalStorage.ts
├── useMediaQuery.ts
└── useDisclosure.ts
```

***

## Quando usar esta pasta

A distinção entre `hooks/` global e `features/<dominio>/hooks/` é simples:

| Critério | Destino |
|---|---|
| Hook usa dados ou lógica de um domínio específico (chatbot, auth, admin) | `features/<dominio>/hooks/` |
| Hook é um utilitário genérico sem conhecimento de domínio | `hooks/` (esta pasta) |
| Hook usa TanStack Query ou faz chamada de API | `features/<dominio>/hooks/` |
| Hook encapsula comportamento de UI reutilizável | `hooks/` (esta pasta) |

***

## Hooks disponíveis

### `useDebounce.ts`

Retorna um valor com delay após a última atualização. Usado em campos de busca para evitar requisições a cada keystroke.

```ts
function useDebounce<T>(value: T, delay: number): T
```

Exemplo de uso:

```ts
const [search, setSearch] = useState('')
const debouncedSearch = useDebounce(search, 400)

useEffect(() => {
  // só executa 400ms após o usuário parar de digitar
}, [debouncedSearch])
```

***

### `useLocalStorage.ts`

Interface tipada para leitura e escrita no `localStorage`. Sincroniza o estado React com o storage automaticamente.

```ts
function useLocalStorage<T>(key: string, initialValue: T): [T, (value: T) => void]
```

> **Nota:** não use este hook para o token JWT — isso é responsabilidade do `auth.store` (Zustand com `persist`), que já gerencia a persistência no localStorage de forma centralizada.

***

### `useMediaQuery.ts`

Retorna `true` se a media query informada estiver ativa. Usado para lógica condicional de layout baseada no breakpoint atual.

```ts
function useMediaQuery(query: string): boolean
```

Exemplo de uso:

```ts
const isMobile = useMediaQuery('(max-width: 768px)')
```

***

### `useDisclosure.ts`

Gerencia estado booleano de aberto/fechado para modais, drawers, dropdowns e afins. Evita repetição de `useState(false)` + handlers em toda a aplicação.

```ts
function useDisclosure(initial?: boolean): {
  isOpen: boolean
  open: () => void
  close: () => void
  toggle: () => void
}
```

Exemplo de uso:

```ts
const { isOpen, open, close } = useDisclosure()

return (
  <>
    <Button onClick={open}>Abrir modal</Button>
    <Dialog open={isOpen} onOpenChange={close} />
  </>
)
```

***

## Regras de contribuição

- Hooks nesta pasta **não importam** de nenhuma pasta dentro de `features/`
- Hooks nesta pasta **não usam** TanStack Query, Axios ou Prisma
- Se o hook crescer e começar a ter conhecimento de domínio, mova-o para a feature correspondente
- Todo hook deve ter sua assinatura de tipos documentada com um bloco de exemplo de uso

***

> _Próximo documento: [`../utils/README.md`](../utils/README.md)_
