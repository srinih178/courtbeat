import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding CourtBeat database...');

  // Use bcrypt lazily to handle native module issues gracefully
  let bcrypt: any;
  try {
    bcrypt = require('bcrypt');
  } catch {
    console.log('⚠ bcrypt not available, using placeholder hash');
  }

  const passwordHash = bcrypt
    ? await bcrypt.hash('admin123', 10)
    : '$2b$10$EixZaYVK1fsbw1ZfbX3OXePaWxn96p36WQlWOLlLkj2DfGBLN3Uim'; // fallback

  // Club
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

  // Admin
  await prisma.clubAdmin.upsert({
    where: { email: 'admin@padelclub.com' },
    update: {},
    create: {
      id: 'admin-001',
      clubId: club.id,
      email: 'admin@padelclub.com',
      passwordHash,
      name: 'Diego Martinez',
    },
  });
  console.log('✅ Admin: admin@padelclub.com');

  // Workouts
  const workouts = [
    { id: 'w-001', title: 'Padel Pre-Match Conditioning', description: 'Dynamic warm-up for padel players with mobility, agility, and court movement.', type: 'CONDITIONING', sportType: 'PADEL', difficulty: 'ALL_LEVELS', duration: 20, requiresRacket: true, sortOrder: 1 },
    { id: 'w-002', title: 'Core Strength for Racket Sports', description: 'Pilates-inspired core workout for rotational strength and racket control.', type: 'PILATES', sportType: 'GENERAL', difficulty: 'INTERMEDIATE', duration: 30, requiresMat: true, sortOrder: 2 },
    { id: 'w-003', title: 'Zumba with Racket – High Energy', description: 'Dance-based cardio with racket movements. Fun and energetic!', type: 'ZUMBA', sportType: 'GENERAL', difficulty: 'ALL_LEVELS', duration: 45, requiresRacket: true, sortOrder: 3 },
    { id: 'w-004', title: 'Tennis Mobility & Flexibility', description: 'Stretching and mobility targeting tennis movement patterns and injury prevention.', type: 'CONDITIONING', sportType: 'TENNIS', difficulty: 'BEGINNER', duration: 25, requiresMat: true, sortOrder: 4 },
    { id: 'w-005', title: 'Pickleball Power Training', description: 'HIIT for pickleball players focusing on explosive power and quick reactions.', type: 'SPORT_SPECIFIC', sportType: 'PICKLEBALL', difficulty: 'ADVANCED', duration: 30, requiresRacket: true, sortOrder: 5 },
    { id: 'w-006', title: 'Bodyweight Pilates Flow', description: 'Flowing Pilates with only bodyweight. Build core strength and control.', type: 'PILATES', sportType: 'GENERAL', difficulty: 'INTERMEDIATE', duration: 35, requiresMat: true, sortOrder: 6 },
    { id: 'w-007', title: 'Recovery & Stretching Session', description: 'Gentle recovery with deep stretching and breathing. Great for rest days.', type: 'CONDITIONING', sportType: 'GENERAL', difficulty: 'ALL_LEVELS', duration: 20, requiresMat: true, sortOrder: 7 },
    { id: 'w-008', title: 'Racket Dance Party – Latin Beats', description: 'Zumba-style workout with Latin music and racket movements.', type: 'ZUMBA', sportType: 'GENERAL', difficulty: 'ALL_LEVELS', duration: 40, requiresRacket: true, sortOrder: 8 },
    { id: 'w-009', title: 'Padel Footwork Drills', description: 'Court-specific footwork and agility training for padel.', type: 'SPORT_SPECIFIC', sportType: 'PADEL', difficulty: 'INTERMEDIATE', duration: 25, requiresRacket: true, sortOrder: 9 },
    { id: 'w-010', title: 'Total Body Conditioning', description: 'Full-body cardio, strength, and flexibility. Mat only.', type: 'CONDITIONING', sportType: 'GENERAL', difficulty: 'ALL_LEVELS', duration: 40, requiresMat: true, sortOrder: 10 },
  ] as const;

  for (const w of workouts) {
    await prisma.workout.upsert({
      where: { id: w.id },
      update: {},
      create: {
        requiresReformer: false,
        requiresRacket: false,
        requiresMat: false,
        hasVerbalCues: true,
        hasVisualMods: false,
        isActive: true,
        ...w,
      } as any,
    });
  }
  console.log(`✅ Workouts: ${workouts.length} seeded`);
  console.log('🎉 Seeding complete!');
}

main()
  .catch((e) => { console.error('❌ Seed error:', e); process.exit(1); })
  .finally(() => prisma.$disconnect());
