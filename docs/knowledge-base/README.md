# 🧠 knowledge-base — Guias Técnicos

> Guias introdutórios sobre as tecnologias usadas no FatecBot.
> Escritos para membros que estão aprendendo a stack durante o desenvolvimento —
> diretos, práticos e sempre com exemplos do contexto real do projeto.

***

## 📑 Índice

- [Sobre esta pasta](#sobre)
- [Guias disponíveis](#guias)
- [Como usar](#como-usar)
- [Regras de Contribuição](#regras)

***

## 🎯 Sobre esta pasta <a id="sobre"></a>

Os documentos aqui **não são referências completas** das tecnologias — para isso
existe a documentação oficial de cada lib. O objetivo é outro: entregar o
**mínimo necessário para contribuir com o projeto**, com exemplos reais da
arquitetura do FatecBot e alertas sobre os erros mais comuns.

Se você está travado em algo relacionado à stack, comece por aqui antes de
sair procurando no Google.

***

## 📚 Guias disponíveis <a id="guias"></a>

### Backend

| Guia | O que você vai aprender |
| ---- | ----------------------- |
| [`express.md`](./express.md) | Como estruturar rotas, middlewares e a separação entre controller e service |
| [`prisma.md`](./prisma.md) | Como definir o schema, rodar migrations e fazer CRUD com type-safety |
| [`jwt-argon2id.md`](./jwt-argon2id.md) | Como funciona o fluxo de autenticação JWT e por que usamos Argon2id no lugar do bcrypt |
| [`zod.md`](./zod.md) | Como validar request bodies e inferir tipos TypeScript a partir dos schemas |
| [`tratamento-de-erros.md`](./tratamento-de-erros.md) | Como usar `AppError`, o middleware global e mapear erros do Prisma e do Zod |
| [`REST-HTTP.md`](./REST-HTTP.md) | Métodos HTTP, status codes, idempotência e padrões de resposta da API |

### Frontend

| Guia | O que você vai aprender |
| ---- | ----------------------- |
| [`react.md`](./react.md) | Hooks essenciais, props, listas, formulários e os anti-padrões mais comuns |
| [`tanstack-query.md`](./tanstack-query.md) | Por que não usar `useEffect` para fetch e como usar `useQuery` e `useMutation` |
| [`shadcn.md`](./shadcn.md) | Como usar componentes shadcn/ui e a regra de nunca editar `components/ui/` |
| [`tailwindcss.md`](./tailwindcss.md) | Tokens, utilitários de layout, responsividade e padrões de estilização do projeto |

### Geral

| Guia | O que você vai aprender |
| ---- | ----------------------- |
| [`typescript.md`](./typescript.md) | Types, interfaces, utility types, type guards e uso prático no Express e React |
| [`pnpm.md`](./pnpm.md) | Como o pnpm workspaces funciona, comandos essenciais e diferenças do npm |
| [`git-flow.md`](./git-flow.md) | Fluxo de branches, como abrir um PR, comandos do dia a dia e erros comuns |

***

## 🔍 Como usar <a id="como-usar"></a>

Não é necessário ler tudo de uma vez. Use conforme a necessidade:

- Vai trabalhar no backend pela primeira vez? Leia `express.md` → `prisma.md` → `tratamento-de-erros.md`
- Vai trabalhar no frontend pela primeira vez? Leia `react.md` → `tanstack-query.md` → `shadcn.md`
- Vai fazer seu primeiro commit? Leia `git-flow.md` antes
- Não entende por que estamos usando Argon2id? Leia `jwt-argon2id.md`
- Perdido com TypeScript? Leia `typescript.md`

***

## 📐 Regras de Contribuição <a id="regras"></a>

- Novos guias entram aqui apenas se cobrirem uma tecnologia **efetivamente usada no projeto**
- O tom deve ser **didático e direto** — sem reproduzir a documentação oficial, foque no que é relevante para o FatecBot
- Todo guia deve ter pelo menos um exemplo de código real do projeto, não genérico
- Ao adicionar um novo guia, atualize a tabela neste README e a tabela em [`docs/README.md`](../README.md)
- Guias não substituem os padrões definidos em [`project-standards.md`](../project-standards.md) — em caso de conflito, o standards prevalece

***

> _Próximo documento: [`../application-overview.md`](../application-overview.md)_