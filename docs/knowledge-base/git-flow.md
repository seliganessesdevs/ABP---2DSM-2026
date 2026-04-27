# Git Flow — Guia para Iniciantes

Git Flow é uma convenção de como organizar branches e commits no Git. Não é uma tecnologia — é um acordo de equipe. Sem ele, um projeto com vários desenvolvedores vira caos: código quebrado na branch principal, histórico impossível de ler, conflitos constantes.

> Para o padrão canônico de branches, commits e PRs do FatecBot, prevalece [`../project-standards.md`](../project-standards.md).
> Este guia continua útil como apoio conceitual e operacional no dia a dia.

***

## O Modelo Mental Correto

Pense no repositório como um rio com afluentes. A branch principal (`main`) é o rio — sempre estável, sempre funcionando. Cada feature, correção ou experimento é um afluente que nasce do rio, cresce separado e só se junta quando está pronto.

***

## As Branches Principais

| Branch | Finalidade |
|---|---|
| `main` | Código de produção — sempre estável |
| `develop` | Integração das features — pode ter trabalho em progresso |


Ninguém commita diretamente na `main`. Todo código novo entra pela `develop` e só vai para `main` quando está pronto para produção.


***


## Branches de Trabalho


Você cria uma branch nova para cada task. Quando termina, abre um Pull Request para `develop`.


**Convenção de nomes:**


```
<tipo>/TASK-NNN-<descricao-curta-em-kebab-case>
```


| Tipo | Quando usar |
|---|---|
| `feature/` | Nova funcionalidade |
| `fix/` | Correção de bug |
| `chore/` | Tarefa técnica sem impacto direto no usuário |
| `docs/` | Documentação |
| `refactor/` | Refatoração sem mudança de comportamento |


**Exemplos reais:**


```bash
feature/TASK-032-chatbot-navigation-service
feature/TASK-048-admin-node-crud
fix/TASK-023-jwt-expiration-handling
docs/TASK-010-use-case-diagram
chore/TASK-019-docker-compose-setup
refactor/TASK-036-extract-session-hook
```


> **Regra:** Uma branch por task. O ID da task já carrega a rastreabilidade com o backlog — não é necessário repetir os RFs no nome da branch.
> Para tarefas sem task formal, use a descrição curta sem o código: `chore/setup-eslint`.


***


## O Fluxo do Dia a Dia


```bash
# 1. Atualiza seu repositório local
git checkout develop
git pull origin develop


# 2. Cria a branch da sua tarefa a partir da develop
git checkout -b feature/TASK-032-chatbot-navigation-service


# 3. Trabalha, commita conforme avança (escopo = módulo alterado)
git add .
git commit -m "feat(chatbot): adiciona carregamento do no raiz ao iniciar sessao"
git commit -m "feat(chatbot): adiciona selecao de opcao e navegacao entre nos filhos"
git commit -m "test(chatbot): adiciona testes unitarios do hook useChatNavigation"


# 4. Antes de abrir PR, atualiza com o que mudou na develop
git pull origin develop --rebase


# 5. Envia para o repositório remoto
git push origin feature/TASK-032-chatbot-navigation-service


# 6. Abre Pull Request no GitHub: feature/... → develop
```

***

## Commits

Usamos o padrão **Conventional Commits** em **português sem acentos**. O formato completo é:

<tipo>(<escopo>): <descricao curta no imperativo>
[corpo opcional — explica o porque, nao o que]
[rodape opcional — referencia a task: Closes #42]
text

| Tipo | Quando usar |
|---|---|
| `feat` | Nova funcionalidade |
| `fix` | Correção de bug |
| `chore` | Tarefa técnica — dependências, configurações |
| `docs` | Documentação |
| `refactor` | Refatoração sem mudança de comportamento |
| `test` | Adição ou correção de testes |
| `style` | Formatação, espaçamento — sem mudança de lógica |
| `perf` | Melhoria de desempenho |

**Escopos recomendados:**

chatbot | auth | admin | secretary | nodes | documents | logs | questions | db | docker | ci
text

**Exemplos corretos:**

```bash
feat(chatbot): adiciona navegacao hierarquica pelo menu de nos
fix(auth): corrige validacao de expiracao do JWT no refresh
refactor(admin): extrai NodeEditor para componente de formulario reutilizavel
test(chatbot): adiciona testes unitarios do hook useChatNavigation
docs(api-layer): documenta endpoint POST /questions com exemplos
chore(docker): adiciona healthcheck ao container do postgres
```

**Exemplos incorretos:**

```bash
# ❌ Sem tipo
atualiza chatbot

# ❌ Verbo no passado
feat(auth): adicionou formulario de login

# ❌ Genérico demais
fix: corrigindo bugs

# ❌ Sem escopo quando aplicável
feat: criar painel do admin

# ❌ Com acento (risco de encoding)
feat(chatbot): adiciona navegação por nós
```

**Regras para a descrição:**
- Imperativo — "adiciona", não "adicionado" ou "adicionando"
- Minúsculo
- Sem ponto no final
- Sem acentos nem cedilha
- Curta — no máximo 72 caracteres

> Para a especificação completa de commits e PRs, consulte [`../project-standards.md`](../project-standards.md).

***

## O que é um Pull Request

Pull Request (PR) é o pedido para mesclar sua branch na `develop`. Antes de aprovar, o time revisa o código — isso evita bugs, mantém o padrão e distribui conhecimento.

**Checklist antes de abrir um PR:**
- O código funciona localmente
- Os testes passam
- Não há `console.log` esquecido
- Os arquivos de `.env` não foram commitados
- A branch está atualizada com a `develop`

***

## `.gitignore` — O que Nunca Commitar

node_modules/ # dependências — regeneradas com pnpm install
.env # variáveis de ambiente — contém segredos
dist/ # código compilado — gerado no build
.DS_Store # arquivo de sistema do macOS
*.log # arquivos de log
coverage/ # relatório de cobertura de testes
text

Se um arquivo sensível foi commitado acidentalmente, apenas adicioná-lo ao `.gitignore` depois não resolve — ele já está no histórico. É preciso removê-lo com `git rm --cached`.

***

## Comandos Essenciais

```bash
# Situação atual do repositório
git status

# Ver histórico de commits
git log --oneline

# Desfazer mudanças não commitadas de um arquivo
git checkout -- arquivo.ts

# Desfazer o último commit (mantém as mudanças)
git reset --soft HEAD~1

# Verificar diferença antes de commitar
git diff

# Atualizar branch local com remoto sem criar commit de merge
git pull --rebase origin develop
```

***

## Erros Comuns

**Commitou na branch errada:**
```bash
# Move o último commit para a branch correta
git reset --soft HEAD~1    # desfaz o commit, mantém as mudanças
git stash                  # guarda temporariamente
git checkout branch-correta
git stash pop              # recupera as mudanças
git commit -m "..."
```

**Conflito ao fazer rebase:**
```bash
# O Git vai pausar e mostrar o conflito no arquivo
# Você resolve manualmente, salva o arquivo e continua:
git add arquivo-resolvido.ts
git rebase --continue
```

**Enviou segredo no commit:**
- Revogue o segredo imediatamente — ele está exposto
- Gere um novo segredo
- Remova do histórico com `git filter-branch` ou BFG Repo Cleaner
- Force push — e avise o time

***

## Boas Práticas

**Commits pequenos e focados** — um commit por mudança lógica. Fica mais fácil de entender o histórico, reverter uma mudança específica e fazer code review.

**Nunca commite diretamente na `main`** — sempre passe por PR, mesmo que você seja o único desenvolvedor. O hábito salva quando o time crescer.

**Sempre atualize antes de abrir PR** — um PR desatualizado tem mais chance de conflito e de quebrar a `develop` ao ser mesclado.

**Mensagens de commit são documentação** — daqui a seis meses, você vai querer entender por que aquela mudança foi feita. `fix: corrigindo` não ajuda. `fix(auth): corrige redirecionamento para /login quando token expira no middleware de auth` ajuda muito.

***

> _Próximo documento: [`tratamento-de-erros.md`](./tratamento-de-erros.md)_
