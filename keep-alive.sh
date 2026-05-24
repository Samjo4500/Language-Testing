#!/bin/bash
cd /home/z/my-project
export NODE_OPTIONS="--max-old-space-size=1024"
while true; do
  echo "[$(date)] Starting next dev..."
  npx next dev -p 3000 2>&1
  echo "[$(date)] Server crashed. Restarting in 5s..."
  sleep 5
done
