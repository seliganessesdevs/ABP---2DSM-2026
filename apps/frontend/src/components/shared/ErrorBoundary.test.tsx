import { useState } from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { ErrorBoundary } from "./ErrorBoundary";

function Bomb() {
  throw new Error("kaboom");
}

describe("ErrorBoundary", () => {
  it("exibe fallback padrao quando captura erro", () => {
    const errorSpy = vi.spyOn(console, "error").mockImplementation(() => undefined);

    render(
      <ErrorBoundary>
        <Bomb />
      </ErrorBoundary>
    );

    expect(screen.getByRole("alert")).toBeInTheDocument();
    expect(screen.getByText(/ocorreu um erro inesperado/i)).toBeInTheDocument();

    errorSpy.mockRestore();
  });

  it("permite recuperar ao resetar a boundary", async () => {
    const user = userEvent.setup();
    const errorSpy = vi.spyOn(console, "error").mockImplementation(() => undefined);

    function Harness() {
      const [explode, setExplode] = useState(true);

      return (
        <ErrorBoundary
          fallback={({ resetErrorBoundary }) => (
            <button
              type="button"
              onClick={() => {
                setExplode(false);
                resetErrorBoundary();
              }}
            >
              Recuperar
            </button>
          )}
        >
          {explode ? <Bomb /> : <p>Conteudo ok</p>}
        </ErrorBoundary>
      );
    }

    render(<Harness />);

    await user.click(screen.getByRole("button", { name: /recuperar/i }));

    expect(screen.getByText(/conteudo ok/i)).toBeInTheDocument();

    errorSpy.mockRestore();
  });
});
