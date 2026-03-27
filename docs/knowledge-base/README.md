# 🧠 knowledge-base — Guias Técnicos

> Guias introdutórios sobre as tecnologias usadas no FatecBot.
> O objetivo aqui é reduzir atrito de onboarding sem duplicar as decisões
> arquiteturais canônicas definidas em `docs/`.

***

## 📑 Índice

- [Sobre esta pasta](#sobre)
- [Guias disponíveis](#guias)
- [Como usar](#como-usar)
- [Relação com os documentos canônicos](#canonicos)
- [Regras de contribuição](#regras)

***

## 🎯 Sobre esta pasta <a id="sobre"></a>

Os documentos daqui explicam ferramentas e conceitos da stack do projeto com foco
prático. Eles ajudam quem está aprendendo React, Express, Prisma, Docker e afins,
mas **não substituem**:

- [`../project-standards.md`](../project-standards.md) para fluxo de trabalho e convenções
- [`../api-layer.md`](../api-layer.md) para contrato de API
- [`../state-management.md`](../state-management.md) para TanStack Query e Zustand

***

## 📚 Guias disponíveis <a id="guias"></a>

### Backend

| Guia | O que você vai encontrar |
| ---- | ------------------------ |
| [`express.md`](./express.md) | Rotas, middlewares e separação controller/service |
| [`prisma.md`](./prisma.md) | Schema, queries, paginação, seleção de campos e erros comuns |
| [`jwt-argon2id.md`](./jwt-argon2id.md) | Fluxo de autenticação, payload JWT e uso de Argon2id |
| [`zod.md`](./zod.md) | Validação de body, params e query strings com tipos inferidos |
| [`tratamento-de-erros.md`](./tratamento-de-erros.md) | AppError, middleware global e resposta consistente de erro |
| [`REST-HTTP.md`](./REST-HTTP.md) | Convenções REST, métodos HTTP e status codes |

### Frontend

| Guia | O que você vai encontrar |
| ---- | ------------------------ |
| [`react.md`](./react.md) | Fundamentos de React 18, hooks e boas práticas de componentes |
| [`axios.md`](./axios.md) | Instância HTTP, interceptors e integração com autenticação |
| [`tanstack-query.md`](./tanstack-query.md) | Fetch declarativo, cache e invalidação |
| [`zustand.md`](./zustand.md) | Store global de auth e limites claros de uso |
| [`shadcn.md`](./shadcn.md) | Uso dos componentes base e regra de não editar `components/ui/` |
| [`tailwindcss.md`](./tailwindcss.md) | Tokens, composição de classes e padrões de estilo |

### Geral

| Guia | O que você vai encontrar |
| ---- | ------------------------ |
| [`typescript.md`](./typescript.md) | Types, interfaces, guards e inferência no projeto |
| [`pnpm.md`](./pnpm.md) | Workspaces, scripts e lockfile do monorepo |
| [`docker.md`](./docker.md) | Containers, Compose, variáveis de ambiente e persistência |
| [`git-flow.md`](./git-flow.md) | Rotina de branch e PR alinhada aos padrões do projeto |

***

## 🔍 Como usar <a id="como-usar"></a>

Não é necessário ler tudo em sequência. Use conforme a necessidade:

- Vai trabalhar no backend pela primeira vez: `express.md` → `prisma.md` → `tratamento-de-erros.md`
- Vai trabalhar no frontend pela primeira vez: `react.md` → `tanstack-query.md` → `zustand.md` → `axios.md`
- Vai subir o ambiente pela primeira vez: `docker.md` → `pnpm.md`
- Vai abrir seu primeiro PR: `git-flow.md` e depois `../project-standards.md`
- Vai mexer em formulários ou validação: `zod.md`

***

## 🧭 Relação com os documentos canônicos <a id="canonicos"></a>

- Padrões de branch, commit e PR: consulte [`../project-standards.md`](../project-standards.md)
- Contrato de API: consulte [`../api-layer.md`](../api-layer.md)
- Estado global e cache de dados: consulte [`../state-management.md`](../state-management.md)

Quando houver conflito entre este diretório e um documento canônico em `docs/`,
o documento canônico prevalece.

***

## 📐 Regras de contribuição <a id="regras"></a>

- Adicione guias aqui apenas para tecnologias realmente usadas no FatecBot
- O tom deve ser didático e direto, sem tentar substituir a documentação oficial
- Sempre que possível, use exemplos coerentes com a arquitetura do projeto
- Ao adicionar um novo guia, atualize este README e [`../README.md`](../README.md)
- Se um guia entrar em conflito com um documento canônico, ajuste o guia e preserve o link para a referência oficial do projeto

***

> _Próximo documento: [`react.md`](./react.md)_
