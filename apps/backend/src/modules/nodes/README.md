# 🌳 modules/nodes — Nós de Navegação

> Módulo responsável pelo CRUD completo da árvore de navegação do chatbot.
> Cada nó representa um menu, submenu ou resposta final que o usuário
> percorre durante o atendimento (RF02, RF04).
> Acesso restrito ao Administrador.

***

## 📑 Índice

- [Responsabilidade](#responsabilidade)
- [Estrutura de Arquivos](#estrutura)
- [Camadas](#camadas)
- [Modelo de dados](#modelo)
- [Tipos de nó](#tipos)
- [Endpoints](#endpoints)
- [Regras de Contribuição](#regras)

***

## 🎯 Responsabilidade <a id="responsabilidade"></a>

Este módulo permite ao Administrador construir e manter a árvore de
navegação que o chatbot usa para guiar o usuário. A **leitura pública**
dos nós — consumida pelo frontend durante o atendimento — é responsabilidade
de `modules/chatbot/`, não deste módulo.

| Responsabilidade | Arquivo |
| ---------------- | ------- |
| CRUD de nós de navegação | `nodes.routes.ts` |
| Lógica de criação, edição e remoção | `nodes.service.ts` |
| Receber requests e formatar respostas | `nodes.controller.ts` |
| Tipagem dos DTOs e responses | `nodes.types.ts` |

***

## 📁 Estrutura de Arquivos <a id="estrutura"></a>

```
modules/nodes/
├── nodes.controller.ts  # Recebe req, chama service, devolve resposta HTTP
├── nodes.service.ts     # Lógica de CRUD e validações de integridade da árvore
├── nodes.routes.ts      # Define rotas protegidas (🔒 ADMIN)
└── nodes.types.ts       # CreateNodeDto, UpdateNodeDto, NodeResponse
```

***

## 🧱 Camadas <a id="camadas"></a>

### nodes.routes.ts

Todas as rotas são protegidas por `authMiddleware` + `authorize('ADMIN')`.
Bodies de `POST` e `PATCH` são validados com Zod antes de chegar ao controller:

```ts
router.use(authMiddleware)
router.use(authorize('ADMIN'))

router.get('/', nodesController.getAll)
router.post('/', nodesController.create)
router.patch('/:id', nodesController.update)
router.delete('/:id', nodesController.remove)
```

### nodes.service.ts

**`getAll`** — lista todos os nós com seus metadados. Não expande filhos
recursivamente — o frontend monta a árvore com base no `parentId`.

**`create`** — cria um novo nó. Valida que o `parentId`, se informado,
existe no banco. Nós raiz têm `parentId: null`.

**`update`** — atualiza campos de um nó existente. Não permite alterar
o `parentId` — mover um nó na árvore não é suportado para evitar
inconsistências na hierarquia.

**`remove`** — remove um nó. **Bloqueado se o nó tiver filhos** — a
árvore nunca pode ficar com filhos órfãos:

```ts
// ✅ Verificação antes de deletar
const childCount = await prisma.chatNode.count({
  where: { parentId: id },
})

if (childCount > 0) {
  throw new AppError(
    'Não é possível remover um nó com filhos. Remova os filhos primeiro.',
    409,
  )
}
```

### nodes.controller.ts

Chama o service e formata a resposta HTTP. Não contém lógica de negócio:

```ts
// ✅ Controller fino — apenas orquestra
async remove(req: Request, res: Response) {
  await nodesService.remove(req.params.id)
  res.status(204).send()
}
```

### nodes.types.ts

```ts
// Body esperado no POST /nodes
interface CreateNodeDto {
  title: string
  content?: string       // obrigatório para nós do tipo ANSWER
  nodeType: 'MENU' | 'ANSWER'
  parentId: string | null
  order: number          // posição entre os irmãos — começa em 0
}

// Body esperado no PATCH /nodes/:id
interface UpdateNodeDto {
  title?: string
  content?: string
  nodeType?: 'MENU' | 'ANSWER'
  order?: number
}

// Resposta retornada ao frontend
interface NodeResponse {
  id: string
  title: string
  content: string | null
  nodeType: 'MENU' | 'ANSWER'
  parentId: string | null
  order: number
  createdAt: string
  updatedAt: string
}
```

***

## 🗄️ Modelo de dados <a id="modelo"></a>

```
ChatNode
├── id        String    @id
├── title     String
├── content   String?
├── nodeType  NodeType  (MENU | ANSWER)
├── parentId  String?   → ChatNode (auto-referência)
├── order     Int
├── createdAt DateTime
├── updatedAt DateTime
├── children  ChatNode[]
└── chunks    DocumentChunk[]
```

A estrutura é uma **árvore recursiva auto-referenciada** — cada nó
aponta para seu pai via `parentId`. O nó raiz tem `parentId: null`.

***

## 🌿 Tipos de nó <a id="tipos"></a>

| Tipo | Tem filhos | Tem conteúdo | Comportamento no chatbot |
| ---- | :--------: | :----------: | ------------------------ |
| `MENU` | ✅ Sim | ❌ Não | Exibe título e lista de filhos como botões de opção |
| `ANSWER` | ❌ Não | ✅ Sim | Exibe conteúdo como resposta final + chunks de evidência |

> ⚠️ Um nó `MENU` sem filhos ou um nó `ANSWER` sem conteúdo são estados
> inválidos — o service deve validar isso na criação e atualização.

***

## 🔌 Endpoints <a id="endpoints"></a>

Documentação completa com exemplos de request/response em
[`docs/api-layer.md`](../../../../docs/api-layer.md).

| Método | Rota | Acesso | Descrição |
| ------ | ---- | :----: | --------- |
| `GET` | `/api/v1/nodes` | 🔒 ADMIN | Lista todos os nós |
| `POST` | `/api/v1/nodes` | 🔒 ADMIN | Cria novo nó de navegação |
| `PATCH` | `/api/v1/nodes/:id` | 🔒 ADMIN | Atualiza nó existente |
| `DELETE` | `/api/v1/nodes/:id` | 🔒 ADMIN | Remove nó (bloqueado se tiver filhos) |

***

## 📐 Regras de Contribuição <a id="regras"></a>

- **Nunca permita remover** um nó com filhos — a integridade da árvore é inegociável
- Nós do tipo `ANSWER` **devem ter** `content` — valide isso no service, não apenas no schema Zod
- Nós do tipo `MENU` **não devem ter** `content` — o campo é ignorado se enviado
- O campo `order` define a posição do nó entre seus irmãos — o frontend depende disso para renderizar as opções na ordem correta
- **Não exponha** as rotas deste módulo publicamente — a leitura pública dos nós é exclusividade de `modules/chatbot/`
- Mover um nó de pai (`parentId`) não é suportado — rejeite alterações de `parentId` no `update` com `400 Bad Request`

***

> _Próximo módulo: [`../questions/README.md`](../questions/README.md)_