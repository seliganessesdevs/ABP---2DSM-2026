FROM node:20-alpine

WORKDIR /app
RUN corepack enable && corepack prepare pnpm@10.30.0 --activate

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY apps/backend/package.json apps/backend/package.json

RUN pnpm install --frozen-lockfile

COPY . .

EXPOSE 3333

CMD ["pnpm", "--filter", "backend", "dev"]
