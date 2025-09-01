FROM oven/bun:1.1-alpine AS base

WORKDIR /app

COPY package.json ./

RUN bun install

#
COPY . .

EXPOSE 3000

CMD ["bun", "run", "index.ts"]