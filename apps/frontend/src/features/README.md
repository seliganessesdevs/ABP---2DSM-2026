# 📁 src/features/

Coração da aplicação. Cada subpasta representa um **domínio de negócio isolado** e contém tudo que aquele domínio precisa: chamadas de API, componentes, hooks e tipos. Nenhuma lógica de negócio deve existir fora desta pasta.

***

## Estrutura

```
features/
├── chatbot/
├── auth/
├── admin/
└── secretary/
```

Cada feature segue a mesma estrutura interna:

```
<feature>/
├── api/
├── components/
├── hooks/
├── stores/
└── types/
```

> Nem toda feature precisa de todas as pastas. Crie apenas o que for necessário.

***

## Responsabilidades por camada

### `api/`

Funções puras que fazem chamadas HTTP usando a instância Axios de `lib/axios.ts`. Não contém lógica de negócio, não usa hooks, não acessa estado global. Retorna os dados tipados ou lança um erro que será tratado pelo hook.

**Regras:**
- Uma função por endpoint — sem agrupamento de lógica
- Sempre tipar o retorno — nunca `any`
- Erros HTTP são propagados para o hook — não trate aqui

### `hooks/`

Hooks customizados que encapsulam a lógica de domínio. São a interface entre os componentes e a camada de dados. Usam TanStack Query para dados do servidor e `useState`/`useReducer` para estado local de UI.

**Regras:**
- Um hook por responsabilidade — não agrupe comportamentos não relacionados
- `queryKey` deve sempre incluir os parâmetros usados na query
- Mutations devem invalidar as queries afetadas no `onSuccess`

### `components/`

Componentes React exclusivos desta feature. Consomem hooks da própria feature ou recebem dados via props. Nunca fazem chamadas de API diretamente.

> Se um componente for usado por duas features diferentes, mova-o para `components/shared/`.

### `stores/`

Estado global Zustand para dados que não vêm do servidor e precisam ser acessados fora da árvore React. Criada **somente** na feature `auth/`. As demais features gerenciam estado via TanStack Query ou `useState` local.

### `types/`

Interfaces e type aliases do domínio. Devem refletir fielmente os tipos retornados pela API — sem transformações ou adaptações aqui.

***

## Features do projeto

### `chatbot/` — RF01, RF02, RF05, RF07

Domínio principal. Gerencia navegação na árvore de nós, exibição de respostas e evidências documentais, avaliação de satisfação e envio de perguntas à secretaria.

| Arquivo | Responsabilidade |
|---|---|
| `api/chatbot.api.ts` | Endpoints: `/nodes/*`, `/sessions/rating`, `/questions` |
| `hooks/useChatNavigation.ts` | Navegar entre nós, histórico, goBack |
| `hooks/useSubmitRating.ts` | Mutation de satisfação com SessionLog |
| `hooks/useSubmitQuestion.ts` | Mutation de envio de pergunta |
| `components/ChatWindow.tsx` | Container orquestrador da conversa |
| `components/MessageBubble.tsx` | Renderiza mensagem do bot ou do usuário |
| `components/OptionButton.tsx` | Botão de opção navegável (filhos de MENU) |
| `components/EvidenceCard.tsx` | Exibe chunk documental com fonte e página |
| `components/SatisfactionRating.tsx` | Botões Gostei / Não gostei |
| `components/QuestionForm.tsx` | Formulário de envio de dúvida à secretaria |

### `auth/` — RF09

Gerencia autenticação JWT. O `auth.store` é o único store Zustand da aplicação e serve como fonte de verdade para autenticação em toda a app, incluindo os interceptors do Axios.

| Arquivo | Responsabilidade |
|---|---|
| `api/auth.api.ts` | Endpoint: `POST /auth/login` |
| `hooks/useLogin.ts` | Mutation de login + setAuth no store |
| `hooks/useLogout.ts` | clearAuth + redirect para /login |
| `stores/auth.store.ts` | Token JWT, dados do usuário, persistência |
| `components/LoginForm.tsx` | Formulário de e-mail e senha |

### `admin/` — RF04, RF08

CRUD de nós de navegação, gestão de documentos e chunks, gerenciamento de usuários da secretaria e visualização de logs.

| Arquivo | Responsabilidade |
|---|---|
| `api/nodes.api.ts` | CRUD: `GET/POST/PATCH/DELETE /nodes` |
| `api/documents.api.ts` | `GET/POST /documents` |
| `api/users.api.ts` | `GET/POST/DELETE /users` |
| `api/logs.api.ts` | `GET /logs` |
| `hooks/useNodes.ts` | Query + mutations de nós |
| `hooks/useDocuments.ts` | Query + mutation de documentos |
| `hooks/useLogs.ts` | Query de logs com filtros |
| `components/NodeTree.tsx` | Árvore visual de nós navegável |
| `components/NodeEditor.tsx` | Formulário de criação/edição de nó |

### `secretary/` — RF05, RF06

Listagem de perguntas recebidas com filtro por status e atualização de status individual.

| Arquivo | Responsabilidade |
|---|---|
| `api/questions.api.ts` | `GET /questions`, `PATCH /questions/:id` |
| `hooks/useQuestions.ts` | Query paginada com filtro de status |
| `hooks/useUpdateQuestion.ts` | Mutation de atualização de status |
| `components/QuestionList.tsx` | Tabela de perguntas com badge de status |
| `components/QuestionStatusBadge.tsx` | Badge OPEN / ANSWERED com cor |

***

## Regras de contribuição

**Isolamento entre features** — features de domínio não importam umas das outras. Se dois domínios precisam do mesmo dado, ambos fazem a query independente — o TanStack Query deduplica automaticamente.

**Alias de importação** — sempre use `@/`, nunca caminhos relativos que cruzem pastas.

**Nova feature** — crie a pasta com as subpastas necessárias, adicione o RF correspondente no cabeçalho deste README e documente os arquivos principais nas tabelas acima.

***

> _Próximo documento: [`./auth/README.md`](./auth/README.md)_
