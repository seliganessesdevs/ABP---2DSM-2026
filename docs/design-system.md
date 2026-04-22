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

## 🖼️ Wireframes — Login e Fluxo de Autenticação

As três variantes exigidas pela Task-008 estão disponíveis abaixo:

### 1. Tela de Login (Normal)

![Tela de Login](designer/login-normal.png)

### 2. Variante de Erro

![Variante de Erro](designer/login-erro.png)

_Exibe mensagem de erro para e-mail ou senha inválidos._

### 3. Variante de Loading

![Variante de Loading](designer/login-loading.png)

_Botão "Entrar" desabilitado e campos bloqueados durante o carregamento._

---

Dúvidas ou sugestões? Consulte o Figma ou entre em contato com o responsável pelo Design System.
