# 📁 src/components/

Componentes React compartilhados entre features. Esta pasta contém três categorias
com responsabilidades e regras de edição completamente distintas. Entender essa
separação é obrigatório antes de criar ou modificar qualquer componente aqui.

---

## Estrutura

components/
├── ui/ # ⚠️ Gerado pelo shadcn/ui — não editar diretamente
│ ├── button.tsx
│ ├── input.tsx
│ ├── dialog.tsx
│ ├── table.tsx
│ └── ...
├── layout/ # Estruturas de página reutilizáveis
│ ├── AdminLayout.tsx
│ └── PublicLayout.tsx
└── shared/ # Componentes com lógica própria reutilizáveis
├── ProtectedRoute.tsx
├── RoleGuard.tsx
├── LoadingSpinner.tsx
└── ErrorBoundary.tsx


---

## `ui/`

Componentes base gerados e gerenciados pelo **shadcn/ui**.

**Regra absoluta: nunca edite arquivos dentro desta pasta.**

shadcn/ui não é uma dependência npm — os componentes são copiados diretamente
para o projeto via CLI. Isso significa que qualquer edição manual será sobrescrita
na próxima vez que o componente for atualizado ou reinstalado.

**Como adicionar um novo componente shadcn:**

```bash
pnpm ui:add <nome-do-componente>
# Exemplos:
pnpm ui:add badge
pnpm ui:add data-table
pnpm ui:add calendar
Como customizar um componente ui/:

Nunca edite o arquivo em ui/. Crie um wrapper em shared/ ou dentro da feature:

```tsx
// ✅ components/shared/DangerButton.tsx
import { Button, type ButtonProps } from '@/components/ui/button'
import { cn } from '@/lib/utils'

export const DangerButton = ({ className, ...props }: ButtonProps) => (
  <Button
    variant="destructive"
    className={cn('font-semibold', className)}
    {...props}
  />
)
```

Como aplicar o tema visual:

Cores, bordas e tipografia são configuradas em index.css via CSS variables,
não editando os componentes diretamente. Consulte a documentação do shadcn/ui
para customização de tema.

layout/
Componentes de estrutura de página que definem o "esqueleto" visual
compartilhado entre múltiplas rotas.

AdminLayout.tsx
Estrutura compartilhada entre o painel do administrador (/admin/*) e
o painel da secretária (/secretary/*). Renderiza:

Sidebar de navegação com links filtrados por role

Topbar com nome do usuário logado e botão de logout

Área de conteúdo principal via <Outlet /> (React Router)

A sidebar lê o role do usuário via useAuthStore e exibe apenas os links
pertinentes ao perfil autenticado — isso é UX, não segurança.

tsx
// Uso em router.tsx
{
  element: <AdminLayout />,
  children: [
    { index: true, element: <AdminDashboard /> },
    { path: 'nodes', element: <NodesPage /> },
  ]
}
PublicLayout.tsx
Estrutura minimalista para as rotas públicas (/ e /login).
Sem sidebar, sem topbar autenticada. Apenas centralização
e container responsivo para o chatbot.

shared/
Componentes com lógica própria que são utilizados em múltiplas features
ou em app/router.tsx. Diferente de ui/, estes podem e devem ser
editados conforme o projeto evolui.

ProtectedRoute.tsx
Componente de rota que verifica a existência de token JWT válido no auth.store.
Se não autenticado, redireciona para /login preservando a rota de origem via state.

```tsx
// Comportamento
token presente  → renderiza <Outlet />
token ausente   → <Navigate to="/login" state={{ from: location }} replace />
```

Usado como elemento pai de todas as rotas autenticadas em router.tsx.
Não recebe props — lê o estado diretamente do Zustand.


RoleGuard.tsx

Componente de rota que verifica se o role do usuário autenticado corresponde
ao role exigido pela rota. Deve sempre ser filho de ProtectedRoute
(nunca usado isoladamente).

```tsx
// Props
interface RoleGuardProps {
  role: 'ADMIN' | 'SECRETARY'
}

// Comportamento
role correto    → renderiza <Outlet />
role incorreto  → renderiza <ForbiddenPage /> (sem redirecionar)
```

LoadingSpinner.tsx

Spinner de carregamento padronizado. Aceita prop size (sm | md | lg)
e fullPage (boolean) para centralização em tela cheia.
Usado como fallback de Suspense e em estados isLoading do TanStack Query.

ErrorBoundary.tsx

Class component React que captura erros de renderização não tratados.
Exibe uma tela de erro amigável com botão de retry em vez de quebrar a UI.
Envolve a árvore principal em provider.tsx.

Regras de contribuição
Onde criar um novo componente?

Situação	Destino
Componente base de UI sem lógica (botão, input, badge)	ui/ via pnpm ui:add
Estrutura de página compartilhada entre rotas	layout/
Componente com lógica usado em 2+ features	shared/
Componente usado exclusivamente em uma feature	features/<dominio>/components/
Regras gerais:

Nunca importe de features/ dentro de components/ — a dependência é sempre
features/ → components/, nunca o contrário

Componentes em shared/ devem ser genéricos o suficiente para não conhecer
detalhes de nenhuma feature específica

Todo componente exportado deve ter sua interface de props nomeada e exportada


***

