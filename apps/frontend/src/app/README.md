Tenho tudo que preciso. Aqui está o README completo para `apps/frontend/src/app/`:

***

```markdown
# 🧭 src/app — Núcleo da Aplicação

> Ponto de inicialização do frontend. É aqui que a aplicação ganha forma:
> rotas são definidas, providers são compostos e os componentes de página
> são conectados à estrutura de navegação.

***

## 📑 Índice

- [Responsabilidade](#responsabilidade)
- [Estrutura de Arquivos](#estrutura-de-arquivos)
- [router.tsx](#router)
- [provider.tsx](#provider)
- [routes/](#routes)
- [Regras de Contribuição](#regras)

***

## 🎯 Responsabilidade <a id="responsabilidade"></a>

A pasta `app/` é o **único lugar** onde rotas são declaradas e providers são compostos.
Nenhum outro arquivo do projeto deve registrar rotas ou envolver a árvore de componentes
com providers globais.

| Arquivo / Pasta | Responsabilidade                                              |
| --------------- | ------------------------------------------------------------- |
| `router.tsx`    | Declara todas as rotas da SPA com React Router v6             |
| `provider.tsx`  | Compõe os providers globais em ordem correta                  |
| `routes/`       | Componentes de página — um arquivo por rota                   |

***

## 📁 Estrutura de Arquivos <a id="estrutura-de-arquivos"></a>

```
app/
├── router.tsx           # Definição central de todas as rotas
├── provider.tsx         # Composição de providers (Query, Auth, Theme)
└── routes/              # Componentes de página por rota
    ├── index.tsx        # Rota pública: chatbot principal (/)
    ├── login.tsx        # Página de login (/login)
    ├── admin/           # Rotas protegidas: painel do administrador (/admin/*)
    │   ├── dashboard.tsx
    │   ├── nodes.tsx
    │   ├── documents.tsx
    │   ├── users.tsx
    │   └── logs.tsx
    └── secretary/       # Rotas protegidas: painel da secretária (/secretary/*)
        ├── dashboard.tsx
        └── questions.tsx
```

***

## 🗺️ router.tsx <a id="router"></a>

Define **todas** as rotas da aplicação em um único lugar usando React Router v6.
Rotas protegidas são envoltas por `ProtectedRoute` e `RoleGuard`, importados de
`components/shared/`.

```tsx
// ✅ Padrão adotado — toda rota nova entra aqui
<Route element={<ProtectedRoute />}>
  <Route element={<RoleGuard role="ADMIN" />}>
    <Route path="/admin" element={<AdminDashboard />} />
  </Route>
</Route>

// ❌ Nunca declare rotas dentro de componentes de feature ou layout
```

A tabela completa de rotas e seus níveis de acesso está documentada em
[`apps/frontend/README.md`](../../../README.md#rotas-da-aplicação).

***

## 🔌 provider.tsx <a id="provider"></a>

Compõe todos os providers globais em volta da aplicação.
A **ordem importa**: providers que dependem de outros devem ser filhos deles.

```tsx
// ✅ Ordem correta de composição
export function AppProvider({ children }: { children: React.ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <ThemeProvider>
          {children}
          <ReactQueryDevtools />
        </ThemeProvider>
      </AuthProvider>
    </QueryClientProvider>
  )
}
```

> ⚠️ **Nunca adicione providers dentro de componentes de página ou feature.**
> Todo provider com escopo global pertence exclusivamente a este arquivo.

***

## 📄 routes/ <a id="routes"></a>

Cada arquivo em `routes/` corresponde a **exatamente uma rota** da aplicação.
Esses componentes são responsáveis apenas por composição de layout e orquestração
de features — **não contêm lógica de negócio**.

```tsx
// ✅ Componente de página correto — compõe, não implementa
export default function AdminNodesPage() {
  return (
    <AdminLayout>
      <NodeManager />   {/* lógica vive em features/admin */}
    </AdminLayout>
  )
}

// ❌ Lógica de negócio (fetching, mutations) não pertence aqui
export default function AdminNodesPage() {
  const [nodes, setNodes] = useState([])
  useEffect(() => { fetch('/api/nodes').then(...) }, [])
  // ...
}
```

### Organização por acesso

| Pasta / Arquivo     | Acesso       | Rota                     |
| ------------------- | :----------: | ------------------------ |
| `index.tsx`         | Público      | `/`                      |
| `login.tsx`         | Público      | `/login`                 |
| `admin/`            | 🔒 ADMIN     | `/admin/*`               |
| `secretary/`        | 🔒 SECRETARY | `/secretary/*`           |

***

## 📐 Regras de Contribuição <a id="regras"></a>

- **Toda rota nova** deve ser declarada em `router.tsx` — nunca em outro lugar
- **Todo provider global** deve ser adicionado em `provider.tsx`
- Componentes de página em `routes/` **não importam** diretamente de `lib/` ou `hooks/` globais — apenas de `features/` e `components/`
- Rotas protegidas **sempre** usam `ProtectedRoute` + `RoleGuard`, nessa ordem
- O nome do arquivo em `routes/` deve refletir o caminho da rota: `/admin/nodes` → `admin/nodes.tsx`

***

> _Este README deve ser atualizado sempre que novas rotas ou providers globais
> forem adicionados ao projeto._
