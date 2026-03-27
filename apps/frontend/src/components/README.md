# 📁 src/components/

Componentes React compartilhados entre features. Esta pasta existe para evitar
duplicação de UI e para separar claramente três responsabilidades diferentes:
base visual, layout e componentes compartilhados com lógica leve.

---

## Estrutura

```text
components/
├── ui/         # Componentes gerados pelo shadcn/ui — não editar diretamente
├── layout/     # Estruturas de página reutilizáveis
└── shared/     # Componentes reutilizáveis com lógica própria
```

---

## `ui/`

Componentes base gerados e gerenciados pelo **shadcn/ui**.

**Regra absoluta: não editar arquivos dentro desta pasta diretamente.**

Se for necessário personalizar comportamento ou aparência, crie um wrapper em
`shared/` ou na feature consumidora.

```tsx
import { Button, type ButtonProps } from '@/components/ui/button'
import { cn } from '@/lib/utils'

export function DangerButton({ className, ...props }: ButtonProps) {
  return (
    <Button
      variant="destructive"
      className={cn('font-semibold', className)}
      {...props}
    />
  )
}
```

---

## `layout/`

Componentes de estrutura de página que definem o esqueleto visual compartilhado
entre rotas.

### `AdminLayout.tsx`

Usado nas áreas autenticadas de admin e secretaria. Pode conter sidebar,
topbar e a área principal para `<Outlet />`, mas não decide permissão de acesso:
isso continua sendo responsabilidade do roteador.

### `PublicLayout.tsx`

Layout das rotas públicas, como o chatbot principal.

---

## `shared/`

Componentes com lógica própria reutilizados em mais de uma parte da aplicação.

Exemplos esperados:

- `ProtectedRoute.tsx`
- `RoleGuard.tsx`
- `LoadingSpinner.tsx`
- `ErrorBoundary.tsx`

Esses componentes podem evoluir com o projeto, ao contrário de `ui/`.

---

## Regras de contribuição

- `components/` nunca depende de uma feature específica
- Se um componente conhece demais um domínio, ele deve morar na feature correspondente
- `shared/` pode ter lógica; `ui/` não deve ser customizado na origem
- Layout não substitui regra de autorização

---

> _Próximo documento: [`../config/README.md`](../config/README.md)_
