import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { ErrorAlert } from "./ErrorAlert";

describe("ErrorAlert", () => {
  it("renderiza estado de erro com mensagem", () => {
    render(<ErrorAlert message="Falha ao carregar" />);

    expect(screen.getByRole("alert")).toBeInTheDocument();
    expect(screen.getByText("Falha ao carregar")).toBeInTheDocument();
  });

  it("executa acao de tentar novamente", async () => {
    const user = userEvent.setup();
    const onRetry = vi.fn();

    render(<ErrorAlert message="Erro" onRetry={onRetry} />);

    await user.click(screen.getByRole("button", { name: /tentar novamente/i }));

    expect(onRetry).toHaveBeenCalledOnce();
  });

  it("permite fechar quando dismissible", async () => {
    const user = userEvent.setup();

    render(<ErrorAlert message="Erro de teste" dismissible />);
    await user.click(screen.getByRole("button", { name: /fechar/i }));

    expect(screen.queryByRole("alert")).not.toBeInTheDocument();
  });
});
