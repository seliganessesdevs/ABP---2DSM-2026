<p align="center">
  <img src="docs/assets/fatecbot-logo.png" alt="FatecBot" width="180px">
  <h2 align="center">FatecBot</h2>
  <p align="center">Autoatendimento da Secretaria Acadêmica — Fatec Jacareí</p>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/status-em%20desenvolvimento-yellow?style=for-the-badge" />
  <img src="https://img.shields.io/badge/node-%3E%3D20.x-brightgreen?style=for-the-badge&logo=node.js&logoColor=white" />
  <img src="https://img.shields.io/badge/React-18-61DAFB?style=for-the-badge&logo=react&logoColor=black" />
  <img src="https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white" />
  <img src="https://img.shields.io/badge/Docker-required-2496ED?style=for-the-badge&logo=docker&logoColor=white" />
  <img src="https://img.shields.io/badge/license-MIT-blue?style=for-the-badge" />
</p>

---

<p align="center">
  | <a href="#desafio">Desafio</a> |
  <a href="#solucao">Solução</a> |
  <a href="#requisitos">Requisitos</a> |
  <a href="#user-stories">User Stories</a> |
  <a href="#backlog">Backlog</a> |
  <a href="#dor">DoR</a> |
  <a href="#dod">DoD</a> |
  <a href="#tecnologias">Tecnologias</a> |
  <a href="#primeiros-passos">Instalação</a> |
  <a href="#env">Variáveis de Ambiente</a> |
  <a href="#estrutura">Estrutura</a> |
  <a href="#docs">Documentação</a> |
  <a href="#equipe">Equipe</a> |
</p>

---

> **Status do Projeto:** 🟡 Em Desenvolvimento — Kick-off: 27/03/2026
>
> [📄 Pasta de Documentação](./docs)
>
> [🚀 Primeiros Passos](./docs/first-steps.md)
>
> 🎓 ABP 2026-1 · 2º Semestre DSM · Fatec Jacareí

---

## 🎯 Desafio <a id="desafio"></a>

A Secretaria Acadêmica da Fatec Jacareí recebe recorrentemente dúvidas de alunos e de
interessados externos, especialmente relacionadas a:

- Horários de aulas
- Datas do calendário acadêmico
- Regras de dispensa e aproveitamento de disciplinas
- Estágio supervisionado
- Estrutura curricular dos cursos (AACC, TG/TCC, obrigatoriedade e carga horária)

Esse cenário gera **sobrecarga operacional**, aumento no tempo de resposta e possíveis
inconsistências nas orientações, principalmente em períodos críticos como rematrícula,
ajustes de matrícula, trancamentos e exames finais.

---

## 💡 Solução <a id="solucao"></a>

O **FatecBot** é uma aplicação web de autoatendimento baseada em chatbot conversacional,
capaz de conduzir o usuário por uma árvore de navegação estruturada (menus e perguntas
guiadas) e fornecer respostas objetivas, padronizadas e verificáveis.

Ao final de cada atendimento, o sistema apresenta:

- Uma **resposta resumida e clara**
- Quando aplicável, um **trecho de evidência extraído de documentos oficiais** (Regulamento Geral
  das Fatecs, Manual de Estágio, Calendário Acadêmico, PPCs)

Essa abordagem garante rastreabilidade, confiabilidade da informação e redução de ambiguidades.

---

## 📋 Requisitos <a id="requisitos"></a>

### 🧩 Funcionais

| Código   | Descrição                                                                                    |
| -------- | -------------------------------------------------------------------------------------------- |
| **RF01** | **Navegação conversacional** — menus e submenus hierárquicos em modelo chatbot               |
| **RF02** | **Repositório de conhecimento** — nós de navegação, Q&A, documentos, chunks e metadados      |
| **RF03** | **Perfis de usuário** — Aluno (público), Secretária Acadêmica e Administrador (autenticados) |
| **RF04** | **Gestão de conteúdo (Admin)** — CRUD de nós, documentos, usuários e logs                    |
| **RF05** | **Encaminhamento de pergunta** — envio de dúvida com e-mail institucional para resposta      |
| **RF06** | **Gestão de perguntas (Secretária)** — listagem e atualização de status das perguntas        |
| **RF07** | **Avaliação de satisfação** — registro de "Gostei" / "Não gostei" ao fim do atendimento      |
| **RF08** | **Registro de logs** — fluxo de navegação, perguntas enviadas, satisfação, data e hora       |
| **RF09** | **Autenticação** — login/senha para Secretária e Administrador; Aluno permanece público      |
| **RF10** | **Autorização por papel (RBAC)** — controle de acesso granular por role no backend           |
| **RF11** | **Proteção de rotas** — middleware de autenticação com validação de JWT obrigatória          |

### ⚙️ Não Funcionais

| Código    | Descrição                                                                                                                         |
| --------- | --------------------------------------------------------------------------------------------------------------------------------- |
| **RNF01** | Interface simples, clara e responsiva (mobile e desktop)                                                                          |
| **RNF02** | Tempo de resposta adequado ao uso interativo                                                                                      |
| **RNF03** | Documentação técnica: visão geral, modelo de dados, arquitetura, execução, rotas da API                                           |
| **RNF04** | Modelagem UML: Casos de Uso, Classes, Sequência e Componentes                                                                     |
| **RNF05** | Containerização com Docker (3 containers: PostgreSQL, Backend, Frontend)                                                          |
| **RNF06** | Orquestração via Docker Compose com inicialização em comando único                                                                |
| **RNF07** | README principal + READMEs específicos por pasta principal                                                                        |
| **RNF08** | Autenticação JWT com `id`, `role` e `exp` via `Authorization: Bearer`                                                             |
| **RNF09** | Senhas com Argon2id (memory-hard com 64 MiB por hash), segredos em variáveis de ambiente, sem exposição de dados sensíveis na API |

---

## 📖 User Stories <a id="user-stories"></a>

| Requisito | User Story                                                                                                                                                     |
| --------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **RF01**  | Como **aluno**, quero navegar por menus e submenus do chatbot, para encontrar a informação que preciso sem contato direto com a secretaria.                    |
| **RF02**  | Como **administrador**, quero manter um repositório de conhecimento estruturado, para que as respostas do bot sejam rastreáveis até documentos oficiais.       |
| **RF03**  | Como **visitante**, quero usar o chatbot sem me cadastrar, para tirar dúvidas de forma ágil e sem fricção.                                                     |
| **RF04**  | Como **administrador**, quero criar, editar e excluir nós de navegação e documentos, para manter o conteúdo do bot sempre atualizado.                          |
| **RF05**  | Como **aluno**, quero poder enviar uma dúvida diretamente à secretaria ao final do atendimento, para receber suporte em casos não cobertos pelo bot.           |
| **RF06**  | Como **secretária acadêmica**, quero visualizar e atualizar o status das perguntas recebidas, para gerenciar os atendimentos pendentes com eficiência.         |
| **RF07**  | Como **aluno**, quero avaliar se o atendimento foi satisfatório, para contribuir com a melhoria contínua do sistema.                                           |
| **RF08**  | Como **administrador**, quero visualizar logs completos de atendimento com data e hora, para auditoria e análise de uso.                                       |
| **RF09**  | Como **secretária acadêmica**, quero fazer login com e-mail e senha, para acessar o painel de gestão de perguntas com segurança.                               |
| **RF10**  | Como **sistema**, devo garantir que cada role acesse apenas as funcionalidades permitidas, para evitar acessos não autorizados.                                |
| **RF11**  | Como **desenvolvedor**, quero que todas as rotas administrativas estejam protegidas por middleware JWT, para garantir que nenhuma rota sensível fique exposta. |

---

## 📋 Backlog do Produto <a id="backlog"></a>

### Sprints

| Sprint | Objetivos                                           | Documentação                              | Período   | Status       |
| ------ | --------------------------------------------------- | ----------------------------------------- | --------- | ------------ |
| 1      | Estrutura base, autenticação, navegação do chatbot  | [Sprint 1 Docs](./docs/sprint1/README.md) | A definir | 🔵 Planejado |
| 2      | Painel Admin (CRUD nós + documentos), RBAC          | [Sprint 2 Docs](./docs/sprint2/README.md) | A definir | 🔵 Planejado |
| 3      | Painel Secretária, logs, satisfação, ajustes finais | [Sprint 3 Docs](./docs/sprint3/README.md) | A definir | 🔵 Planejado |

> 📝 Tasks detalhadas por sprint:
> [Sprint 1 Tasks](./docs/sprint1/tasks.md) · Sprint 2 Tasks ⚠️ a criar · Sprint 3 Tasks ⚠️ a criar

---

## ✅ DoR — Definition of Ready <a id="dor"></a>

Um item do backlog está **pronto para entrar na sprint** quando:

- Requisito funcional claramente descrito e vinculado a uma User Story
- Critérios de aceite definidos e revisados pelo PO
- Wireframe ou protótipo no Figma aprovado (para itens de UI)
- Dependências técnicas identificadas e sem bloqueios
- Estimativa de esforço realizada pela equipe

---

## 🏁 DoD — Definition of Done <a id="dod"></a>

Um item está **concluído** quando:

- Código implementado, revisado e aprovado em PR (mínimo 1 aprovação)
- Testes unitários escritos e passando (Vitest)
- CI/CD passando sem erros (lint, build, testes)
- Funcionalidade validada no ambiente Docker (`docker compose up`)
- Documentação técnica atualizada (README, Storybook ou TSDoc se aplicável)
- Demonstrado e aceito pelo PO na Sprint Review

---

## 💻 Tecnologias <a id="tecnologias"></a>

<p align="center">
  <a href="https://react.dev/"><img src="https://img.shields.io/badge/React-18-61DAFB?style=for-the-badge&logo=react&logoColor=black" /></a>
  <a href="https://www.typescriptlang.org/"><img src="https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white" /></a>
  <a href="https://vitejs.dev/"><img src="https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white" /></a>
  <a href="https://tailwindcss.com/"><img src="https://img.shields.io/badge/Tailwind_CSS-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white" /></a>
  <a href="https://ui.shadcn.com/"><img src="https://img.shields.io/badge/shadcn/ui-000000?style=for-the-badge&logo=shadcnui&logoColor=white" /></a>
  <br/>
  <a href="https://nodejs.org/"><img src="https://img.shields.io/badge/Node.js-20-5FA04E?style=for-the-badge&logo=node.js&logoColor=white" /></a>
  <a href="https://expressjs.com/"><img src="https://img.shields.io/badge/Express-000000?style=for-the-badge&logo=express&logoColor=white" /></a>
  <a href="https://www.prisma.io/"><img src="https://img.shields.io/badge/Prisma-2D3748?style=for-the-badge&logo=prisma&logoColor=white" /></a>
  <a href="https://www.postgresql.org/"><img src="https://img.shields.io/badge/PostgreSQL-4169E1?style=for-the-badge&logo=postgresql&logoColor=white" /></a>
  <br/>
  <a href="https://jwt.io/"><img src="https://img.shields.io/badge/JWT-000000?style=for-the-badge&logo=jsonwebtokens&logoColor=white" /></a>
  <a href="https://www.docker.com/"><img src="https://img.shields.io/badge/Docker-2496ED?style=for-the-badge&logo=docker&logoColor=white" /></a>
  <a href="https://vitest.dev/"><img src="https://img.shields.io/badge/Vitest-6E9F18?style=for-the-badge&logo=vitest&logoColor=white" /></a>
  <a href="https://github.com/"><img src="https://img.shields.io/badge/GitHub-181717?style=for-the-badge&logo=github&logoColor=white" /></a>
  <a href="https://code.visualstudio.com/"><img src="https://img.shields.io/badge/VS_Code-007ACC?style=for-the-badge&logo=visual-studio-code&logoColor=white" /></a>
  <a href="https://www.figma.com/"><img src="https://img.shields.io/badge/Figma-F24E1E?style=for-the-badge&logo=figma&logoColor=white" /></a>
</p>

                        | Camada             | Tecnologia                          | Justificativa                              |
                        |--------------------|-------------------------------------|--------------------------------------------|
                        | **Frontend**       | React 18 + TypeScript               | Obrigatório (RP01)                         |
                        | **Build Tool**     | Vite                                | HMR rápido, nativo com React + TS          |
                        | **Estilização**    | Tailwind CSS + shadcn/ui            | Componentização acessível e responsiva     |
                        | **Backend**        | Node.js 20 + TypeScript + Express   | Obrigatório (RP02)                         |
                        | **ORM**            | Prisma                              | DDL/DML explícitos com type-safety         |
                        | **Banco de Dados** | PostgreSQL                          | Obrigatório (RP03)                         |
                        | **Autenticação**   | JWT + Argon2id                      | Obrigatório (RP06, RNF08, RNF09); Argon2id é memory-hard (64 MiB/hash), vencedor da Password Hashing Competition (2015) e superior ao bcrypt contra GPU/ASIC |
                        | **Containers**     | Docker + Docker Compose             | Obrigatório (RP04, RNF05, RNF06)           |
                        | **Testes**         | Vitest + Testing Library            | Cobertura unitária e de componentes        |
                        | **Linting**        | ESLint + Prettier                   | Padronização de código                     |



## ⚡ Primeiros Passos <a id="primeiros-passos"></a>

### Pré-requisitos

| Software       | Versão mínima | Link                             |
| -------------- | :-----------: | -------------------------------- |
| Docker         |     24.x      | https://www.docker.com/          |
| Docker Compose |      2.x      | https://docs.docker.com/compose/ |
| Git            |   qualquer    | https://git-scm.com/             |

### Instalação e execução

```bash
# 1. Clone o repositório
git clone https://github.com/seu-org/fatecbot.git
cd fatecbot

# 2. Configure as variáveis de ambiente
cp .env.example .env
# Edite o .env com os valores do seu ambiente

# 3. Suba todos os containers com um único comando
docker compose up --build
```

A aplicação estará disponível em:

| Serviço     | URL                   |
| ----------- | --------------------- |
| Frontend    | http://localhost:5173 |
| Backend API | http://localhost:3333 |
| PostgreSQL  | localhost:5432        |

### Execução sem Docker (desenvolvimento local)

> Requer Node.js >= 20.x e pnpm >= 9.x instalados.

```bash
pnpm install                         # instala dependências do monorepo

# Frontend
pnpm --filter frontend dev

# Backend
pnpm --filter backend dev

# Banco de dados
pnpm --filter backend db:migrate     # executa migrations Prisma
pnpm --filter backend db:seed        # popula dados iniciais do chatbot

# Testes
pnpm test
pnpm test:watch
```

---

## 🔐 Variáveis de Ambiente <a id="env"></a>

Copie `.env.example` para `.env` e preencha os valores:

```bash
# ── Banco de Dados ──────────────────────────────────────
DATABASE_URL=postgresql://postgres:postgres@db:5432/fatecbot

# ── JWT ─────────────────────────────────────────────────
JWT_SECRET=troque_por_um_segredo_forte_aqui
JWT_EXPIRES_IN=8h

# ── Backend ─────────────────────────────────────────────
PORT=3333
NODE_ENV=development

# ── Frontend ────────────────────────────────────────────
VITE_API_URL=http://localhost:3333
VITE_ENABLE_DEVTOOLS=true
```

> ⚠️ **Nunca commite o arquivo `.env`**. Ele já está no `.gitignore`.

---

## 📁 Estrutura do Projeto <a id="estrutura"></a>

```
fatecbot/
├── apps/
│   ├── frontend/          # React + TypeScript (Vite)
│   │   └── README.md      # README específico do frontend
│   └── backend/           # Node.js + TypeScript (Express + Prisma)
│       └── README.md      # README específico do backend
├── docs/                  # Documentação técnica completa
│   ├── application-overview.md
│   ├── first-steps.md
│   ├── project-structure.md
│   ├── project-standards.md
│   ├── api-layer.md
│   ├── state-management.md
│   ├── testing.md
│   ├── troubleshooting.md
│   ├── mvp-scope.md
│   ├── seed-data.md
│   ├── env-matrix.md
│   ├── sprint1/
│   ├── sprint2/
│   ├── sprint3/
│   └── adr/               # Architecture Decision Records
├── docker-compose.yml
├── .env.example
└── pnpm-workspace.yaml
```

> Documentação detalhada de cada pasta em [`/docs/project-structure.md`](./docs/project-structure.md).

---

## 📚 Documentação Técnica <a id="docs"></a>

| Documento                                                        | Conteúdo                                     |
| ---------------------------------------------------------------- | -------------------------------------------- |
| [`docs/first-steps.md`](./docs/first-steps.md)                   | Setup inicial, trilhas de leitura e mapa da documentação |
| [`docs/application-overview.md`](./docs/application-overview.md) | Modelo de dados, fluxos, perfis e data model |
| [`docs/project-structure.md`](./docs/project-structure.md)       | Estrutura de pastas comentada                |
| [`docs/project-standards.md`](./docs/project-standards.md)       | Convenções de commit, nomenclatura e linting |
| [`docs/api-layer.md`](./docs/api-layer.md)                       | Endpoints, exemplos de request/response      |
| [`docs/state-management.md`](./docs/state-management.md)         | Estratégia de estado com TanStack Query e Zustand |
| [`docs/testing.md`](./docs/testing.md)                           | Estratégia de testes e exemplos por camada   |
| [`docs/mvp-scope.md`](./docs/mvp-scope.md)                       | Escopo do MVP, prioridades e critério de corte |
| [`docs/seed-data.md`](./docs/seed-data.md)                       | Usuários, árvore inicial e dependências do seed |
| [`docs/env-matrix.md`](./docs/env-matrix.md)                     | Matriz de variáveis de ambiente por camada |
| [`apps/frontend/README.md`](./apps/frontend/README.md)           | README específico do frontend                |
| [`apps/backend/README.md`](./apps/backend/README.md)             | README específico do backend                 |

---

## 👥 Equipe <a id="equipe"></a>

<div align="center">
  <table>
    <tr>
      <th>Membro</th>
      <th>Função</th>
      <th>GitHub</th>
      <th>LinkedIn</th>
    </tr>
    <tr>
      <td>Gianluca Lourenço</td>
      <td>Product Owner</td>
      <td><a href="https://github.com/GianlucaAlves"><img src="https://img.shields.io/badge/GitHub-100000?style=for-the-badge&logo=github&logoColor=white"></a></td>
      <td><a href="https://www.linkedin.com/in/gianluca-alves"><img src="https://img.shields.io/badge/LinkedIn-0077B5?style=for-the-badge&logo=linkedin&logoColor=white"></a></td>
    </tr>
    <tr>
      <td>Lucas Cobra</td>
      <td>Scrum Master</td>
      <td><a href="https://github.com/LucasCobraFatec"><img src="https://img.shields.io/badge/GitHub-100000?style=for-the-badge&logo=github&logoColor=white"></a></td>
      <td><a href="https://www.linkedin.com/in/lucascobra/"><img src="https://img.shields.io/badge/LinkedIn-0077B5?style=for-the-badge&logo=linkedin&logoColor=white"></a></td>
    </tr>
    <tr>
      <td>Allan Ramos</td>
      <td>Desenvolvedor</td>
      <td><a href="https://github.com/Allan-ramos122"><img src="https://img.shields.io/badge/GitHub-100000?style=for-the-badge&logo=github&logoColor=white"></a></td>
      <td><a href="https://www.linkedin.com/"><img src="https://img.shields.io/badge/LinkedIn-0077B5?style=for-the-badge&logo=linkedin&logoColor=white"></a></td>
    </tr>
    <tr>
      <td>Guilherme Henrique</td>
      <td>Desenvolvedor</td>
      <td><a href="https://github.com/guioliv3"><img src="https://img.shields.io/badge/GitHub-100000?style=for-the-badge&logo=github&logoColor=white"></a></td>
      <td><a href="https://www.linkedin.com/in/guilherme-henrique-de-oliveira-97076535b"><img src="https://img.shields.io/badge/LinkedIn-0077B5?style=for-the-badge&logo=linkedin&logoColor=white"></a></td>
    </tr>
    <tr>
      <td>Victor Coutinho</td>
      <td>Desenvolvedor</td>
      <td><a href="https://github.com/Vitaixs"><img src="https://img.shields.io/badge/GitHub-100000?style=for-the-badge&logo=github&logoColor=white"></a></td>
      <td><a href="https://www.linkedin.com/"><img src="https://img.shields.io/badge/LinkedIn-0077B5?style=for-the-badge&logo=linkedin&logoColor=white"></a></td>
    </tr>
    <tr>
      <td>Lucas Cecon</td>
      <td>Desenvolvedor</td>
      <td><a href="https://github.com/lucas-cecon"><img src="https://img.shields.io/badge/GitHub-100000?style=for-the-badge&logo=github&logoColor=white"></a></td>
      <td><a href="https://www.linkedin.com/"><img src="https://img.shields.io/badge/LinkedIn-0077B5?style=for-the-badge&logo=linkedin&logoColor=white"></a></td>
    </tr>
  </table>
</div>

**Focal Point:** Prof. André Olimpio

---

> _Projeto acadêmico desenvolvido no âmbito do ABP 2026-1 · Fatec Jacareí · 2º DSM_

> _Próximo documento: [`docs/README.md`](./docs/README.md)_
