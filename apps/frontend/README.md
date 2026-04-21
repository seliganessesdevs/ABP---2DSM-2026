# 🖥️ Frontend — FatecBot

> Interface web do **FatecBot** — aplicação React com TypeScript que entrega o chatbot
> conversacional de autoatendimento e os painéis administrativos da Secretaria Acadêmica
> da Fatec Jacareí.

---

<p align="center">
  <img src="https://img.shields.io/badge/React-18-61DAFB?style=for-the-badge&logo=react&logoColor=black" />
  <img src="https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white" />
  <img src="https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white" />
  <img src="https://img.shields.io/badge/shadcn/ui-000000?style=for-the-badge&logo=shadcnui&logoColor=white" />
  <img src="https://img.shields.io/badge/TanStack_Query-FF4154?style=for-the-badge&logo=reactquery&logoColor=white" />
</p>

---

## 📑 Índice

- [Responsabilidades](#responsabilidades)
- [Estrutura de Pastas](#estrutura-de-pastas)
- [Primeiros Passos](#primeiros-passos)
- [Checklist de Implementação Inicial](#checklist-de-implementacao-inicial)
- [Scripts Disponíveis](#scripts-disponíveis)
- [Variáveis de Ambiente](#variáveis-de-ambiente)
- [Rotas da Aplicação](#rotas-da-aplicação)
- [Arquitetura e Decisões Técnicas](#arquitetura-e-decisões-técnicas)
- [Componentes e Features](#componentes-e-features)

---

## 🎯 Responsabilidades <a id="responsabilidades"></a>

O frontend é uma **SPA (Single Page Application)** responsável exclusivamente pela
interface do usuário. Toda lógica de negócio, segurança e persistência vivem no backend.

| Responsabilidade                    | Tecnologia                   |
| ----------------------------------- | ---------------------------- |
| Interface do chatbot conversacional | React 19 + TypeScript        |
| Painel administrativo (Admin)       | React + shadcn/ui            |
| Painel da secretaria                | React + shadcn/ui            |
| Gerenciamento de estado do servidor | TanStack Query (React Query) |
| Estado global do cliente (auth)     | Zustand                      |
| Estilização responsiva              | Tailwind CSS                 |
| Requisições HTTP à API              | Axios com interceptors       |
| Proteção de rotas por autenticação  | React Router v7 + Guards     |
| Build e desenvolvimento             | Vite                         |

---

## 📁 Estrutura de Pastas <a id="estrutura-de-pastas"></a>

Resumo da estrutura do frontend:

- `src/app/`: bootstrap da aplicação, providers e rotas.
- `src/features/`: domínios de negócio (`chatbot`, `auth`, `admin`, `secretary`).
- `src/components/`: UI base, layouts e componentes compartilhados.
- `src/lib/`: cliente Axios e Query Client.
- `src/config/env.ts`: validação de variáveis de ambiente.
- `src/types/`, `src/hooks/`, `src/utils/`: tipos e utilitários globais.

Documentação canônica da árvore completa e responsabilidades por pasta:
[`docs/project-structure.md`](../../docs/project-structure.md).

---

## ⚡ Primeiros Passos <a id="primeiros-passos"></a>

### Via Docker (recomendado)

O frontend sobe automaticamente via Docker Compose na raiz do projeto:

```bash
# Na raiz do monorepo
docker compose up --build
```

Acesse `http://localhost:5173`.

### Execução local (sem Docker)

> Requer Node.js >= 20.x e pnpm >= 9.x.
> O backend precisa estar rodando para as requisições funcionarem.

```bash
# Na pasta do frontend
cd apps/frontend

# Instalar dependências
pnpm install

# Configurar variáveis de ambiente
cp .env.example .env
# Confirme que VITE_API_URL aponta para o backend

# Iniciar servidor de desenvolvimento
pnpm dev
```

Acesse `http://localhost:5173`.

### Credenciais de desenvolvimento (após o seed)

| Perfil        | E-mail                          | Senha           |
|---------------|----------------------------------|-----------------|
| Administrador | `admin@fatec.sp.gov.br`          | `admin123`      |
| Secretária    | `secretaria@fatec.sp.gov.br`     | `secretaria123` |
| Aluno         | — sem login — acesso público     | —               |

> ⚠️ Estas credenciais existem apenas no ambiente de desenvolvimento após `pnpm db:seed`.
> **Nunca use em produção.**

---

## ✅ Checklist de Implementação Inicial <a id="checklist-de-implementacao-inicial"></a>

Antes de qualquer feature de domínio, o frontend deve ter estes arquivos-base:

- `src/app/provider.tsx`
- `src/app/router.tsx`
- `src/lib/axios.ts`
- `src/lib/queryClient.ts`
- `src/config/env.ts`

Essa fundação garante roteamento, acesso à API, providers globais e validação de
ambiente antes do crescimento das features.

---

## 📜 Scripts Disponíveis <a id="scripts-disponíveis"></a>

| Script          | Comando               | Descrição                                              |
|-----------------|-----------------------|--------------------------------------------------------|
| Desenvolvimento | `pnpm dev`            | Inicia com HMR em `http://localhost:5173`              |
| Build           | `pnpm build`          | Gera bundle otimizado em `dist/`                       |
| Preview         | `pnpm preview`        | Serve o build de produção localmente                   |
| Testes          | `pnpm test`           | Executa testes com Vitest                              |
| Testes (watch)  | `pnpm test:watch`     | Modo watch — reexecuta ao salvar                       |
| Testes (UI)     | `pnpm test:ui`        | Interface visual do Vitest no browser                  |
| Cobertura       | `pnpm test:coverage`  | Gera relatório HTML em `coverage/`                     |
| Lint            | `pnpm lint`           | ESLint em todo o projeto                               |
| Lint (fix)      | `pnpm lint:fix`       | Corrige automaticamente o que for possível             |
| Typecheck       | `pnpm typecheck`      | Valida TypeScript sem compilar (`tsc --noEmit`)        |
| Shadcn          | `pnpm ui:add`         | Adiciona novo componente shadcn/ui ao projeto          |

---

## 🔐 Variáveis de Ambiente <a id="variáveis-de-ambiente"></a>

Copie `.env.example` para `.env`:

```bash
# URL base da API REST — deve apontar para o backend
# Em Docker: http://localhost:3333
# Em produção: https://api.seu-dominio.com
VITE_API_URL=http://localhost:3333

# Habilita React Query Devtools (true em dev, false em produção)
VITE_ENABLE_DEVTOOLS=true
```

> Todas as variáveis de ambiente do frontend são **públicas por natureza** —
> elas ficam no bundle JavaScript enviado ao browser.
> **Nunca coloque segredos (JWT_SECRET, senhas) em variáveis VITE_*.**

---

## 🗺️ Rotas da Aplicação <a id="rotas-da-aplicação"></a>

| Rota                        | Acesso       | Componente de página         | Descrição                             |
|-----------------------------|:------------:|------------------------------|---------------------------------------|
| `/`                         | Público      | `routes/index.tsx`           | Chatbot conversacional                |
| `/login`                    | Público      | `routes/login.tsx`           | Formulário de autenticação            |
| `/admin`                    | 🔒 ADMIN     | `routes/admin/dashboard.tsx` | Dashboard do administrador            |
| `/admin/nodes`              | 🔒 ADMIN     | `routes/admin/nodes.tsx`     | CRUD de nós de navegação              |
| `/admin/documents`          | 🔒 ADMIN     | `routes/admin/documents.tsx` | Gestão de documentos oficiais         |
| `/admin/users`              | 🔒 ADMIN     | `routes/admin/users.tsx`     | Gestão de usuários da secretaria      |
| `/admin/logs`               | 🔒 ADMIN     | `routes/admin/logs.tsx`      | Logs de atendimento                   |
| `/secretary`                | 🔒 SECRETARY | `routes/secretary/dashboard.tsx` | Dashboard da secretária           |
| `/secretary/questions`      | 🔒 SECRETARY | `routes/secretary/questions.tsx` | Gestão de perguntas recebidas     |

> Rotas com 🔒 redirecionam para `/login` se o usuário não estiver autenticado
> (`ProtectedRoute`) e retornam 403 se o role não tiver permissão (`RoleGuard`).

---

## 🏗️ Arquitetura e Decisões Técnicas <a id="arquitetura-e-decisões-técnicas"></a>

### TanStack Query para estado do servidor

Todo dado que vem da API é gerenciado pelo **TanStack Query** — nunca por `useState` + `useEffect` manual.
Isso garante cache, revalidação automática e estados de loading/error consistentes.

```ts
// ✅ Padrão adotado — nunca use useEffect para fetch
const { data, isLoading, error } = useQuery({
  queryKey: ['node', nodeId],
  queryFn: () => chatbotApi.getNode(nodeId),
})
```

### Zustand apenas para estado do cliente

O **Zustand** é usado exclusivamente para estado que não vem do servidor:
token JWT, dados do usuário logado e preferências de UI.
Nunca use Zustand para cachear dados da API — isso é responsabilidade do TanStack Query.

```ts
// auth.store.ts — apenas o que é "local" ao cliente
interface AuthStore {
  token: string | null
  user: AuthUser | null
  setAuth: (token: string, user: AuthUser) => void
  clearAuth: () => void
}
```

### Axios Interceptors — Authorization automático

A instância Axios em `lib/axios.ts` injeta o token JWT em **todas** as requisições
automaticamente. Nenhum componente ou hook precisa se preocupar com isso:

```ts
// lib/axios.ts
api.interceptors.request.use(config => {
  const token = useAuthStore.getState().token
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

// Interceptor de resposta: redireciona para /login em 401
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

### Componentes `ui/` são intocáveis

Os arquivos em `src/components/ui/` são gerados pelo **shadcn/ui** e não devem ser
editados diretamente. Para customizar um componente base, crie um wrapper em
`components/shared/` ou dentro da feature correspondente.

```tsx
// ❌ Não edite components/ui/button.tsx
// ✅ Crie um wrapper em components/shared/
export const DangerButton = (props: ButtonProps) => (
  <Button {...props} variant="destructive" className={cn('font-bold', props.className)} />
)
```

---

## 🧩 Componentes e Features <a id="componentes-e-features"></a>

### `features/chatbot` — RF01, RF02, RF05, RF07

O núcleo da aplicação. O hook `useChatNavigation` gerencia toda a
lógica de navegação na árvore de nós e o histórico da sessão.

Componentes principais:

| Componente            | Função                                                    |
|-----------------------|-----------------------------------------------------------|
| `ChatWindow`          | Container da conversa — orquestra todos os outros         |
| `MessageBubble`       | Renderiza uma mensagem do bot ou do usuário               |
| `OptionButton`        | Botão de opção navegável (filhos de um nó MENU)           |
| `EvidenceCard`        | Exibe chunk de documento oficial com fonte e página       |
| `SatisfactionRating`  | Botões "Gostei / Não gostei" com submit para a API        |
| `QuestionForm`        | Formulário de envio de pergunta à secretaria              |

### `features/auth` — RF09

Gerencia login, logout e persistência do token JWT.
O `auth.store.ts` (Zustand) é a fonte de verdade para o estado de autenticação em toda a aplicação.

### `features/admin` — RF04

Painel do administrador com CRUD completo de nós, documentos, usuários e visualização de logs.

### `features/secretary` — RF06

Painel da secretária com listagem e atualização de status das perguntas recebidas.

---

> _Este README deve ser atualizado sempre que novas rotas, scripts ou variáveis
> de ambiente forem adicionados ao projeto._

> _Próximo documento: [`../../docs/state-management.md`](../../docs/state-management.md)_
