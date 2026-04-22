# Design System — Handoff

Este documento reúne os tokens visuais e os componentes reutilizáveis definidos no Figma para o projeto FatecBot, além de orientações para o mapeamento com Tailwind CSS.

## Tokens Visuais

- Paleta de cores primária, secundária e neutra exportada como tokens nomeados (ex: --primary, --background, --destructive)
- Escala tipográfica: heading 1–4, body, caption, code — com família, tamanho e peso
- Escala de espaçamentos baseada em múltiplos de 4px
- Raio de borda (radius) padronizado

Esses tokens estão anotados para facilitar o mapeamento com o arquivo `tailwind.config.ts`.

## Componentes Figma Reutilizáveis

- Button (variantes: primary, secondary, ghost, destructive)
- Input
- Badge
- Card
- Modal/Dialog
- Sidebar
- Table

Todos os componentes estão organizados na página "Design System" do Figma do projeto.

## Handoff para Tailwind

Os tokens definidos no Figma foram mapeados para utilitários do Tailwind CSS, garantindo consistência visual entre design e código. Exemplos:

- `--primary` → `bg-primary` / `text-primary` (Tailwind)
- `--background` → `bg-background`
- `--radius-md` → `rounded-md`
- `--font-heading` → `font-bold`
- `--spacing-md` → `p-4`, `m-4`

Para detalhes completos, consulte o arquivo `tailwind.config.ts` no frontend.

---

## 📸 Galeria Visual do Design System

### Visão Geral

![Visão geral do handoff](designer/handoff.PNG)

### Paleta de Cores

![Paleta de cores](designer/paleta-cores.PNG)

### Tokens de Espaçamento

![Tokens de espaçamento](designer/tokens-espacamento.PNG)

### Tokens de Tipografia

![Tokens de tipografia](designer/tokens-tipografia.PNG)

### Tokens de Uso de Cores

![Tokens de uso de cores](designer/tokens-uso-cores.PNG)

### Variações de Botão

![Variações de botão](designer/variantes-botao.PNG)

### PDF de Referência

[Download do PDF de handoff](designer/designer-home.pdf)

---

Dúvidas ou sugestões? Consulte o Figma ou entre em contato com o responsável pelo Design System.
