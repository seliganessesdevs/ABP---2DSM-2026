# 📐 Padrões do Projeto

> Este documento define as convenções obrigatórias de código, versionamento e colaboração
> adotadas no **FatecBot**. Todos os membros da equipe devem seguir estes padrões
> para garantir consistência, rastreabilidade e qualidade ao longo das sprints.

---

## 📑 Índice

- [Branches](#branches)
- [Commits](#commits)
- [Pull Requests](#pull-requests)
- [Nomenclatura de Código](#nomenclatura-de-código)
- [TypeScript](#typescript)
- [ESLint e Prettier](#eslint-e-prettier)
- [Estrutura de Componentes React](#estrutura-de-componentes-react)
- [Estilização](#estilização)
- [Variáveis de Ambiente](#variáveis-de-ambiente)

---


## 🌿 Branches <a id="branches"></a>

### Estratégia: GitHub Flow simplificado

| Branch          | Finalidade                                               |
|-----------------|----------------------------------------------------------|
| `main`          | Código estável e entregável — **nunca commitar diretamente** |
| `develop`       | Integração contínua entre features da sprint atual       |
| `feature/*`     | Nova funcionalidade mapeada em um RF ou tarefa           |
| `fix/*`         | Correção de bug identificado em revisão ou teste         |
| `docs/*`        | Atualização exclusiva de documentação                    |
| `chore/*`       | Configuração de ferramentas, CI, dependências            |
| `refactor/*`    | Reestruturação de código sem mudança de comportamento    |

### Nomenclatura de branches


**Exemplos:**

```bash
feature/RF01-chatbot-navigation
feature/RF04-admin-node-crud
fix/RF09-jwt-expiration-handling
docs/project-standards
chore/setup-docker-compose
refactor/extract-hash-utils
```

> **Regra:** Sempre vincule a branch ao RF correspondente quando houver.
> Para tarefas sem RF direto, use a descrição curta sem código.
Seção ## ✍️ Commits
text
## ✍️ Commits <a id="commits"></a>

### Padrão: Conventional Commits em português sem acentos

Todo commit deve seguir o formato:

<tipo>(<escopo>): <descricao curta no imperativo>
[corpo opcional — explica o porque, nao o que]
[rodape opcional — referencia a task: Closes #42]
text

> ⚠️ Não use acentos, cedilha ou caracteres especiais na mensagem de commit.
> Risco real de corrompimento de encoding em diferentes terminais e ferramentas de CI.

### Tipos permitidos

| Tipo       | Quando usar                                                   |
|------------|---------------------------------------------------------------|
| `feat`     | Nova funcionalidade (ex: implementar RF01)                    |
| `fix`      | Correção de bug                                               |
| `refactor` | Reestruturação de código sem mudança de comportamento         |
| `test`     | Adição ou correção de testes                                  |
| `docs`     | Alteração exclusiva em documentação                           |
| `style`    | Formatação, espaçamento — sem mudança de lógica               |
| `chore`    | Atualização de dependências, configurações de build/CI        |
| `perf`     | Melhoria de desempenho                                        |

### Escopos recomendados

chatbot | auth | admin | secretary | nodes | documents | logs | questions | db | docker | ci


### Exemplos corretos

```bash
feat(chatbot): adiciona navegacao hierarquica pelo menu de nos
fix(auth): corrige validacao de expiracao do JWT no refresh
refactor(admin): extrai NodeEditor para componente de formulario reutilizavel
test(chatbot): adiciona testes unitarios do hook useChatNavigation
docs(api-layer): documenta endpoint POST /questions com exemplos
chore(docker): adiciona healthcheck ao container do postgres
```

### Exemplos incorretos

```bash
# ❌ Sem tipo
atualiza chatbot

# ❌ Verbo no passado
feat(auth): adicionou formulario de login

# ❌ Genérico demais
fix: corrigindo bugs

# ❌ Sem escopo quando aplicável
feat: criar painel do admin

# ❌ Com acento (risco de encoding)
feat(chatbot): adiciona navegação por nós
```

---

## 🔀 Pull Requests <a id="pull-requests"></a>

### Regras obrigatórias

- Mínimo **1 aprovação** de outro membro da equipe
- **CI deve estar passando** (lint + build + testes) antes do merge
- PR deve ser aberto contra `develop` (nunca diretamente para `main`)
- Branch de `develop` para `main` apenas ao final da Sprint Review

### Template de PR

Todo PR deve preencher o seguinte template (`.github/pull_request_template.md`):

```markdown
## 📋 Descrição
<!-- O que foi feito e por quê? -->

## 🔗 Requisito relacionado
<!-- RF ou RNF que este PR implementa/corrige -->
RF:

## ✅ Checklist
- [ ] Código segue os padrões do projeto (`pnpm lint` passou)
- [ ] Build sem erros (`pnpm build` passou)
- [ ] Testes escritos e passando (`pnpm test` passou)
- [ ] Documentação atualizada (se necessário)
- [ ] Testado localmente com Docker (`docker compose up --build`)

## 📸 Screenshots (se alteração de UI)
<!-- Antes / Depois -->
```

---

## 🏷️ Nomenclatura de Código <a id="nomenclatura-de-código"></a>

### Geral

| Elemento                  | Convenção         | Exemplo                                   |
|---------------------------|-------------------|-------------------------------------------|
| Componente React          | `PascalCase`      | `ChatWindow`, `NodeEditor`                |
| Hook customizado          | `camelCase` + `use` | `useChatNavigation`, `useAuth`          |
| Função utilitária         | `camelCase`       | `formatDate`, `hashPassword`              |
| Constante global          | `UPPER_SNAKE_CASE`| `JWT_EXPIRES_IN`, `MAX_CHUNK_LENGTH`      |
| Variável/parâmetro local  | `camelCase`       | `chatNode`, `userId`                      |
| Interface TypeScript      | `PascalCase` + `I` prefixo opcional | `ChatNode`, `AuthUser`  |
| Type alias                | `PascalCase`      | `UserRole`, `NodeStatus`                  |
| Enum                      | `PascalCase`      | `Role`, `QuestionStatus`                  |
| Arquivo de componente     | `PascalCase.tsx`  | `ChatWindow.tsx`                          |
| Arquivo de hook/util/api  | `camelCase.ts`    | `useChatNavigation.ts`, `auth.api.ts`     |
| Arquivo de types          | `kebab-case.types.ts` | `chatbot.types.ts`, `auth.types.ts`   |
| Pasta de feature          | `kebab-case`      | `chatbot/`, `admin/`                      |

### Nomenclatura de rotas da API

```
GET    /api/v1/nodes              → listar nós raiz
GET    /api/v1/nodes/:id          → buscar nó por ID (com filhos)
POST   /api/v1/nodes              → criar nó
PATCH  /api/v1/nodes/:id          → atualizar nó
DELETE /api/v1/nodes/:id          → remover nó

POST   /api/v1/auth/login         → autenticar usuário
POST   /api/v1/questions          → enviar pergunta à secretaria
GET    /api/v1/questions          → listar perguntas (secretária)
PATCH  /api/v1/questions/:id      → atualizar status da pergunta

GET    /api/v1/logs               → listar logs (admin)
POST   /api/v1/sessions/rating    → registrar satisfação
```

---

## 🔷 TypeScript <a id="typescript"></a>

### Regras obrigatórias

```ts
// ❌ Proibido — any apaga toda segurança de tipo
const data: any = response.data
function process(input: any) { ... }

// ✅ Use generics ou tipos explícitos
const data: ChatNode = response.data
function process<T>(input: T): T { ... }
```

```ts
// ❌ Proibido — type inline em props de componente
const Button = ({ label, onClick }: { label: string; onClick: () => void }) => ...

// ✅ Interface nomeada e exportada
interface ButtonProps {
  label: string
  onClick: () => void
}
export const Button = ({ label, onClick }: ButtonProps) => ...
```

```ts
// ❌ Evitar — asserção forçada sem verificação
const user = getUser() as AuthUser

// ✅ Prefira type guard
function isAuthUser(obj: unknown): obj is AuthUser {
  return typeof obj === 'object' && obj !== null && 'role' in obj
}
```

### Padrão de resposta da API

Use um wrapper genérico para todas as respostas:

```ts
// types/api.types.ts
export interface ApiResponse<T> {
  data: T
  success: boolean
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  meta: {
    total: number
    page: number
    limit: number
  }
}
```

### Enum de roles (compartilhado frontend/backend)

```ts
// types/common.types.ts
export enum Role {
  ADMIN = 'ADMIN',
  SECRETARY = 'SECRETARY',
  // Aluno não tem role — acesso público
}

export enum QuestionStatus {
  OPEN = 'OPEN',
  ANSWERED = 'ANSWERED',
}
```

---

## 🔍 ESLint e Prettier <a id="eslint-e-prettier"></a>

### Configuração ESLint (`eslint.config.ts`)

Regras críticas ativadas:

```ts
rules: {
  '@typescript-eslint/no-explicit-any': 'error',         // Proíbe any
  '@typescript-eslint/explicit-function-return-type': 'warn',
  '@typescript-eslint/no-unused-vars': 'error',
  'react-hooks/rules-of-hooks': 'error',                 // Hooks apenas em componentes/hooks
  'react-hooks/exhaustive-deps': 'warn',                 // Deps do useEffect sempre completas
  'no-console': ['warn', { allow: ['warn', 'error'] }],  // Console.log proibido em produção
  'import/no-relative-parent-imports': 'error',          // Força uso de aliases @/
}
```

### Configuração Prettier (`.prettierrc`)

```json
{
  "semi": false,
  "singleQuote": true,
  "trailingComma": "all",
  "printWidth": 100,
  "tabWidth": 2,
  "arrowParens": "avoid"
}
```

### Scripts obrigatórios antes de abrir PR

```bash
pnpm lint          # ESLint em todo o projeto
pnpm lint:fix      # Corrige automaticamente o que for possível
pnpm format        # Aplica Prettier
pnpm typecheck     # tsc --noEmit sem compilar
```

> 💡 Configure o VS Code para formatar ao salvar:
> `"editor.formatOnSave": true` e `"editor.defaultFormatter": "esbenp.prettier-vscode"`

---

## ⚛️ Estrutura de Componentes React <a id="estrutura-de-componentes-react"></a>

Todo componente deve seguir esta ordem interna:

```tsx
// 1. Imports externos (React, bibliotecas)
import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'

// 2. Imports internos (sempre via alias @/)
import { Button } from '@/components/ui/button'
import { useChatNavigation } from '@/features/chatbot/hooks/useChatNavigation'
import type { ChatNode } from '@/features/chatbot/types/chatbot.types'

// 3. Interface de props (sempre nomeada e exportada)
export interface ChatWindowProps {
  initialNodeId: string
  onSessionEnd: () => void
}

// 4. Componente (arrow function nomeada, exportação no final)
const ChatWindow = ({ initialNodeId, onSessionEnd }: ChatWindowProps) => {
  // 4a. Hooks de estado
  const [currentNode, setCurrentNode] = useState<ChatNode | null>(null)

  // 4b. Hooks de efeito e queries
  const { navigate, isLoading } = useChatNavigation(initialNodeId)

  // 4c. Handlers
  const handleOptionSelect = (nodeId: string) => {
    navigate(nodeId)
  }

  // 4d. Render condicional (loading/error antes do JSX principal)
  if (isLoading) return <LoadingSpinner />

  // 4e. JSX principal
  return (
    <div className="flex flex-col gap-4">
      {/* ... */}
    </div>
  )
}

// 5. Exportação no final (facilita re-exports e mocking em testes)
export default ChatWindow
```

---

## 🎨 Estilização <a id="estilização"></a>

### Regras Tailwind CSS

```tsx
// ❌ Evitar — classes longas inline sem organização
<div className="flex flex-col gap-4 p-4 bg-white rounded-lg shadow-md border border-gray-200 hover:shadow-lg transition-shadow duration-200 cursor-pointer">

// ✅ Use cn() do shadcn para classes condicionais e agrupe logicamente
import { cn } from '@/lib/utils'

<div className={cn(
  // Layout
  'flex flex-col gap-4 p-4',
  // Visual
  'bg-white rounded-lg border border-gray-200 shadow-md',
  // Interação
  'hover:shadow-lg transition-shadow duration-200 cursor-pointer',
  // Condicional
  isActive && 'ring-2 ring-blue-500',
)}>
```

### Nunca use CSS inline para estilização

```tsx
// ❌ Proibido para estilização
<div style={{ marginTop: '16px', color: '#3b82f6' }}>

// ✅ Classes Tailwind
<div className="mt-4 text-blue-500">
```

> CSS inline é permitido **apenas** para valores dinâmicos que não existem como classe Tailwind
> (ex: posicionamento calculado em pixels via JS).

---

## 🔐 Variáveis de Ambiente <a id="variáveis-de-ambiente"></a>

### Frontend (Vite)

- Todas as variáveis devem começar com `VITE_`
- Nunca acesse `import.meta.env.VITE_*` diretamente nos componentes
- **Sempre** importe de `@/config/env.ts` para ter validação centralizada

```ts
// config/env.ts
import { z } from 'zod'

const envSchema = z.object({
  VITE_API_URL: z.string().url(),
  VITE_ENABLE_DEVTOOLS: z.string().default('false'),
})

export const env = envSchema.parse(import.meta.env)
```

### Backend (Node.js)

- Validação com Zod no startup — se uma variável obrigatória faltar, o processo encerra imediatamente

```ts
// config/env.ts
import { z } from 'zod'

const envSchema = z.object({
  DATABASE_URL: z.string().url(),
  JWT_SECRET: z.string().min(32, 'JWT_SECRET deve ter no mínimo 32 caracteres'),
  JWT_EXPIRES_IN: z.string().default('8h'),
  PORT: z.coerce.number().default(3333),
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
})

export const env = envSchema.parse(process.env)
```

---

> _Próximo documento: [`application-overview.md`](./application-overview.md)_
