# ❓ modules/questions — Perguntas à Secretaria

> Módulo responsável pelo envio de dúvidas ao fim do atendimento e pela
> gestão do status dessas perguntas pela Secretária Acadêmica.
> Cobre o fluxo completo de uma pergunta — do envio pelo aluno até a
> marcação como respondida (RF05, RF06).

---

## 📑 Índice

- [Responsabilidade](#responsabilidade)
- [Estrutura de Arquivos](#estrutura)
- [Camadas](#camadas)
- [Ciclo de vida de uma pergunta](#ciclo)
- [Endpoints](#endpoints)
- [Regras de Contribuição](#regras)

---

## 🎯 Responsabilidade <a id="responsabilidade"></a>

Este módulo tem dois públicos distintos com responsabilidades diferentes:

| Quem               | O que pode fazer                                 |    Acesso    |
| ------------------ | ------------------------------------------------ | :----------: |
| Aluno              | Enviar uma pergunta com e-mail e texto da dúvida |   Público    |
| Secretária / Admin | Listar perguntas e atualizar status              | 🔒 SEC/ADMIN |

A separação de acesso é feita na própria rota — o mesmo módulo atende
os dois perfis com middlewares diferentes por endpoint.

| Responsabilidade                      | Arquivo                   |
| ------------------------------------- | ------------------------- |
| Envio e gestão de perguntas           | `questions.routes.ts`     |
| Lógica de criação e atualização       | `questions.service.ts`    |
| Receber requests e formatar respostas | `questions.controller.ts` |
| Tipagem dos DTOs e responses          | `questions.types.ts`      |

---

## 📁 Estrutura de Arquivos <a id="estrutura"></a>

```
modules/questions/
├── questions.controller.ts  # Recebe req, chama service, devolve resposta HTTP
├── questions.service.ts     # Lógica de criação, listagem e atualização de status
├── questions.routes.ts      # Define rotas públicas e protegidas
└── questions.types.ts       # CreateQuestionDto, UpdateStatusDto, QuestionResponse
```

---

## 🧱 Camadas <a id="camadas"></a>

### questions.routes.ts

Rotas com níveis de acesso diferentes no mesmo módulo:

```ts
// Público — aluno envia pergunta
router.post("/", questionsController.create);

// Protegido — secretária e admin gerenciam
router.get(
  "/",
  authMiddleware,
  authorize("SECRETARIA", "ADMIN"),
  questionsController.getAll,
);
router.patch(
  "/:id",
  authMiddleware,
  authorize("SECRETARIA", "ADMIN"),
  questionsController.updateStatus,
);
```

Bodies de `POST` e `PATCH` são validados com Zod antes de chegar ao controller.

### questions.service.ts

**`create`** — registra a pergunta no banco com status inicial `ABERTA`.
Não valida se o e-mail pertence a um aluno cadastrado — o acesso ao chatbot
é público e sem autenticação:

```ts
await prisma.question.create({
  data: {
    requester_name: dto.requester_name,
    question: dto.question,
    requester_email: dto.requester_email,
    status: "ABERTA",
  },
});
```

**`getAll`** — lista todas as perguntas ordenadas pela mais recente.
Suporta filtro opcional por `status` via query param:

```ts
// GET /questions?status=ABERTA
const where = status ? { status } : {};
return prisma.question.findMany({ where, orderBy: { createdAt: "desc" } });
```

**`updateStatus`** — atualiza o status de uma pergunta. Valida que a
pergunta existe antes de atualizar — lança `AppError('Pergunta não encontrada', 404)`
se o `id` não existir no banco.

> A transição canônica de status está definida em [`../../../../../docs/api-layer.md`](../../../../../docs/api-layer.md):
> `Question` só pode ir de `ABERTA` para `RESPONDIDA`.

### questions.controller.ts

Chama o service e formata a resposta HTTP. Não contém lógica de negócio:

```ts
// ✅ Controller fino — apenas orquestra
async updateStatus(req: Request, res: Response) {
  const question = await questionsService.updateStatus(req.params.id, req.body)
  res.status(200).json({ success: true, data: question })
}
```

### questions.types.ts

```ts
// Body esperado no POST /questions
interface CreateQuestionDto {
  requester_name: string;
  question: string;
  requester_email: string;
}

// Body esperado no PATCH /questions/:id
interface UpdateStatusDto {
  status: "RESPONDIDA";
}

// Resposta retornada ao frontend
interface QuestionResponse {
  id: number;
  requester_name: string;
  question: string;
  requester_email: string;
  status: "ABERTA" | "RESPONDIDA";
  created_at: string;
  updated_at: string;
}
```

---

## 🔄 Ciclo de vida de uma pergunta <a id="ciclo"></a>

```
Aluno finaliza atendimento no chatbot
        ↓
Preenche QuestionForm → POST /questions { text, email }
        ↓
Pergunta criada com status ABERTA → 201
        ↓
Secretária acessa painel → GET /questions?status=ABERTA
        ↓
Secretária responde o aluno por e-mail (fora do sistema)
        ↓
Secretária atualiza status → PATCH /questions/:id { status: 'RESPONDIDA' }
        ↓
Pergunta marcada como RESPONDIDA → 200
```

> ⚠️ O sistema **não envia e-mails** — ele apenas armazena o e-mail informado
> pelo aluno para que a secretária possa respondê-lo fora da plataforma.
> Não implemente envio de e-mail sem validar com o PO primeiro.

---

## 🔌 Endpoints <a id="endpoints"></a>

Documentação completa com exemplos de request/response em
[`docs/api-layer.md`](../../../../../docs/api-layer.md).

| Método  | Rota                    |    Acesso    | Descrição                   |
| ------- | ----------------------- | :----------: | --------------------------- |
| `POST`  | `/api/v1/questions`     |   Público    | Envia pergunta à secretaria |
| `GET`   | `/api/v1/questions`     | 🔒 SEC/ADMIN | Lista perguntas recebidas   |
| `PATCH` | `/api/v1/questions/:id` | 🔒 SEC/ADMIN | Atualiza status da pergunta |

---

## 📐 Regras de Contribuição <a id="regras"></a>

- O `POST /questions` é **sempre público** — nunca adicione `authMiddleware` nesta rota
- O status inicial de toda pergunta criada é sempre `ABERTA` — nunca aceite status no body do `POST`
- Não valide se o e-mail pertence a um aluno cadastrado — o chatbot é público e sem autenticação
- O sistema **não envia e-mails** — apenas armazena o endereço para uso externo pela secretária
- Novos status além de `ABERTA` e `RESPONDIDA` exigem alinhamento com o PO e atualização do enum no schema Prisma
- O `GET /questions` deve sempre suportar filtro por `status` via query param — não quebre essa interface

---

> _Próximo documento: [`../users/README.md`](../users/README.md)_
