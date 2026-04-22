import { render, screen } from "@testing-library/react";

import { LoadingSpinner } from "./LoadingSpinner";

describe("LoadingSpinner", () => {
  it("renderiza mensagem e semantica de loading", () => {
    render(<LoadingSpinner message="Buscando dados" />);

    expect(screen.getByRole("status", { name: /buscando dados/i })).toBeInTheDocument();
    expect(screen.getByText("Buscando dados")).toBeInTheDocument();
  });

  it("aplica variante de tamanho", () => {
    const { container } = render(<LoadingSpinner size="lg" />);
    const spinner = container.querySelector('[data-slot="spinner"]');

    expect(spinner).toHaveClass("h-8");
    expect(spinner).toHaveClass("w-8");
  });

  it("renderiza em tela cheia quando solicitado", () => {
    const { container } = render(<LoadingSpinner fullScreen />);

    expect(container.firstElementChild).toHaveClass("fixed");
    expect(container.firstElementChild).toHaveClass("inset-0");
  });
});
