# Stage 1: Build
FROM oven/bun:1 as builder

WORKDIR /app

# Copy package files
COPY package.json bun.lock ./

# Install dependencies
RUN bun install --frozen-lockfile

# Copy source code
COPY . .

# Build the application
RUN bun run build

# Stage 2: Production
FROM nginx:alpine

# Copy built assets from builder
COPY --from=builder /app/dist /usr/share/nginx/html

# Copy Nginx configuration template
COPY nginx.conf.template /etc/nginx/templates/default.conf.template

# Expose port 80
EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]

