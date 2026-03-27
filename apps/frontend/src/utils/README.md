# 📁 src/utils/

Funções utilitárias puras de uso global. Sem estado, sem side effects, sem conhecimento de domínio. Recebem um input, retornam um output — testáveis de forma isolada com uma linha.

## Estrutura

```
utils/
├── date.utils.ts        # Formatação e manipulação de datas
├── string.utils.ts      # Formatação de strings
└── pagination.utils.ts  # Helpers para paginação
```

***

## `date.utils.ts`

Funções de formatação de datas usadas nos logs de atendimento, timestamps de perguntas e timestamps do painel admin.

```ts
// Formata para exibição: "27/03/2026 às 20:15"
export const formatDateTime = (iso: string): string => {
  return new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit', month: '2-digit', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  }).format(new Date(iso))
}

// Formata apenas a data: "27/03/2026"
export const formatDate = (iso: string): string => {
  return new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit', month: '2-digit', year: 'numeric',
  }).format(new Date(iso))
}

// Duração em minutos entre dois timestamps
export const durationInMinutes = (start: string, end: string): number => {
  return Math.round((new Date(end).getTime() - new Date(start).getTime()) / 60000)
}
```

***

## `string.utils.ts`

Formatação de strings para exibição na interface.

```ts
// Trunca com reticências: "Texto muito lon..."
export const truncate = (text: string, maxLength: number): string => {
  if (text.length <= maxLength) return text
  return text.slice(0, maxLength).trimEnd() + '...'
}

// Primeira letra maiúscula: "open" → "Open"
export const capitalize = (str: string): string => {
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase()
}

// Formata nome para iniciais: "Carolina Silva" → "CS"
export const getInitials = (name: string): string => {
  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map(n => n[0].toUpperCase())
    .join('')
}
```

***

## `pagination.utils.ts`

Helpers para calcular estado de paginação nas listagens do painel admin e secretaria.

```ts
export const getTotalPages = (total: number, limit: number): number => {
  return Math.ceil(total / limit)
}

export const getPageRange = (page: number, limit: number): { skip: number; take: number } => {
  return { skip: (page - 1) * limit, take: limit }
}

export const hasNextPage = (page: number, total: number, limit: number): boolean => {
  return page < getTotalPages(total, limit)
}
```

***

## Quando usar esta pasta vs `lib/utils.ts`

| Função | Destino |
|---|---|
| `cn()` para composição de classes Tailwind | `lib/utils.ts` |
| Formatação de data, string, número | `utils/` (esta pasta) |
| Transformação de dados de domínio | `features/<dominio>/` |

***

## Regras de contribuição

- Toda função aqui deve ser **pura** — mesmo input sempre produz mesmo output, sem side effects
- Nunca importe de `features/`, `hooks/` ou `lib/axios` dentro desta pasta
- Toda função deve ter tipagem explícita de parâmetros e retorno
- Se uma função utilitária for específica de uma feature, coloque-a em `features/<dominio>/` — não generalize prematuramente

***

> _Próximo documento: [`../features/README.md`](../features/README.md)_

