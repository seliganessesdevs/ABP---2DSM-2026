# 🧪 Estratégia de Testes

> Este documento define a pirâmide de testes adotada no **FatecBot**, as ferramentas
> utilizadas em cada camada e exemplos concretos de implementação.
> Todo código entregue em PR deve ter testes cobrindo a lógica de negócio central.

---

## 📑 Índice

- [Pirâmide de Testes](#pirâmide-de-testes)
- [Ferramentas](#ferramentas)
- [Configuração](#configuração)
- [Testes Unitários — Frontend](#testes-unitários--frontend)
- [Testes Unitários — Backend](#testes-unitários--backend)
- [Testes de Integração — Backend](#testes-de-integração--backend)
- [Mínimo Obrigatório por Sprint](#minimo-obrigatorio-por-sprint)
- [Estratégia Ideal](#estrategia-ideal)
- [Convenções](#convenções)

---

## 🔺 Pirâmide de Testes <a id="pirâmide-de-testes"></a>

```
           /\
          /  \
         / E2E\          → Poucos, lentos, cobrem fluxos críticos de ponta a ponta
        /──────\           (fora do escopo do MVP — planejado para sprint 3)
       /        \
      /Integração\       → Médios: testam módulos reais com banco em memória
     /────────────\
    /              \
   /   Unitários    \    → Muitos, rápidos: funções puras, hooks, services isolados
  /──────────────────\
```

| Camada     | Quantidade | Velocidade | Foco                                              |
| ---------- | :--------: | :--------: | ------------------------------------------------- |
| Unitários  |    ~70%    | < 1s cada  | Funções puras, hooks, services (sem I/O real)     |
| Integração |    ~25%    | ~3–5s cada | Controllers + services com banco de teste isolado |
| E2E        |    ~5%     |  ~10–30s   | Fluxo completo do chatbot (planejado — Sprint 3)  |

---

## 🛠️ Ferramentas <a id="ferramentas"></a>

| Ferramenta                      | Camada               | Uso                                             |
| ------------------------------- | -------------------- | ----------------------------------------------- |
| **Vitest**                      | Unit + Integração    | Test runner principal (frontend e backend)      |
| **@testing-library/react**      | Unit (Frontend)      | Renderiza componentes e simula interações       |
| **@testing-library/user-event** | Unit (Frontend)      | Simula eventos do usuário (click, type, etc.)   |
| **msw** (Mock Service Worker)   | Unit (Frontend)      | Intercepta requisições HTTP no teste            |
| **supertest**                   | Integração (Backend) | Dispara requisições HTTP reais contra o Express |
| **Prisma mocks**                | Integração (Backend) | Mock do PrismaClient para isolamento do banco   |

---

## ⚙️ Configuração <a id="configuração"></a>

### `vitest.config.ts` (Frontend)

```ts
import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [react()],
  test: {
    environment: "jsdom", // Simula o DOM do browser
    globals: true, // Habilita describe/it/expect sem import
    setupFiles: ["./src/testing/setup.ts"],
    coverage: {
      provider: "v8",
      reporter: ["text", "html"],
      exclude: ["src/components/ui/**", "src/testing/**"],
    },
  },
  resolve: {
    alias: { "@": path.resolve(__dirname, "./src") },
  },
});
```

### `src/testing/setup.ts` (Frontend)

```ts
import "@testing-library/jest-dom";
import { server } from "./mocks/server";

// Inicia o MSW antes de todos os testes
beforeAll(() => server.listen({ onUnhandledRequest: "warn" }));
afterEach(() => server.resetHandlers());
afterAll(() => server.close());
```

### `vitest.config.ts` (Backend)

```ts
import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    environment: "node",
    globals: true,
    setupFiles: ["./src/testing/setup.ts"],
    coverage: {
      provider: "v8",
      reporter: ["text", "html"],
      exclude: ["prisma/**", "src/index.ts"],
    },
  },
});
```

---

## ⚛️ Testes Unitários — Frontend <a id="testes-unitários--frontend"></a>

### Hook: `useChatNavigation`

Testa a lógica de navegação na árvore do chatbot sem renderizar UI.

```ts
// features/chatbot/hooks/useChatNavigation.test.ts
import { renderHook, act } from "@testing-library/react";
import { useChatNavigation } from "./useChatNavigation";
import { createWrapper } from "@/testing/utils";

const mockRootNode = {
  id: "node-root-uuid",
  title: "Bem-vindo",
  content: "Para qual curso você deseja atendimento?",
  nodeType: "MENU",
  children: [
    { id: "node-dsm-uuid", title: "DSM", order: 1 },
    { id: "node-geo-uuid", title: "Geoprocessamento", order: 2 },
  ],
  chunks: [],
};

describe("useChatNavigation", () => {
  it("deve inicializar com o nó raiz carregado", async () => {
    const { result } = renderHook(() => useChatNavigation("node-root-uuid"), {
      wrapper: createWrapper(),
    });

    await act(async () => {
      await result.current.loadNode("node-root-uuid");
    });

    expect(result.current.currentNode?.id).toBe("node-root-uuid");
    expect(result.current.history).toHaveLength(1);
  });

  it("deve adicionar nó ao histórico ao navegar", async () => {
    const { result } = renderHook(() => useChatNavigation("node-root-uuid"), {
      wrapper: createWrapper(),
    });

    await act(async () => {
      await result.current.navigate("node-dsm-uuid");
    });

    expect(result.current.history).toContain("node-dsm-uuid");
  });

  it("deve permitir voltar ao nó anterior", async () => {
    const { result } = renderHook(() => useChatNavigation("node-root-uuid"), {
      wrapper: createWrapper(),
    });

    await act(async () => {
      await result.current.navigate("node-dsm-uuid");
      result.current.goBack();
    });

    expect(result.current.currentNode?.id).toBe("node-root-uuid");
    expect(result.current.history).toHaveLength(1);
  });
});
```

---

### Componente: `SatisfactionRating`

Testa o componente de avaliação de satisfação do RF07.

```tsx
// features/chatbot/components/SatisfactionRating.test.tsx
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { SatisfactionRating } from "./SatisfactionRating";

describe("SatisfactionRating", () => {
  it("deve renderizar os dois botões de avaliação", () => {
    render(<SatisfactionRating onRate={vi.fn()} />);

    expect(screen.getByRole("button", { name: /gostei/i })).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /não gostei/i }),
    ).toBeInTheDocument();
  });

  it('deve chamar onRate com "LIKED" ao clicar em Gostei', async () => {
    const user = userEvent.setup();
    const onRate = vi.fn();

    render(<SatisfactionRating onRate={onRate} />);

    await user.click(screen.getByRole("button", { name: /gostei/i }));

    expect(onRate).toHaveBeenCalledOnce();
    expect(onRate).toHaveBeenCalledWith("LIKED");
  });

  it("deve desabilitar os botões após avaliação", async () => {
    const user = userEvent.setup();
    render(<SatisfactionRating onRate={vi.fn()} />);

    await user.click(screen.getByRole("button", { name: /gostei/i }));

    expect(screen.getByRole("button", { name: /gostei/i })).toBeDisabled();
    expect(screen.getByRole("button", { name: /não gostei/i })).toBeDisabled();
  });
});
```

---

### Guard de rota: `ProtectedRoute`

Testa o redirecionamento quando o usuário não está autenticado.

```tsx
// components/shared/ProtectedRoute.test.tsx
import { render, screen } from "@testing-library/react";
import { MemoryRouter, Routes, Route } from "react-router-dom";
import { ProtectedRoute } from "./ProtectedRoute";
import { useAuthStore } from "@/features/auth/stores/auth.store";

vi.mock("@/features/auth/stores/auth.store");

describe("ProtectedRoute", () => {
  it("deve redirecionar para /login quando não autenticado", () => {
    vi.mocked(useAuthStore).mockReturnValue({ token: null, user: null });

    render(
      <MemoryRouter initialEntries={["/admin/dashboard"]}>
        <Routes>
          <Route element={<ProtectedRoute />}>
            <Route path="/admin/dashboard" element={<div>Painel Admin</div>} />
          </Route>
          <Route path="/login" element={<div>Página de Login</div>} />
        </Routes>
      </MemoryRouter>,
    );

    expect(screen.getByText("Página de Login")).toBeInTheDocument();
    expect(screen.queryByText("Painel Admin")).not.toBeInTheDocument();
  });

  it("deve renderizar a rota protegida quando autenticado", () => {
    vi.mocked(useAuthStore).mockReturnValue({
      token: "valid-token",
      user: { id: "1", role: "ADMIN", name: "Admin" },
    });

    render(
      <MemoryRouter initialEntries={["/admin/dashboard"]}>
        <Routes>
          <Route element={<ProtectedRoute />}>
            <Route path="/admin/dashboard" element={<div>Painel Admin</div>} />
          </Route>
        </Routes>
      </MemoryRouter>,
    );

    expect(screen.getByText("Painel Admin")).toBeInTheDocument();
  });
});
```

---

## ⚙️ Testes Unitários — Backend <a id="testes-unitários--backend"></a>

### Service: `AuthService`

Testa a lógica de autenticação com PrismaClient mockado.

```ts
// modules/auth/auth.service.test.ts
import { describe, it, expect, vi, beforeEach } from "vitest";
import { AuthService } from "./auth.service";
import { prisma } from "@/config/database";
import * as argon2 from "argon2";
import * as jwtUtils from "@/utils/jwt.utils";

vi.mock("@/config/database", () => ({
  prisma: { user: { findUnique: vi.fn() } },
}));
vi.mock("argon2");
vi.mock("@/utils/jwt.utils");

describe("AuthService", () => {
  const authService = new AuthService();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("deve lançar erro se o usuário não existir", async () => {
    vi.mocked(prisma.user.findUnique).mockResolvedValue(null);

    await expect(
      authService.login({ email: "x@fatec.sp.gov.br", password: "123" }),
    ).rejects.toThrow("E-mail ou senha inválidos");
  });

  it("deve lançar erro se a senha estiver incorreta", async () => {
    vi.mocked(prisma.user.findUnique).mockResolvedValue({
      id: "1",
      email: "x@fatec.sp.gov.br",
      passwordHash: "hash",
      role: "SECRETARY",
      name: "X",
    } as any);
    vi.mocked(argon2.verify).mockResolvedValue(false as never);

    await expect(
      authService.login({ email: "x@fatec.sp.gov.br", password: "errada" }),
    ).rejects.toThrow("E-mail ou senha inválidos");
  });

  it("deve retornar token e dados do usuário em login bem-sucedido", async () => {
    const mockUser = {
      id: "user-uuid-1",
      name: "Carolina",
      email: "sec@fatec.sp.gov.br",
      passwordHash: "hash",
      role: "SECRETARY",
    };
    vi.mocked(prisma.user.findUnique).mockResolvedValue(mockUser as any);
    vi.mocked(argon2.verify).mockResolvedValue(true as never);
    vi.mocked(jwtUtils.generateToken).mockReturnValue("mocked-jwt-token");

    const result = await authService.login({
      email: "sec@fatec.sp.gov.br",
      password: "correta",
    });

    expect(result.token).toBe("mocked-jwt-token");
    expect(result.user.email).toBe("sec@fatec.sp.gov.br");
    expect(result.user).not.toHaveProperty("passwordHash"); // nunca expor o hash
  });
});
```

---

### Middleware: `auth.middleware`

Testa a validação do JWT Bearer Token.

```ts
// middlewares/auth.middleware.test.ts
import { describe, it, expect, vi } from "vitest";
import { Request, Response, NextFunction } from "express";
import { authMiddleware } from "./auth.middleware";
import * as jwtUtils from "@/utils/jwt.utils";

vi.mock("@/utils/jwt.utils");

const mockRes = () => {
  const res = {} as Response;
  res.status = vi.fn().mockReturnValue(res);
  res.json = vi.fn().mockReturnValue(res);
  return res;
};

describe("authMiddleware", () => {
  it("deve retornar 401 quando o header Authorization estiver ausente", () => {
    const req = { headers: {} } as Request;
    const res = mockRes();
    const next = vi.fn() as NextFunction;

    authMiddleware(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(next).not.toHaveBeenCalled();
  });

  it("deve retornar 401 quando o token for inválido", () => {
    const req = {
      headers: { authorization: "Bearer token-invalido" },
    } as Request;
    const res = mockRes();
    const next = vi.fn() as NextFunction;

    vi.mocked(jwtUtils.verifyToken).mockImplementation(() => {
      throw new Error("invalid");
    });

    authMiddleware(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(next).not.toHaveBeenCalled();
  });

  it("deve chamar next() e popular req.user com token válido", () => {
    const req = {
      headers: { authorization: "Bearer token-valido" },
    } as Request;
    const res = mockRes();
    const next = vi.fn() as NextFunction;

    vi.mocked(jwtUtils.verifyToken).mockReturnValue({
      sub: "user-uuid-1",
      role: "ADMIN",
      exp: Date.now() / 1000 + 3600,
    } as any);

    authMiddleware(req, res, next);

    expect(next).toHaveBeenCalledOnce();
    expect((req as any).user.role).toBe("ADMIN");
  });
});
```

---

### Middleware: `rbac.middleware`

Testa o controle de acesso por papel (RF10).

```ts
// middlewares/rbac.middleware.test.ts
import { describe, it, expect, vi } from "vitest";
import { Request, Response, NextFunction } from "express";
import { authorize } from "./rbac.middleware";

const mockRes = () => {
  const res = {} as Response;
  res.status = vi.fn().mockReturnValue(res);
  res.json = vi.fn().mockReturnValue(res);
  return res;
};

describe("authorize middleware", () => {
  it("deve retornar 403 quando o role não tem permissão", () => {
    const req = { user: { role: "SECRETARY" } } as any;
    const res = mockRes();
    const next = vi.fn() as NextFunction;

    authorize("ADMIN")(req, res, next);

    expect(res.status).toHaveBeenCalledWith(403);
    expect(next).not.toHaveBeenCalled();
  });

  it("deve chamar next() quando o role tem permissão", () => {
    const req = { user: { role: "ADMIN" } } as any;
    const res = mockRes();
    const next = vi.fn() as NextFunction;

    authorize("ADMIN")(req, res, next);

    expect(next).toHaveBeenCalledOnce();
  });

  it("deve aceitar múltiplos roles permitidos", () => {
    const req = { user: { role: "SECRETARY" } } as any;
    const res = mockRes();
    const next = vi.fn() as NextFunction;

    authorize("ADMIN", "SECRETARY")(req, res, next);

    expect(next).toHaveBeenCalledOnce();
  });
});
```

---

## 🔗 Testes de Integração — Backend <a id="testes-de-integração--backend"></a>

### Controller: `POST /auth/login`

Testa o endpoint completo com Supertest, sem subir banco real.

```ts
// modules/auth/auth.controller.test.ts
import { describe, it, expect, vi, beforeAll } from "vitest";
import request from "supertest";
import { app } from "@/server";
import { prisma } from "@/config/database";
import * as argon2 from "argon2";

vi.mock("@/config/database", () => ({
  prisma: { user: { findUnique: vi.fn() } },
}));

describe("POST /api/v1/auth/login", () => {
  const mockUser = {
    id: "user-uuid-1",
    name: "Carolina",
    email: "sec@fatec.sp.gov.br",
    passwordHash: "$2b$10$hashedpassword",
    role: "SECRETARY",
  };

  it("deve retornar 200 e token em login válido", async () => {
    vi.mocked(prisma.user.findUnique).mockResolvedValue(mockUser as any);
    vi.spyOn(argon2, "verify").mockResolvedValue(true as never);

    const res = await request(app)
      .post("/api/v1/auth/login")
      .send({ email: "sec@fatec.sp.gov.br", password: "correta" });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.token).toBeDefined();
    expect(res.body.data.user).not.toHaveProperty("passwordHash");
  });

  it("deve retornar 401 em credenciais inválidas", async () => {
    vi.mocked(prisma.user.findUnique).mockResolvedValue(null);

    const res = await request(app)
      .post("/api/v1/auth/login")
      .send({ email: "inexistente@fatec.sp.gov.br", password: "qualquer" });

    expect(res.status).toBe(401);
    expect(res.body.success).toBe(false);
    expect(res.body.error).toBe("UNAUTHORIZED");
  });

  it("deve retornar 400 quando o body estiver incompleto", async () => {
    const res = await request(app)
      .post("/api/v1/auth/login")
      .send({ email: "sec@fatec.sp.gov.br" }); // sem password

    expect(res.status).toBe(400);
  });
});
```

---

## ✅ Mínimo Obrigatório por Sprint <a id="minimo-obrigatorio-por-sprint"></a>

### Sprint 1

- Teste do endpoint `GET /api/v1/health`
- Teste do service ou controller que responde `GET /api/v1/nodes/root`
- Teste mínimo do hook ou fluxo que carrega o menu inicial no frontend

### Sprint 2

- Testes do fluxo de login com credenciais válidas e inválidas
- Testes de `ProtectedRoute` e `RoleGuard`
- Testes das mutations críticas do painel Admin

### Sprint 3

- Testes do fluxo da secretária para listar e atualizar perguntas
- Testes de leitura dos logs
- Testes do registro de satisfação e encerramento de sessão do chatbot

> O mínimo obrigatório existe para fechar sprint com segurança. Ele não substitui
> a estratégia ideal de cobertura do projeto.

---

## 🌟 Estratégia Ideal <a id="estrategia-ideal"></a>

Sem restrição de tempo, o FatecBot deve buscar:

- Services de backend cobertos por testes unitários com branches críticas de regra
- Controllers e middlewares cobertos por integração com Supertest
- Hooks de frontend cobertos com estados de loading, sucesso e erro
- Componentes críticos cobertos com testes de interação
- Um conjunto pequeno de fluxos E2E cobrindo chatbot público, login admin e secretaria

---

## 📏 Convenções <a id="convenções"></a>

### Nomenclatura de arquivos de teste

```
ChatWindow.tsx          → ChatWindow.test.tsx
useChatNavigation.ts    → useChatNavigation.test.ts
auth.service.ts         → auth.service.test.ts
auth.middleware.ts      → auth.middleware.test.ts
```

> O arquivo de teste fica **na mesma pasta** do arquivo testado — nunca em uma pasta `/tests` separada.

### Estrutura interna de cada teste

Siga o padrão **AAA (Arrange → Act → Assert)**:

```ts
it("deve [comportamento esperado] quando [condição]", () => {
  // Arrange — prepara o contexto
  const input = { email: "x@fatec.sp.gov.br", password: "123" };
  vi.mocked(prisma.user.findUnique).mockResolvedValue(null);

  // Act — executa a ação
  const promise = authService.login(input);

  // Assert — verifica o resultado
  await expect(promise).rejects.toThrow("E-mail ou senha inválidos");
});
```

### Cobertura mínima esperada por sprint

| Sprint | Meta de cobertura |
| :----: | :---------------: |
|   1    |        40%        |
|   2    |        60%        |
|   3    |        75%        |

> Execute `pnpm test:coverage` para gerar o relatório HTML em `coverage/index.html`.

---

> _Próximo documento: [`project-standards.md`](./project-standards.md)_
