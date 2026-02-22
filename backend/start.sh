#!/bin/sh
set -e

echo "🔄 Running database migrations..."
npx prisma migrate deploy

echo "🌱 Checking seed data..."
node -e "
const { PrismaClient } = require('@prisma/client');
const p = new PrismaClient();
p.club.count().then(n => {
  if (n === 0) {
    console.log('NEEDS_SEED');
  } else {
    console.log('SEEDED:' + n);
  }
  return p.\$disconnect();
}).catch(e => { console.error(e); process.exit(1); });
" > /tmp/seed_check.txt 2>&1

SEED_STATUS=$(cat /tmp/seed_check.txt)
echo "Seed check: $SEED_STATUS"

if echo "$SEED_STATUS" | grep -q "NEEDS_SEED"; then
  echo "🌱 Seeding database with initial data..."
  node -e "
const { PrismaClient } = require('@prisma/client');
const p = new PrismaClient();
async function seed() {
  // Create club
  const club = await p.club.upsert({
    where: { accessCode: 'PADEL2024' },
    update: {},
    create: {
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
  console.log('Club created:', club.name);

  // Create workouts
  const workouts = [
    { id:'w1', title:'Padel Pre-Match Conditioning', description:'Dynamic warm-up for padel players', type:'CONDITIONING', sportType:'PADEL', difficulty:'ALL_LEVELS', duration:20, requiresReformer:false, requiresRacket:true, requiresMat:false, hasVerbalCues:true, hasVisualMods:false, isActive:true, sortOrder:1 },
    { id:'w2', title:'Core Strength for Racket Sports', description:'Pilates core for racket control', type:'PILATES', sportType:'GENERAL', difficulty:'INTERMEDIATE', duration:30, requiresReformer:false, requiresRacket:false, requiresMat:true, hasVerbalCues:true, hasVisualMods:false, isActive:true, sortOrder:2 },
    { id:'w3', title:'Zumba with Racket', description:'Fun dance cardio with racket movements', type:'ZUMBA', sportType:'GENERAL', difficulty:'ALL_LEVELS', duration:45, requiresReformer:false, requiresRacket:true, requiresMat:false, hasVerbalCues:true, hasVisualMods:false, isActive:true, sortOrder:3 },
    { id:'w4', title:'Tennis Mobility & Flexibility', description:'Stretching for tennis players', type:'CONDITIONING', sportType:'TENNIS', difficulty:'BEGINNER', duration:25, requiresReformer:false, requiresRacket:false, requiresMat:true, hasVerbalCues:true, hasVisualMods:false, isActive:true, sortOrder:4 },
    { id:'w5', title:'Pickleball Power Training', description:'HIIT for pickleball players', type:'SPORT_SPECIFIC', sportType:'PICKLEBALL', difficulty:'ADVANCED', duration:30, requiresReformer:false, requiresRacket:true, requiresMat:false, hasVerbalCues:true, hasVisualMods:false, isActive:true, sortOrder:5 },
    { id:'w6', title:'Bodyweight Pilates Flow', description:'Core and flexibility workout', type:'PILATES', sportType:'GENERAL', difficulty:'INTERMEDIATE', duration:35, requiresReformer:false, requiresRacket:false, requiresMat:true, hasVerbalCues:true, hasVisualMods:true, isActive:true, sortOrder:6 },
    { id:'w7', title:'Recovery & Stretching', description:'Gentle recovery session', type:'CONDITIONING', sportType:'GENERAL', difficulty:'ALL_LEVELS', duration:20, requiresReformer:false, requiresRacket:false, requiresMat:true, hasVerbalCues:true, hasVisualMods:false, isActive:true, sortOrder:7 },
    { id:'w8', title:'Racket Dance Party', description:'Latin Zumba with racket', type:'ZUMBA', sportType:'GENERAL', difficulty:'ALL_LEVELS', duration:40, requiresReformer:false, requiresRacket:true, requiresMat:false, hasVerbalCues:true, hasVisualMods:false, isActive:true, sortOrder:8 },
    { id:'w9', title:'Padel Footwork Drills', description:'Court footwork and agility', type:'SPORT_SPECIFIC', sportType:'PADEL', difficulty:'INTERMEDIATE', duration:25, requiresReformer:false, requiresRacket:true, requiresMat:false, hasVerbalCues:true, hasVisualMods:false, isActive:true, sortOrder:9 },
    { id:'w10', title:'Total Body Conditioning', description:'Full body workout, no equipment', type:'CONDITIONING', sportType:'GENERAL', difficulty:'ALL_LEVELS', duration:40, requiresReformer:false, requiresRacket:false, requiresMat:true, hasVerbalCues:true, hasVisualMods:true, isActive:true, sortOrder:10 },
  ];

  for (const w of workouts) {
    await p.workout.upsert({ where: { id: w.id }, update: {}, create: w });
  }
  console.log('Workouts created: 10');
  await p.\$disconnect();
}
seed().catch(e => { console.error(e); process.exit(1); });
"
  echo "✅ Seed complete!"
else
  echo "✅ Data already exists, skipping seed"
fi

echo "🚀 Starting CourtBeat API..."
exec node dist/main
