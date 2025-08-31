# Use official Bun image
FROM oven/bun:1.1-alpine AS base

# Set working directory
WORKDIR /app

# Copy package.json and bun.lock
COPY package.json bun.lock ./

# Install dependencies
RUN bun install --frozen-lockfile

# Copy source code
COPY . .

# Build TypeScript (if needed)
RUN bun run build

# Expose port
EXPOSE 3000

# Start the application
CMD ["bun", "run", "index.ts"]