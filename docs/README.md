# 📚 docs — Documentação Técnica

> Repositório central de toda a documentação técnica do FatecBot.
> Cobre arquitetura, padrões de engenharia, contrato de API, estratégia de testes,
> base de conhecimento para o time e registros de decisão técnica (ADRs).

***

## 📑 Índice

- [Estrutura](#estrutura)
- [Documentos Principais](#principais)
- [Base de Conhecimento](#knowledge-base)
- [Sprints](#sprints)
- [ADRs](#adr)
- [Regras de Contribuição](#regras)

***

## 📁 Estrutura <a id="estrutura"></a>

```
docs/
├── application-overview.md     # Visão arquitetural, perfis, modelo de dados e fluxos
├── project-structure.md        # Organização do monorepo e princípios de estrutura
├── project-standards.md        # Padrões de branch, commit, PR, lint e nomenclatura
├── api-layer.md                # Contrato REST: endpoints, request/response e status
├── state-management.md         # Estratégia de estado (TanStack Query + Zustand)
├── testing.md                  # Pirâmide de testes, ferramentas e exemplos por camada
│
├── knowledge-base/             # Guias técnicos introdutórios para o time
│   ├── express.md
│   ├── git-flow.md
│   ├── jwt-argon2id.md
│   ├── pnpm.md
│   ├── prisma.md
│   ├── react.md
│   ├── REST-HTTP.md
│   ├── shadcn.md
│   ├── tailwindcss.md
│   ├── tanstack-query.md
│   ├── tratamento-de-erros.md
│   ├── typescript.md
│   └── zod.md
│
├── sprint1/                    # Documentação da Sprint 1
│   ├── README.md               # Objetivos, entregáveis e critérios de aceite
│   └── tasks.md                # Tasks detalhadas com responsáveis e status
│
├── sprint2/                    # Documentação da Sprint 2
│   ├── README.md
│   └── tasks.md
│
├── sprint3/                    # Documentação da Sprint 3
│   ├── README.md
│   └── tasks.md
│
├── adr/                        # Architecture Decision Records
│   └── README.md               # Índice dos ADRs e template
│
└── assets/                     # Imagens, diagramas e arquivos visuais
    └── fatecbot-logo.png
```

***

## 📄 Documentos Principais <a id="principais"></a>

| Documento | Conteúdo | Leitura recomendada para |
| --------- | -------- | ------------------------ |
| [`application-overview.md`](./application-overview.md) | Perfis de usuário, containers, modelo ER e fluxos principais | Qualquer membro antes de começar |
| [`project-structure.md`](./project-structure.md) | Organização do monorepo, frontend e backend | Antes de criar qualquer arquivo |
| [`project-standards.md`](./project-standards.md) | Branches, commits, PRs, lint e nomenclatura | Antes do primeiro commit |
| [`api-layer.md`](./api-layer.md) | Todos os endpoints REST com exemplos de request/response | Frontend ao integrar com a API |
| [`state-management.md`](./state-management.md) | Quando usar TanStack Query vs Zustand e padrões de cache | Frontend ao criar hooks de dados |
| [`testing.md`](./testing.md) | Pirâmide de testes, Vitest, Testing Library e exemplos | Ao escrever qualquer teste |

***

## 🧠 Base de Conhecimento <a id="knowledge-base"></a>

A pasta [`knowledge-base/`](./knowledge-base/) reúne guias introdutórios sobre as
tecnologias usadas no projeto. São documentos **didáticos e práticos**, escritos
para membros que estão aprendendo a stack durante o desenvolvimento.

| Guia | O que cobre |
| ---- | ----------- |
| [`express.md`](./knowledge-base/express.md) | Rotas, middlewares e separação controller/service |
| [`git-flow.md`](./knowledge-base/git-flow.md) | Fluxo de branches, PRs e comandos do dia a dia |
| [`jwt-argon2id.md`](./knowledge-base/jwt-argon2id.md) | Autenticação JWT e hash seguro de senhas com Argon2id |
| [`pnpm.md`](./knowledge-base/pnpm.md) | Gerenciamento de dependências e workspaces |
| [`prisma.md`](./knowledge-base/prisma.md) | Schema, migrations, CRUD e tratamento de erros |
| [`react.md`](./knowledge-base/react.md) | Hooks, props, listas, formulários e anti-padrões |
| [`REST-HTTP.md`](./knowledge-base/REST-HTTP.md) | Métodos, status codes, idempotência e padrões de resposta |
| [`shadcn.md`](./knowledge-base/shadcn.md) | Uso de componentes e regra de não editar `components/ui/` |
| [`tailwindcss.md`](./knowledge-base/tailwindcss.md) | Tokens, layout, responsividade e padrões de componente |
| [`tanstack-query.md`](./knowledge-base/tanstack-query.md) | useQuery, useMutation, queryKey e invalidação de cache |
| [`tratamento-de-erros.md`](./knowledge-base/tratamento-de-erros.md) | AppError, middleware global e mapeamento de erros |
| [`typescript.md`](./knowledge-base/typescript.md) | Types, interfaces, utility types e guards |
| [`zod.md`](./knowledge-base/zod.md) | Schemas, parse/safeParse, inferência e boas práticas |

***

## 🏃 Sprints <a id="sprints"></a>

Cada sprint possui uma subpasta com dois arquivos:

- **`README.md`** — objetivos da sprint, entregáveis esperados e critérios de aceite
- **`tasks.md`** — tasks detalhadas com responsáveis, estimativas e status

| Sprint | Foco principal | Pasta |
| ------ | -------------- | ----- |
| 1 | Estrutura base, autenticação, navegação do chatbot | [`sprint1/`](./sprint1/) |
| 2 | Painel Admin (CRUD nós + documentos), RBAC | [`sprint2/`](./sprint2/) |
| 3 | Painel Secretária, logs, satisfação, ajustes finais | [`sprint3/`](./sprint3/) |

***

## 🏛️ ADRs — Architecture Decision Records <a id="adr"></a>

A pasta [`adr/`](./adr/) registra as decisões arquiteturais relevantes tomadas
durante o projeto. Cada ADR documenta o **contexto**, a **decisão** e as
**consequências** de uma escolha técnica significativa.

> ⚠️ Toda decisão que afete a estrutura do projeto, a escolha de biblioteca
> ou o contrato entre frontend e backend **deve ser registrada como um ADR**
> antes de ser implementada.

***

## 📐 Regras de Contribuição <a id="regras"></a>

- Documentos novos que cobrem a arquitetura geral entram na raiz de `docs/`
- Guias introdutórios de tecnologia entram em `knowledge-base/`
- Imagens e diagramas entram em `assets/` — **nunca** referencie imagens por URL externa nos documentos
- Todo link entre documentos usa **caminho relativo** — nunca URL absoluta
- Ao criar um novo arquivo referenciado por outro documento, atualize a tabela do documento que o referencia
- ADRs seguem o template em [`adr/README.md`](./adr/README.md) e são numerados sequencialmente

***

> _Próximo documento: [`application-overview.md`](./application-overview.md)_