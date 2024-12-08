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

# Check if curl was successful and the file is not empty
if [ $? -eq 0 ] && [ -s temp.json ]; then
    # Log the JSON content for debugging
    echo "[$(date)] JSON content preview:" >> logs/cron.log
    head -n 5 temp.json >> logs/cron.log
    
    # Create the TypeScript file with the data
    echo "export const data = $(cat temp.json);" > src/data/true-data.ts
    
    # Verify the TypeScript file was created properly
    if [ -s src/data/true-data.ts ]; then
        echo "[$(date)] Successfully updated data file. Size: $(wc -c < src/data/true-data.ts) bytes" >> logs/cron.log
        # Clean up
        rm temp.json
    else
        echo "[$(date)] Error: TypeScript file is empty" >> logs/cron.log
    fi
else
    echo "[$(date)] Error: Failed to fetch data or JSON file is empty" >> logs/cron.log
    if [ -f temp.json ]; then
        echo "[$(date)] temp.json content:" >> logs/cron.log
        cat temp.json >> logs/cron.log
    fi
fi

echo "----------------------------------------" >> logs/cron.log