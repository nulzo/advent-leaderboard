FROM oven/bun:1 as base
WORKDIR /app

# Install dependencies
COPY package.json ./
RUN bun install --frozen-lockfile

# Copy source
COPY . .

# Build not strictly needed for Bun run, but good for validation/optimizing
# RUN bun run build

# Expose port
EXPOSE 3000

# Start the server
CMD ["bun", "run", "src/index.ts"]

