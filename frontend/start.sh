#!/bin/sh
set -e

echo "🚀 CourtBeat Frontend Starting..."
echo "Environment: $NODE_ENV"
echo "Port: ${PORT:-3000}"

echo ""
echo "🎾 Starting CourtBeat FrontEnd..."
# echo "Entry point: $ENTRY"
exec npx next start -p $PORT
