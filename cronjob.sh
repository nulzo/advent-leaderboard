#!/bin/bash

# Load environment variables from .env file
set -a
source .env
set +a

# Run the update script (choose one of these options):
# Option 1: Using ts-node directly (development)
mkdir -p logs
echo "[$(date)] Running update script..." >> logs/cron.log
npm run update-data >> logs/cron.log 2>&1
echo "[$(date)] Finished update script" >> logs/cron.log
echo "----------------------------------------" >> logs/cron.log


# Option 2: Using compiled JavaScript (production)
# node dist/api/update-data.js >> /var/log/aoc-cron.log 2>&1