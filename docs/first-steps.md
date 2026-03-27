# Primeiros Passos

## O que é o FatecBot

O FatecBot é a aplicação web de autoatendimento da Secretaria Acadêmica da Fatec Jacareí. Para quem vai contribuir com código, o ponto principal é este: o projeto é dividido em monorepo, com frontend e backend separados, contrato de API explícito e documentação como fonte de verdade da implementação.

## Pré-requisitos

- Docker
- Docker Compose
- Git
- Opcional para execução sem Docker: Node.js 20 e pnpm >= 9
- Referência rápida: [`knowledge-base/docker.md`](./knowledge-base/docker.md)

## Subindo o projeto do zero

```bash
git clone <repositorio>
cd fatecbot
cp .env.example .env
docker compose up --build
docker compose exec backend pnpm db:seed
```

URLs esperadas:

- Frontend: `http://localhost:5173`
- Backend API: `http://localhost:3333/api/v1`
- PostgreSQL: `localhost:5432`

Para detalhes operacionais de Docker e Compose, consulte [`knowledge-base/docker.md`](./knowledge-base/docker.md).

## Credenciais de desenvolvimento

> As credenciais abaixo existem após o seed de desenvolvimento.

| Perfil | E-mail | Senha | O que acessa |
| ------ | ------ | ----- | ------------ |
| Admin | `admin@fatec.sp.gov.br` | `admin123` | Painel administrativo e rotas protegidas de admin |
| Secretária | `secretaria@fatec.sp.gov.br` | `secretaria123` | Painel da secretária e gestão de perguntas |
| Aluno (público) | — | — | Chatbot público, envio de pergunta e avaliação de atendimento |

## Trilhas de leitura recomendadas

1. Arquitetura geral — [`application-overview.md`](./application-overview.md)
   Leia agora para entender o sistema como produto, os perfis de usuário e os fluxos centrais.
2. Backend — [`api-layer.md`](./api-layer.md)
   Leia agora para saber quais contratos precisam existir antes de escrever controller, service ou integração.
3. Frontend — [`state-management.md`](./state-management.md)
   Leia agora para evitar duplicar estado entre TanStack Query e Zustand logo no começo.

## Mapa completo da documentação

### Entrada e visão geral

- [`README.md`](./README.md) — índice principal da pasta `docs`
- [`application-overview.md`](./application-overview.md) — visão geral, perfis, fluxos e modelo de dados
- [`project-structure.md`](./project-structure.md) — organização do monorepo e responsabilidades por pasta
- [`project-standards.md`](./project-standards.md) — branches, commits, PRs, linting e convenções

### Implementação

- [`api-layer.md`](./api-layer.md) — contrato de endpoints, envelopes, filtros e paginação
- [`state-management.md`](./state-management.md) — estratégia de estado do frontend
- [`testing.md`](./testing.md) — testes, mínimos por sprint e estratégia ideal
- [`troubleshooting.md`](./troubleshooting.md) — falhas comuns de ambiente e execução

### Planejamento e operação

- [`mvp-scope.md`](./mvp-scope.md) — Must, Should, Won't e critério de corte
- [`seed-data.md`](./seed-data.md) — usuários, árvore inicial e ordem do seed
- [`env-matrix.md`](./env-matrix.md) — variáveis de ambiente por camada
- [`sprint1/README.md`](./sprint1/README.md) — foco e entregáveis da Sprint 1
- [`sprint1/tasks.md`](./sprint1/tasks.md) — backlog detalhado da Sprint 1
- [`sprint2/README.md`](./sprint2/README.md) — foco da Sprint 2
- [`sprint3/README.md`](./sprint3/README.md) — foco da Sprint 3

### Decisões e apoio

- [`adr/README.md`](./adr/README.md) — decisões arquiteturais registradas
- [`knowledge-base/README.md`](./knowledge-base/README.md) — guias didáticos da stack
- [`assets/README.md`](./assets/README.md) — organização dos recursos visuais da documentação

> _Próximo documento: [`application-overview.md`](./application-overview.md)_
