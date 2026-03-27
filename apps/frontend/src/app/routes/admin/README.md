
# 🔒 routes/admin — Painel do Administrador

> Componentes de página das rotas protegidas do administrador (`/admin/*`).
> Cada arquivo representa uma tela do painel e é responsável apenas por compor
> layout e features — a lógica de negócio vive em `features/admin/`.

***

## 📑 Índice

- [Responsabilidade](#responsabilidade)
- [Rotas desta pasta](#rotas)
- [Arquivos](#arquivos)
- [Regras de Contribuição](#regras)

***

## 🎯 Responsabilidade <a id="responsabilidade"></a>

As páginas de admin são o ponto de encontro entre o layout autenticado e as features
de gestão de conteúdo (RF04). Elas **não implementam** lógica de dados — apenas
orquestram quais componentes de `features/admin/` aparecem em cada tela.

Todo acesso a esta pasta é protegido por **duas camadas** declaradas em `router.tsx`:


Requisição → ProtectedRoute (valida autenticação) → RoleGuard('ADMIN') → Página


> ⚠️ **Nunca remova ou mova** o `RoleGuard` para dentro dos componentes de página.
> A proteção por role deve ser declarada no roteador, não nas folhas da árvore.

***

## 🗺️ Rotas desta pasta <a id="rotas"></a>

| Arquivo         | Rota                | Descrição                              | RF       |
| --------------- | ------------------- | -------------------------------------- | -------- |
| `dashboard.tsx` | `/admin`            | Visão geral do painel administrativo   | RF04     |
| `nodes.tsx`     | `/admin/nodes`      | CRUD de nós de navegação do chatbot    | RF04     |
| `documents.tsx` | `/admin/documents`  | Gestão de documentos oficiais e chunks | RF02     |
| `users.tsx`     | `/admin/users`      | Criação e remoção de usuários          | RF04     |
| `logs.tsx`      | `/admin/logs`       | Visualização de logs de atendimento    | RF08     |

***

## 📄 Arquivos <a id="arquivos"></a>

### dashboard.tsx

Tela inicial do painel. Exibe uma visão consolidada do sistema — resumo de perguntas
pendentes, nós cadastrados e interações recentes. Compõe cards e widgets de
`features/admin/components/`.

### nodes.tsx

Tela de gestão da árvore de navegação do chatbot. Permite criar, editar, reordenar
e excluir nós do tipo `MENU` e `ANSWER`. A exclusão é bloqueada quando o nó possui
filhos — essa regra é aplicada e validada no backend.

### documents.tsx

Tela de gestão de documentos oficiais (Regulamento Geral, Manual de Estágio,
Calendário Acadêmico, PPCs). Cada documento pode ter múltiplos chunks indexados,
usados como evidência nas respostas do chatbot (RF02).

### users.tsx

Tela de gestão dos usuários do perfil Secretária Acadêmica. O administrador pode
criar novos usuários e remover existentes. **Não é possível criar outros administradores
por esta interface** — o administrador padrão é criado via seed.

### logs.tsx

Tela de visualização dos logs de atendimento registrados pelo sistema (RF08).
Exibe o fluxo de navegação, perguntas enviadas, avaliações de satisfação e
data/hora de cada interação. Somente leitura — nenhuma ação de escrita disponível.

***

## 📐 Regras de Contribuição <a id="regras"></a>

- Componentes de página **importam apenas** de `features/admin/` e `components/layout/`
- **Nunca** faça fetch, mutation ou acesso direto ao Axios dentro desta pasta
- Toda nova rota de admin deve ser declarada em `app/router.tsx` antes de criar o arquivo de página aqui
- O nome do arquivo deve espelhar o segmento de rota: `/admin/nodes` → `nodes.tsx`
- Mantenha os arquivos pequenos — se o arquivo passar de ~50 linhas, a lógica provavelmente está no lugar errado

***

> _Este README deve ser atualizado sempre que uma nova rota de administrador
> for adicionada ou removida do projeto._

> _Próximo documento: [`../secretary/README.md`](../secretary/README.md)_
