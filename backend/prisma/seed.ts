import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seed...');

  // Create demo club
  const club = await prisma.club.upsert({
    where: { email: 'diego@padelclub.com' },
    update: {},
    create: {
      name: "Diego's Padel Club",
      email: 'diego@padelclub.com',
      accessCode: 'PADEL2024',
      address: '123 Racket Street, Miami, FL',
      contactPerson: 'Diego Martinez',
      contactPhone: '+1-555-0123',
      subscriptionTier: 'BASE',
      hasReformer: false,
      isActive: true,
    },
  });
  console.log('✅ Created demo club:', club.name);

  // Create club admin
  const passwordHash = await bcrypt.hash('admin123', 10);
  const admin = await prisma.clubAdmin.upsert({
    where: { email: 'admin@padelclub.com' },
    update: {},
    create: {
      clubId: club.id,
      email: 'admin@padelclub.com',
      passwordHash,
      name: 'Diego Martinez',
    },
  });
  console.log('✅ Created club admin:', admin.email);

  // Create sample workouts
  const workouts: any[] = [
    {
      title: 'Padel Pre-Match Conditioning',
      description: 'Dynamic warm-up and conditioning routine designed specifically for padel players. Includes mobility work, agility drills, and court movement patterns.',
      type: 'CONDITIONING',
      sportType: 'PADEL',
      difficulty: 'ALL_LEVELS',
      duration: 20,
      requiresRacket: true,
      hasVerbalCues: true,
    },
    {
      title: 'Core Strength for Racket Sports',
      description: 'Bodyweight Pilates-inspired core workout focusing on rotational strength and stability for improved racket control.',
      type: 'PILATES',
      sportType: 'GENERAL',
      difficulty: 'INTERMEDIATE',
      duration: 30,
      requiresMat: true,
      hasVerbalCues: true,
    },
    {
      title: 'Zumba with Racket - High Energy',
      description: 'Fun, dance-based cardio workout incorporating racket movements. Perfect for building endurance while having fun!',
      type: 'ZUMBA',
      sportType: 'GENERAL',
      difficulty: 'ALL_LEVELS',
      duration: 45,
      requiresRacket: true,
      hasVerbalCues: true,
    },
    {
      title: 'Tennis Mobility & Flexibility',
      description: 'Gentle stretching and mobility work tailored for tennis players of all ages. Includes verbal cues for modifications.',
      type: 'CONDITIONING',
      sportType: 'TENNIS',
      difficulty: 'BEGINNER',
      duration: 25,
      requiresMat: true,
      hasVerbalCues: true,
    },
    {
      title: 'Pickleball Power Training',
      description: 'Explosive power and agility training designed for pickleball players. Suitable for active members.',
      type: 'SPORT_SPECIFIC',
      sportType: 'PICKLEBALL',
      difficulty: 'ADVANCED',
      duration: 30,
      requiresRacket: true,
      hasVerbalCues: true,
    },
    {
      title: 'Bodyweight Pilates Flow',
      description: 'Accessible Pilates routine with clear verbal modifications for both active and less active participants.',
      type: 'PILATES',
      sportType: 'GENERAL',
      difficulty: 'ALL_LEVELS',
      duration: 35,
      requiresMat: true,
      hasVerbalCues: true,
    },
    {
      title: 'Recovery & Stretching Session',
      description: 'Post-match recovery routine with gentle stretches and breathing exercises. Perfect for seniors and casual players.',
      type: 'CONDITIONING',
      sportType: 'GENERAL',
      difficulty: 'BEGINNER',
      duration: 20,
      requiresMat: true,
      hasVerbalCues: true,
    },
    {
      title: 'Racket Dance Party - Latin Beats',
      description: 'Upbeat Zumba-style dance workout with Latin music and racket choreography.',
      type: 'ZUMBA',
      sportType: 'GENERAL',
      difficulty: 'ALL_LEVELS',
      duration: 40,
      requiresRacket: true,
      hasVerbalCues: true,
    },
    {
      title: 'Padel Footwork Drills',
      description: 'Court movement and footwork training specific to padel gameplay patterns.',
      type: 'SPORT_SPECIFIC',
      sportType: 'PADEL',
      difficulty: 'INTERMEDIATE',
      duration: 25,
      requiresRacket: false,
      hasVerbalCues: true,
    },
    {
      title: 'Total Body Conditioning',
      description: 'Full-body workout combining strength and cardio elements for racket sport athletes.',
      type: 'CONDITIONING',
      sportType: 'GENERAL',
      difficulty: 'INTERMEDIATE',
      duration: 35,
      requiresMat: false,
      hasVerbalCues: true,
    },
  ];

  for (const workoutData of workouts) {
    const workout = await prisma.workout.create({
      data: workoutData,
    });
    console.log(`✅ Created workout: ${workout.title}`);
  }

  // Create sample music tracks
  const musicTracks = [
    {
      title: 'Energetic Warm-up',
      artist: 'Various',
      source: 'epidemic',
      fileUrl: '/music/warmup-energetic.mp3',
      duration: 180,
      bpm: 128,
      energy: 'high',
      genre: 'Electronic',
    },
    {
      title: 'Latin Dance Beats',
      artist: 'Various',
      source: 'artlist',
      fileUrl: '/music/latin-dance.mp3',
      duration: 240,
      bpm: 135,
      energy: 'high',
      genre: 'Latin',
    },
    {
      title: 'Calm Stretching',
      artist: 'Various',
      source: 'epidemic',
      fileUrl: '/music/calm-stretch.mp3',
      duration: 300,
      bpm: 80,
      energy: 'low',
      genre: 'Ambient',
    },
  ];

  for (const trackData of musicTracks) {
    const track = await prisma.musicTrack.create({
      data: trackData,
    });
    console.log(`✅ Created music track: ${track.title}`);
  }

  console.log('🎉 Seed completed successfully!');
  console.log('\n📋 Demo Credentials:');
  console.log('   Club Access Code: PADEL2024');
  console.log('   Admin Email: admin@padelclub.com');
  console.log('   Admin Password: admin123');
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
