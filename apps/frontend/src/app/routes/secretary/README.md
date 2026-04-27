# 🗂️ routes/secretary — Painel da Secretária

> Componentes de página das rotas protegidas da secretária acadêmica (`/secretary/*`).
> Cada arquivo representa uma tela do painel e é responsável apenas por compor
> layout e features — a lógica de negócio vive em `features/secretary/`.

---

## 📑 Índice

- [Responsabilidade](#responsabilidade)
- [Rotas desta pasta](#rotas)
- [Arquivos](#arquivos)
- [Regras de Contribuição](#regras)

---

## 🎯 Responsabilidade <a id="responsabilidade"></a>

As páginas da secretária são o ponto de encontro entre o layout autenticado e as features
de gestão de perguntas (RF06). Elas **não implementam** lógica de dados — apenas
orquestram quais componentes de `features/secretary/` aparecem em cada tela.

Todo acesso a esta pasta é protegido por **duas camadas** declaradas em `router.tsx`:

```
Requisição → ProtectedRoute (valida autenticação) → RoleGuard('SECRETARIA') → Página
```

> ⚠️ **Nunca remova ou mova** o `RoleGuard` para dentro dos componentes de página.
> A proteção por role deve ser declarada no roteador, não nas folhas da árvore.

---

## 🗺️ Rotas desta pasta <a id="rotas"></a>

| Arquivo         | Rota                   | Descrição                                     | RF   |
| --------------- | ---------------------- | --------------------------------------------- | ---- |
| `dashboard.tsx` | `/secretary`           | Visão geral do painel da secretária           | RF06 |
| `questions.tsx` | `/secretary/questions` | Listagem e atualização de status de perguntas | RF06 |

---

## 📄 Arquivos <a id="arquivos"></a>

### dashboard.tsx

Tela inicial do painel da secretária. Exibe um resumo das perguntas recebidas,
destacando as pendentes de resposta. Compõe cards e indicadores de
`features/secretary/components/`.

### questions.tsx

Tela principal do fluxo de trabalho da secretária. Lista todas as perguntas enviadas
pelos alunos via chatbot (RF05), com filtro por status (`ABERTA`, `RESPONDIDA`).
A secretária pode atualizar o status de cada pergunta — a ação dispara uma `PATCH`
na API via mutation do TanStack Query, definida em `features/secretary/`.

> ⚠️ Esta tela é somente de **gestão de status** — a comunicação com o aluno
> ocorre fora do sistema, pelo e-mail institucional informado no envio da pergunta.

---

## 📐 Regras de Contribuição <a id="regras"></a>

- Componentes de página **importam apenas** de `features/secretary/`, `components/shared/` e utilitários de app
- **Nunca** faça fetch, mutation ou acesso direto ao Axios dentro desta pasta
- Toda nova rota de secretária deve ser declarada em `app/router.tsx` antes de criar o arquivo de página aqui
- O nome do arquivo deve espelhar o segmento de rota: `/secretary/questions` → `questions.tsx`
- Mantenha os arquivos pequenos — se o arquivo passar de ~50 linhas, a lógica provavelmente está no lugar errado

---

> _Este README deve ser atualizado sempre que uma nova rota da secretária
> for adicionada ou removida do projeto._

> _Próximo documento: [`../../../../README.md`](../../../../README.md)_
