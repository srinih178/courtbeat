#!/bin/sh
set -e

echo "🚀 CourtBeat Frontend Starting..."
echo "Environment: $NODE_ENV"
echo "Port: ${PORT:-3000}"

# Find the entry point
if [ -f "server.js" ]; then
  ENTRY="server.js"
elif [ -f ".next/standalone/server.js" ]; then
  ENTRY=".next/standalone/server.js"
elif [ -f "/app/.next/standalone/server.js" ]; then
  ENTRY="/app/.next/standalone/server.js"
else
  echo "❌ ERROR: Cannot find entry point!"
  echo "Searching for possible entry points..."
  find . -name "server.js" 2>/dev/null | head -10
  exit 1
fi

echo "✅ Found entry point: $ENTRY"
echo ""
echo "🎾 Starting CourtBeat Frontend..."

# CRITICAL: Set hostname to 0.0.0.0 so Railway can reach it
export HOSTNAME="0.0.0.0"
export PORT="${PORT:-3000}"

exec node $ENTRY
