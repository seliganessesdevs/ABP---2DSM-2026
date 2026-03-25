# React 19 — Guia para Iniciantes

React é uma biblioteca JavaScript para construir interfaces. A ideia central é simples: você descreve **como a UI deve parecer** para um dado estado, e o React se encarrega de atualizar o DOM quando esse estado muda. Entender isso elimina 90% da confusão inicial.

***

## O Modelo Mental Correto

Um componente React é uma **função que recebe dados e retorna JSX**. Toda vez que os dados mudam, a função roda de novo e a UI atualiza. É só isso.

```tsx
// Um componente é uma função comum
const Greeting = ({ name }: { name: string }) => {
  return <h1>Olá, {name}</h1>
}

// Dados mudam → função roda de novo → UI atualiza
```

***

## `useState` — Estado Local

`useState` armazena um valor que, quando muda, faz o componente re-renderizar. Use para dados que pertencem exclusivamente àquele componente.

```tsx
const Counter = () => {
  const [count, setCount] = useState(0)

  return (
    <div>
      <p>Contagem: {count}</p>
      <button onClick={() => setCount(count + 1)}>Incrementar</button>
    </div>
  )
}
```

**O que iniciantes erram:**

```tsx
// ❌ Modificar o estado diretamente — o React não vai detectar a mudança
const [items, setItems] = useState(['a', 'b'])
items.push('c')            // errado — mutação direta
setItems(items)            // React compara referência, vê que é o mesmo array

// ✅ Sempre crie um novo valor
setItems([...items, 'c'])  // novo array → React detecta e re-renderiza

// ❌ Atualização que depende do valor atual sem forma funcional
setCount(count + 1)        // pode ser stale em atualizações rápidas

// ✅ Forma funcional — garante o valor mais recente
setCount(prev => prev + 1)

// ❌ Atualizar objeto sobrescrevendo todo o estado
setUser({ name: 'João' })  // perdeu email, role, id...

// ✅ Espalhe o estado anterior
setUser(prev => ({ ...prev, name: 'João' }))
```

***

## `useEffect` — Efeitos Colaterais

`useEffect` sincroniza o componente com algo externo: DOM, timers, subscriptions. Não é um gatilho para reagir a mudanças de estado — é para sincronizar com sistemas fora do React.

```tsx
// Executado uma vez após montar — title da página
useEffect(() => {
  document.title = 'FatecBot — Atendimento'
}, []) // [] = "rode só na montagem"

// Executado quando userId muda
useEffect(() => {
  const subscription = subscribeToUser(userId)
  return () => subscription.unsubscribe() // cleanup — rode antes de desmontar
}, [userId])
```

**O que iniciantes erram:**

```tsx
// ❌ Buscar dados com useEffect — nunca faça isso
useEffect(() => {
  fetch('/api/questions')
    .then(r => r.json())
    .then(data => setQuestions(data))
}, [])
// Problema: sem loading, sem cache, sem erro tratado,
// race condition se o componente desmontar antes do fetch terminar

// ✅ Use TanStack Query para buscar dados
const { data, isLoading, error } = useQuery({
  queryKey: ['questions'],
  queryFn: () => questionsApi.getAll(),
})

// ❌ useEffect para derivar estado
useEffect(() => {
  setFilteredItems(items.filter(i => i.active))
}, [items])

// ✅ Calcule direto no render — sem useEffect
const filteredItems = items.filter(i => i.active)

// ❌ Deps faltando — warning do ESLint e comportamento imprevisível
useEffect(() => {
  doSomething(value) // usa value mas não está nas deps
}, [])

// ✅ Coloque todas as deps que você usa
useEffect(() => {
  doSomething(value)
}, [value])
```

***

## `useRef` — Valores sem Re-render

`useRef` armazena um valor que persiste entre renders mas **não causa re-render quando muda**. Também é a forma de acessar elementos do DOM diretamente.

```tsx
// Acesso ao DOM
const inputRef = useRef<HTMLInputElement>(null)

const focusInput = () => inputRef.current?.focus()

return <input ref={inputRef} />

// Valor que não deve causar re-render (timer, valor anterior)
const timerRef = useRef<ReturnType<typeof setTimeout>>(null)

useEffect(() => {
  timerRef.current = setTimeout(() => submit(), 2000)
  return () => clearTimeout(timerRef.current!)
}, [])
```

**Quando usar `useRef` vs `useState`:**

| Preciso de | Use |
|---|---|
| Re-render quando o valor muda | `useState` |
| Persistir valor sem re-render | `useRef` |
| Acessar elemento do DOM | `useRef` |

***

## Props — Comunicação entre Componentes

Props são os dados que um componente pai passa para o filho. São **somente leitura** — o filho nunca modifica a prop que recebeu.

```tsx
// Interface de props — sempre nomeada e exportada
export interface UserCardProps {
  name: string
  email: string
  role: 'ADMIN' | 'SECRETARY'
  onRemove: (id: string) => void  // função é prop como qualquer outra
}

const UserCard = ({ name, email, role, onRemove }: UserCardProps) => (
  <div className="rounded-lg border p-4">
    <p className="font-medium">{name}</p>
    <p className="text-sm text-muted-foreground">{email}</p>
    <button onClick={() => onRemove(email)}>Remover</button>
  </div>
)
```

**O que iniciantes erram:**

```tsx
// ❌ Modificar a prop diretamente
const List = ({ items }: { items: string[] }) => {
  items.push('novo')  // nunca — você está mutando o dado do pai
  return <ul>{items.map(i => <li>{i}</li>)}</ul>
}

// ❌ Prop drilling excessivo — passar props por 4+ níveis
<Page user={user}>
  <Layout user={user}>
    <Sidebar user={user}>
      <Avatar user={user} /> {/* aqui precisava só do avatar */}

// ✅ Passe o componente já montado (composição)
<Page>
  <Layout>
    <Sidebar>
      <Avatar src={user.avatarUrl} name={user.name} />
```

***

## Renderização Condicional

```tsx
// Ternário — para alternar entre dois elementos
{isLoading ? <LoadingSpinner /> : <Content />}

// && — para mostrar ou nada
{hasError && <ErrorMessage />}

// Cuidado com && e números — renderiza "0" se a lista estiver vazia
{items.length && <List />}    // ❌ renderiza "0"
{items.length > 0 && <List />} // ✅

// Early return — para estados de loading/erro antes do JSX principal
if (isLoading) return <LoadingSpinner />
if (error) return <ErrorMessage />
if (!data) return null

return <MainContent data={data} />
```

***

## Listas com `map`

```tsx
// Sempre com key única — o React usa para identificar qual item mudou
{questions.map(question => (
  <QuestionCard key={question.id} question={question} />
))}

// ❌ Nunca use o index como key em listas que podem reordenar ou filtrar
{items.map((item, index) => (
  <Item key={index} />  // se a lista reordenar, o React reutiliza o elemento errado
))}

// ✅ Use sempre um ID único e estável
{items.map(item => (
  <Item key={item.id} />
))}

// Trate sempre a lista vazia
{questions.length === 0 ? (
  <EmptyState />
) : (
  questions.map(q => <QuestionCard key={q.id} question={q} />)
)}
```

***

## Formulários

```tsx
// Formulário controlado — o estado React é a fonte da verdade
const LoginForm = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault() // impede reload da página
    setError(null)
    setIsLoading(true)

    try {
      await authApi.login({ email, password })
    } catch (err) {
      setError('E-mail ou senha inválidos')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <input
        type="email"
        value={email}
        onChange={e => setEmail(e.target.value)}
        placeholder="E-mail"
        required
      />
      <input
        type="password"
        value={password}
        onChange={e => setPassword(e.target.value)}
        placeholder="Senha"
        required
      />
      {error && <p className="text-sm text-destructive">{error}</p>}
      <button type="submit" disabled={isLoading}>
        {isLoading ? 'Entrando...' : 'Entrar'}
      </button>
    </form>
  )
}
```

***

## Estrutura de um Componente

Siga sempre a mesma ordem interna — facilita leitura e code review:

```tsx
// 1. Imports externos
import { useState } from 'react'

// 2. Imports internos
import { Button } from '@/components/ui/button'
import type { Question } from '@/features/secretary/types'

// 3. Interface de props
export interface QuestionCardProps {
  question: Question
  onMarkAnswered: (id: string) => void
}

// 4. Componente
const QuestionCard = ({ question, onMarkAnswered }: QuestionCardProps) => {
  // 4a. Estado local
  const [isExpanded, setIsExpanded] = useState(false)

  // 4b. Handlers
  const handleExpand = () => setIsExpanded(prev => !prev)

  // 4c. Render condicional de guarda (loading, erro, vazio)
  if (!question) return null

  // 4d. JSX
  return (
    <div className="rounded-lg border border-border p-4">
      <p className="text-sm font-medium">{question.text}</p>
      {isExpanded && (
        <p className="mt-2 text-sm text-muted-foreground">{question.email}</p>
      )}
      <Button onClick={() => onMarkAnswered(question.id)}>
        Marcar como respondida
      </Button>
    </div>
  )
}

// 5. Export no final
export default QuestionCard
```

***

## Boas Práticas — O que evitar

**Não coloque tudo em um componente só:**

```tsx
// ❌ componente de 300 linhas que faz tudo
const AdminPage = () => {
  // busca dados, renderiza tabela, gerencia modal, valida form...
}

// ✅ quebre em componentes menores com responsabilidade única
const AdminPage = () => (
  <div>
    <PageHeader />
    <NodeTable />
    <CreateNodeModal />
  </div>
)
```

**Não derive estado de estado — calcule no render:**

```tsx
// ❌
const [items, setItems] = useState([...])
const [total, setTotal] = useState(0)
useEffect(() => { setTotal(items.length) }, [items])

// ✅
const [items, setItems] = useState([...])
const total = items.length  // calculado a cada render, sem useEffect
```

**Não ignore o TypeScript:**

```tsx
// ❌ apaga toda segurança de tipo
const data: any = response.data
data.nomeQueNaoExiste  // sem erro, bug em produção

// ✅
const data: Question = response.data
data.nomeQueNaoExiste  // erro em tempo de compilação — você descobre antes
```

**Não esqueça de tratar loading e erro:**

```tsx
// ❌ só renderiza o caminho feliz
const { data } = useQuery(...)
return <List items={data} />  // data é undefined enquanto carrega → crash

// ✅ trate todos os estados
const { data, isLoading, error } = useQuery(...)

if (isLoading) return <LoadingSpinner />
if (error) return <ErrorMessage />

return <List items={data} />
```

**Não crie estado para o que pode ser calculado:**

```tsx
// ❌
const [isFormValid, setIsFormValid] = useState(false)
useEffect(() => {
  setIsFormValid(email.length > 0 && password.length >= 6)
}, [email, password])

// ✅
const isFormValid = email.length > 0 && password.length >= 6
```

**Não use `console.log` para debug em produção — remova antes do PR:**

```tsx
// ❌ deixado acidentalmente
const handleClick = () => {
  console.log('dados do usuário:', user) // vaza dados no console
  submit()
}

// ✅ ESLint vai avisar — configure no projeto
// 'no-console': ['warn', { allow: ['warn', 'error'] }]
```