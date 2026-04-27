# 🧭 src/app — Núcleo da Aplicação

> Ponto de entrada do frontend. Esta pasta concentra a composição global da
> aplicação: providers, roteamento e páginas. A lógica de negócio continua
> nas features; aqui nós apenas montamos a casca da SPA.

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

A pasta `app/` é o **único lugar** onde:

- as rotas são declaradas com React Router
- os providers globais são compostos
- as páginas conectam layout + features

| Arquivo / Pasta | Responsabilidade |
| --------------- | ---------------- |
| `router.tsx` | Declara todas as rotas da SPA |
| `provider.tsx` | Compõe Query Client, Router e demais providers globais |
| `routes/` | Componentes de página, um por rota |

***

## 📁 Estrutura de Arquivos <a id="estrutura-de-arquivos"></a>

```
app/
├── router.tsx           # Definição central das rotas
├── provider.tsx         # Composição dos providers globais
└── routes/
    ├── index.tsx        # Rota pública do chatbot
    ├── admin/           # Páginas do painel administrativo
    │   ├── dashboard.tsx
    │   ├── documents.tsx
    │   ├── logs.tsx
    │   ├── nodes.tsx
    │   └── users.tsx
    └── secretary/       # Páginas do painel da secretária
        ├── dashboard.tsx
        └── questions.tsx
```

> Se uma rota ainda não existir no código, trate esta estrutura como alvo de implementação e não como garantia de que tudo já foi criado.

***

## 🗺️ `router.tsx` <a id="router"></a>

Define **todas** as rotas da aplicação em um único lugar. As regras de acesso
devem ser declaradas aqui, com `ProtectedRoute` e `RoleGuard`, sem espalhar
autorização pelos componentes de página.

```tsx
<Route element={<ProtectedRoute />}>
  <Route element={<RoleGuard role="ADMIN" />}>
    <Route path="/admin" element={<AdminDashboardPage />} />
  </Route>
</Route>
```

As páginas em `routes/` apenas recebem esse contexto e compõem a UI.

***

## 🔌 `provider.tsx` <a id="provider"></a>

Compõe os providers globais que precisam existir uma única vez no topo da app.
O checklist inicial canônico do frontend está em [`../../README.md`](../../README.md),
mas o mínimo esperado aqui é:

- `QueryClientProvider`
- o roteador da aplicação
- qualquer provider global adicional aprovado pelo time

> Evite inventar providers nesta camada sem necessidade real. Se o estado vem da API, a regra canônica continua sendo usar TanStack Query em vez de contexto global.

***

## 📄 `routes/` <a id="routes"></a>

Cada arquivo em `routes/` representa uma página. Esses componentes não devem
conter regra de negócio, chamadas HTTP diretas nem estado global de domínio.
O papel deles é montar layout + feature.

```tsx
export default function AdminNodesPage() {
  return (
    <AdminLayout>
      <NodeManager />
    </AdminLayout>
  )
}
```

***

## 📐 Regras de Contribuição <a id="regras"></a>

- Toda rota nova entra em `router.tsx`
- Toda composição global entra em `provider.tsx`
- Componentes de página importam de `features/` e `components/`, não de chamadas HTTP diretas
- Guards de autenticação e role devem ser declarados no roteador
- Se a estrutura de páginas mudar, atualize este README e o [`apps/frontend/README.md`](../../README.md)

***

> _Próximo documento: [`routes/admin/README.md`](./routes/admin/README.md)_
