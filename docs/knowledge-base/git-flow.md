# Git Flow — Guia para Iniciantes

Git Flow é uma convenção de como organizar branches e commits no Git. Não é uma tecnologia — é um acordo de equipe. Sem ele, um projeto com vários desenvolvedores vira caos: código quebrado na branch principal, histórico impossível de ler, conflitos constantes.

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

Você cria uma branch nova para cada tarefa. Quando termina, abre um Pull Request para `develop`.

**Convenção de nomes:**

```bash
feature/nome-da-feature      # nova funcionalidade
fix/descricao-do-bug         # correção de bug
chore/descricao-da-tarefa    # tarefa técnica sem impacto direto no usuário
docs/descricao               # documentação
refactor/descricao           # refatoração sem mudança de comportamento
```

**Exemplos reais:**

```bash
feature/login-jwt
feature/listagem-perguntas
fix/token-expirado-nao-redirecionava
chore/configurar-eslint
docs/atualizar-readme
```

***

## O Fluxo do Dia a Dia

```bash
# 1. Atualiza seu repositório local
git checkout develop
git pull origin develop

# 2. Cria a branch da sua tarefa a partir da develop
git checkout -b feature/listagem-perguntas

# 3. Trabalha, commita conforme avança
git add .
git commit -m "feat: adiciona endpoint de listagem de perguntas"
git commit -m "feat: adiciona filtro por status na listagem"
git commit -m "test: adiciona testes da listagem de perguntas"

# 4. Antes de abrir PR, atualiza com o que mudou na develop
git pull origin develop --rebase

# 5. Envia para o repositório remoto
git push origin feature/listagem-perguntas

# 6. Abre Pull Request no GitHub: feature/... → develop
```

***

## Commits 

Nós usaremos uma convenção para nomear commits de forma padronizada. O formato é:

```
tipo(escopo): descrição curta no imperativo
```

| Tipo | Quando usar |
|---|---|
| `feat` | Nova funcionalidade |
| `fix` | Correção de bug |
| `chore` | Tarefa técnica — dependências, configurações |
| `docs` | Documentação |
| `refactor` | Refatoração sem mudança de comportamento |
| `test` | Adição ou correção de testes |
| `style` | Formatação, espaçamento — sem mudança de lógica |

**Exemplos:**

```bash
git commit -m "feat(auth): adiciona autenticação JWT"
git commit -m "fix(auth): corrige redirecionamento após token expirado"
git commit -m "chore(backend): atualiza dependências do backend"
git commit -m "test(chatbot): adiciona testes de integração para login"
git commit -m "refactor(utils): extrai lógica de hash para utilitário"
```

**Regras para a descrição:**
- Imperativo — "adiciona", não "adicionado" ou "adicionando"
- Minúsculo
- Sem ponto no final
- Curta — no máximo 72 caracteres

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

```
node_modules/       # dependências — regeneradas com pnpm install
.env                # variáveis de ambiente — contém segredos
dist/               # código compilado — gerado no build
.DS_Store           # arquivo de sistema do macOS
*.log               # arquivos de log
coverage/           # relatório de cobertura de testes
```

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

**Mensagens de commit são documentação** — daqui a seis meses, você vai querer entender por que aquela mudança foi feita. "fix: corrige" não ajuda. "fix: corrige redirecionamento para /login quando token expira no middleware de auth" ajuda muito.