#!/bin/bash

# Script to run the worker to process pending image edits
# This is a temporary solution for local development

# Load environment variables
source .env.local

# Check if CRON_SECRET is set
if [ -z "$CRON_SECRET" ]; then
  echo "❌ CRON_SECRET is not defined in your .env.local file"
  echo "Please add a CRON_SECRET to your .env.local file and try again"
  exit 1
fi

# Define the site URL
SITE_URL=${NEXT_PUBLIC_SITE_URL:-http://localhost:3000}

echo "🚀 Triggering worker to process pending image edits..."

# Call the worker API
response=$(curl -s -X POST \
  -H "Authorization: Bearer $CRON_SECRET" \
  -H "Content-Type: application/json" \
  "$SITE_URL/api/orchestrator/worker")

# Check if the curl command succeeded
if [ $? -eq 0 ]; then
  echo "✅ Worker triggered successfully!"
  echo "📊 Results: $response"
  
  # Extract the processed count using grep and sed
  processed=$(echo $response | grep -o '"processed":[0-9]*' | sed 's/"processed"://')
  
  if [ "$processed" = "0" ]; then
    echo "ℹ️ No pending jobs found to process."
  else
    echo "🔄 Processed $processed job(s)."
  fi
else
  echo "❌ Failed to trigger worker: $response"
fi
