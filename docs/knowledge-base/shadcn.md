# shadcn/ui — Guia para Iniciantes

shadcn/ui é uma coleção de componentes prontos — botões, modais, tabelas, campos de formulário — que você adiciona ao seu projeto e usa diretamente. A diferença de outras bibliotecas é que o código de cada componente vai para dentro do seu projeto, então você vê exatamente o que está usando.

***

## Como Adicionar Componentes

Em vez de instalar uma biblioteca, você roda um comando e o componente aparece em `src/components/ui/`:

```bash
pnpm ui:add button       # botão
pnpm ui:add input        # campo de texto
pnpm ui:add dialog       # janela modal (popup)
pnpm ui:add table        # tabela
pnpm ui:add badge        # etiqueta colorida
pnpm ui:add sheet        # painel lateral
pnpm ui:add skeleton     # placeholder de carregamento
pnpm ui:add tabs         # abas
pnpm ui:add label        # texto de campo
pnpm ui:add dropdown-menu # menu de opções
```

Depois de rodar o comando, você importa e usa normalmente:

```tsx
import { Button } from '@/components/ui/button'

<Button>Clique aqui</Button>
```

> **Regra de ouro:** nunca edite os arquivos dentro de `components/ui/`. Se precisar mudar algo, crie um componente novo em `components/shared/` que usa o original por baixo.

***

## `Button` — Botão

```tsx
import { Button } from '@/components/ui/button'

// Estilos diferentes para cada situação
<Button variant="default">Salvar</Button>       {/* ação principal */}
<Button variant="outline">Cancelar</Button>     {/* ação secundária */}
<Button variant="destructive">Remover</Button>  {/* ação perigosa */}
<Button variant="ghost">Ver mais</Button>       {/* discreto, sem borda */}

// Tamanhos
<Button size="sm">Pequeno</Button>
<Button size="default">Normal</Button>
<Button size="lg">Grande</Button>
<Button size="icon"><TrashIcon /></Button>  {/* botão quadrado só com ícone */}

// Desabilitado durante carregamento
<Button disabled={isLoading}>
  {isLoading ? 'Salvando...' : 'Salvar'}
</Button>
```

**Usando botão como link:**

Às vezes você quer que um link pareça um botão. Use `asChild` para isso — ele pega o visual do botão e aplica no link, sem gerar HTML quebrado:

```tsx
import { Link } from 'react-router-dom'

<Button asChild>
  <Link to="/admin">Ir para o painel</Link>
</Button>
```

***

## `Input` e `Label` — Campo de Formulário

Sempre coloque um `Label` acima do `Input` e conecte os dois com `htmlFor` e `id` — isso é importante para acessibilidade (clicar no texto do label foca o campo):

```tsx
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

<div className="flex flex-col gap-1.5">
  <Label htmlFor="email">E-mail</Label>
  <Input
    id="email"
    type="email"
    placeholder="aluno@fatec.sp.gov.br"
    value={email}
    onChange={e => setEmail(e.target.value)}
  />
</div>

// Mostrando um erro abaixo do campo
<div className="flex flex-col gap-1.5">
  <Label htmlFor="senha">Senha</Label>
  <Input id="senha" type="password" />
  {temErro && (
    <p className="text-xs text-destructive">Senha muito curta</p>
  )}
</div>
```

***

## `Dialog` — Janela Modal (Popup)

Modal é aquela janela que aparece por cima do conteúdo. O Dialog é formado por várias partes que você monta como blocos:

```tsx
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogTrigger,
} from '@/components/ui/dialog'

// Versão simples — o botão abre o modal automaticamente
<Dialog>
  <DialogTrigger asChild>
    <Button>Criar pergunta</Button>   {/* este botão abre o modal */}
  </DialogTrigger>

  <DialogContent>
    <DialogHeader>
      <DialogTitle>Nova pergunta</DialogTitle>
      <DialogDescription>
        Preencha os campos abaixo para enviar sua dúvida.
      </DialogDescription>
    </DialogHeader>

    {/* conteúdo do meio */}
    <div className="flex flex-col gap-4 py-4">
      <Input placeholder="Digite sua dúvida" />
    </div>

    <DialogFooter>
      <Button variant="outline">Cancelar</Button>
      <Button>Enviar</Button>
    </DialogFooter>
  </DialogContent>
</Dialog>
```

Quando o botão que abre o modal está em outro lugar da tela, controle com estado:

```tsx
const [aberto, setAberto] = useState(false)

<Button onClick={() => setAberto(true)}>Abrir</Button>

<Dialog open={aberto} onOpenChange={setAberto}>
  <DialogContent>
    {/* ... */}
  </DialogContent>
</Dialog>
```

***

## `Table` — Tabela

```tsx
import {
  Table, TableBody, TableCell,
  TableHead, TableHeader, TableRow,
} from '@/components/ui/table'

<Table>
  <TableHeader>
    <TableRow>
      <TableHead>Pergunta</TableHead>
      <TableHead>E-mail</TableHead>
      <TableHead>Status</TableHead>
      <TableHead>Ações</TableHead>
    </TableRow>
  </TableHeader>
  <TableBody>
    {perguntas.map(p => (
      <TableRow key={p.id}>
        <TableCell className="font-medium">{p.texto}</TableCell>
        <TableCell className="text-muted-foreground">{p.email}</TableCell>
        <TableCell><Badge>{p.status}</Badge></TableCell>
        <TableCell>
          <Button size="icon" variant="ghost">
            <MoreHorizontalIcon className="h-4 w-4" />
          </Button>
        </TableCell>
      </TableRow>
    ))}
  </TableBody>
</Table>

{/* Sempre mostre uma mensagem quando não há itens */}
{perguntas.length === 0 && (
  <p className="py-8 text-center text-sm text-muted-foreground">
    Nenhuma pergunta encontrada.
  </p>
)}
```

***

## `Badge` — Etiqueta de Status

```tsx
import { Badge } from '@/components/ui/badge'

<Badge>Padrão</Badge>
<Badge variant="secondary">Secundário</Badge>
<Badge variant="destructive">Erro</Badge>
<Badge variant="outline">Outline</Badge>

// Status que muda conforme o valor
const estiloStatus = {
  OPEN:     'secondary',
  ANSWERED: 'default',
} as const

<Badge variant={estiloStatus[pergunta.status]}>
  {pergunta.status === 'OPEN' ? 'Em aberto' : 'Respondida'}
</Badge>
```

***

## `Skeleton` — Tela de Carregamento

Skeleton é um "fantasma" do conteúdo que aparece enquanto os dados carregam. É melhor que um spinner quando você sabe o formato do que vai aparecer:

```tsx
import { Skeleton } from '@/components/ui/skeleton'

// Monte no mesmo formato do card real
const CardCarregando = () => (
  <div className="rounded-lg border p-4 space-y-3">
    <Skeleton className="h-4 w-3/4" />     {/* linha de título */}
    <Skeleton className="h-4 w-1/2" />     {/* linha de subtítulo */}
    <Skeleton className="h-6 w-20 rounded-full" /> {/* badge */}
  </div>
)

// Use com TanStack Query
if (isLoading) return (
  <div className="flex flex-col gap-4">
    {Array.from({ length: 5 }).map((_, i) => (
      <CardCarregando key={i} />
    ))}
  </div>
)
```

***

## `Tabs` — Abas

```tsx
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

<Tabs defaultValue="em-aberto">
  <TabsList>
    <TabsTrigger value="em-aberto">Em aberto</TabsTrigger>
    <TabsTrigger value="respondidas">Respondidas</TabsTrigger>
  </TabsList>

  <TabsContent value="em-aberto">
    <ListaPerguntas status="OPEN" />
  </TabsContent>

  <TabsContent value="respondidas">
    <ListaPerguntas status="ANSWERED" />
  </TabsContent>
</Tabs>
```

***

## `DropdownMenu` — Menu de Opções

Aquele menu que abre com um clique e mostra opções:

```tsx
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem,
  DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

<DropdownMenu>
  <DropdownMenuTrigger asChild>
    <Button size="icon" variant="ghost">
      <MoreHorizontalIcon className="h-4 w-4" />
    </Button>
  </DropdownMenuTrigger>

  <DropdownMenuContent align="end">
    <DropdownMenuLabel>Ações</DropdownMenuLabel>
    <DropdownMenuSeparator />
    <DropdownMenuItem onClick={() => handleEditar(id)}>
      Editar
    </DropdownMenuItem>
    <DropdownMenuItem
      onClick={() => handleRemover(id)}
      className="text-destructive focus:text-destructive"
    >
      Remover
    </DropdownMenuItem>
  </DropdownMenuContent>
</DropdownMenu>
```

***

## Criando seu Próprio Componente com shadcn

Quando você repete o mesmo conjunto de campos ou botões em vários lugares, extraia um componente. Não edite o arquivo original — use ele por dentro:

```tsx
// components/shared/CampoFormulario.tsx
// Um campo de formulário completo: label + input + erro
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'

interface CampoFormularioProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string
  erro?: string
}

export const CampoFormulario = ({ label, erro, id, ...props }: CampoFormularioProps) => (
  <div className="flex flex-col gap-1.5">
    <Label htmlFor={id}>{label}</Label>
    <Input
      id={id}
      className={cn(erro && 'border-destructive')}
      {...props}
    />
    {erro && <p className="text-xs text-destructive">{erro}</p>}
  </div>
)

// Uso — muito mais limpo do que repetir label + input + erro em todo lugar
<CampoFormulario
  id="email"
  label="E-mail"
  type="email"
  placeholder="aluno@fatec.sp.gov.br"
  erro={erros.email}
/>
```

***

## Boas Práticas

**Nunca edite `components/ui/`** — se o componente for atualizado, você perde suas alterações. Crie sempre um componente novo que usa o original.

**Use `Skeleton` no lugar de spinner quando souber o formato** — a tela parece carregar mais rápido porque o usuário já vê o formato do conteúdo.

**Sempre trate o estado vazio** — componentes do shadcn não mostram nada quando a lista está vazia. Você precisa adicionar isso:

```tsx
{itens.length === 0 ? (
  <p className="text-center text-muted-foreground py-8">Nenhum item encontrado.</p>
) : (
  itens.map(item => <Card key={item.id} item={item} />)
)}
```

**Leia o código gerado em `components/ui/`** — parece intimidador no começo, mas com o tempo você entende como o componente funciona por dentro e fica mais fácil de resolver problemas.

***

> _Próximo documento: [`pnpm.md`](./pnpm.md)_
