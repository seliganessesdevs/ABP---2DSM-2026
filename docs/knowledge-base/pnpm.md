# pnpm — Guia para Iniciantes

pnpm é um gerenciador de pacotes para JavaScript — a mesma categoria do npm e yarn. Ele instala e gerencia as dependências do projeto. A diferença está em como ele faz isso: de forma muito mais eficiente em disco e velocidade.

***

## O Problema do npm

Quando você roda `npm install` em um projeto, o npm baixa todas as dependências para a pasta `node_modules` daquele projeto. Em outro projeto, baixa tudo de novo. Em mais um projeto, mais uma vez:

```
projeto-a/node_modules/react     (50mb)
projeto-b/node_modules/react     (50mb) — cópia idêntica
projeto-c/node_modules/react     (50mb) — mais uma cópia
```

Se você tem 10 projetos usando React, tem 10 cópias idênticas no disco. Com o tempo, `node_modules` vira o objeto mais pesado do universo.

***

## Como o pnpm Resolve Isso

O pnpm mantém um **store global** — uma única cópia de cada pacote no seu computador. Cada projeto usa links para esse store em vez de cópias:

```
~/.pnpm-store/react@18.0.0   (50mb — uma única vez)
     ↑              ↑              ↑
projeto-a       projeto-b      projeto-c
(link)          (link)         (link)
```

O resultado é economia real de disco e instalação muito mais rápida em projetos novos — o pacote já está no store, só cria o link.

***

## npm vs pnpm — Comparação Direta

| | npm | pnpm |
|---|---|---|
| Uso de disco | Cópia em cada projeto | Store global compartilhado |
| Velocidade de instalação | Lento em projetos novos | Rápido — reutiliza o store |
| Monorepos | Suporte limitado | Suporte nativo com workspaces |
| `node_modules` fantasma | Sim ⚠️ | Não ✅ |
| Lockfile | `package-lock.json` | `pnpm-lock.yaml` |
| Compatibilidade | Universal | Compatível com npm registry |

***

## `node_modules` Fantasma

Esse é um problema sério do npm que poucos iniciantes conhecem. O npm instala dependências de forma **plana** — todas as dependências das suas dependências também ficam acessíveis:

```
// Seu projeto depende de "express"
// Express depende de "lodash"
// npm coloca lodash em node_modules/ também

// Você pode fazer isso — e vai funcionar:
import _ from 'lodash'  // você nunca declarou essa dependência

// Mas se express atualizar e parar de usar lodash, seu código quebra
```

O pnpm isola corretamente — você só acessa o que declarou no `package.json`. Isso evita bugs silenciosos que aparecem meses depois.

***

## Comandos — npm vs pnpm

| O que fazer | npm | pnpm |
|---|---|---|
| Instalar dependências | `npm install` | `pnpm install` |
| Adicionar dependência | `npm install react` | `pnpm add react` |
| Adicionar dev dependency | `npm install -D vitest` | `pnpm add -D vitest` |
| Remover dependência | `npm uninstall react` | `pnpm remove react` |
| Rodar script | `npm run dev` | `pnpm dev` |
| Executar pacote sem instalar | `npx prisma` | `pnpm dlx prisma` |
| Atualizar dependências | `npm update` | `pnpm update` |

A diferença mais usada no dia a dia: `npm install pacote` vira `pnpm add pacote`. Scripts ficam ainda mais curtos — `pnpm dev` em vez de `npm run dev`.

***

## Workspaces — Monorepos

Workspaces permitem ter vários pacotes no mesmo repositório compartilhando dependências. O npm suporta, mas o pnpm foi construído pensando nisso:

```
apps/
  frontend/   → package.json próprio
  backend/    → package.json próprio
packages/
  shared/     → tipos compartilhados
pnpm-workspace.yaml
```

```yaml
# pnpm-workspace.yaml
packages:
  - 'apps/*'
  - 'packages/*'
```

Com isso, um único `pnpm install` na raiz instala tudo. E um pacote pode importar outro do monorepo:

```ts
// apps/frontend importa de packages/shared
import type { User } from '@projeto/shared'
```

***

## Scripts no `package.json`

O pnpm executa os scripts do `package.json` normalmente. A vantagem é poder rodar scripts em workspaces específicos ou em todos de uma vez:

```bash
pnpm dev                    # roda o script "dev" do pacote atual
pnpm --filter frontend dev  # roda "dev" só no workspace frontend
pnpm --filter backend dev   # roda "dev" só no workspace backend
pnpm -r build               # roda "build" em todos os workspaces
```

***

## O Lockfile

O `pnpm-lock.yaml` tem o mesmo papel do `package-lock.json` — garante que todo mundo do time instala exatamente as mesmas versões:

- **Sempre commite o lockfile** — sem ele, `pnpm install` pode instalar versões diferentes para pessoas diferentes
- **Nunca edite manualmente** — é gerado automaticamente pelo pnpm
- **Conflitos no lockfile** — rode `pnpm install` após resolver conflitos no `package.json` e o lockfile será regenerado

***

## Instalando o pnpm

```bash
# Via npm — instala globalmente
npm install -g pnpm

# Verificar versão
pnpm --version

# Ativar via Corepack (recomendado — gerencia versões automaticamente)
corepack enable
corepack prepare pnpm@latest --activate
```

***

## Boas Práticas

**Não misture gerenciadores no mesmo projeto** — se o projeto usa pnpm, não rode `npm install`. Isso gera dois lockfiles e comportamento imprevisível.

**Commite sempre o `pnpm-lock.yaml`** — é a garantia de que o time e o servidor de CI instalam as mesmas versões.

**Use `pnpm dlx` no lugar de `npx`** — para rodar comandos sem instalar permanentemente, como `pnpm dlx prisma generate` ou `pnpm dlx shadcn@latest init`.

**Defina a versão do pnpm no `package.json`** — evita que pessoas do time usem versões diferentes:

```json
{
  "packageManager": "pnpm@9"
}
```

***

> _Próximo documento: [`git-flow.md`](./git-flow.md)_
