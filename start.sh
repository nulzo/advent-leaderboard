#!/bin/sh

# Start the backend in the background
node /app/server/index.js &

# Start Nginx in the foreground
nginx -g "daemon off;"

