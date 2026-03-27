# 🚨 Troubleshooting

> Soluções para os problemas mais comuns durante o desenvolvimento do FatecBot.
> Antes de pedir ajuda no grupo, verifique se o seu problema está aqui.

***

## 📑 Índice

- [Docker e containers](#docker)
- [Banco de dados](#banco)
- [Backend](#backend)
- [Frontend](#frontend)
- [Autenticação](#auth)
- [Testes](#testes)
- [Monorepo e pnpm](#pnpm)

***

## 🐳 Docker e containers <a id="docker"></a>

**`port is already allocated` ao subir os containers**
Algum processo local está ocupando a porta 5432, 3333 ou 5173.

```bash
# Descubra qual processo está usando a porta (ex: 3333)
netstat -ano | findstr :3333        # Windows
lsof -i :3333                       # Linux/macOS

# Encerre o processo ou altere a porta no .env
```

***

**Mudei o código mas o container não atualizou**
Se a mudança foi no `Dockerfile` ou no `package.json`, o container precisa
ser reconstruído:

```bash
docker compose up --build backend
```

Se foi só no código TypeScript, o hot reload via `ts-node-dev` já reflete
automaticamente — aguarde alguns segundos.

***

**`docker compose up` sobe mas o backend cai imediatamente**
Verifique os logs para entender o motivo:

```bash
docker compose logs backend
```

As causas mais comuns são variável de ambiente faltando no `.env` ou erro
de sintaxe TypeScript que impede o start.

***

**Quero resetar tudo e começar do zero**

```bash
# ⚠️ Apaga containers E o volume do banco — dados serão perdidos
docker compose down -v
docker compose up --build
docker compose exec backend pnpm db:seed
```

***

## 🗄️ Banco de dados <a id="banco"></a>

**`Error: connect ECONNREFUSED` — backend não consegue conectar ao banco**
O backend tentou conectar antes do PostgreSQL estar pronto. Solução:

```bash
docker compose down
docker compose up --build
```

O `healthcheck` do Compose garante a ordem correta. Se persistir, verifique
se o `DATABASE_URL` no `.env` aponta para `db` (nome do container) e não
para `localhost`:

```bash
# ✅ Correto para Docker
DATABASE_URL=postgresql://postgres:postgres@db:5432/fatecbot

# ❌ Errado — localhost não resolve dentro do container
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/fatecbot
```

***

**`The table 'X' does not exist` ou erro de coluna inexistente**
As migrations não foram executadas. Rode:

```bash
docker compose exec backend pnpm db:migrate
```

***

**Banco vazio após subir os containers**
O seed não roda automaticamente — execute manualmente:

```bash
docker compose exec backend pnpm db:seed
```

***

**`Migration failed` ao rodar `db:migrate`**
O schema e o banco estão em conflito. Em desenvolvimento, o mais rápido é resetar:

```bash
# ⚠️ Apaga todos os dados
docker compose exec backend pnpm db:reset
```

***

**Quero inspecionar o banco visualmente**

```bash
docker compose exec backend pnpm db:studio
# Abre o Prisma Studio em http://localhost:5555
```

***

## ⚙️ Backend <a id="backend"></a>

**Processo encerra na inicialização com erro de variável de ambiente**
O `env.ts` valida todas as variáveis com Zod no startup. Se uma estiver
faltando ou com formato inválido, o processo encerra imediatamente com
mensagem descritiva. Verifique o `.env` e compare com o `.env.example`.

***

**`Cannot find module` ao importar um arquivo local**
Verifique se o caminho do import usa `@/` (alias configurado no `tsconfig.json`)
ou caminho relativo correto. Imports com caminho errado não são detectados
pelo TypeScript em alguns casos.

***

**Rota retorna `401 Unauthorized` mesmo com token válido**
Verifique se o token está sendo enviado corretamente no header:

```bash
# ✅ Formato correto
Authorization: Bearer eyJhbGci...

# ❌ Formatos inválidos
Authorization: eyJhbGci...
Authorization: bearer eyJhbGci...
```

***

**Rota retorna `403 Forbidden` com token válido**
O token é válido mas o `role` do usuário não tem permissão para aquela rota.
Verifique qual role é exigido pela rota no [`docs/api-layer.md`](./api-layer.md).

***

**`422 Unprocessable Entity` ao fazer uma request**
O body da request falhou na validação do schema Zod. A resposta inclui
detalhes por campo — verifique o JSON de erro retornado pela API.

***

## 🖥️ Frontend <a id="frontend"></a>

**`VITE_API_URL` não está sendo lida**
Variáveis de ambiente do Vite precisam do prefixo `VITE_` e devem estar
no `.env` da pasta `apps/frontend/`. Reinicie o servidor de desenvolvimento
após alterar o `.env`.

***

**Dados da API não atualizam após uma mutation**
A invalidação do cache não foi configurada no `onSuccess` da mutation.
Verifique se o `queryKey` invalidado é idêntico ao usado no `useQuery`:

```ts
// ✅ queryKey idêntico — cache invalidado corretamente
useQuery({ queryKey: ['nodes'] })
invalidateQueries({ queryKey: ['nodes'] })

// ❌ queryKey diferente — cache não é invalidado
useQuery({ queryKey: ['nodes'] })
invalidateQueries({ queryKey: ['node'] })
```

***

**Rota protegida redireciona para `/login` mesmo logado**
O token no Zustand pode ter sido perdido. Verifique se o `persist` middleware
está ativo na `auth.store.ts` e se a chave no `localStorage` é `fatecbot:auth`.

***

**Componente shadcn/ui com estilo quebrado**
Não edite arquivos em `src/components/ui/` diretamente. Crie um wrapper em
`components/shared/` — consulte [`docs/knowledge-base/shadcn.md`](./knowledge-base/shadcn.md).

***

## 🔐 Autenticação <a id="auth"></a>

**Login retorna `401` com credenciais corretas**
Em desenvolvimento, as credenciais padrão só existem após rodar o seed:

```bash
docker compose exec backend pnpm db:seed
```

Credenciais padrão após o seed:

| Perfil | E-mail | Senha |
| ------ | ------ | ----- |
| Administrador | `admin@fatec.sp.gov.br` | `admin123` |
| Secretária | `secretaria@fatec.sp.gov.br` | `secretaria123` |

> ⚠️ Estas credenciais existem **apenas em desenvolvimento**. Nunca use em produção.

***

**Token expira muito rápido**
O tempo de expiração é definido por `JWT_EXPIRES_IN` no `.env`. O padrão é `8h`.
Valores válidos: `1h`, `8h`, `1d`, `7d`.

***

## 🧪 Testes <a id="testes"></a>

**Testes falham com erro de variável de ambiente**
Os testes precisam de um `.env.test` ou das variáveis definidas no
`vitest.config.ts`. Consulte [`docs/testing.md`](./testing.md) para o
setup correto do ambiente de testes.

***

**Teste de integração tenta subir servidor real**
O `server.ts` exporta o app Express **sem** chamar `.listen()` — o
`index.ts` é quem chama. Nos testes, importe direto de `server.ts`:

```ts
// ✅ Correto — não sobe servidor real
import app from '../server'
import request from 'supertest'

const res = await request(app).get('/api/v1/health')
```

***

## 📦 Monorepo e pnpm <a id="pnpm"></a>

**`pnpm install` falha com erro de workspace**
Certifique-se de estar na raiz do monorepo (onde fica o `pnpm-workspace.yaml`)
e não dentro de um dos apps:

```bash
# ✅ Correto — instala dependências de todos os workspaces
cd fatecbot
pnpm install

# ❌ Instala apenas o frontend isoladamente
cd apps/frontend
pnpm install
```

***

**Quero instalar uma dependência apenas no backend ou frontend**

```bash
# Apenas no backend
pnpm --filter backend add nome-do-pacote

# Apenas no frontend
pnpm --filter frontend add nome-do-pacote

# Como devDependency
pnpm --filter backend add -D nome-do-pacote
```

***

**`command not found: pnpm`**
O pnpm não está instalado globalmente. Instale via npm:

```bash
npm install -g pnpm
```

***

> _Se o seu problema não está aqui, abra uma issue no repositório descrevendo
> o erro completo, os passos para reproduzir e o que já tentou._