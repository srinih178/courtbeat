#!/bin/sh
set -e

echo "🚀 CourtBeat Backend Starting..."
echo "Environment: $NODE_ENV"
echo "Port: ${PORT:-4000}"

# Find the entry point
if [ -f "dist/main.js" ]; then
  ENTRY="dist/main.js"
elif [ -f "dist/src/main.js" ]; then
  ENTRY="dist/src/main.js"
elif [ -f "dist/main/index.js" ]; then
  ENTRY="dist/main/index.js"
else
  echo "❌ ERROR: Cannot find entry point!"
  echo "Searching for possible entry points..."
  find dist -name "*.js" | head -10
  exit 1
fi

echo "✅ Found entry point: $ENTRY"

echo ""
echo "📦 Running database migrations..."
npx prisma migrate deploy || {
  echo "⚠️  Migration failed or not needed, continuing..."
}

echo ""
echo "🌱 Seeding database (safe to re-run)..."
node -e "
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function seed() {
  console.log('Attempting to seed...');
  
  // Check if already seeded
  try {
    const existing = await prisma.club.findUnique({ where: { accessCode: 'PADEL2024' } });
    if (existing) {
      console.log('✅ Database already seeded (found PADEL2024)');
      await prisma.\$disconnect();
      return;
    }
  } catch (e) {
    console.log('Database not ready yet, will retry...');
  }

  console.log('No existing data, seeding now...');
  
  try {
    // Create club
    await prisma.club.create({
      data: {
        id: 'club-001',
        name: 'Diego\\'s Padel Club',
        email: 'diego@padelclub.com',
        accessCode: 'PADEL2024',
        contactPerson: 'Diego Martinez',
        contactPhone: '+1-555-0123',
        subscriptionTier: 'BASE',
        hasReformer: false,
        isActive: true,
      }
    });
    console.log('✅ Club created');

    // Create admin (pre-hashed password for admin123)
    await prisma.clubAdmin.create({
      data: {
        id: 'admin-001',
        clubId: 'club-001',
        email: 'admin@padelclub.com',
        passwordHash: '\$2b\$10\$EixZaYVK1fsbw1ZfbX3OXePaWxn96p36YQlWOLlLkj2DfGBLN3UiS',
        name: 'Diego Martinez',
      }
    });
    console.log('✅ Admin created');

    // Create workouts
    const workouts = [
      { id: 'w1', title: 'Padel Conditioning', description: 'Dynamic warm-up for padel', type: 'CONDITIONING', sportType: 'PADEL', difficulty: 'ALL_LEVELS', duration: 20, requiresRacket: true },
      { id: 'w2', title: 'Core Strength', description: 'Core workout', type: 'PILATES', sportType: 'GENERAL', difficulty: 'INTERMEDIATE', duration: 30, requiresMat: true },
      { id: 'w3', title: 'Zumba High Energy', description: 'Dance cardio', type: 'ZUMBA', sportType: 'GENERAL', difficulty: 'ALL_LEVELS', duration: 45, requiresRacket: true },
      { id: 'w4', title: 'Tennis Mobility', description: 'Stretching', type: 'CONDITIONING', sportType: 'TENNIS', difficulty: 'BEGINNER', duration: 25, requiresMat: true },
      { id: 'w5', title: 'Pickleball Power', description: 'HIIT training', type: 'SPORT_SPECIFIC', sportType: 'PICKLEBALL', difficulty: 'ADVANCED', duration: 30, requiresRacket: true },
      { id: 'w6', title: 'Pilates Flow', description: 'Bodyweight Pilates', type: 'PILATES', sportType: 'GENERAL', difficulty: 'INTERMEDIATE', duration: 35, requiresMat: true },
      { id: 'w7', title: 'Recovery Session', description: 'Gentle stretching', type: 'CONDITIONING', sportType: 'GENERAL', difficulty: 'ALL_LEVELS', duration: 20, requiresMat: true },
      { id: 'w8', title: 'Dance Party', description: 'Latin Zumba', type: 'ZUMBA', sportType: 'GENERAL', difficulty: 'ALL_LEVELS', duration: 40, requiresRacket: true },
      { id: 'w9', title: 'Footwork Drills', description: 'Court agility', type: 'SPORT_SPECIFIC', sportType: 'PADEL', difficulty: 'INTERMEDIATE', duration: 25, requiresRacket: true },
      { id: 'w10', title: 'Total Body', description: 'Full body workout', type: 'CONDITIONING', sportType: 'GENERAL', difficulty: 'ALL_LEVELS', duration: 40, requiresMat: true },
    ];
    
    for (const w of workouts) {
      await prisma.workout.create({
        data: {
          requiresReformer: false,
          requiresRacket: w.requiresRacket || false,
          requiresMat: w.requiresMat || false,
          hasVerbalCues: true,
          hasVisualMods: false,
          isActive: true,
          sortOrder: parseInt(w.id.replace('w', '')),
          ...w,
        }
      });
    }
    console.log('✅ Workouts created (10 total)');
  } catch (e) {
    console.log('⚠️  Seed error:', e.message);
  }
  
  await prisma.\$disconnect();
}

seed().catch(e => {
  console.log('⚠️  Seed failed:', e.message);
  process.exit(0);
});
" || echo "⚠️  Seed skipped"

echo ""
echo "🎾 Starting CourtBeat API..."
echo "Entry point: $ENTRY"
exec node $ENTRY
