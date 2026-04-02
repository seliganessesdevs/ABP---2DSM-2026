# FatecBot — Backlog Técnico de Tarefas

> Projeto: FatecBot — Autoatendimento da Secretaria Acadêmica · Fatec Jacareí
> Modelo de organização: baixo acoplamento, separação por módulo/camada, tasks autocontidas
> Cada task toca um conjunto de arquivos exclusivo, evitando conflitos simultâneos entre devs

---

## Princípios de Leitura

| Símbolo      | Significado                                                       |
| ------------ | ----------------------------------------------------------------- |
| `[BE]`       | Task de backend (`apps/backend/`)                                 |
| `[FE]`       | Task de frontend (`apps/frontend/`)                               |
| `[INFRA]`    | Task de infraestrutura (raiz do monorepo)                         |
| `[FIGMA]`    | Task de design de interface (Figma — sem arquivos de código)      |
| **Entrada**  | O que deve existir/estar pronto antes de iniciar                  |
| **Saída**    | O que a task entrega como artefato testável                       |
| **Peso**     | Story points estimados (escala Fibonacci: 1 · 2 · 3 · 5 · 8 · 13) |
| **Arquivos** | Arquivos exclusivamente criados/editados por esta task            |

> **Regra de ouro:** arquivos de `types/`, `api/`, `service/` e `hooks/` são sempre tasks separadas.
> Isso garante que dois desenvolvedores nunca editem o mesmo arquivo ao mesmo tempo.

---

## 🗂️ SPRINT 1 — Fundação, Autenticação e Chatbot Público

> 🎯 **Total de pontos nesta sprint: 112 pts** · 43 tasks · Acumulado até aqui: 112 pts

> Objetivo: sistema funcional do ponto de vista do aluno (chatbot + envio de pergunta) e infraestrutura base.

---

### 🏗️ Infraestrutura — Backend

---

## Tabela de Rastreabilidade

| Task     | Tipo     | Módulo       | Nome                                                                      | User Story                                                                                                                             | Descrição                                                                                | RFs                                            | RNFs          | Prioridade | Pts |
| -------- | -------- | ------------ | ------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------- | ---------------------------------------------- | ------------- | ---------- | --- |
| TASK-001 | 🟣 BE    | 🏗️ Infra     | Bootstrap do servidor Express                                             | Como aluno, quero iniciar o atendimento sem falhas, para que eu consiga tirar dúvidas quando precisar.                                 | Disponibiliza a base do atendimento para o chatbot funcionar desde o início.             | —                                              | RNF05 · RNF06 | 🔴 Crítica | 2   |
| TASK-002 | 🟣 BE    | 🏗️ Infra     | Configuração de ambiente e banco de dados                                 | Como aluno, quero que meus atendimentos funcionem de forma estável, para que eu tenha respostas sem interrupções.                      | Organiza as configurações essenciais para o sistema operar com segurança e continuidade. | —                                              | RNF05 · RNF09 | 🔴 Crítica | 2   |
| TASK-003 | 🟣 BE    | 🏗️ Infra     | Classe AppError e middleware de erros                                     | Como aluno, quero receber mensagens claras quando algo der errado, para que eu saiba como continuar o atendimento.                     | Padroniza o tratamento de falhas para tornar o uso mais confiável.                       | RF11                                           | RNF02 · RNF09 | 🔴 Crítica | 3   |
| TASK-004 | 🟣 BE    | 🏗️ Infra     | Schema Prisma e migration inicial                                         | Como equipe acadêmica, quero estruturar as informações do sistema, para que atendimento, usuários e histórico fiquem organizados.      | Cria a base de dados que sustenta todas as funcionalidades do produto.                   | RF01 · RF02 · RF03 · RF05 · RF07 · RF08 · RF09 | —             | 🔴 Crítica | 5   |
| TASK-005 | 🟣 BE    | 🏗️ Infra     | Seed de dados iniciais                                                    | Como administrador, quero começar com dados iniciais prontos, para que o sistema possa ser validado rapidamente.                       | Prepara conteúdos e acessos iniciais para acelerar os primeiros testes de uso real.      | RF02 · RF03 · RF09                             | RNF09         | 🟡 Alta    | 2   |
| TASK-006 | 🟣 BE    | 🏗️ Infra     | Utils: hash e JWT                                                         | Como secretária, quero acessar o sistema com proteção adequada, para que minhas informações fiquem seguras.                            | Habilita a proteção de acesso e validação de sessão para uso diário com segurança.       | RF09                                           | RNF08 · RNF09 | 🔴 Crítica | 3   |
| TASK-007 | 🎨 FIGMA | 🎨 Design    | Design System e tokens visuais                                            | Como aluno, quero uma interface consistente, para que eu entenda e navegue com facilidade.                                             | Define padrões visuais para manter clareza e unidade entre as telas.                     | —                                              | RNF01         | 🟡 Alta    | 5   |
| TASK-008 | 🎨 FIGMA | 🎨 Design    | Wireframes — Login e fluxo de autenticação                                | Como secretária, quero uma tela de entrada clara, para que eu consiga entrar no sistema sem confusão.                                  | Desenha os estados da tela de login para orientar uma experiência simples e previsível.  | RF03 · RF09                                    | RNF01         | 🟡 Alta    | 3   |
| TASK-009 | 🎨 FIGMA | 🎨 Design    | Wireframes — Interface do Chatbot público                                 | Como aluno, quero uma conversa guiada e objetiva, para que eu encontre respostas acadêmicas com rapidez.                               | Projeta os fluxos visuais do chatbot público, da navegação ao envio de pergunta.         | RF01 · RF02 · RF05 · RF07                      | RNF01         | 🔴 Crítica | 5   |
| TASK-010 | 🔵 FE    | 🏗️ Infra     | Bootstrap do projeto Vite + TypeScript                                    | Como aluno, quero abrir a interface com rapidez e estabilidade, para que eu tenha uma boa primeira experiência.                        | Prepara a estrutura inicial da aplicação web para suportar as telas do atendimento.      | —                                              | RNF01 · RNF05 | 🔴 Crítica | 2   |
| TASK-011 | 🔵 FE    | 🏗️ Infra     | Tipos globais compartilhados                                              | Como aluno, quero informações consistentes em todo o atendimento, para que eu não encontre dados contraditórios.                       | Padroniza formatos de dados para reduzir inconsistências visíveis nas telas.             | RF01 · RF03 · RF07                             | —             | 🔴 Crítica | 2   |
| TASK-012 | 🔵 FE    | 🏗️ Infra     | Instância Axios e React Query client                                      | Como secretária, quero que minhas ações carreguem com fluidez, para que eu trabalhe sem atrasos desnecessários.                        | Melhora comunicação e atualização de dados para uma navegação mais responsiva.           | RF09 · RF11                                    | RNF02 · RNF08 | 🔴 Crítica | 3   |
| TASK-013 | 🔵 FE    | 🏗️ Infra     | Provider global e Router                                                  | Como usuário do sistema, quero chegar às páginas certas com facilidade, para que eu navegue sem me perder.                             | Organiza a navegação principal da aplicação para cada área do produto.                   | RF03 · RF09 · RF10 · RF11                      | —             | 🔴 Crítica | 2   |
| TASK-014 | 🔵 FE    | 🏗️ Infra     | Utils frontend                                                            | Como aluno, quero visualizar textos e datas de forma clara, para que eu compreenda melhor as informações exibidas.                     | Adiciona utilidades para melhorar apresentação e leitura de conteúdo na interface.       | RF09                                           | RNF01 · RNF08 | 🟡 Alta    | 2   |
| TASK-015 | 🔵 FE    | 🏗️ Infra     | Componentes compartilhados base                                           | Como aluno, quero ver carregamento e falhas de forma compreensível, para que eu saiba o que está acontecendo.                          | Cria componentes visuais reutilizáveis para estados de espera e erro.                    | —                                              | RNF01 · RNF02 | 🟡 Alta    | 2   |
| TASK-016 | 🔵 FE    | 🏗️ Infra     | Hooks globais utilitários                                                 | Como secretária, quero navegar por listas de forma prática, para que eu encontre informações com menos esforço.                        | Disponibiliza comportamentos reutilizáveis para busca e paginação no uso diário.         | —                                              | RNF01 · RNF02 | 🟢 Média   | 2   |
| TASK-017 | ⚙️ INFRA | 🐳 Docker    | Docker Compose e Dockerfiles                                              | Como equipe acadêmica, quero subir o sistema completo com facilidade, para que o ambiente fique pronto rapidamente.                    | Permite iniciar todos os serviços do projeto de forma padronizada em um único fluxo.     | —                                              | RNF05 · RNF06 | 🔴 Crítica | 3   |
| TASK-018 | 🟣 BE    | 🔐 Auth      | auth.types.ts — DTOs e contratos de autenticação                          | Como secretária, quero que meus dados de entrada sejam interpretados corretamente, para que meu acesso funcione sem ruídos.            | Define os formatos de informação usados no processo de entrada no sistema.               | RF03 · RF09                                    | RNF08         | 🔴 Crítica | 1   |
| TASK-019 | 🟣 BE    | 🔐 Auth      | auth.service.ts — lógica de autenticação                                  | Como secretária, quero entrar com meu e-mail institucional e senha, para que eu acesse minhas funções com segurança.                   | Implementa a validação de acesso para liberar o uso das áreas protegidas.                | RF03 · RF09                                    | RNF08 · RNF09 | 🔴 Crítica | 3   |
| TASK-020 | 🟣 BE    | 🔐 Auth      | auth.controller.ts + auth.routes.ts                                       | Como secretária, quero concluir meu acesso com retorno claro, para que eu saiba quando entrar ou corrigir meus dados.                  | Entrega o fluxo de entrada com respostas consistentes para sucesso e falha.              | RF09 · RF11                                    | —             | 🔴 Crítica | 3   |
| TASK-021 | 🟣 BE    | 🔐 Auth      | auth.middleware.ts — validação JWT                                        | Como administrador, quero que apenas pessoas autenticadas acessem áreas restritas, para que os dados institucionais fiquem protegidos. | Garante que áreas sensíveis só sejam abertas para quem estiver com acesso válido.        | RF09 · RF11                                    | RNF08         | 🔴 Crítica | 2   |
| TASK-022 | 🟣 BE    | 🔐 Auth      | rbac.middleware.ts — autorização por role                                 | Como administrador, quero controlar quem pode usar cada área, para que cada perfil veja apenas o que lhe cabe.                         | Aplica regras de permissão por perfil para proteger funções administrativas.             | RF03 · RF10 · RF11                             | —             | 🔴 Crítica | 2   |
| TASK-023 | 🔵 FE    | 🔐 Auth      | auth.types.ts — tipos de autenticação                                     | Como secretária, quero que minhas informações de acesso apareçam corretamente na interface, para que meu uso seja confiável.           | Padroniza dados de acesso exibidos e manipulados no frontend.                            | RF03 · RF09                                    | RNF08         | 🔴 Crítica | 1   |
| TASK-024 | 🔵 FE    | 🔐 Auth      | auth.store.ts — estado global de autenticação (Zustand)                   | Como secretária, quero permanecer logada durante meu trabalho, para que eu não precise entrar novamente a todo momento.                | Mantém o estado de acesso do usuário para navegação contínua nas áreas protegidas.       | RF09 · RF10 · RF11                             | —             | 🔴 Crítica | 2   |
| TASK-025 | 🔵 FE    | 🔐 Auth      | auth.api.ts — chamadas de autenticação                                    | Como secretária, quero enviar meus dados de acesso de forma confiável, para que eu consiga entrar sem retrabalho.                      | Centraliza a comunicação do login para tornar o acesso mais previsível.                  | RF09                                           | RNF08         | 🔴 Crítica | 1   |
| TASK-026 | 🔵 FE    | 🔐 Auth      | useLogin.ts — hook de login                                               | Como secretária, quero ser levada automaticamente para minha área após entrar, para que eu comece meu trabalho mais rápido.            | Conecta o formulário de acesso ao fluxo de navegação por perfil.                         | RF03 · RF09 · RF10                             | —             | 🔴 Crítica | 3   |
| TASK-027 | 🔵 FE    | 🔐 Auth      | LoginForm.tsx — componente de formulário                                  | Como secretária, quero preencher meu acesso em um formulário simples, para que eu entre no sistema com facilidade.                     | Entrega a tela de entrada com campos, envio e feedback de erro.                          | RF09                                           | RNF01         | 🟡 Alta    | 3   |
| TASK-028 | 🔵 FE    | 🔐 Auth      | ProtectedRoute.tsx + RoleGuard.tsx                                        | Como administrador, quero bloquear páginas para perfis não permitidos, para que recursos sensíveis não fiquem expostos.                | Protege a navegação da interface conforme autenticação e perfil do usuário.              | RF03 · RF10 · RF11                             | —             | 🔴 Crítica | 2   |
| TASK-029 | 🟣 BE    | 🤖 Chatbot   | chatbot.types.ts — DTOs de navegação                                      | Como aluno, quero receber respostas e opções organizadas, para que eu avance no atendimento sem confusão.                              | Define os formatos de informação da conversa para manter consistência no fluxo.          | RF01 · RF02 · RF07 · RF08                      | —             | 🔴 Crítica | 2   |
| TASK-030 | 🟣 BE    | 🤖 Chatbot   | chatbot.service.ts — lógica de navegação                                  | Como aluno, quero navegar pelas opções do chatbot até chegar à resposta certa, para que eu resolva minha dúvida com autonomia.         | Implementa o coração do fluxo conversacional e do registro da sessão.                    | RF01 · RF02 · RF07 · RF08                      | —             | 🔴 Crítica | 5   |
| TASK-031 | 🟣 BE    | 🤖 Chatbot   | chatbot.controller.ts + chatbot.routes.ts                                 | Como aluno, quero acessar as opções e registrar minha satisfação ao final, para que o atendimento melhore continuamente.               | Disponibiliza as ações públicas do chatbot e da avaliação da sessão.                     | RF01 · RF07 · RF08                             | —             | 🔴 Crítica | 3   |
| TASK-032 | 🔵 FE    | 🤖 Chatbot   | chatbot.types.ts — tipos de navegação                                     | Como aluno, quero ver mensagens e opções no formato correto, para que a conversa faça sentido em cada etapa.                           | Organiza os dados exibidos no chatbot para manter a experiência coerente.                | RF01 · RF02 · RF07 · RF08                      | —             | 🔴 Crítica | 2   |
| TASK-033 | 🔵 FE    | 🤖 Chatbot   | chatbot.api.ts — chamadas de navegação                                    | Como aluno, quero que cada clique carregue a próxima etapa da conversa, para que eu avance no atendimento sem travas.                  | Centraliza as ações de consulta e avaliação usadas na conversa pública.                  | RF01 · RF07 · RF08                             | —             | 🔴 Crítica | 2   |
| TASK-034 | 🔵 FE    | 🤖 Chatbot   | useChatNavigation.ts — hook de estado da sessão                           | Como aluno, quero retomar o contexto da conversa a cada passo, para que eu não perca meu caminho no atendimento.                       | Controla estado da sessão, histórico e caminho de navegação do chatbot.                  | RF01 · RF07 · RF08                             | RNF02         | 🔴 Crítica | 5   |
| TASK-035 | 🔵 FE    | 🤖 Chatbot   | MessageBubble.tsx + OptionButton.tsx                                      | Como aluno, quero visualizar mensagens e opções de forma clara, para que eu escolha o próximo passo com confiança.                     | Cria os componentes centrais de leitura e escolha dentro da conversa.                    | RF01                                           | RNF01         | 🟡 Alta    | 3   |
| TASK-036 | 🔵 FE    | 🤖 Chatbot   | EvidenceCard.tsx                                                          | Como aluno, quero ver a origem da resposta apresentada, para que eu confie nas informações recebidas.                                  | Exibe referência do conteúdo consultado junto da resposta do chatbot.                    | RF02                                           | RNF01         | 🟡 Alta    | 2   |
| TASK-037 | 🔵 FE    | 🤖 Chatbot   | SatisfactionRating.tsx                                                    | Como aluno, quero avaliar o atendimento ao final da conversa, para que minha experiência ajude a melhorar o serviço.                   | Permite registrar opinião de satisfação ao término do fluxo.                             | RF07 · RF08                                    | RNF01         | 🟡 Alta    | 3   |
| TASK-038 | 🔵 FE    | 🤖 Chatbot   | ChatWindow.tsx — orquestrador do chatbot                                  | Como aluno, quero conversar em uma janela única e organizada, para que eu resolva dúvidas com fluidez.                                 | Reúne mensagens, opções, evidências e avaliação em uma experiência completa.             | RF01 · RF02 · RF07                             | RNF01         | 🟡 Alta    | 5   |
| TASK-039 | 🟣 BE    | ❓ Questions | questions.types.ts — DTOs                                                 | Como aluno, quero enviar minha pergunta em formato claro, para que a equipe acadêmica consiga me responder corretamente.               | Define os dados necessários para registrar perguntas enviadas pelo público.              | RF05 · RF08                                    | —             | 🟡 Alta    | 1   |
| TASK-040 | 🟣 BE    | ❓ Questions | questions.service.ts — criação de pergunta                                | Como aluno, quero registrar uma pergunta quando não encontro resposta, para que eu receba retorno da secretaria.                       | Implementa o registro da pergunta aberta para acompanhamento posterior.                  | RF05 · RF08                                    | —             | 🟡 Alta    | 2   |
| TASK-041 | 🟣 BE    | ❓ Questions | questions.controller.ts + questions.routes.ts (POST público)              | Como aluno, quero enviar minha dúvida de forma simples, para que ela chegue corretamente para análise.                                 | Disponibiliza o envio público de perguntas com validação de dados.                       | RF05 · RF11                                    | —             | 🟡 Alta    | 2   |
| TASK-042 | 🔵 FE    | ❓ Questions | QuestionForm.tsx — formulário de envio de pergunta                        | Como aluno, quero preencher e enviar minha dúvida com meu e-mail institucional, para que eu possa receber retorno oficial.             | Entrega o formulário de encaminhamento de pergunta no fluxo público.                     | RF05 · RF08                                    | RNF01         | 🟡 Alta    | 3   |
| TASK-043 | 🟣 BE    | 🏗️ Infra     | routes/index.ts — composição global de rotas                              | Como usuário do sistema, quero que todas as funcionalidades estejam acessíveis nos caminhos corretos, para que eu navegue sem erros.   | Centraliza as rotas principais para manter o acesso estável entre módulos.               | RF01 · RF05 · RF09 · RF11                      | —             | 🔴 Crítica | 1   |
| TASK-044 | 🟣 BE    | 🌿 Nodes     | nodes.types.ts — DTOs de nós                                              | Como administrador, quero estruturar as informações de cada item do chatbot, para que a organização do conteúdo seja consistente.      | Define o formato dos dados usados para criar e manter nós de navegação.                  | RF02                                           | —             | 🔴 Crítica | 2   |
| TASK-045 | 🟣 BE    | 🌿 Nodes     | nodes.service.ts — CRUD de nós                                            | Como administrador, quero criar e ajustar os conteúdos do chatbot, para que os alunos encontrem respostas atualizadas.                 | Entrega o gerenciamento completo dos nós da base de conhecimento.                        | RF02                                           | —             | 🔴 Crítica | 5   |
| TASK-046 | 🟣 BE    | 🌿 Nodes     | nodes.controller.ts + nodes.routes.ts                                     | Como administrador, quero gerenciar a árvore de conteúdos com acesso restrito, para que apenas perfis autorizados façam alterações.    | Disponibiliza operações de gestão de nós com proteção por perfil.                        | RF02 · RF10 · RF11                             | —             | 🔴 Crítica | 3   |
| TASK-047 | 🔵 FE    | 🌿 Nodes     | nodes.api.ts — chamadas CRUD                                              | Como administrador, quero executar ações de cadastro e edição da árvore, para que eu mantenha o conteúdo do atendimento em dia.        | Centraliza as ações de gestão de nós usadas no painel administrativo.                    | RF02                                           | —             | 🔴 Crítica | 2   |
| TASK-048 | 🔵 FE    | 🌿 Nodes     | useNodes.ts — hook de gerenciamento de nós                                | Como administrador, quero atualizar a lista de nós com agilidade, para que a manutenção do conteúdo seja eficiente.                    | Organiza o fluxo de listagem, criação, edição e remoção de nós no painel.                | RF02                                           | RNF02         | 🔴 Crítica | 3   |
| TASK-049 | 🔵 FE    | 🌿 Nodes     | NodeTree.tsx — visualização hierárquica                                   | Como administrador, quero visualizar a hierarquia dos conteúdos do chatbot, para que eu entenda rapidamente a estrutura atual.         | Exibe a árvore de nós com ações de manutenção em cada item.                              | RF02                                           | RNF01         | 🟡 Alta    | 5   |
| TASK-050 | 🔵 FE    | 🌿 Nodes     | NodeEditor.tsx — formulário de criação/edição                             | Como administrador, quero editar conteúdos em um formulário claro, para que eu publique ajustes com menos erros.                       | Oferece criação e edição de nós em uma interface guiada.                                 | RF02                                           | RNF01         | 🟡 Alta    | 5   |
| TASK-051 | 🟣 BE    | 📄 Documents | documents.types.ts                                                        | Como administrador, quero padronizar os documentos cadastrados, para que o conteúdo de referência seja organizado.                     | Define o formato dos dados usados no cadastro de documentos e trechos.                   | RF02                                           | —             | 🟡 Alta    | 1   |
| TASK-052 | 🟣 BE    | 📄 Documents | documents.service.ts + documents.controller.ts + documents.routes.ts      | Como administrador, quero gerenciar documentos de apoio do chatbot, para que as respostas tenham base confiável.                       | Entrega cadastro, listagem e remoção de documentos no painel administrativo.             | RF02 · RF10 · RF11                             | —             | 🟡 Alta    | 5   |
| TASK-053 | 🔵 FE    | 📄 Documents | documents.api.ts + useDocuments.ts + DocumentList.tsx                     | Como administrador, quero visualizar e manter os documentos em uma lista simples, para que eu acompanhe o acervo com facilidade.       | Disponibiliza tela e ações de gestão de documentos para uso diário.                      | RF02                                           | RNF01         | 🟡 Alta    | 5   |
| TASK-054 | 🟣 BE    | 👥 Users     | users.types.ts + users.service.ts + users.controller.ts + users.routes.ts | Como administrador, quero cadastrar e remover usuários internos, para que apenas pessoas autorizadas usem o painel.                    | Entrega a gestão de contas internas com regras de acesso por perfil.                     | RF03 · RF10 · RF11                             | —             | 🟡 Alta    | 5   |
| TASK-055 | 🔵 FE    | 👥 Users     | users.api.ts + UserList.tsx                                               | Como administrador, quero administrar usuários em uma tela objetiva, para que eu mantenha o time com acessos corretos.                 | Exibe lista de usuários e ações de criação e remoção no painel.                          | RF03                                           | RNF01         | 🟡 Alta    | 3   |
| TASK-056 | 🎨 FIGMA | 🎨 Design    | Mockups do painel Admin                                                   | Como administrador, quero navegar por um painel claro e organizado, para que eu gerencie conteúdos e usuários com confiança.           | Projeta as principais telas administrativas para orientar implementação consistente.     | RF02 · RF03 · RF08                             | RNF01         | 🟡 Alta    | 8   |
| TASK-057 | 🔵 FE    | 🖼️ Layout    | AdminLayout.tsx + PublicLayout.tsx                                        | Como administrador, quero uma navegação padrão no painel, para que eu acesse cada área rapidamente.                                    | Estrutura os layouts público e administrativo para uma navegação previsível.             | RF03 · RF10                                    | RNF01         | 🔴 Crítica | 3   |
| TASK-058 | 🔵 FE    | 🛡️ Admin     | Páginas do painel Admin                                                   | Como administrador, quero telas separadas para cada gestão, para que eu execute minhas tarefas com mais foco.                          | Monta as páginas de dashboard, nós, documentos e usuários do painel.                     | RF02 · RF03 · RF10                             | RNF01         | 🟡 Alta    | 5   |
| TASK-059 | 🟣 BE    | ❓ Questions | questions.service.ts — extensão para listagem e status                    | Como secretária, quero listar perguntas e marcar as respondidas, para que eu acompanhe o andamento do atendimento.                     | Amplia o fluxo de perguntas para incluir acompanhamento e atualização de situação.       | RF05 · RF03                                    | —             | 🔴 Crítica | 2   |
| TASK-060 | 🟣 BE    | ❓ Questions | questions.controller.ts + questions.routes.ts — rotas protegidas          | Como secretária, quero gerenciar perguntas em área restrita, para que apenas perfis autorizados façam alterações.                      | Disponibiliza listagem e atualização de perguntas com acesso protegido.                  | RF05 · RF10 · RF11                             | —             | 🔴 Crítica | 2   |
| TASK-061 | 🔵 FE    | ❓ Questions | questions.api.ts — chamadas para secretária                               | Como secretária, quero consultar e atualizar perguntas com praticidade, para que eu mantenha a fila de atendimento organizada.         | Centraliza as ações de consulta e atualização de perguntas da área da secretaria.        | RF05 · RF03                                    | —             | 🔴 Crítica | 2   |
| TASK-062 | 🔵 FE    | ❓ Questions | useQuestions.ts — hook de perguntas                                       | Como secretária, quero filtrar e paginar perguntas com facilidade, para que eu trate demandas sem perder contexto.                     | Organiza o fluxo de carregamento e atualização da lista de perguntas.                    | RF05                                           | RNF02         | 🔴 Crítica | 3   |
| TASK-063 | 🔵 FE    | ❓ Questions | QuestionsTable.tsx + StatusBadge.tsx                                      | Como secretária, quero visualizar status e agir rapidamente em cada pergunta, para que eu reduza o tempo de resposta ao aluno.         | Entrega tabela de perguntas com identificação visual de status e ação de atualização.    | RF05 · RF03                                    | RNF01         | 🟡 Alta    | 3   |
| TASK-064 | 🟣 BE    | 📊 Logs      | logs.types.ts + logs.service.ts + logs.controller.ts + logs.routes.ts     | Como administrador, quero consultar histórico de atendimentos e satisfação, para que eu identifique melhorias no serviço.              | Disponibiliza o registro e a consulta de sessões para análise administrativa.            | RF08 · RF10 · RF11                             | —             | 🟡 Alta    | 5   |
| TASK-065 | 🔵 FE    | 📊 Logs      | logs.api.ts + useLogs.ts + LogTable.tsx                                   | Como administrador, quero analisar registros em uma tela filtrável, para que eu acompanhe a qualidade dos atendimentos.                | Entrega listagem de sessões com filtros para leitura rápida do histórico.                | RF08                                           | RNF01         | 🟡 Alta    | 5   |
| TASK-066 | 🎨 FIGMA | 🎨 Design    | Mockups do painel Secretária                                              | Como secretária, quero uma tela clara para acompanhar perguntas e histórico, para que eu priorize atendimentos com segurança.          | Projeta a experiência visual das telas da secretaria e de acompanhamento.                | RF03 · RF05 · RF08                             | RNF01         | 🟡 Alta    | 5   |
| TASK-067 | 🔵 FE    | 📑 Pages     | Páginas do painel Secretária + Logs Admin                                 | Como secretária, quero páginas dedicadas para acompanhar perguntas e indicadores, para que eu execute meu fluxo diário com agilidade.  | Monta as páginas finais da secretaria e de logs para fechamento do MVP.                  | RF03 · RF05 · RF08 · RF10                      | RNF01         | 🟡 Alta    | 3   |
| TASK-068 | 🔵 FE    | ❓ Questions | questions.api.ts — chamadas para secretária                               | Como secretária, quero consultar e atualizar perguntas com praticidade, para que eu mantenha a fila de atendimento organizada.         | Centraliza as ações de consulta e atualização de perguntas da área da secretaria.        | RF06                                           | —             | 🔴 Crítica | 2   |
| TASK-069 | 🔵 FE    | ❓ Questions | useQuestions.ts — hook de perguntas                                       | Como secretária, quero filtrar e paginar perguntas com facilidade, para que eu trate demandas sem perder contexto.                     | Organiza o fluxo de carregamento e atualização da lista de perguntas.                    | RF06                                           | —             | 🔴 Crítica | 3   |
| TASK-070 | 🔵 FE    | ❓ Questions | QuestionsTable.tsx + StatusBadge.tsx                                      | Como secretária, quero visualizar status e agir rapidamente em cada pergunta, para que eu reduza o tempo de resposta ao aluno.         | Entrega tabela de perguntas com identificação visual de status e ação de atualização.    | RF06                                           | RNF01         | 🟡 Alta    | 3   |
| TASK-071 | 🟣 BE    | 📊 Logs      | logs.types.ts + logs.service.ts + logs.controller.ts + logs.routes.ts     | Como administrador, quero consultar histórico de atendimentos e satisfação, para que eu identifique melhorias no serviço.              | Disponibiliza o registro e a consulta de sessões para análise administrativa.            | RF04 · RF08 · RF10 · RF11                      | —             | 🟡 Alta    | 5   |
| TASK-072 | 🔵 FE    | 🛡️ Admin     | logs.api.ts + useLogs.ts + LogTable.tsx                                   | Como administrador, quero analisar registros em uma tela filtrável, para que eu acompanhe a qualidade dos atendimentos.                | Entrega listagem de sessões com filtros para leitura rápida do histórico.                | RF04 · RF08                                    | RNF01         | 🟡 Alta    | 5   |
| TASK-073 | 🎨 FIGMA | 🎨 Design    | Mockups do painel Secretária                                              | Como secretária, quero uma tela clara para acompanhar perguntas e histórico, para que eu priorize atendimentos com segurança.          | Projeta a experiência visual das telas da secretaria e de acompanhamento.                | RF06 · RF08                                    | RNF01 · RNF04 | 🟡 Alta    | 5   |
| TASK-074 | 🔵 FE    | 📑 Pages     | Páginas do painel Secretária + Logs Admin                                 | Como secretária, quero páginas dedicadas para acompanhar perguntas e indicadores, para que eu execute meu fluxo diário com agilidade.  | Monta as páginas finais da secretaria e de logs para fechamento do MVP.                  | RF06 · RF08                                    | RNF01         | 🟡 Alta    | 3   |

---

## 📋 Resumo — Mapa de Dependências Críticas

```
TASK-001 (Bootstrap BE)
  └─► TASK-002 (Config)
        └─► TASK-004 (Schema Prisma)
              ├─► TASK-005 (Seed)
              ├─► TASK-018 (auth.types)
              │     └─► TASK-019 (auth.service)
              │           └─► TASK-020 (auth.controller/routes) ──► TASK-043 (routes/index)
              ├─► TASK-029 (chatbot.types)
              │     └─► TASK-030 (chatbot.service)
              │           └─► TASK-031 (chatbot.controller/routes) ──► TASK-043
              └─► TASK-039 (questions.types)
                    └─► TASK-040 (questions.service)
                          └─► TASK-041 (questions.controller/routes) ──► TASK-043

TASK-006 (utils: hash/jwt) ──► TASK-019 (auth.service)

TASK-007 (Design System Figma)
  ├─► TASK-008 (Wireframes Login)      ──► TASK-027 (LoginForm)
  ├─► TASK-009 (Wireframes Chatbot)    ──► TASK-035, TASK-036, TASK-037, TASK-038, TASK-042
  ├─► TASK-056 (Mockups Admin)         ──► TASK-057, TASK-058
  └─► TASK-066 (Mockups Secretária)    ──► TASK-067

TASK-010 (Bootstrap FE)
  └─► TASK-011 (tipos globais)
        └─► TASK-012 (axios + queryClient)
              ├─► TASK-023 (auth.types FE) ──► TASK-024 (auth.store)
              │     └─► TASK-025 (auth.api) ──► TASK-026 (useLogin) ──► TASK-027 (LoginForm)
              └─► TASK-032 (chatbot.types) ──► TASK-033 (chatbot.api)
                    └─► TASK-034 (useChatNavigation)
                          └─► TASK-038 (ChatWindow)

TASK-067 (questions.routes protegidas) ──► TASK-068 (questions.api secretaria)
      └─► TASK-069 (useQuestions)
                        └─► TASK-070 (QuestionsTable + StatusBadge)

TASK-002 + TASK-003 + TASK-023 + TASK-024 ──► TASK-071 (logs BE)
      └─► TASK-072 (logs FE)

TASK-007 (Design System Figma)
      └─► TASK-073 (Mockups Secretária Sprint 3)

TASK-060 + TASK-070 + TASK-072 + TASK-073 ──► TASK-074 (Páginas Secretária + Logs)
```

---

## 🔒 Tabela de Propriedade de Arquivos por Task

| Task     | Arquivos exclusivos                                                             | Pode ser desenvolvida em paralelo com  |
| -------- | ------------------------------------------------------------------------------- | -------------------------------------- |
| TASK-007 | Figma — Design System                                                           | TASK-001, TASK-004, TASK-010           |
| TASK-008 | Figma — Wireframes Login                                                        | TASK-009, TASK-018, TASK-023           |
| TASK-009 | Figma — Wireframes Chatbot                                                      | TASK-008, TASK-029, TASK-032           |
| TASK-018 | `auth.types.ts` [BE]                                                            | TASK-029, TASK-039, TASK-011           |
| TASK-019 | `auth.service.ts` [BE]                                                          | TASK-030, TASK-040                     |
| TASK-020 | `auth.controller.ts`, `auth.routes.ts` [BE]                                     | TASK-031, TASK-041                     |
| TASK-023 | `auth.types.ts` [FE]                                                            | TASK-032, TASK-044                     |
| TASK-024 | `auth.store.ts` [FE]                                                            | TASK-033, TASK-047                     |
| TASK-025 | `auth.api.ts` [FE]                                                              | TASK-033, TASK-047                     |
| TASK-026 | `useLogin.ts` [FE]                                                              | TASK-034, TASK-048                     |
| TASK-027 | `LoginForm.tsx` [FE]                                                            | TASK-035, TASK-049                     |
| TASK-029 | `chatbot.types.ts` [BE]                                                         | TASK-018, TASK-039                     |
| TASK-030 | `chatbot.service.ts` [BE]                                                       | TASK-019, TASK-040                     |
| TASK-031 | `chatbot.controller.ts`, `chatbot.routes.ts` [BE]                               | TASK-020, TASK-041                     |
| TASK-032 | `chatbot.types.ts` [FE]                                                         | TASK-023, TASK-011                     |
| TASK-033 | `chatbot.api.ts` [FE]                                                           | TASK-025, TASK-047                     |
| TASK-034 | `useChatNavigation.ts` [FE]                                                     | TASK-026, TASK-048                     |
| TASK-056 | Figma — Mockups Admin                                                           | TASK-051, TASK-052, TASK-054, TASK-055 |
| TASK-066 | Figma — Mockups Secretária                                                      | TASK-059, TASK-060, TASK-064           |
| TASK-068 | `questions.api.ts` [FE]                                                         | TASK-071, TASK-073                     |
| TASK-069 | `useQuestions.ts` [FE]                                                          | TASK-071, TASK-073                     |
| TASK-070 | `QuestionsTable.tsx`, `StatusBadge.tsx` [FE]                                    | TASK-071, TASK-073                     |
| TASK-071 | `logs.types.ts`, `logs.service.ts`, `logs.controller.ts`, `logs.routes.ts` [BE] | TASK-068, TASK-069, TASK-070, TASK-073 |
| TASK-072 | `logs.api.ts`, `useLogs.ts`, `LogTable.tsx` [FE]                                | TASK-068, TASK-069, TASK-070           |
| TASK-073 | Figma — Mockups Secretária (Sprint 3)                                           | TASK-068, TASK-069, TASK-070, TASK-071 |
| TASK-074 | `dashboard.tsx`, `questions.tsx`, `logs.tsx` [FE]                               | —                                      |

## 📉 Referência de Pesos para Burndown Chart

> Escala Fibonacci adotada: **1** (só tipos/config) · **2** (arquivo simples) · **3** (lógica média) · **5** (múltiplos arquivos / lógica complexa) · **8** (feature grande integrada)
