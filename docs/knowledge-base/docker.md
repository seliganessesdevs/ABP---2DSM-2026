# 🐳 Docker e Docker Compose

> O essencial sobre Docker para rodar, entender e contribuir com o FatecBot.
> Foco no que o projeto usa de verdade — sem aprofundar em conceitos que não
> aparecem aqui.

***

## 📑 Índice

- [O que é Docker e por que usamos](#o-que-e)
- [Conceitos essenciais](#conceitos)
- [Como o FatecBot usa Docker](#fatecbot)
- [Comandos do dia a dia](#comandos)
- [Volumes e persistência](#volumes)
- [Variáveis de ambiente no Docker](#env)
- [Erros comuns](#erros)

***

## 🎯 O que é Docker e por que usamos <a id="o-que-e"></a>

Docker empacota a aplicação e tudo que ela precisa para rodar (Node, PostgreSQL,
dependências) em **containers isolados**. O resultado: qualquer membro do time
sobe o projeto inteiro com um único comando, sem instalar nada além do Docker.

No FatecBot isso é obrigatório (RNF05, RNF06) — a entrega final do projeto
**deve rodar exclusivamente via containers**.

***

## 🧱 Conceitos essenciais <a id="conceitos"></a>

Você não precisa saber tudo sobre Docker. Estes quatro conceitos cobrem 90%
do que vai aparecer no projeto:

| Conceito | O que é |
| -------- | ------- |
| **Image** | Receita imutável de como montar o container — gerada a partir do `Dockerfile` |
| **Container** | Instância em execução de uma image — é o "processo rodando" |
| **Dockerfile** | Arquivo que descreve como construir a image do serviço |
| **Docker Compose** | Ferramenta que orquestra múltiplos containers juntos via `docker-compose.yml` |

A relação entre eles:

```
Dockerfile → docker build → Image → docker run → Container
                                         ↑
                          docker-compose.yml orquestra vários desses
```

***

## 🏗️ Como o FatecBot usa Docker <a id="fatecbot"></a>

O projeto tem **três containers**, definidos no `docker-compose.yml` da raiz:

| Container | Serviço | Porta |
| --------- | ------- | :---: |
| `db` | PostgreSQL 16 | 5432 |
| `backend` | Node.js + Express | 3333 |
| `frontend` | React + Vite | 5173 |

O container `backend` só sobe depois do `db` estar saudável — o Compose
gerencia essa dependência via `depends_on` com `condition: service_healthy`.

```yaml
# Exemplo simplificado do docker-compose.yml
services:
  db:
    image: postgres:16
    healthcheck:
      test: ["CMD", "pg_isready", "-U", "postgres"]

  backend:
    build: ./apps/backend
    depends_on:
      db:
        condition: service_healthy

  frontend:
    build: ./apps/frontend
    depends_on:
      - backend
```

***

## ⚡ Comandos do dia a dia <a id="comandos"></a>

Todos os comandos abaixo devem ser executados na **raiz do monorepo**:

```bash
# Subir todos os containers (rebuild das images se houver mudança)
docker compose up --build

# Subir em background (sem travar o terminal)
docker compose up --build -d

# Ver o que está rodando
docker compose ps

# Ver logs em tempo real de todos os containers
docker compose logs -f

# Ver logs de um container específico
docker compose logs -f backend

# Parar todos os containers sem remover
docker compose stop

# Parar e remover containers (mantém volumes)
docker compose down

# ⚠️ Parar, remover containers E volumes (apaga o banco)
docker compose down -v

# Rebuildar apenas um serviço específico
docker compose up --build backend
```

### Executar comandos dentro de um container

```bash
# Abre terminal interativo no container do backend
docker compose exec backend sh

# Roda um comando único dentro do container
docker compose exec backend pnpm db:migrate
docker compose exec backend pnpm db:seed
```

***

## 💾 Volumes e persistência <a id="volumes"></a>

Por padrão, tudo dentro de um container é **destruído ao removê-lo**. Para o
banco de dados persistir entre reinicializações, o Compose usa um volume nomeado:

```yaml
services:
  db:
    volumes:
      - postgres_data:/var/lib/postgresql/data

volumes:
  postgres_data:
```

> ⚠️ Rodar `docker compose down -v` apaga o volume `postgres_data` e
> **todos os dados do banco são perdidos**. Use apenas para resetar o
> ambiente de desenvolvimento do zero.

***

## 🔐 Variáveis de ambiente no Docker <a id="env"></a>

O Compose lê o arquivo `.env` da raiz automaticamente e injeta as variáveis
nos containers. Por isso o `.env` **nunca vai para o repositório** — cada
membro copia o `.env.example` e preenche localmente.

```bash
# ✅ Setup correto antes de subir pela primeira vez
cp .env.example .env
# Edite o .env com os valores do seu ambiente
docker compose up --build
```

Dentro do `docker-compose.yml`, as variáveis são repassadas assim:

```yaml
services:
  backend:
    environment:
      DATABASE_URL: ${DATABASE_URL}
      JWT_SECRET: ${JWT_SECRET}
      JWT_EXPIRES_IN: ${JWT_EXPIRES_IN}
      PORT: ${PORT}
      NODE_ENV: ${NODE_ENV}
```

> ⚠️ **Nunca** coloque valores sensíveis diretamente no `docker-compose.yml`.
> Tudo que é segredo vai no `.env` — que está no `.gitignore`.

***

## 🚨 Erros comuns <a id="erros"></a>

**`Error: connect ECONNREFUSED` no backend ao tentar conectar no banco**
O backend subiu antes do PostgreSQL estar pronto. Solução: o `healthcheck`
no `docker-compose.yml` resolve isso automaticamente. Se ainda ocorrer,
rode `docker compose down` e suba novamente com `docker compose up --build`.

**Mudei o código mas o container não refletiu a mudança**
Em desenvolvimento, o volume de bind mount sincroniza o código automaticamente.
Se a mudança for no `Dockerfile` ou no `package.json`, é necessário rebuildar:
```bash
docker compose up --build backend
```

**`port is already allocated` ao subir os containers**
Algum processo local está usando a mesma porta (5432, 3333 ou 5173). Pare
o processo local ou altere a porta no `.env` e no `docker-compose.yml`.

**Banco está vazio após subir**
O seed não roda automaticamente. Execute manualmente após subir:
```bash
docker compose exec backend pnpm db:seed
```

***

> _Este guia cobre o necessário para o dia a dia do projeto. Para aprofundamento,
> consulte a [documentação oficial do Docker](https://docs.docker.com) e do
> [Docker Compose](https://docs.docker.com/compose/)._

> _Próximo documento: [`../sprint1/README.md`](../sprint1/README.md)_
