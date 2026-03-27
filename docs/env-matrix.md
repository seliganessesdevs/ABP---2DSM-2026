# Matriz de Variáveis de Ambiente

## Variáveis do backend

| Variável | Obrigatória? | Valor exemplo | Descrição | Impacto se ausente |
| -------- | ------------ | ------------- | --------- | ------------------ |
| `DATABASE_URL` | Sim | `postgresql://seu_usuario_postgres:sua_senha_postgres_forte@db:5432/seu_banco_postgres` | Connection string principal do backend para o PostgreSQL | O backend não consegue iniciar nem acessar o banco |
| `JWT_SECRET` | Sim | `gere_um_segredo_forte_com_no_minimo_32_caracteres` | Segredo usado para assinar e validar JWTs | Login e rotas protegidas ficam inviáveis |
| `JWT_EXPIRES_IN` | Sim | `8h` | Tempo de expiração do token JWT | O backend não consegue definir política de sessão corretamente |
| `PORT` | Sim | `3333` | Porta HTTP do backend | O serviço pode subir em porta errada ou falhar por configuração incompleta |
| `NODE_ENV` | Sim | `development` | Ambiente de execução (`development`, `test`, `production`) | Comportamentos condicionais de ambiente ficam incorretos |

## Variáveis do frontend

| Variável | Obrigatória? | Valor exemplo | Descrição | Impacto se ausente |
| -------- | ------------ | ------------- | --------- | ------------------ |
| `VITE_API_URL` | Sim | `http://localhost:3333` | URL base da API consumida pelo frontend | As chamadas HTTP falham ou apontam para destino errado |
| `VITE_ENABLE_DEVTOOLS` | Não | `true` | Habilita Devtools do TanStack Query em desenvolvimento | O app sobe, mas perde ferramental de depuração |

## Como o Docker usa essas variáveis

O `docker-compose.yml` lê o `.env` da raiz e injeta valores diretamente nos serviços via `environment`:

- `db` recebe `POSTGRES_DB`, `POSTGRES_USER` e `POSTGRES_PASSWORD`
- `backend` recebe `DATABASE_URL`, `JWT_SECRET`, `JWT_EXPIRES_IN`, `PORT` e `NODE_ENV`
- `frontend` recebe `VITE_API_URL` e `VITE_ENABLE_DEVTOOLS`

Além disso:

- `POSTGRES_PORT` controla o bind local da porta do banco
- `FRONTEND_PORT` controla o bind local da porta do Vite
- O Compose usa `:?` em variáveis críticas para falhar cedo quando elas estão ausentes

## Diferenças entre ambientes

| Ambiente | O que muda |
| -------- | ---------- |
| `development` | URLs locais, Devtools habilitadas, seed de desenvolvimento e foco em produtividade |
| `test` | Banco isolado de teste, valores previsíveis de env e menor dependência de serviços externos |
| `production` | Segredos reais, Devtools desabilitadas, URLs públicas, políticas mais restritivas e sem credenciais de exemplo |

> _Próximo documento: [`sprint1/README.md`](./sprint1/README.md)_
