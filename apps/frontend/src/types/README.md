# 📁 src/types/

Types e interfaces TypeScript globais — compartilhados entre features, hooks e camada de API. Esta pasta contém apenas tipos que não pertencem a nenhum domínio específico. Types de domínio vivem em `features/<dominio>/types/`.

***

## Estrutura

```
types/
├── api.types.ts        # Envelope padrão de resposta da API
├── common.types.ts     # Enums e types compartilhados entre domínios
└── env.d.ts            # Tipagem das variáveis de ambiente Vite
```

***

## `api.types.ts`

Wrapper genérico que todas as respostas da API seguem. Garante que toda chamada HTTP tenha tipagem consistente sem repetição.

```ts
export interface ApiResponse<T> {
  success: boolean
  message: string
  data: T
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  total: number
  page: number
  limit: number
}
```

Uso nas funções de API:

```ts
// features/chatbot/api/chatbot.api.ts
api.get<ApiResponse<ChatNode>>('/nodes/root').then(r => r.data.data)

// features/admin/api/questions.api.ts
api.get<PaginatedResponse<Question>>('/questions').then(r => r.data)
```

***

## `common.types.ts`

Enums e types usados em mais de uma feature. Devem espelhar exatamente os valores definidos no backend — qualquer alteração aqui exige atualização correspondente no `schema.prisma`.

```ts
export enum Role {
  ADMIN = 'ADMIN',
  SECRETARY = 'SECRETARY',
}

export enum QuestionStatus {
  OPEN = 'OPEN',
  ANSWERED = 'ANSWERED',
}

export enum NodeType {
  MENU = 'MENU',
  ANSWER = 'ANSWER',
}

export enum Satisfaction {
  LIKED = 'LIKED',
  DISLIKED = 'DISLIKED',
}

export interface AuthUser {
  id: string
  name: string
  email: string
  role: Role
}
```

`AuthUser` é global porque é consumido pelo `auth.store`, pelos guards `ProtectedRoute` e `RoleGuard`, e pelo `AdminLayout` — todos fora de uma única feature.

***

## `env.d.ts`

Estende a interface `ImportMetaEnv` do Vite para tipar as variáveis de ambiente. Sem este arquivo, `import.meta.env.VITE_*` seria do tipo `string | undefined`.

```ts
/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_URL: string
  readonly VITE_ENABLE_DEVTOOLS: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
```

> Sempre que uma nova variável `VITE_*` for adicionada ao `.env.example`, adicione a tipagem correspondente aqui e a validação em `config/env.ts`.

***

## Quando usar esta pasta vs `features/<dominio>/types/`

| Type | Destino |
|---|---|
| Envelope de resposta HTTP | `types/api.types.ts` |
| Enum usado em múltiplas features | `types/common.types.ts` |
| Interface de entidade de um domínio | `features/<dominio>/types/` |
| Tipo de payload de uma mutation específica | `features/<dominio>/types/` |

***

## Regras de contribuição

- Nunca coloque types de domínio aqui — se pertence a uma feature, fica na feature
- Nunca transforme dados nos types — interfaces descrevem formato, não comportamento
- Qualquer enum adicionado aqui deve ter valor idêntico ao enum correspondente no backend (`schema.prisma` ou `common.types.ts` do backend)

***
