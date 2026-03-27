# 📄 modules/documents — Documentos Oficiais

> Módulo responsável pelo cadastro e gestão dos documentos oficiais usados
> como evidência nas respostas do chatbot — Regulamento Geral das Fatecs,
> Manual de Estágio, Calendário Acadêmico e PPCs (RF02, RF04).
> Acesso restrito ao Administrador.

***

## 📑 Índice

- [Responsabilidade](#responsabilidade)
- [Estrutura de Arquivos](#estrutura)
- [Camadas](#camadas)
- [Modelo de dados](#modelo)
- [Endpoints](#endpoints)
- [Regras de Contribuição](#regras)

***

## 🎯 Responsabilidade <a id="responsabilidade"></a>

Este módulo gerencia os documentos oficiais e seus chunks indexados.
Um **documento** é o arquivo de origem (ex: Regulamento Geral das Fatecs).
Um **chunk** é um trecho extraído desse documento, com metadados de localização
(página, âncora), que é vinculado a um nó de navegação e exibido como
evidência ao usuário no chatbot.

| Responsabilidade | Arquivo |
| ---------------- | ------- |
| Listar e cadastrar documentos com chunks | `documents.routes.ts` |
| Lógica de criação e listagem | `documents.service.ts` |
| Receber requests e formatar respostas | `documents.controller.ts` |
| Tipagem dos DTOs e responses | `documents.types.ts` |

***

## 📁 Estrutura de Arquivos <a id="estrutura"></a>

```
modules/documents/
├── documents.controller.ts  # Recebe req, chama service, devolve resposta HTTP
├── documents.service.ts     # Lógica de criação e listagem de documentos e chunks
├── documents.routes.ts      # Define rotas protegidas (🔒 ADMIN)
└── documents.types.ts       # CreateDocumentDto, DocumentResponse, ChunkDto
```

***

## 🧱 Camadas <a id="camadas"></a>

### documents.routes.ts

Todas as rotas são protegidas por `authMiddleware` + `authorize('ADMIN')`:

```ts
router.use(authMiddleware)
router.use(authorize('ADMIN'))

router.get('/', documentsController.getAll)
router.post('/', documentsController.create)
```

O body do `POST /documents` é validado com Zod antes de chegar ao controller.

### documents.service.ts

**`getAll`** — lista todos os documentos cadastrados com contagem de chunks
associados. Não retorna o conteúdo dos chunks na listagem — apenas metadados
do documento.

**`create`** — cria o documento e seus chunks em uma única transação Prisma.
Se a criação de qualquer chunk falhar, toda a operação é revertida — nunca
persiste um documento sem chunks:

```ts
// ✅ Transação garante atomicidade
await prisma.$transaction(async (tx) => {
  const document = await tx.document.create({ data: documentData })

  await tx.documentChunk.createMany({
    data: dto.chunks.map((chunk) => ({
      ...chunk,
      documentId: document.id,
    })),
  })

  return document
})
```

### documents.controller.ts

Chama o service e formata a resposta HTTP. Não contém lógica de negócio:

```ts
// ✅ Controller fino — apenas orquestra
async create(req: Request, res: Response) {
  const document = await documentsService.create(req.body)
  res.status(201).json({ success: true, data: document })
}
```

### documents.types.ts

```ts
// Body esperado no POST /documents
interface CreateDocumentDto {
  title: string          // ex: "Regulamento Geral dos Cursos Superiores das Fatecs"
  description?: string
  chunks: ChunkDto[]
}

// Chunk individual dentro do DTO de criação
interface ChunkDto {
  text: string           // trecho extraído do documento
  page?: number          // página de origem
  anchor?: string        // âncora ou seção (ex: "Seção I, p. 25")
  nodeId?: string        // nó de navegação ao qual este chunk será vinculado
}

// Resposta de listagem
interface DocumentResponse {
  id: string
  title: string
  description: string | null
  chunkCount: number
  createdAt: string
}
```

***

## 🗄️ Modelo de dados <a id="modelo"></a>

```
Document
├── id           String   @id
├── title        String
├── description  String?
├── createdAt    DateTime
└── chunks       DocumentChunk[]

DocumentChunk
├── id          String   @id
├── text        String
├── page        Int?
├── anchor      String?
├── documentId  String   → Document
└── nodeId      String?  → ChatNode
```

> A relação entre `DocumentChunk` e `ChatNode` é opcional — um chunk pode
> existir sem estar vinculado a nenhum nó, mas só será exibido no chatbot
> quando vinculado a um nó do tipo `ANSWER`.

***

## 🔌 Endpoints <a id="endpoints"></a>

Documentação completa com exemplos de request/response em
[`docs/api-layer.md`](../../../../docs/api-layer.md).

| Método | Rota | Acesso | Descrição |
| ------ | ---- | :----: | --------- |
| `GET` | `/api/v1/documents` | 🔒 ADMIN | Lista todos os documentos |
| `POST` | `/api/v1/documents` | 🔒 ADMIN | Cadastra documento com chunks |

***

## 📐 Regras de Contribuição <a id="regras"></a>

- Documento e chunks devem ser sempre criados em **uma única transação** — nunca em requests separadas
- O service **nunca** retorna o objeto Prisma diretamente — mapeie sempre para os tipos de `documents.types.ts`
- Chunks sem `nodeId` são válidos — o vínculo com o nó pode ser feito posteriormente via `modules/nodes/`
- Não implemente edição ou remoção de chunks individuais sem avaliar o impacto nos nós vinculados
- Rotas deste módulo são **sempre protegidas** — nunca remova o `authMiddleware` ou o `authorize('ADMIN')`

***

> _Próximo módulo: [`../nodes/README.md`](../nodes/README.md)_