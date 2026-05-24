#!/bin/bash
cd /home/z/my-project
export NODE_OPTIONS="--max-old-space-size=1024"
while true; do
  echo "Starting server at $(date)..."
  npx next start -p 3000 2>&1
  EXIT_CODE=$?
  echo "Server exited with code $EXIT_CODE at $(date). Restarting in 3s..."
  sleep 3
done
