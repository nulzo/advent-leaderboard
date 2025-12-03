# Stage 1: Build
# Use --platform=$BUILDPLATFORM to run the build on the runner's native architecture (amd64)
# This avoids slow QEMU emulation when building for arm64, since static assets are arch-independent
FROM --platform=$BUILDPLATFORM oven/bun:1 as builder

WORKDIR /app

# Copy package files
COPY package.json bun.lock ./

# Install dependencies
RUN bun install --frozen-lockfile

# Copy source code
COPY . .

# Set placeholder environment variable for build-time validation
ENV VITE_APP_AOC_SESSION_ID=placeholder

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

# Nginx will automatically substitute environment variables in templates
# and start the server
CMD ["nginx", "-g", "daemon off;"]

