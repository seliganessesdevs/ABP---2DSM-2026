# 📚 docs — Documentação Técnica

> Repositório central da documentação técnica do FatecBot.
> Esta pasta concentra visão arquitetural, padrões de engenharia, contrato de API,
> estratégia de testes, escopo do MVP, guias de apoio e documentação das sprints.

***

## 📑 Índice

- [Estrutura](#estrutura)
- [Comece por aqui](#comece-por-aqui)
- [Documentos principais](#documentos-principais)
- [Base de conhecimento](#base-de-conhecimento)
- [Sprints](#sprints)
- [ADRs](#adrs)
- [Regras de contribuição](#regras-de-contribuicao)

***

## 📁 Estrutura <a id="estrutura"></a>

```text
docs/
├── README.md                    # Este índice geral
├── first-steps.md               # Ponto de entrada para quem vai contribuir
├── application-overview.md      # Visão geral, perfis, fluxos e modelo de dados
├── project-structure.md         # Organização do monorepo e princípios de estrutura
├── project-standards.md         # Branches, commits, PRs, linting e nomenclatura
├── api-layer.md                 # Contrato REST com envelopes, filtros e paginação
├── state-management.md          # Estratégia de estado do frontend
├── testing.md                   # Estratégia de testes e mínimos por sprint
├── troubleshooting.md           # Problemas comuns no ambiente de desenvolvimento
├── mvp-scope.md                 # Escopo do MVP do semestre
├── seed-data.md                 # Dados esperados do seed inicial
├── env-matrix.md                # Matriz de variáveis de ambiente
├── assets/
│   └── README.md                # Convenções de assets e diagramas da documentação
├── knowledge-base/
│   ├── README.md
│   ├── axios.md
│   ├── docker.md
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
│   ├── zod.md
│   └── zustand.md
├── sprint1/
│   ├── README.md
│   └── tasks.md
├── sprint2/
│   └── README.md
├── sprint3/
│   └── README.md
└── adr/
    └── README.md
```

***

## 🚦 Comece por aqui <a id="comece-por-aqui"></a>

| Documento | Quando ler | Por que ler agora |
| --------- | ---------- | ----------------- |
| [`first-steps.md`](./first-steps.md) | Primeira entrada no projeto | Centraliza setup, trilhas de leitura e mapa da documentação |
| [`application-overview.md`](./application-overview.md) | Antes de implementar qualquer feature | Resume usuários, fluxos e modelo de dados |
| [`project-structure.md`](./project-structure.md) | Antes de criar arquivos novos | Mostra onde cada responsabilidade deve viver |
| [`project-standards.md`](./project-standards.md) | Antes do primeiro commit | Define branches, commits, PRs e convenções obrigatórias |

***

## 📄 Documentos Principais <a id="documentos-principais"></a>

| Documento | Conteúdo | Leitura recomendada para |
| --------- | -------- | ------------------------ |
| [`first-steps.md`](./first-steps.md) | Entrada rápida no projeto, setup e trilhas de leitura | Qualquer pessoa chegando ao repositório |
| [`application-overview.md`](./application-overview.md) | Perfis de usuário, containers, modelo de dados e fluxos | Entender o sistema como produto |
| [`project-structure.md`](./project-structure.md) | Organização do monorepo, responsabilidades por pasta e princípios de modularização | Criar ou mover arquivos com segurança |
| [`project-standards.md`](./project-standards.md) | Branches, commits, PRs, lint, nomenclatura e regras de env | Contribuir sem quebrar o fluxo do time |
| [`api-layer.md`](./api-layer.md) | Endpoints, envelopes, filtros, paginação e códigos de status | Integrar frontend e backend |
| [`state-management.md`](./state-management.md) | Quando usar TanStack Query e quando usar Zustand | Criar hooks e stores no frontend |
| [`testing.md`](./testing.md) | Estratégia de testes, exemplos e mínimo por sprint | Planejar cobertura antes de desenvolver |
| [`troubleshooting.md`](./troubleshooting.md) | Diagnóstico de problemas frequentes | Resolver setup, Docker, env e auth |
| [`mvp-scope.md`](./mvp-scope.md) | O que entra, o que não entra e como priorizar corte | Planejamento de entrega do semestre |
| [`seed-data.md`](./seed-data.md) | Usuários, árvore inicial e ordem do seed | Implementar ou revisar o seed |
| [`env-matrix.md`](./env-matrix.md) | Variáveis de ambiente por camada e por ambiente | Configurar execução local, Docker e testes |

***

## 🧠 Base de Conhecimento <a id="base-de-conhecimento"></a>

A pasta [`knowledge-base/`](./knowledge-base/) reúne guias introdutórios sobre as
tecnologias usadas no projeto. Eles não substituem os documentos canônicos de
arquitetura, mas ajudam quem está subindo na stack.

| Guia | O que cobre |
| ---- | ----------- |
| [`axios.md`](./knowledge-base/axios.md) | Instância HTTP do frontend, interceptors e tratamento de erros |
| [`docker.md`](./knowledge-base/docker.md) | Containers, Compose, volumes e fluxo de execução local |
| [`express.md`](./knowledge-base/express.md) | Rotas, middlewares e separação controller/service |
| [`git-flow.md`](./knowledge-base/git-flow.md) | Rotina de branch e PR alinhada aos padrões do projeto |
| [`jwt-argon2id.md`](./knowledge-base/jwt-argon2id.md) | Autenticação JWT e hash seguro com Argon2id |
| [`pnpm.md`](./knowledge-base/pnpm.md) | Workspaces, scripts e lockfile do monorepo |
| [`prisma.md`](./knowledge-base/prisma.md) | Schema, queries, paginação, erros e boas práticas |
| [`react.md`](./knowledge-base/react.md) | Fundamentos de React 18 e práticas adotadas no projeto |
| [`REST-HTTP.md`](./knowledge-base/REST-HTTP.md) | Convenções REST, métodos HTTP e envelopes de resposta |
| [`shadcn.md`](./knowledge-base/shadcn.md) | Regras de uso do shadcn/ui e wrappers |
| [`tailwindcss.md`](./knowledge-base/tailwindcss.md) | Estilização utilitária, composição e padrões do projeto |
| [`tanstack-query.md`](./knowledge-base/tanstack-query.md) | Fetch declarativo, cache e invalidação |
| [`tratamento-de-erros.md`](./knowledge-base/tratamento-de-erros.md) | AppError, middleware global e mapeamento de falhas |
| [`typescript.md`](./knowledge-base/typescript.md) | Regras de tipos, inferência e boas práticas |
| [`zod.md`](./knowledge-base/zod.md) | Validação de entrada e geração de tipos |
| [`zustand.md`](./knowledge-base/zustand.md) | Store global de auth e limites de uso |

***

## 🏃 Sprints <a id="sprints"></a>

Cada sprint possui uma subpasta própria. Quando existir `tasks.md`, ele é a
referência operacional daquela sprint.

| Sprint | Foco principal | Documentos |
| ------ | -------------- | ---------- |
| 1 | Arquitetura base ponta a ponta | [`README.md`](./sprint1/README.md) · [`tasks.md`](./sprint1/tasks.md) |
| 2 | Painel Admin, autenticação completa e RBAC | [`README.md`](./sprint2/README.md) · [`tasks.md`](./sprint2/tasks.md) |
| 3 | Painel da secretária, logs, satisfação e estabilização | [`README.md`](./sprint3/README.md) · [`tasks.md`](./sprint3/tasks.md) |

***

## 🏛️ ADRs <a id="adrs"></a>

As decisões arquiteturais relevantes vivem em [`adr/README.md`](./adr/README.md),
seguindo o formato de contexto, decisão e consequências.

> Toda decisão que altere estrutura do monorepo, modelo de dados central,
> autenticação ou contrato entre frontend e backend deve ser registrada como ADR.

***

## 📐 Regras de Contribuição <a id="regras-de-contribuicao"></a>

- Documentos de arquitetura geral ficam na raiz de `docs/`
- Guias didáticos de tecnologia ficam em `docs/knowledge-base/`
- Arquivos de sprint ficam em `docs/sprint*/`
- Assets, diagramas e imagens da documentação ficam em `docs/assets/`
- Todo link entre documentos deve usar caminho relativo
- Em caso de conflito, os documentos canônicos prevalecem sobre a base de conhecimento e READMEs locais
- Ao criar um documento novo, atualize este índice e o rodapé de navegação relacionado

***

> _Próximo documento: [`first-steps.md`](./first-steps.md)_
