#!/bin/sh
set -e

echo "🚀 CourtBeat Backend Starting..."
echo "Environment: $NODE_ENV"
echo "Port: ${PORT:-4000}"

echo ""
echo "📦 Running database migrations..."
npx prisma migrate deploy || {
  echo "⚠️  Migration failed, but continuing..."
}

echo ""
echo "🌱 Seeding database (safe to re-run)..."
npx prisma db seed || {
  echo "⚠️  Seed failed or already done, continuing..."
}

echo ""
echo "🎾 Starting CourtBeat API..."
exec node dist/main
