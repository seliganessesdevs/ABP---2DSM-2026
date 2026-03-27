# ⚙️ features/admin — Gestão de Conteúdo

> Feature responsável por toda a interface e lógica do painel administrativo.
> Cobre o CRUD de nós de navegação, documentos oficiais, usuários da secretaria
> e a visualização de logs de atendimento (RF04, RF02, RF08).

***

## 📑 Índice

- [Responsabilidade](#responsabilidade)
- [Estrutura de Arquivos](#estrutura)
- [Camadas](#camadas)
- [Mapeamento por Requisito](#requisitos)
- [Regras de Contribuição](#regras)

***

## 🎯 Responsabilidade <a id="responsabilidade"></a>

Esta feature é o coração do painel administrativo. Ela encapsula **tudo** que o
administrador precisa para manter o sistema funcionando: desde criar um novo nó
de navegação até visualizar os logs de atendimento gerados pelo chatbot.

Nenhuma lógica desta feature vaza para fora — os componentes de página em
`app/routes/admin/` apenas importam daqui e compõem o layout.

***

## 📁 Estrutura de Arquivos <a id="estrutura"></a>

```
features/admin/
├── api/                        # Funções de acesso à API REST
│   ├── nodes.api.ts            # GET, POST, PATCH, DELETE /nodes
│   ├── documents.api.ts        # GET, POST /documents
│   ├── users.api.ts            # GET, POST, DELETE /users
│   └── logs.api.ts             # GET /logs
│
├── components/                 # Componentes visuais exclusivos do admin
│   ├── NodeTree/               # Árvore de navegação do chatbot (MENU/ANSWER)
│   ├── NodeForm/               # Formulário de criação e edição de nó
│   ├── DocumentList/           # Listagem de documentos com chunks
│   ├── DocumentForm/           # Formulário de cadastro de documento
│   ├── UserList/               # Tabela de usuários da secretaria
│   ├── UserForm/               # Formulário de criação de usuário
│   └── LogTable/               # Tabela de logs de atendimento (somente leitura)
│
└── hooks/                      # Hooks de dados com TanStack Query
    ├── useNodes.ts             # useQuery + useMutation para nós
    ├── useDocuments.ts         # useQuery + useMutation para documentos
    ├── useUsers.ts             # useQuery + useMutation para usuários
    └── useLogs.ts              # useQuery para logs (somente leitura)
```

***

## 🧱 Camadas <a id="camadas"></a>

### api/

Funções puras que chamam os endpoints do backend via Axios. **Não usam hooks** —
retornam Promises diretamente para serem consumidas pelos hooks do TanStack Query.

```ts
// ✅ Padrão adotado em api/
export const nodesApi = {
  getAll: () => api.get<Node[]>('/nodes').then(res => res.data),
  create: (data: CreateNodeDto) => api.post<Node>('/nodes', data).then(res => res.data),
  update: (id: string, data: UpdateNodeDto) => api.patch<Node>(`/nodes/${id}`, data).then(res => res.data),
  remove: (id: string) => api.delete(`/nodes/${id}`),
}

// ❌ Nunca use axios diretamente nos hooks ou componentes
```

### hooks/

Encapsulam as chamadas de `api/` em hooks do TanStack Query. São a **única fonte
de dados** para os componentes desta feature — nenhum componente chama `api/`
diretamente.

```ts
// ✅ Padrão adotado em hooks/
export function useNodes() {
  return useQuery({
    queryKey: ['nodes'],
    queryFn: nodesApi.getAll,
  })
}

export function useCreateNode() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: nodesApi.create,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['nodes'] }),
  })
}
```

### components/

Componentes React que consomem os hooks e renderizam a interface. Cada subpasta
representa um domínio visual independente com seu próprio `index.tsx`.

```tsx
// ✅ Componente correto — consome hook, não chama api/ diretamente
export function NodeForm({ onSuccess }: NodeFormProps) {
  const { mutate: createNode, isPending } = useCreateNode()
  // ...
}
```

***

## 📋 Mapeamento por Requisito <a id="requisitos"></a>

| Requisito | Funcionalidade                              | Hook            | Componente       |
| --------- | ------------------------------------------- | --------------- | ---------------- |
| **RF02**  | Cadastrar documentos e chunks               | `useDocuments`  | `DocumentForm`   |
| **RF04**  | CRUD de nós de navegação                    | `useNodes`      | `NodeTree`, `NodeForm` |
| **RF04**  | Criar e remover usuários da secretaria      | `useUsers`      | `UserList`, `UserForm` |
| **RF08**  | Visualizar logs de atendimento              | `useLogs`       | `LogTable`       |

***

## 📐 Regras de Contribuição <a id="regras"></a>

- **Todo novo endpoint** de admin ganha um arquivo próprio em `api/` — nunca adicione funções em arquivos existentes de outro domínio
- **Todo acesso a dados** passa por um hook em `hooks/` — componentes **nunca** importam de `api/` diretamente
- Componentes desta feature **não importam** de outras features — se precisar de algo compartilhado, mova para `components/shared/`
- Após qualquer mutation bem-sucedida, **invalide o queryKey** correspondente para manter o cache sincronizado
- Formulários devem usar validação client-side com Zod antes de disparar a mutation

***

> _Este README deve ser atualizado sempre que um novo domínio de gestão
> for adicionado ao painel administrativo._

> _Próximo documento: [`../../../README.md`](../../../README.md)_
