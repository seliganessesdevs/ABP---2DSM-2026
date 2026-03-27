# Sprint 1 — Arquitetura Base

> Sprint dedicada a validar a espinha dorsal técnica do FatecBot de ponta a ponta:
> containers sobem, banco inicializa, seed popula dados, backend responde e o
> frontend consome o menu inicial do chatbot.

***

## Objetivo

Comprovar que a arquitetura base do projeto funciona em fluxo completo antes da
entrada das features mais complexas de autenticação, RBAC e painéis internos.

***

## Entregáveis esperados

- `docker compose up --build` sobe os serviços sem erro
- Banco com schema inicial aplicado
- Seed com usuários de desenvolvimento e nós iniciais do chatbot
- Endpoint `GET /api/v1/health` respondendo
- Endpoint `GET /api/v1/nodes/root` respondendo com o nó raiz e filhos
- Frontend exibindo o menu inicial carregado da API

***

## Fora do escopo desta sprint

- Login completo
- Proteção de rotas
- CRUD administrativo
- Fluxo completo da secretária

Esses itens entram a partir da Sprint 2.

***

## Documentos desta sprint

- [`tasks.md`](./tasks.md) — backlog detalhado da sprint

***

> _Próximo documento: [`tasks.md`](./tasks.md)_
