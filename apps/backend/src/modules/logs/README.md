# 📋 modules/logs — Logs de Atendimento

> Módulo responsável pela visualização dos logs de atendimento registrados
> pelo sistema. Expõe os registros de sessão para auditoria e análise de uso
> pelo Administrador (RF08). Somente leitura — nenhuma escrita ocorre aqui.

---

## 📑 Índice

- [Responsabilidade](#responsabilidade)
- [Estrutura de Arquivos](#estrutura)
- [Camadas](#camadas)
- [Modelo de dados](#modelo)
- [Endpoints](#endpoints)
- [Regras de Contribuição](#regras)

---

## 🎯 Responsabilidade <a id="responsabilidade"></a>

Este módulo é **exclusivamente de leitura**. Os logs são criados pelo
`modules/chatbot/` quando o usuário conclui um atendimento e registra
sua avaliação — este módulo apenas os expõe para consulta pelo Administrador.

| Responsabilidade                      | Arquivo              |
| ------------------------------------- | -------------------- |
| Listagem de logs com filtros          | `logs.routes.ts`     |
| Lógica de consulta e paginação        | `logs.service.ts`    |
| Receber requests e formatar respostas | `logs.controller.ts` |
| Tipagem dos filtros e responses       | `logs.types.ts`      |

---

## 📁 Estrutura de Arquivos <a id="estrutura"></a>

```
modules/logs/
├── logs.controller.ts  # Recebe req, chama service, devolve resposta HTTP
├── logs.service.ts     # Lógica de consulta, filtros e paginação
├── logs.routes.ts      # Define rota protegida (🔒 ADMIN)
└── logs.types.ts       # LogFiltersDto, SessionLogResponse
```

---

## 🧱 Camadas <a id="camadas"></a>

### logs.routes.ts

Rota única protegida por `authMiddleware` + `authorize('ADMIN')`:

```ts
router.use(authMiddleware);
router.use(authorize("ADMIN"));

router.get("/", logsController.getAll);
```

Os filtros são recebidos via **query params** — não há body nesta rota.

### logs.service.ts

**`getAll`** — lista os logs de atendimento com suporte a filtros opcionais
por data e avaliação, ordenados do mais recente para o mais antigo.
Implementa paginação via `page` e `limit` para não sobrecarregar a resposta:

```ts
// ✅ Filtros opcionais via query params
// GET /logs?flag=ATENDEU&from=2026-03-01&to=2026-03-31&page=1&limit=20

const where: Prisma.SessionLogWhereInput = {};

if (flag) where.flag = flag;
if (from || to) {
  where.createdAt = {
    ...(from && { gte: new Date(from) }),
    ...(to && { lte: new Date(to) }),
  };
}

const [logs, total] = await prisma.$transaction([
  prisma.sessionLog.findMany({
    where,
    orderBy: { createdAt: "desc" },
    skip: (page - 1) * limit,
    take: limit,
  }),
  prisma.sessionLog.count({ where }),
]);
```

### logs.controller.ts

Chama o service e formata a resposta HTTP com metadados de paginação.
Não contém lógica de negócio:

```ts
// ✅ Controller fino — inclui metadados de paginação na resposta
async getAll(req: Request, res: Response) {
  const result = await logsService.getAll(req.query)
  res.status(200).json({
    success: true,
    data: result.logs,
    meta: {
      total: result.total,
      page: result.page,
      limit: result.limit,
    },
  })
}
```

### logs.types.ts

```ts
// Query params aceitos no GET /logs
interface LogFiltersDto {
  flag?: "ATENDEU" | "NAO_ATENDEU";
  from?: string; // ISO 8601 — ex: "2026-03-01"
  to?: string; // ISO 8601 — ex: "2026-03-31"
  page?: number; // padrão: 1
  limit?: number; // padrão: 20
}

// Resposta individual de um log
interface SessionLogResponse {
  id: number;
  navigation_flow: string[];
  flag: "ATENDEU" | "NAO_ATENDEU";
  created_at: string;
}

// Resposta paginada
interface PaginatedLogsResponse {
  logs: SessionLogResponse[];
  meta: {
    total: number;
    page: number;
    limit: number;
  };
}
```

---

## 🗄️ Modelo de dados <a id="modelo"></a>

```
SessionLog
├── id              Int       @id
├── navigation_flow String[]  (array de slugs/etapas visitadas)
├── flag            Rating    (ATENDEU | NAO_ATENDEU)
└── created_at      DateTime
```

> Os logs são **imutáveis** — uma vez criados pelo `modules/chatbot/`,
> não podem ser editados ou removidos. Não implemente `PUT`, `PATCH`
> ou `DELETE` neste módulo.

---

## 🔌 Endpoints <a id="endpoints"></a>

Documentação completa com exemplos de request/response em
[`docs/api-layer.md`](../../../../../docs/api-layer.md).

| Método | Rota           |  Acesso  | Descrição                 |
| ------ | -------------- | :------: | ------------------------- |
| `GET`  | `/api/v1/logs` | 🔒 ADMIN | Lista logs de atendimento |

---

## 📐 Regras de Contribuição <a id="regras"></a>

- Este módulo é **somente leitura** — nunca implemente `POST`, `PUT`, `PATCH` ou `DELETE` aqui
- A criação de logs é responsabilidade exclusiva de `modules/chatbot/` — nunca importe o Prisma de logs direto no chatbot, use o model `SessionLog` via Prisma normalmente
- **Sempre pagine** os resultados — logs podem crescer rapidamente e uma query sem `limit` pode travar o banco
- Os filtros de data devem usar `gte` e `lte` no Prisma — nunca filtre em memória após buscar todos os registros
- Rotas deste módulo são **sempre protegidas** — nunca remova o `authMiddleware` ou o `authorize('ADMIN')`
- O `navigation_flow` é uma trilha de navegação — não resolva títulos de nós neste módulo para manter a query simples

---

> _Próximo documento: [`../../../../../docs/api-layer.md`](../../../../../docs/api-layer.md)_
