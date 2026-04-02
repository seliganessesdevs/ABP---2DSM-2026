# FatecBot — Sprint 1 · Tabela de Tasks

> **Sprint 1 — Fundação, Autenticação e Chatbot Público**
> Período: A definir · Status: 🔵 Planejado
>
> **Objetivo:** sistema funcional do ponto de vista do aluno — chatbot navegável, envio de pergunta e infraestrutura base autenticada.

***

## Princípios de Leitura

| Símbolo | Significado |
|---------|-------------|
| `[BE]` | Task de backend (`apps/backend/`) |
| `[FE]` | Task de frontend (`apps/frontend/`) |
| `[INFRA]` | Task de infraestrutura (raiz do monorepo) |
| `[FIGMA]` | Task de design de interface |
| `[UML]` | Task de modelagem UML com Astah (`docs/uml/`) |
| `[DB]` | Task de modelagem de banco de dados com dbdesigner (`docs/database/`) |

> Este documento funciona como visão operacional da sprint.
> Para o detalhamento completo de contratos de cada task, use `docs/fatecbot-backlog.md` como fonte canônica.

***

## Legenda de Requisitos

### Funcionais

| Código | Descrição resumida |
|--------|-------------------|
| RF01 | Navegação conversacional — menus e submenus hierárquicos |
| RF02 | Repositório de conhecimento — nós, documentos, chunks e metadados |
| RF03 | Perfis de usuário — Aluno (público), Secretária e Administrador |
| RF05 | Encaminhamento de pergunta — texto + e-mail institucional |
| RF07 | Avaliação de satisfação — "Gostei" / "Não gostei" ao fim do atendimento |
| RF08 | Registro de logs — navigationPath, satisfação, timestamps |
| RF09 | Autenticação — login/senha para Secretária e Administrador |
| RF10 | Autorização por papel (RBAC) — controle de acesso no backend |
| RF11 | Proteção de rotas — middleware JWT obrigatório em rotas sensíveis |

### Não Funcionais

| Código | Descrição resumida |
|--------|-------------------|
| RNF01 | Interface simples, clara e responsiva (mobile e desktop) |
| RNF02 | Tempo de resposta adequado ao uso interativo |
| RNF05 | Containerização com Docker — 3 containers |
| RNF06 | Orquestração via Docker Compose com comando único |
| RNF08 | Autenticação JWT com `sub`, `role` e `exp` via `Authorization: Bearer` |
| RNF09 | Senhas com Argon2id; segredos em variáveis de ambiente; sem exposição de dados sensíveis |

> RF04 e RF06 (painel admin/secretária) e RNF03/RNF04/RNF07 não são cobertos na Sprint 1.
> RF08 é coberto na Sprint 1 para rastreamento de sessões e satisfação no fluxo público do chatbot.

***

## 📖 User Stories — Sprint 1

> Cada User Story segue o formato padrão do Scrum:
> **Como** [tipo de usuário] · **Quero** [ação ou funcionalidade] · **Para que** [benefício entregue]
>
> Os Critérios de Aceitação detalham as condições que a funcionalidade deve atender para ser considerada concluída,
> escritos na perspectiva do usuário, descrevendo o comportamento esperado do sistema de forma clara e verificável na Sprint Review.

***

### US-01 · RF01 — Navegação Conversacional

> **Tasks:** TASK-009 · TASK-031 · TASK-032 · TASK-033 · TASK-034 · TASK-035 · TASK-036 · TASK-037 · TASK-040

**Como** aluno
**Quero** navegar por menus e submenus do chatbot
**Para que** eu encontre a informação que preciso sem precisar contatar a secretaria diretamente

**Critérios de Aceitação:**

- O aluno deve ver as opções de atendimento disponíveis logo ao abrir o chatbot.
- Ao clicar em uma opção, o chatbot deve exibir o próximo nível de informações ou a resposta correspondente.
- Quando houver mais opções para escolher, o chatbot exibe botões de navegação; quando houver uma resposta final, ela é apresentada como texto.
- O sistema deve registrar todos os tópicos que o aluno visitou durante a conversa.
- A interface deve funcionar corretamente tanto em celular quanto em computador.

***

### US-02 · RF02 — Repositório de Conhecimento

> **Tasks:** TASK-004 · TASK-031 · TASK-032 · TASK-038 · TASK-040

**Como** administrador
**Quero** que as respostas do chatbot sejam baseadas em documentos oficiais com trechos rastreáveis
**Para que** os alunos recebam informações verificáveis e a secretaria tenha credibilidade nas respostas

**Critérios de Aceitação:**

- As respostas do chatbot devem indicar de qual documento oficial a informação foi extraída, com o nome do documento, página e seção.
- O trecho do documento deve ser exibido em destaque junto à resposta, para que o aluno possa verificar a fonte.
- Quando uma resposta não tiver documento associado, o chatbot ainda exibe a informação disponível normalmente.
- O sistema deve armazenar os documentos e seus trechos de forma organizada para que possam ser consultados pelo chatbot.

***

### US-03 · RF03 — Acesso Público sem Cadastro

> **Tasks:** TASK-013 · TASK-015 · TASK-024 · TASK-028 · TASK-030

**Como** visitante
**Quero** acessar o chatbot sem precisar criar uma conta
**Para que** eu tire dúvidas de forma ágil e sem fricção

**Critérios de Aceitação:**

- O visitante deve conseguir acessar e usar o chatbot sem precisar criar conta ou fazer login.
- Ao tentar acessar as áreas restritas (painel admin ou secretária) sem estar autenticado, o sistema deve redirecionar para a tela de login.
- Um usuário autenticado como secretária não deve conseguir acessar as funcionalidades exclusivas do administrador.
- Após o login bem-sucedido, o sistema deve direcionar cada usuário automaticamente para o painel correspondente ao seu perfil.

***

### US-04 · RF05 — Encaminhamento de Pergunta

> **Tasks:** TASK-041 · TASK-042 · TASK-043 · TASK-044

**Como** aluno
**Quero** enviar uma dúvida diretamente à secretaria ao final do atendimento
**Para que** eu receba suporte nos casos em que o bot não cobriu o que eu precisava

**Critérios de Aceitação:**

- O aluno deve poder enviar uma dúvida preenchendo nome, texto da pergunta, e-mail institucional e, opcionalmente, um anexo (PDF/JPG/PNG · máx. 5 MB).
- Se o aluno tentar enviar sem preencher o texto ou com um e-mail inválido, o sistema deve exibir uma mensagem de erro indicando o problema.
- Após o envio bem-sucedido, o aluno deve ver uma confirmação de que a mensagem foi recebida pela secretaria.
- A pergunta enviada fica automaticamente vinculada à sessão de atendimento que a originou, para facilitar o contexto para a secretaria.

***

### US-05 · RF07 — Avaliação de Satisfação

> **Tasks:** TASK-031 · TASK-032 · TASK-033 · TASK-036 · TASK-039

**Como** aluno
**Quero** avaliar se o atendimento foi satisfatório ao final da conversa
**Para que** o sistema melhore com base no meu feedback

**Critérios de Aceitação:**

- Ao receber uma resposta final do chatbot, o aluno deve ver os botões "👍 Gostei" e "👎 Não gostei" para avaliar o atendimento.
- Após clicar em uma das opções, o sistema deve exibir uma mensagem de agradecimento pelo feedback.
- O aluno só deve conseguir avaliar uma vez por atendimento — após votar, os botões ficam desabilitados.
- A avaliação deve ser registrada junto ao histórico da sessão para análise posterior.

***

### US-06 · RF08 — Registro de Logs de Sessão

> **Tasks:** TASK-004 · TASK-031 · TASK-032 · TASK-033 · TASK-036 · TASK-039 · TASK-041 · TASK-042

**Como** administrador
**Quero** que o sistema registre o fluxo de navegação, a satisfação e os timestamps de cada sessão
**Para que** eu possa auditar o uso, identificar pontos de melhoria e analisar os temas mais consultados

**Critérios de Aceitação:**

- O sistema deve registrar automaticamente quais tópicos o aluno navegou, quando iniciou e quando finalizou o atendimento.
- Quando o aluno avalia a conversa, o horário de encerramento deve ser registrado automaticamente.
- Se o aluno enviar uma dúvida ao final do atendimento, a pergunta deve ficar vinculada à sessão correspondente.
- Toda pergunta recebida deve ser registrada como pendente de resposta, até que a secretaria a marque como respondida.

***

### US-07 · RF09 — Autenticação por Login e Senha

> **Tasks:** TASK-006 · TASK-020 · TASK-021 · TASK-022 · TASK-023 · TASK-025 · TASK-026 · TASK-027 · TASK-028 · TASK-029

**Como** secretária acadêmica
**Quero** fazer login com e-mail institucional e senha
**Para que** eu acesse o painel de gestão com segurança

**Critérios de Aceitação:**

- A secretária e o administrador devem conseguir acessar o sistema informando e-mail e senha na tela de login.
- Se as credenciais estiverem incorretas, o sistema deve exibir uma mensagem de erro genérica, sem indicar qual campo está errado.
- As senhas devem ser armazenadas de forma segura no banco de dados, sem que o valor original possa ser recuperado.
- Durante o carregamento do login, o botão de envio deve mostrar um indicador de espera e, em caso de falha, a mensagem de erro deve aparecer sem recarregar a página.

***

### US-08 · RF10 — Autorização por Papel (RBAC)

> **Tasks:** TASK-024 · TASK-026 · TASK-028 · TASK-030

**Como** sistema
**Quero** garantir que cada role acesse apenas as funcionalidades permitidas
**Para que** nenhum usuário execute ações além do seu nível de autorização

**Critérios de Aceitação:**

- A secretária não deve conseguir acessar funcionalidades exclusivas do administrador; ao tentar, o sistema deve negar o acesso.
- Cada perfil de usuário deve ser direcionado automaticamente para a área correspondente após o login.
- O sistema deve controlar o acesso a cada área do painel com base no papel do usuário autenticado.
- As restrições de acesso devem ser verificadas tanto no servidor quanto no frontend, garantindo proteção em ambas as camadas.

***

### US-09 · RF11 — Proteção de Rotas por JWT

> **Tasks:** TASK-003 · TASK-014 · TASK-023 · TASK-026 · TASK-030 · TASK-043 · TASK-045

**Como** desenvolvedor
**Quero** que todas as rotas administrativas estejam protegidas por middleware JWT
**Para que** nenhuma rota sensível seja acessível sem autenticação válida

**Critérios de Aceitação:**

- Qualquer tentativa de acessar as áreas administrativas sem sessão ativa deve redirecionar o usuário para a tela de login.
- Se a sessão do usuário expirar durante o uso, o sistema deve redirecionar para o login automaticamente.
- O chatbot público deve permanecer acessível para qualquer visitante, sem necessidade de autenticação.
- As áreas restritas só devem ser exibidas após confirmação de identidade válida pelo sistema.

***

## Tabela de Rastreabilidade — Sprint 1

> 🎯 **Total Sprint 1: 118 pts** · 45 tasks

| Task | Tipo | Módulo | Nome | RFs | RNFs | Prioridade | Pts |
|------|------|--------|------|-----|------|------------|-----|
| TASK-001 | `[BE]` | Infra | Bootstrap do servidor Express | — | RNF05 · RNF06 | 🔴 Crítica | **2** |
| TASK-002 | `[BE]` | Infra | Configuração de ambiente e banco de dados | — | RNF05 · RNF09 | 🔴 Crítica | **2** |
| TASK-003 | `[BE]` | Infra | Classe AppError e middleware de erros | RF11 | RNF02 · RNF09 | 🔴 Crítica | **3** |
| TASK-004 | `[BE]` | Infra | Schema Prisma e migration inicial | RF01 · RF02 · RF03 · RF05 · RF07 · RF08 · RF09 | — | 🔴 Crítica | **5** |
| TASK-005 | `[BE]` | Infra | Seed de dados iniciais | RF02 · RF03 · RF09 | RNF09 | 🟡 Alta | **2** |
| TASK-006 | `[BE]` | Infra | Utils: hash e JWT | RF09 | RNF08 · RNF09 | 🔴 Crítica | **3** |
| TASK-007 | `[FIGMA]` | Design | Design System e tokens visuais | — | RNF01 | 🟡 Alta | **5** |
| TASK-008 | `[FIGMA]` | Design | Wireframes — Login e fluxo de autenticação | RF03 · RF09 | RNF01 | 🟡 Alta | **3** |
| TASK-009 | `[FIGMA]` | Design | Wireframes — Interface do Chatbot público | RF01 · RF02 · RF05 · RF07 | RNF01 | 🔴 Crítica | **5** |
| TASK-010 | `[UML]` | Modelagem | Diagrama de Casos de Uso — Astah | RF01 · RF02 · RF03 · RF04 · RF05 · RF06 · RF07 · RF08 · RF09 · RF10 · RF11 | — | 🟡 Alta | **3** |
| TASK-011 | `[DB]` | Modelagem | Modelagem do Banco de Dados — dbdesigner | RF01 · RF02 · RF03 · RF04 · RF05 · RF07 · RF08 · RF09 | RNF09 | 🔴 Crítica | **3** |
| TASK-012 | `[FE]` | Infra | Bootstrap do projeto Vite + TypeScript | — | RNF01 · RNF05 | 🔴 Crítica | **2** |
| TASK-013 | `[FE]` | Infra | Tipos globais compartilhados | RF01 · RF03 · RF07 | — | 🔴 Crítica | **2** |
| TASK-014 | `[FE]` | Infra | Instância Axios e React Query client | RF09 · RF11 | RNF02 · RNF08 | 🔴 Crítica | **3** |
| TASK-015 | `[FE]` | Infra | Provider global e Router | RF03 · RF09 · RF10 · RF11 | — | 🔴 Crítica | **2** |
| TASK-016 | `[FE]` | Infra | Utils frontend | RF09 | RNF01 · RNF08 | 🟡 Alta | **2** |
| TASK-017 | `[FE]` | Infra | Componentes compartilhados base | — | RNF01 · RNF02 | 🟡 Alta | **2** |
| TASK-018 | `[FE]` | Infra | Hooks globais utilitários | — | RNF01 · RNF02 | 🟢 Média | **2** |
| TASK-019 | `[INFRA]` | Docker | Docker Compose e Dockerfiles | — | RNF05 · RNF06 | 🔴 Crítica | **3** |
| TASK-020 | `[BE]` | Auth | auth.types.ts — DTOs de autenticação | RF03 · RF09 | RNF08 | 🔴 Crítica | **1** |
| TASK-021 | `[BE]` | Auth | auth.service.ts — lógica de autenticação | RF03 · RF09 | RNF08 · RNF09 | 🔴 Crítica | **3** |
| TASK-022 | `[BE]` | Auth | auth.controller.ts + auth.routes.ts | RF09 · RF11 | — | 🔴 Crítica | **3** |
| TASK-023 | `[BE]` | Auth | auth.middleware.ts — validação JWT | RF09 · RF11 | RNF08 | 🔴 Crítica | **2** |
| TASK-024 | `[BE]` | Auth | rbac.middleware.ts — autorização por role | RF03 · RF10 · RF11 | — | 🔴 Crítica | **2** |
| TASK-025 | `[FE]` | Auth | auth.types.ts — tipos de autenticação | RF03 · RF09 | RNF08 | 🔴 Crítica | **1** |
| TASK-026 | `[FE]` | Auth | auth.store.ts — estado global (Zustand) | RF09 · RF10 · RF11 | — | 🔴 Crítica | **2** |
| TASK-027 | `[FE]` | Auth | auth.api.ts — chamadas de autenticação | RF09 | RNF08 | 🔴 Crítica | **1** |
| TASK-028 | `[FE]` | Auth | useLogin.ts — hook de login | RF03 · RF09 · RF10 | — | 🔴 Crítica | **3** |
| TASK-029 | `[FE]` | Auth | LoginForm.tsx — componente de formulário | RF09 | RNF01 | 🟡 Alta | **3** |
| TASK-030 | `[FE]` | Auth | ProtectedRoute.tsx + RoleGuard.tsx | RF03 · RF10 · RF11 | — | 🔴 Crítica | **2** |
| TASK-031 | `[BE]` | Chatbot | chatbot.types.ts — DTOs de navegação | RF01 · RF02 · RF07 · RF08 | — | 🔴 Crítica | **2** |
| TASK-032 | `[BE]` | Chatbot | chatbot.service.ts — lógica de navegação | RF01 · RF02 · RF07 · RF08 | — | 🔴 Crítica | **5** |
| TASK-033 | `[BE]` | Chatbot | chatbot.controller.ts + chatbot.routes.ts | RF01 · RF07 · RF08 | — | 🔴 Crítica | **3** |
| TASK-034 | `[FE]` | Chatbot | chatbot.types.ts — tipos de navegação | RF01 · RF02 · RF07 · RF08 | — | 🔴 Crítica | **2** |
| TASK-035 | `[FE]` | Chatbot | chatbot.api.ts — chamadas de navegação | RF01 · RF07 · RF08 | — | 🔴 Crítica | **2** |
| TASK-036 | `[FE]` | Chatbot | useChatNavigation.ts — hook de sessão | RF01 · RF07 · RF08 | RNF02 | 🔴 Crítica | **5** |
| TASK-037 | `[FE]` | Chatbot | MessageBubble.tsx + OptionButton.tsx | RF01 | RNF01 | 🟡 Alta | **3** |
| TASK-038 | `[FE]` | Chatbot | EvidenceCard.tsx | RF02 | RNF01 | 🟡 Alta | **2** |
| TASK-039 | `[FE]` | Chatbot | SatisfactionRating.tsx | RF07 · RF08 | RNF01 | 🟡 Alta | **3** |
| TASK-040 | `[FE]` | Chatbot | ChatWindow.tsx — orquestrador do chatbot | RF01 · RF02 · RF07 | RNF01 | 🟡 Alta | **5** |
| TASK-041 | `[BE]` | Questions | questions.types.ts — DTOs | RF05 · RF08 | — | 🟡 Alta | **1** |
| TASK-042 | `[BE]` | Questions | questions.service.ts — criação de pergunta | RF05 · RF08 | — | 🟡 Alta | **2** |
| TASK-043 | `[BE]` | Questions | questions.controller.ts + questions.routes.ts (POST público) | RF05 · RF11 | — | 🟡 Alta | **2** |
| TASK-044 | `[FE]` | Questions | QuestionForm.tsx — formulário de envio | RF05 · RF08 | RNF01 | 🟡 Alta | **3** |
| TASK-045 | `[BE]` | Infra | routes/index.ts — composição global de rotas | RF01 · RF05 · RF09 · RF11 | — | 🔴 Crítica | **1** |

***

## 📉 Burndown de Referência — Sprint 1

> Linha ideal: partindo de **118 pts** no dia 0, chegando a **0 pts** no último dia.
> Marque uma task como concluída assim que seu PR for mergeado em `develop`.

| Task | Pts | Pts Restantes (ideal) |
|------|-----|-----------------------|
| TASK-001 | 2 | 118 |
| TASK-002 | 2 | 116 |
| TASK-003 | 3 | 114 |
| TASK-004 | 5 | 111 |
| TASK-005 | 2 | 106 |
| TASK-006 | 3 | 104 |
| TASK-007 | 5 | 101 |
| TASK-008 | 3 | 96 |
| TASK-009 | 5 | 93 |
| TASK-010 | 3 | 88 |
| TASK-011 | 3 | 85 |
| TASK-012 | 2 | 82 |
| TASK-013 | 2 | 80 |
| TASK-014 | 3 | 78 |
| TASK-015 | 2 | 75 |
| TASK-016 | 2 | 73 |
| TASK-017 | 2 | 71 |
| TASK-018 | 2 | 69 |
| TASK-019 | 3 | 67 |
| TASK-020 | 1 | 64 |
| TASK-021 | 3 | 63 |
| TASK-022 | 3 | 60 |
| TASK-023 | 2 | 57 |
| TASK-024 | 2 | 55 |
| TASK-025 | 1 | 53 |
| TASK-026 | 2 | 52 |
| TASK-027 | 1 | 50 |
| TASK-028 | 3 | 49 |
| TASK-029 | 3 | 46 |
| TASK-030 | 2 | 43 |
| TASK-031 | 2 | 41 |
| TASK-032 | 5 | 39 |
| TASK-033 | 3 | 34 |
| TASK-034 | 2 | 31 |
| TASK-035 | 2 | 29 |
| TASK-036 | 5 | 27 |
| TASK-037 | 3 | 22 |
| TASK-038 | 2 | 19 |
| TASK-039 | 3 | 17 |
| TASK-040 | 5 | 14 |
| TASK-041 | 1 | 9 |
| TASK-042 | 2 | 8 |
| TASK-043 | 2 | 6 |
| TASK-044 | 3 | 4 |
| TASK-045 | 1 | 1 |

> **Total Sprint 1:** 118 pts · 45 tasks
> Escala Fibonacci: **1** tipo/config · **2** arquivo simples · **3** lógica média · **5** múltiplos arquivos ou lógica complexa