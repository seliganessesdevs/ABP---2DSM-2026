# Tailwind CSS v4 — Guia Prático

Tailwind é um framework CSS utilitário: em vez de escrever classes semânticas como `.card` ou `.btn-primary`, você compõe estilos diretamente no JSX usando classes atômicas. Cada classe faz exatamente uma coisa — `flex` aplica `display: flex`, `p-4` aplica `padding: 1rem`, `text-sm` aplica `font-size: 0.875rem`. O resultado final é um CSS mínimo — só o que você usa é gerado.

***

## A lógica por trás dos valores numéricos

Tailwind usa uma **escala baseada em múltiplos de 4px**. Entender isso elimina a necessidade de memorizar cada classe:

| Classe | Valor real |
|--------|-----------|
| `p-1` | 4px |
| `p-2` | 8px |
| `p-4` | 16px |
| `p-6` | 24px |
| `p-8` | 32px |
| `p-12` | 48px |
| `p-16` | 64px |

A mesma escala se aplica a `m-`, `w-`, `h-`, `gap-`, `space-`, `rounded-`, etc. Quando você ver `gap-6`, sabe que é 24px. Quando ver `mt-8`, é 32px de margin-top.

***

## Classes Essenciais

### Display e Posicionamento

```tsx
// Os valores mais usados de display
<div className="block">          {/* display: block */}
<div className="inline-block">   {/* display: inline-block */}
<div className="flex">           {/* display: flex */}
<div className="inline-flex">    {/* display: inline-flex — útil em badges e botões */}
<div className="grid">           {/* display: grid */}
<div className="hidden">         {/* display: none */}

// Posicionamento
<div className="relative">       {/* position: relative */}
<div className="absolute">       {/* position: absolute */}
<div className="fixed">          {/* position: fixed */}
<div className="sticky top-0">   {/* gruda no topo ao rolar */}

// Posição absoluta com inset (atalho para top/right/bottom/left)
<div className="absolute inset-0">           {/* ocupa todo o pai */}
<div className="absolute top-4 right-4">     {/* 16px do topo e da direita */}
<div className="absolute bottom-0 left-1/2 -translate-x-1/2"> {/* centralizado na base */}

// Z-index
<div className="z-10">   {/* z-index: 10 */}
<div className="z-50">   {/* z-index: 50 — padrão para modais */}
```

### Flexbox

Flexbox é o sistema de layout mais usado no dia a dia. Entender os eixos é fundamental: `items-*` controla o eixo cruzado (vertical em row), `justify-*` controla o eixo principal (horizontal em row).

```tsx
// Direção
<div className="flex flex-row">      {/* padrão — horizontal */}
<div className="flex flex-col">      {/* vertical */}
<div className="flex flex-row-reverse">

// Alinhamento no eixo cruzado (items-)
<div className="flex items-start">   {/* topo */}
<div className="flex items-center">  {/* centro — o mais usado */}
<div className="flex items-end">     {/* base */}
<div className="flex items-stretch"> {/* estica para preencher */}

// Distribuição no eixo principal (justify-)
<div className="flex justify-start">
<div className="flex justify-center">
<div className="flex justify-end">
<div className="flex justify-between"> {/* espaço entre os filhos */}
<div className="flex justify-around">
<div className="flex justify-evenly">

// Quebra de linha
<div className="flex flex-wrap">     {/* itens quebram para a próxima linha */}
<div className="flex flex-nowrap">   {/* padrão — sem quebra */}

// Tamanho dos filhos
<div className="flex-1">    {/* cresce para preencher o espaço disponível */}
<div className="flex-none"> {/* não cresce nem encolhe */}
<div className="shrink-0">  {/* não encolhe mesmo sem espaço */}

// Gap entre filhos
<div className="flex gap-4">         {/* 16px entre todos */}
<div className="flex gap-x-4 gap-y-2"> {/* diferente por eixo */}
```

### Grid

```tsx
// Colunas fixas
<div className="grid grid-cols-2 gap-4">
<div className="grid grid-cols-3 gap-6">
<div className="grid grid-cols-12 gap-4">  {/* grid de 12 colunas clássico */}

// Colunas responsivas automáticas
<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">

// Span de colunas (item ocupa mais de uma coluna)
<div className="col-span-2">    {/* ocupa 2 colunas */}
<div className="col-span-full"> {/* ocupa todas as colunas */}

// Linhas
<div className="grid grid-rows-3">
<div className="row-span-2">

// Grid auto — colunas de tamanho mínimo
<div className="grid grid-cols-[repeat(auto-fill,minmax(280px,1fr))] gap-6">
```

### Dimensões e Espaçamento

```tsx
// Largura
<div className="w-full">       {/* 100% */}
<div className="w-screen">     {/* 100vw */}
<div className="w-1/2">        {/* 50% */}
<div className="w-1/3">        {/* 33.33% */}
<div className="w-64">         {/* 256px */}
<div className="w-px">         {/* 1px — linhas divisórias */}
<div className="max-w-sm">     {/* max-width: 384px */}
<div className="max-w-lg">     {/* max-width: 512px */}
<div className="max-w-2xl">    {/* max-width: 672px */}
<div className="max-w-7xl">    {/* max-width: 1280px — container de página */}
<div className="min-w-0">      {/* essencial para evitar overflow em flex */}

// Altura
<div className="h-full">       {/* 100% da altura do pai */}
<div className="h-screen">     {/* 100vh */}
<div className="h-16">         {/* 64px — altura padrão de topbar */}
<div className="min-h-screen">  {/* garante que a página ocupa a tela inteira */}
<div className="max-h-96 overflow-auto"> {/* altura máxima com scroll */}

// Padding
<div className="p-4">          {/* todos os lados */}
<div className="px-6 py-3">    {/* horizontal e vertical separados */}
<div className="pt-8 pb-4">    {/* top e bottom separados */}
<div className="pl-4">         {/* apenas esquerda */}

// Margin
<div className="mx-auto">      {/* centraliza horizontalmente */}
<div className="mt-4 mb-8">
<div className="-mt-px">       {/* margin negativa — compensa bordas */}

// Space (gap entre filhos sem flex/grid)
<div className="space-y-4">    {/* margin-top em todos exceto o primeiro filho */}
<div className="space-x-2">
```

### Tipografia

```tsx
// Tamanho
<p className="text-xs">    {/* 12px */}
<p className="text-sm">    {/* 14px — corpo de texto padrão em UI */}
<p className="text-base">  {/* 16px */}
<p className="text-lg">    {/* 18px */}
<p className="text-xl">    {/* 20px */}
<p className="text-2xl">   {/* 24px */}
<p className="text-3xl">   {/* 30px */}
<p className="text-4xl">   {/* 36px */}

// Peso
<p className="font-normal">   {/* 400 */}
<p className="font-medium">   {/* 500 — destaque suave */}
<p className="font-semibold"> {/* 600 — mais usado em headings */}
<p className="font-bold">     {/* 700 */}

// Alinhamento
<p className="text-left">
<p className="text-center">
<p className="text-right">

// Altura de linha
<p className="leading-none">     {/* 1 */}
<p className="leading-tight">    {/* 1.25 */}
<p className="leading-normal">   {/* 1.5 */}
<p className="leading-relaxed">  {/* 1.625 — melhor para textos longos */}
<p className="leading-loose">    {/* 2 */}

// Espaçamento entre letras
<p className="tracking-tight">   {/* -0.025em */}
<p className="tracking-normal">
<p className="tracking-wide">    {/* 0.025em */}
<p className="tracking-widest">  {/* 0.1em — bom para labels maiúsculos */}

// Overflow e truncamento
<p className="truncate">         {/* corta em uma linha com reticências */}
<p className="line-clamp-2">     {/* limita a 2 linhas com reticências */}
<p className="break-words">      {/* quebra palavras longas */}
<p className="whitespace-nowrap"> {/* nunca quebra — cuidado com overflow */}

// Decoração
<p className="underline decoration-primary underline-offset-4">
<p className="line-through text-muted-foreground">
<p className="uppercase tracking-widest text-xs"> {/* padrão para labels */}
```

### Cores e Fundo

```tsx
// Tokens do shadcn/ui — sempre prefira estes
<div className="bg-background text-foreground">         {/* base da página */}
<div className="bg-card text-card-foreground">           {/* cards */}
<div className="bg-muted text-muted-foreground">         {/* áreas secundárias */}
<div className="bg-primary text-primary-foreground">     {/* ação principal */}
<div className="bg-secondary text-secondary-foreground"> {/* ação secundária */}
<div className="bg-destructive text-destructive-foreground"> {/* erro/perigo */}
<div className="bg-accent text-accent-foreground">       {/* hover/destaque */}
<div className="border border-border">
<div className="border border-input">                    {/* bordas de formulário */}
<div className="text-ring">                              {/* cor do foco */}

// Opacidade na cor (/ seguido do percentual)
<div className="bg-primary/10">     {/* primary com 10% de opacidade */}
<div className="bg-black/50">       {/* overlay semitransparente */}
<div className="text-foreground/60"> {/* texto mais suave */}

// Gradientes
<div className="bg-gradient-to-r from-primary to-secondary">
<div className="bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500">
```

### Bordas e Sombras

```tsx
// Borda
<div className="border">              {/* 1px solid */}
<div className="border-2">           {/* 2px solid */}
<div className="border-t">           {/* apenas topo */}
<div className="border-b border-border"> {/* linha divisória */}

// Border radius
<div className="rounded-sm">   {/* 2px */}
<div className="rounded">      {/* 4px */}
<div className="rounded-md">   {/* 6px */}
<div className="rounded-lg">   {/* 8px — o mais usado em cards */}
<div className="rounded-xl">   {/* 12px */}
<div className="rounded-2xl">  {/* 16px */}
<div className="rounded-full"> {/* 9999px — círculos e pills */}

// Sombra
<div className="shadow-sm">    {/* sutil — cards e inputs */}
<div className="shadow">       {/* padrão */}
<div className="shadow-md">    {/* dropdowns */}
<div className="shadow-lg">    {/* modais */}
<div className="shadow-xl">    {/* drawers */}
<div className="shadow-none">  {/* remove sombra */}

// Ring (outline para foco e destaque)
<div className="ring-1 ring-border">
<div className="ring-2 ring-primary ring-offset-2">  {/* foco acessível */}
<div className="ring-inset ring-1 ring-input">        {/* border interno */}
```

***

## Responsividade

Tailwind usa breakpoints como prefixos. O padrão é **mobile-first** — sem prefixo vale para todos os tamanhos, com prefixo vale a partir daquele breakpoint para cima.

| Prefixo | Breakpoint | Uso típico |
|---------|-----------|-----------|
| *(sem prefixo)* | 0px+ | Mobile |
| `sm:` | ≥ 640px | Mobile largo |
| `md:` | ≥ 768px | Tablet |
| `lg:` | ≥ 1024px | Desktop |
| `xl:` | ≥ 1280px | Desktop largo |

```tsx
// Layout muda de coluna para linha
<div className="flex flex-col md:flex-row gap-4">

// Texto cresce em telas maiores
<h1 className="text-2xl md:text-3xl lg:text-4xl font-bold">

// Grid responsivo
<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">

// Padding aumenta em desktop
<section className="px-4 md:px-8 lg:px-16 py-8 md:py-16">

// Sidebar oculta no mobile
<aside className="hidden lg:flex lg:w-64 flex-col">

// Menu hambúrguer visível só no mobile
<button className="flex lg:hidden">
```

***

## Estados Interativos

```tsx
// Hover
<button className="bg-primary hover:bg-primary/90 transition-colors duration-150">
<div className="hover:shadow-md hover:-translate-y-0.5 transition-all">

// Focus visível (acessibilidade — nunca remova sem substituir)
<button className="focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2">

// Disabled
<button className="disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none">

// Active (feedback de clique)
<button className="active:scale-95 transition-transform">

// Placeholder de inputs
<input className="placeholder:text-muted-foreground placeholder:text-sm">

// Seleção de texto
<p className="selection:bg-primary/20 selection:text-primary">

// Group — hover no pai afeta filho
<div className="group flex items-center gap-3 p-3 rounded-lg hover:bg-accent cursor-pointer">
  <Icon className="text-muted-foreground group-hover:text-primary transition-colors" />
  <span className="text-sm group-hover:text-foreground transition-colors">Item</span>
</div>

// Peer — estado de um elemento afeta irmão seguinte
<input id="check" type="checkbox" className="peer sr-only" />
<label htmlFor="check" className="peer-checked:text-primary peer-checked:font-medium">
  Opção
</label>
```

***

## Animações e Transições

```tsx
// Transição suave (sempre adicione junto com hover/active)
<div className="transition-colors duration-150">        {/* só cores */}
<div className="transition-all duration-200">           {/* tudo */}
<div className="transition-transform duration-150 ease-out">

// Animações nativas do Tailwind
<div className="animate-spin">       {/* rotação contínua — loading */}
<div className="animate-pulse">      {/* fade pulsante — skeleton */}
<div className="animate-bounce">     {/* quique */}
<div className="animate-ping">       {/* expande e some — notificações */}

// Skeleton loading com pulse
<div className="animate-pulse space-y-3">
  <div className="h-4 bg-muted rounded w-3/4" />
  <div className="h-4 bg-muted rounded w-1/2" />
  <div className="h-4 bg-muted rounded w-5/6" />
</div>
```

***

## Overflow e Scroll

```tsx
<div className="overflow-hidden">     {/* corta o conteúdo */}
<div className="overflow-auto">       {/* scroll quando necessário */}
<div className="overflow-y-auto">     {/* scroll vertical */}
<div className="overflow-x-auto">     {/* scroll horizontal — tabelas */}
<div className="overflow-x-hidden">   {/* oculta scroll horizontal */}
<div className="scroll-smooth">       {/* scroll suave no âncora */}

// Container com scroll e altura máxima
<div className="max-h-64 overflow-y-auto rounded-md border border-border">
```

***

## Acessibilidade

```tsx
// Visualmente oculto mas acessível por leitores de tela
<span className="sr-only">Fechar modal</span>

// Visível apenas no focus (útil para skip links)
<a className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-50">
  Pular para o conteúdo
</a>
```

***

## Dark Mode

Com shadcn/ui, os tokens como `bg-background` e `text-foreground` mudam automaticamente com o tema — você raramente precisa do prefixo `dark:`. Use-o apenas para ajustes finos que os tokens não cobrem:

```tsx
<div className="bg-white dark:bg-zinc-900">
<img className="opacity-100 dark:opacity-80">
<div className="shadow-gray-200 dark:shadow-gray-900">
```

***

## Padrões de Componentes Comuns

### Card

```tsx
<div className="rounded-lg border border-border bg-card p-6 shadow-sm">
  <div className="flex items-center justify-between mb-4">
    <h2 className="text-lg font-semibold text-card-foreground">Título</h2>
    <span className="text-xs text-muted-foreground">27/03/2026</span>
  </div>
  <p className="text-sm text-muted-foreground leading-relaxed">
    Descrição do card com texto secundário.
  </p>
</div>
```

### Badge de status

```tsx
// OPEN — amarelo
<span className="inline-flex items-center rounded-full bg-yellow-100 px-2.5 py-0.5 text-xs font-medium text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400">
  Em aberto
</span>

// ANSWERED — verde
<span className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800 dark:bg-green-900/30 dark:text-green-400">
  Respondida
</span>

// Genérico com variante
const statusClass = {
  OPEN:     'bg-yellow-100 text-yellow-800',
  ANSWERED: 'bg-green-100 text-green-800',
}

<span className={cn('inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium', statusClass[status])}>
  {label}
</span>
```

### Input com label e erro

```tsx
<div className="flex flex-col gap-1.5">
  <label className="text-sm font-medium text-foreground">
    E-mail institucional
  </label>
  <input
    className={cn(
      'rounded-md border bg-background px-3 py-2 text-sm',
      'placeholder:text-muted-foreground',
      'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1',
      'disabled:cursor-not-allowed disabled:opacity-50',
      hasError ? 'border-destructive' : 'border-input',
    )}
    placeholder="aluno@fatec.sp.gov.br"
  />
  {hasError && (
    <p className="text-xs text-destructive">E-mail inválido</p>
  )}
</div>
```

### Botão

```tsx
// Primário
<button className="inline-flex items-center justify-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed transition-all">
  Salvar
</button>

// Outline
<button className="inline-flex items-center justify-center gap-2 rounded-md border border-border bg-transparent px-4 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground transition-colors">
  Cancelar
</button>

// Destrutivo
<button className="inline-flex items-center justify-center gap-2 rounded-md bg-destructive px-4 py-2 text-sm font-medium text-destructive-foreground hover:bg-destructive/90 transition-colors">
  Remover
</button>
```

### Overlay de loading

```tsx
<div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm">
  <div className="h-8 w-8 animate-spin rounded-full border-4 border-muted border-t-primary" />
</div>
```

### Empty state

```tsx
<div className="flex flex-col items-center justify-center gap-3 rounded-lg border border-dashed border-border p-12 text-center">
  <div className="rounded-full bg-muted p-3">
    <InboxIcon className="h-6 w-6 text-muted-foreground" />
  </div>
  <h3 className="text-sm font-medium text-foreground">Nenhuma pergunta encontrada</h3>
  <p className="text-sm text-muted-foreground max-w-sm">
    Quando os alunos enviarem perguntas, elas aparecerão aqui.
  </p>
</div>
```

### Divider com texto

```tsx
<div className="relative flex items-center gap-4">
  <div className="flex-1 border-t border-border" />
  <span className="text-xs text-muted-foreground">ou</span>
  <div className="flex-1 border-t border-border" />
</div>
```

### Topbar

```tsx
<header className="sticky top-0 z-40 flex h-16 items-center justify-between border-b border-border bg-background/95 px-6 backdrop-blur supports-[backdrop-filter]:bg-background/60">
  <span className="text-sm font-semibold text-foreground">FatecBot</span>
  <div className="flex items-center gap-3">
    <span className="text-sm text-muted-foreground">Carolina Silva</span>
    <button className="rounded-md p-1.5 hover:bg-accent transition-colors">
      <LogOutIcon className="h-4 w-4 text-muted-foreground" />
    </button>
  </div>
</header>
```

***

## Boas Práticas

**Use `cn()` para classes condicionais — nunca template literals:**

```tsx
// ❌
<div className={`p-4 ${isActive ? 'bg-primary text-primary-foreground' : 'bg-muted'}`}>

// ✅
<div className={cn('p-4', isActive ? 'bg-primary text-primary-foreground' : 'bg-muted')}>
```

**Agrupe classes por categoria:**

```tsx
// ❌ sem organização
<div className="flex p-4 text-sm bg-white border rounded-lg hover:shadow gap-2 items-center font-medium transition-shadow cursor-pointer">

// ✅ layout → visual → tipografia → interação
<div className={cn(
  'flex items-center gap-2 p-4',           // layout
  'rounded-lg border border-border bg-card shadow-sm', // visual
  'text-sm font-medium',                   // tipografia
  'hover:shadow-md transition-shadow cursor-pointer',  // interação
)}>
```

**Prefira tokens do shadcn a valores fixos:**

```tsx
// ❌ quebra no dark mode, inconsistente com o tema
<div className="bg-white text-gray-900 border-gray-200">

// ✅ adapta automaticamente ao tema
<div className="bg-background text-foreground border-border">
```

**Valores arbitrários com moderação:**

```tsx
// OK — valor único que não existe na escala
<div className="w-[340px] h-[72px]">

// ❌ use a classe padrão equivalente
<div className="w-[16px]">    {/* → w-4 */}
<div className="p-[8px]">     {/* → p-2 */}
<div className="mt-[16px]">   {/* → mt-4 */}
```

**Extraia componentes React em vez de usar `@apply`:**

O `@apply` existe mas é desencorajado no Tailwind v4. Se um conjunto de classes se repete muito, extraia um componente React:

```tsx
// ❌ evitar
// .card { @apply rounded-lg border border-border bg-card p-6 shadow-sm; }

// ✅
export const Card = ({ children, className }: CardProps) => (
  <div className={cn('rounded-lg border border-border bg-card p-6 shadow-sm', className)}>
    {children}
  </div>
)
```

**Nunca use `!important` via `!` prefix a não ser em último caso:**

```tsx
// Tailwind permite forçar com ! mas indica problema de especificidade
<div className="!mt-0">   // só se realmente necessário
```