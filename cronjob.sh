#!/bin/bash

# Load environment variables from .env file
set -a
source .env
set +a

# Create logs directory if it doesn't exist
mkdir -p logs

# Log start time
echo "[$(date)] Running update script..." >> logs/cron.log

# Fetch data and update file
curl -s -H "Cookie: session=${AOC_SESSION_COOKIE}" \
     "https://adventofcode.com/2024/leaderboard/private/view/1858329.json" \
     | jq '.' > temp.json

# Check if curl was successful
if [ $? -eq 0 ]; then
    # Create the TypeScript file with the data
    echo "export const data = $(cat temp.json);" > src/data/true-data.ts
    rm temp.json
    echo "[$(date)] Successfully updated data file" >> logs/cron.log
else
    echo "[$(date)] Error: Failed to fetch data" >> logs/cron.log
fi

echo "----------------------------------------" >> logs/cron.log