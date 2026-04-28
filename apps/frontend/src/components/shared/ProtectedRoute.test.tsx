import { MemoryRouter, Route, Routes } from "react-router-dom";
import { render, screen } from "@testing-library/react";

import { ProtectedRoute } from "./ProtectedRoute";
import { useAuthStore } from "@/features/auth/stores/auth.store";

vi.mock("@/features/auth/stores/auth.store", () => ({
  useAuthStore: vi.fn(),
}));

describe("ProtectedRoute", () => {
  it("redireciona para /login quando nao autenticado", () => {
    vi.mocked(useAuthStore).mockImplementation((selector?: any) =>
      selector({ token: null, user: null })
    );

    render(
      <MemoryRouter initialEntries={["/admin"]}>
        <Routes>
          <Route element={<ProtectedRoute />}>
            <Route path="/admin" element={<div>Painel Admin</div>} />
          </Route>
          <Route path="/login" element={<div>Página de Login</div>} />
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByText("Página de Login")).toBeInTheDocument();
    expect(screen.queryByText("Painel Admin")).not.toBeInTheDocument();
  });

  it("renderiza as rotas filhas quando autenticado", () => {
    vi.mocked(useAuthStore).mockImplementation((selector?: any) =>
      selector({ token: "valid-token", user: { id: 1, name: "Admin", email: "admin@fatec.sp.gov.br", role: "ADMIN" } })
    );

    render(
      <MemoryRouter initialEntries={["/admin"]}>
        <Routes>
          <Route element={<ProtectedRoute />}>
            <Route path="/admin" element={<div>Painel Admin</div>} />
          </Route>
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByText("Painel Admin")).toBeInTheDocument();
  });
});