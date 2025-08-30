# Use official Bun image
FROM oven/bun:1-alpine AS runtime

# Set working directory
WORKDIR /app

# Copy package files
COPY package.json .
COPY bun.lockb .

# Install dependencies
RUN bun install --frozen-lockfile --production

# Copy source code
COPY . .

# Expose port
EXPOSE 3001

# Start the application
CMD ["bun", "run", "src/index.ts"]