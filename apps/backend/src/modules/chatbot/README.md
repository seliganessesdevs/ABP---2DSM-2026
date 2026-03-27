# 🤖 modules/chatbot — Navegação e Sessão

> Módulo responsável pela navegação pública do chatbot: entrega os nós da
> árvore de navegação ao frontend e registra o log de sessão com a avaliação
> de satisfação ao fim de cada atendimento (RF01, RF02, RF07, RF08).

***

## 📑 Índice

- [Responsabilidade](#responsabilidade)
- [Estrutura de Arquivos](#estrutura)
- [Camadas](#camadas)
- [Fluxo de navegação](#fluxo)
- [Endpoints](#endpoints)
- [Regras de Contribuição](#regras)

***

## 🎯 Responsabilidade <a id="responsabilidade"></a>

Este módulo expõe os nós de navegação para consumo público — nenhuma
autenticação é necessária. Também é responsável por registrar o log
completo de cada sessão de atendimento, incluindo a avaliação de satisfação
do usuário ao final.

A **gestão** dos nós (criar, editar, excluir) **não é responsabilidade deste módulo**
— ela pertence a `modules/nodes/`, que é protegida e restrita ao Administrador.

| Responsabilidade | Arquivo |
| ---------------- | ------- |
| Servir o nó raiz do chatbot | `chatbot.routes.ts` |
| Servir um nó específico com filhos e chunks | `chatbot.routes.ts` |
| Registrar log de sessão e satisfação | `chatbot.routes.ts` |
| Lógica de montagem do nó e registro de sessão | `chatbot.service.ts` |
| Receber requests e formatar respostas | `chatbot.controller.ts` |
| Tipagem dos nós, chunks e sessão | `chatbot.types.ts` |

***

## 📁 Estrutura de Arquivos <a id="estrutura"></a>

```
modules/chatbot/
├── chatbot.controller.ts  # Recebe req, chama service, devolve resposta HTTP
├── chatbot.service.ts     # Monta árvore de nós, registra sessão e satisfação
├── chatbot.routes.ts      # Define rotas públicas de navegação e sessão
└── chatbot.types.ts       # ChatNodeResponse, SessionLogDto, RatingDto
```

***

## 🧱 Camadas <a id="camadas"></a>

### chatbot.routes.ts

Define três rotas, todas **públicas** — sem `authMiddleware`:

```ts
router.get('/nodes/root', chatbotController.getRoot)
router.get('/nodes/:id', chatbotController.getNode)
router.post('/sessions/rating', chatbotController.registerRating)
```

O body do `POST /sessions/rating` é validado com Zod antes de chegar
ao controller.

### chatbot.service.ts

Contém toda a lógica de montagem da resposta de navegação e de registro
de sessão.

**`getRoot`** — busca o nó raiz (nó sem `parentId`) e retorna com seus
filhos diretos ordenados pelo campo `order`.

**`getNode`** — busca o nó pelo `id` e retorna com filhos diretos e
`DocumentChunk` associados. Se o nó não existir, lança
`AppError('Nó não encontrado', 404)`.

**`registerRating`** — cria um `SessionLog` no banco com o fluxo de
navegação percorrido, a avaliação de satisfação e os timestamps da sessão.

> O contrato HTTP canônico deste endpoint vive em [`../../../../../docs/api-layer.md`](../../../../../docs/api-layer.md).
> Se o nome de um campo divergir deste exemplo resumido, prevalece a documentação da camada de API.

```ts
// ✅ Estrutura do SessionLog registrado
await prisma.sessionLog.create({
  data: {
    navigationPath: dto.navigationPath, // array de IDs dos nós visitados
    satisfaction: dto.satisfaction,     // 'LIKED' | 'DISLIKED'
    startedAt: dto.startedAt,
    endedAt: dto.endedAt,
  },
})
```

### chatbot.controller.ts

Chama o service e formata a resposta HTTP. Não contém lógica de negócio:

```ts
// ✅ Controller fino — apenas orquestra
async getNode(req: Request, res: Response) {
  const node = await chatbotService.getNode(req.params.id)
  res.status(200).json({ success: true, data: node })
}
```

### chatbot.types.ts

```ts
// Resposta de um nó com filhos e chunks
interface ChatNodeResponse {
  id: string
  title: string
  content: string | null
  nodeType: 'MENU' | 'ANSWER'
  order: number
  children: ChatNodeResponse[]
  chunks: DocumentChunkResponse[]
}

// Chunk de evidência documental retornado com o nó
interface DocumentChunkResponse {
  id: string
  text: string
  source: string   // nome do documento
  page: number | null
  anchor: string | null
}

// Body esperado no POST /sessions/rating
interface RatingDto {
  navigationPath: string[]       // IDs dos nós visitados na ordem
  satisfaction: 'LIKED' | 'DISLIKED'
  startedAt: string
  endedAt: string
}
```

***

## 🔄 Fluxo de navegação <a id="fluxo"></a>

```
Frontend carrega → GET /nodes/root
        ↓
Retorna nó raiz com filhos (opções do menu inicial)
        ↓
Usuário escolhe opção → GET /nodes/:id
        ↓
Retorna nó filho com seus filhos e chunks associados
        ↓  (repete até nó do tipo ANSWER)
Nó ANSWER → exibe resposta + chunks de evidência
        ↓
Usuário avalia → POST /sessions/rating
        ↓
SessionLog registrado no banco → 201
```

> ⚠️ Nós do tipo `MENU` sempre têm filhos — o frontend exibe as opções
> como botões navegáveis. Nós do tipo `ANSWER` nunca têm filhos — o
> frontend exibe a resposta final com os chunks de evidência.

***

## 🔌 Endpoints <a id="endpoints"></a>

Documentação completa com exemplos de request/response em
[`docs/api-layer.md`](../../../../../docs/api-layer.md).

| Método | Rota | Acesso | Descrição |
| ------ | ---- | :----: | --------- |
| `GET` | `/api/v1/nodes/root` | Público | Retorna o nó raiz com filhos |
| `GET` | `/api/v1/nodes/:id` | Público | Retorna nó com filhos e chunks |
| `POST` | `/api/v1/sessions/rating` | Público | Registra sessão e satisfação |

***

## 📐 Regras de Contribuição <a id="regras"></a>

- As rotas deste módulo são **sempre públicas** — nunca adicione `authMiddleware` aqui
- O service **nunca** retorna o objeto Prisma diretamente — mapeie sempre para os tipos de `chatbot.types.ts` antes de retornar
- A ordem dos filhos de um nó deve **sempre** respeitar o campo `order` — nunca confie na ordem de inserção do banco
- Lógica de CRUD de nós não pertence aqui — qualquer criação, edição ou remoção vai em `modules/nodes/`
- Um `SessionLog` deve ser criado apenas quando o usuário efetivamente concluir o atendimento e avaliar — não registre sessões parciais

***

> _Próximo documento: [`../questions/README.md`](../questions/README.md)_
