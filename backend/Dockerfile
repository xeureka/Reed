FROM oven/bun:1.1-alpine AS base

WORKDIR /app

# Copy only package.json first
COPY package.json ./

# Install without lockfile
RUN bun install

# Copy everything else
COPY . .

EXPOSE 3000

CMD ["bun", "run", "index.ts"]