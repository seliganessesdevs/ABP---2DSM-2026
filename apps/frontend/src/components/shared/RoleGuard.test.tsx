import { MemoryRouter, Route, Routes } from "react-router-dom";
import { render, screen } from "@testing-library/react";

import { RoleGuard } from "./RoleGuard";
import { useAuthStore } from "@/features/auth/stores/auth.store";

vi.mock("@/features/auth/stores/auth.store", () => ({
  useAuthStore: vi.fn(),
}));

describe("RoleGuard", () => {
  it("renderiza a rota quando o role e permitido", () => {
    vi.mocked(useAuthStore).mockImplementation((selector?: any) =>
      selector({ token: "valid-token", user: { id: 1, name: "Admin", email: "admin@fatec.sp.gov.br", role: "ADMIN" } })
    );

    render(
      <MemoryRouter initialEntries={["/admin"]}>
        <Routes>
          <Route element={<RoleGuard allowedRoles={["ADMIN"]} />}>
            <Route path="/admin" element={<div>Painel Admin</div>} />
          </Route>
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByText("Painel Admin")).toBeInTheDocument();
  });

  it("bloqueia acesso quando o role nao e permitido", () => {
    vi.mocked(useAuthStore).mockImplementation((selector?: any) =>
      selector({ token: "valid-token", user: { id: 1, name: "Secretaria", email: "secretaria@fatec.sp.gov.br", role: "SECRETARIA" } })
    );

    render(
      <MemoryRouter initialEntries={["/admin"]}>
        <Routes>
          <Route path="/" element={<div>Pagina Inicial</div>} />
          <Route element={<RoleGuard allowedRoles={["ADMIN"]} />}>
            <Route path="/admin" element={<div>Painel Admin</div>} />
          </Route>
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByText("Pagina Inicial")).toBeInTheDocument();
    expect(screen.queryByText("Painel Admin")).not.toBeInTheDocument();
  });
});