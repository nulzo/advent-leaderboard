# Stage 1: Build
FROM oven/bun:1 as builder

WORKDIR /app

# Copy package files
COPY package.json bun.lock ./

# Install dependencies
RUN bun install --frozen-lockfile

# Copy source code
COPY . .

# Set placeholder environment variable for build-time validation
ENV VITE_APP_AOC_SESSION_ID=placeholder

# Build the application (Frontend + Backend)
# Note: Ensure package.json has "build": "tsc -b && vite build && bun build ./server/index.ts --target node --outdir dist-server"
RUN bun run build

# Stage 2: Production
FROM nginx:alpine

# Install Node.js for the backend
RUN apk add --no-cache nodejs

WORKDIR /app

# Copy built frontend assets
COPY --from=builder /app/dist /usr/share/nginx/html

# Copy built backend
COPY --from=builder /app/dist-server/index.js /app/server/index.js

# Copy Nginx configuration template
COPY nginx.conf.template /etc/nginx/templates/default.conf.template

# Copy startup script
COPY start.sh /start.sh
RUN chmod +x /start.sh

# Expose port 80
EXPOSE 80

# Start both services
CMD ["/start.sh"]
