FROM oven/bun:1-alpine

WORKDIR /app

COPY backend/package.json .
COPY backend/bun.lockb .

RUN bun install --frozen-lockfile --production

COPY backend/ .

EXPOSE 3001

CMD ["bun", "run", "index.ts"]