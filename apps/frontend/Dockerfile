FROM node:20-alpine

WORKDIR /app
RUN corepack enable && corepack prepare pnpm@10.30.0 --activate

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY apps/frontend/package.json apps/frontend/package.json

RUN pnpm install --frozen-lockfile

COPY . .

EXPOSE 5173

CMD ["pnpm", "--filter", "frontend", "exec", "vite", "--host", "0.0.0.0", "--port", "5173"]
