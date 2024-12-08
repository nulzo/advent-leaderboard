#!/bin/bash

# Load environment variables from .env file
set -a
source .env
set +a

# Run the update script (choose one of these options):
# Option 1: Using ts-node directly (development)
npm run update-data >> /var/log/aoc-cron.log 2>&1

# Option 2: Using compiled JavaScript (production)
# node dist/api/update-data.js >> /var/log/aoc-cron.log 2>&1