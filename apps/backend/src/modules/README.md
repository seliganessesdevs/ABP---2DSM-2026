# 📁 src/modules/

O coração da aplicação. Cada módulo representa um **domínio de negócio** — um conjunto de funcionalidades relacionadas. Toda lógica de negócio, validação de entrada e acesso ao banco vive aqui.

---

## Estrutura

```
modules/
├── auth/
├── chatbot/
├── questions/
├── nodes/
├── users/
└── logs/
```

Cada módulo segue a mesma estrutura interna:

```
<modulo>/
├── <modulo>.routes.ts      # Caminhos, métodos HTTP e middlewares da rota
├── <modulo>.controller.ts  # Lê req, chama service, escreve res
├── <modulo>.service.ts     # Lógica de negócio e acesso ao banco
└── <modulo>.types.ts       # Tipos, interfaces e DTOs do módulo
```

---

## Responsabilidade de Cada Camada

### `routes.ts`

Define os endpoints do módulo, aplica os middlewares corretos e conecta cada rota ao controller. Não contém lógica — apenas configuração.

```ts
router.post("/", validate(createQuestionSchema), controller.create);
router.get(
  "/",
  authMiddleware,
  authorize("ADMIN", "SECRETARY"),
  controller.list,
);
router.patch(
  "/:id",
  authMiddleware,
  authorize("ADMIN", "SECRETARY"),
  controller.update,
);
```

### `controller.ts`

Recebe a requisição, extrai os dados do `req`, chama o service e devolve a resposta. Não contém lógica de negócio — não fala com o Prisma diretamente, não tem `if` de regra.

```ts
// O controller sabe sobre HTTP. O service não sabe.
const list = async (req, res, next) => {
  try {
    const result = await this.service.list(req.query);
    res.status(200).json({ success: true, data: result });
  } catch (error) {
    next(error);
  }
};
```

### `service.ts`

Toda a lógica de negócio vive aqui. Valida regras, fala com o Prisma, lança `AppError` quando algo não está certo. Não conhece `req`, `res` ou status codes — recebe dados, retorna dados.

### `types.ts`

Tipos TypeScript e DTOs do módulo. Gerados com `z.infer` a partir dos schemas Zod quando possível — sem duplicação.

---

## Os Módulos

### `auth/`

Responsável pelo login. Recebe email e senha, valida com Argon2id, retorna o JWT. Não tem rotas autenticadas — é o ponto de entrada de toda autenticação.

**Endpoint:** `POST /auth/login`

---

### `chatbot/`

Navega na árvore de `ChatNode` e registra sessões. É o módulo mais acessado — todas as interações do aluno passam aqui. Rotas públicas — sem autenticação.

**Endpoints:**

- `GET /nodes/root` — retorna o nó raiz para iniciar a navegação
- `GET /nodes/:id` — retorna um nó com filhos e evidência
- `POST /sessions/log` — registra log de sessão e satisfação

---

### `questions/`

Gerencia as perguntas enviadas pelos alunos à secretaria. Criação é pública — qualquer aluno pode enviar nome, texto, e-mail institucional e anexo opcional (PDF/JPG/PNG · máx. 5 MB). Listagem e atualização exigem autenticação.

**Endpoints:**

- `POST /questions` — público — aluno envia pergunta
- `GET /questions` — ADMIN ou SECRETARIA
- `PATCH /questions/:id` — ADMIN ou SECRETARIA

---

### `nodes/`

CRUD completo dos nós de navegação do chatbot. Exclusivo para administradores. Um nó não pode ser removido se tiver filhos — o service valida isso antes de deletar.

**Endpoints:** `GET`, `POST`, `PATCH`, `DELETE` em `/nodes` — todos ADMIN.

---

### `users/`

Gerencia os usuários da secretaria (ADMIN e SECRETARIA). O admin cria, lista e remove usuários. Senhas são sempre armazenadas com hash — nunca em texto puro.

**Endpoints:** `GET`, `POST`, `DELETE` em `/users` — todos ADMIN.

---

### `logs/`

Somente leitura. Expõe os registros de sessão gerados pelo módulo `chatbot` para visualização no painel do administrador.

**Endpoint:** `GET /logs` — ADMIN.

---

## Regras de contribuição

- **Nunca** acesse o Prisma fora do `service.ts` — controllers não falam com o banco
- **Nunca** importe um módulo dentro de outro — se precisar de dados de outro domínio, chame o service correspondente
- Todo novo módulo deve ser registrado em `src/routes/index.ts` com seu prefixo
- Schemas Zod ficam no `routes.ts` ou em arquivo separado `<modulo>.schema.ts` se forem grandes
- Erros de negócio sempre lançam `AppError` — nunca `res.status()` direto no service

---

> _Próximo documento: [`./auth/README.md`](./auth/README.md)_
