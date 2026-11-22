FROM node:22-alpine AS base

WORKDIR /app
RUN corepack enable

COPY apps/backend/package.json apps/backend/pnpm-lock.yaml apps/backend/pnpm-workspace.yaml ./

RUN pnpm install --frozen-lockfile

COPY apps/backend .

EXPOSE 3000

CMD ["pnpm", "start"]
