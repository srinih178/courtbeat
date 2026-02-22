import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const count = await prisma.club.count();
  
  if (count > 0) {
    console.log(`✅ Database already seeded (${count} clubs found). Skipping.`);
    return;
  }

  console.log('🌱 Seeding database...');

  // Create club
  const club = await prisma.club.upsert({
    where: { accessCode: 'PADEL2024' },
    update: {},
    create: {
      id: 'club-001',
      name: "Diego's Padel Club",
      email: 'diego@padelclub.com',
      accessCode: 'PADEL2024',
      contactPerson: 'Diego Martinez',
      contactPhone: '+1-555-0123',
      subscriptionTier: 'BASE',
      hasReformer: false,
      isActive: true,
    },
  });
  console.log(`✅ Club: ${club.name} (${club.accessCode})`);

  // Create workouts
  const workouts = [
    { id: 'w1', title: 'Padel Pre-Match Conditioning', description: 'Dynamic warm-up for padel players', type: 'CONDITIONING' as const, sportType: 'PADEL' as const, difficulty: 'ALL_LEVELS' as const, duration: 20, requiresReformer: false, requiresRacket: true, requiresMat: false, hasVerbalCues: true, hasVisualMods: false, isActive: true, sortOrder: 1 },
    { id: 'w2', title: 'Core Strength for Racket Sports', description: 'Pilates core for racket control', type: 'PILATES' as const, sportType: 'GENERAL' as const, difficulty: 'INTERMEDIATE' as const, duration: 30, requiresReformer: false, requiresRacket: false, requiresMat: true, hasVerbalCues: true, hasVisualMods: false, isActive: true, sortOrder: 2 },
    { id: 'w3', title: 'Zumba with Racket - High Energy', description: 'Fun dance cardio with racket movements', type: 'ZUMBA' as const, sportType: 'GENERAL' as const, difficulty: 'ALL_LEVELS' as const, duration: 45, requiresReformer: false, requiresRacket: true, requiresMat: false, hasVerbalCues: true, hasVisualMods: false, isActive: true, sortOrder: 3 },
    { id: 'w4', title: 'Tennis Mobility & Flexibility', description: 'Comprehensive stretching for tennis', type: 'CONDITIONING' as const, sportType: 'TENNIS' as const, difficulty: 'BEGINNER' as const, duration: 25, requiresReformer: false, requiresRacket: false, requiresMat: true, hasVerbalCues: true, hasVisualMods: false, isActive: true, sortOrder: 4 },
    { id: 'w5', title: 'Pickleball Power Training', description: 'HIIT training for pickleball players', type: 'SPORT_SPECIFIC' as const, sportType: 'PICKLEBALL' as const, difficulty: 'ADVANCED' as const, duration: 30, requiresReformer: false, requiresRacket: true, requiresMat: false, hasVerbalCues: true, hasVisualMods: false, isActive: true, sortOrder: 5 },
    { id: 'w6', title: 'Bodyweight Pilates Flow', description: 'Flowing Pilates for core strength', type: 'PILATES' as const, sportType: 'GENERAL' as const, difficulty: 'INTERMEDIATE' as const, duration: 35, requiresReformer: false, requiresRacket: false, requiresMat: true, hasVerbalCues: true, hasVisualMods: true, isActive: true, sortOrder: 6 },
    { id: 'w7', title: 'Recovery & Stretching Session', description: 'Gentle recovery and breathing', type: 'CONDITIONING' as const, sportType: 'GENERAL' as const, difficulty: 'ALL_LEVELS' as const, duration: 20, requiresReformer: false, requiresRacket: false, requiresMat: true, hasVerbalCues: true, hasVisualMods: false, isActive: true, sortOrder: 7 },
    { id: 'w8', title: 'Racket Dance Party - Latin Beats', description: 'Latin Zumba with racket movements', type: 'ZUMBA' as const, sportType: 'GENERAL' as const, difficulty: 'ALL_LEVELS' as const, duration: 40, requiresReformer: false, requiresRacket: true, requiresMat: false, hasVerbalCues: true, hasVisualMods: false, isActive: true, sortOrder: 8 },
    { id: 'w9', title: 'Padel Footwork Drills', description: 'Court footwork and agility', type: 'SPORT_SPECIFIC' as const, sportType: 'PADEL' as const, difficulty: 'INTERMEDIATE' as const, duration: 25, requiresReformer: false, requiresRacket: true, requiresMat: false, hasVerbalCues: true, hasVisualMods: false, isActive: true, sortOrder: 9 },
    { id: 'w10', title: 'Total Body Conditioning', description: 'Full body workout, mat only', type: 'CONDITIONING' as const, sportType: 'GENERAL' as const, difficulty: 'ALL_LEVELS' as const, duration: 40, requiresReformer: false, requiresRacket: false, requiresMat: true, hasVerbalCues: true, hasVisualMods: true, isActive: true, sortOrder: 10 },
  ];

  for (const workout of workouts) {
    await prisma.workout.upsert({
      where: { id: workout.id },
      update: {},
      create: workout,
    });
  }
  console.log(`✅ Workouts: 10 created`);
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e.message);
    // Don't exit with error - allow app to start even if seed fails
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
