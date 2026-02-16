-- CreateEnum
CREATE TYPE "WorkoutType" AS ENUM ('CONDITIONING', 'PILATES', 'ZUMBA', 'SPORT_SPECIFIC', 'REFORMER_PILATES');

-- CreateEnum
CREATE TYPE "WorkoutDifficulty" AS ENUM ('BEGINNER', 'INTERMEDIATE', 'ADVANCED', 'ALL_LEVELS');

-- CreateEnum
CREATE TYPE "SportType" AS ENUM ('PADEL', 'PICKLEBALL', 'TENNIS', 'GENERAL');

-- CreateEnum
CREATE TYPE "SubscriptionTier" AS ENUM ('BASE', 'PREMIUM');

-- CreateTable
CREATE TABLE "clubs" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "accessCode" TEXT NOT NULL,
    "address" TEXT,
    "contactPerson" TEXT,
    "contactPhone" TEXT,
    "subscriptionTier" "SubscriptionTier" NOT NULL DEFAULT 'BASE',
    "hasReformer" BOOLEAN NOT NULL DEFAULT false,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "clubs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "club_admins" (
    "id" TEXT NOT NULL,
    "clubId" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "club_admins_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "workouts" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "type" "WorkoutType" NOT NULL,
    "sportType" "SportType" NOT NULL DEFAULT 'GENERAL',
    "difficulty" "WorkoutDifficulty" NOT NULL DEFAULT 'ALL_LEVELS',
    "duration" INTEGER NOT NULL,
    "requiresReformer" BOOLEAN NOT NULL DEFAULT false,
    "requiresRacket" BOOLEAN NOT NULL DEFAULT false,
    "requiresMat" BOOLEAN NOT NULL DEFAULT false,
    "hasVerbalCues" BOOLEAN NOT NULL DEFAULT true,
    "hasVisualMods" BOOLEAN NOT NULL DEFAULT false,
    "instructorNotes" TEXT,
    "thumbnailUrl" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "workouts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "videos" (
    "id" TEXT NOT NULL,
    "workoutId" TEXT NOT NULL,
    "fileName" TEXT NOT NULL,
    "originalUrl" TEXT,
    "muxAssetId" TEXT,
    "muxPlaybackId" TEXT,
    "streamUrl" TEXT,
    "duration" INTEGER,
    "fileSize" INTEGER,
    "width" INTEGER,
    "height" INTEGER,
    "hasMusic" BOOLEAN NOT NULL DEFAULT false,
    "musicTrackName" TEXT,
    "isProcessed" BOOLEAN NOT NULL DEFAULT false,
    "processingError" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "videos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "schedules" (
    "id" TEXT NOT NULL,
    "clubId" TEXT NOT NULL,
    "workoutId" TEXT NOT NULL,
    "scheduledAt" TIMESTAMP(3) NOT NULL,
    "duration" INTEGER NOT NULL,
    "isCompleted" BOOLEAN NOT NULL DEFAULT false,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "schedules_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "analytics" (
    "id" TEXT NOT NULL,
    "clubId" TEXT NOT NULL,
    "workoutId" TEXT,
    "eventType" TEXT NOT NULL,
    "sessionId" TEXT,
    "metadata" JSONB,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "analytics_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "music_tracks" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "artist" TEXT,
    "source" TEXT NOT NULL,
    "licenseInfo" TEXT,
    "fileUrl" TEXT NOT NULL,
    "duration" INTEGER NOT NULL,
    "bpm" INTEGER,
    "energy" TEXT,
    "genre" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "music_tracks_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "content_batches" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "totalItems" INTEGER NOT NULL DEFAULT 0,
    "processedItems" INTEGER NOT NULL DEFAULT 0,
    "errorLog" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "content_batches_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "clubs_email_key" ON "clubs"("email");

-- CreateIndex
CREATE UNIQUE INDEX "clubs_accessCode_key" ON "clubs"("accessCode");

-- CreateIndex
CREATE INDEX "clubs_accessCode_idx" ON "clubs"("accessCode");

-- CreateIndex
CREATE UNIQUE INDEX "club_admins_email_key" ON "club_admins"("email");

-- CreateIndex
CREATE INDEX "club_admins_clubId_idx" ON "club_admins"("clubId");

-- CreateIndex
CREATE INDEX "workouts_type_sportType_idx" ON "workouts"("type", "sportType");

-- CreateIndex
CREATE INDEX "workouts_requiresReformer_idx" ON "workouts"("requiresReformer");

-- CreateIndex
CREATE INDEX "videos_workoutId_idx" ON "videos"("workoutId");

-- CreateIndex
CREATE INDEX "videos_muxAssetId_idx" ON "videos"("muxAssetId");

-- CreateIndex
CREATE INDEX "schedules_clubId_scheduledAt_idx" ON "schedules"("clubId", "scheduledAt");

-- CreateIndex
CREATE INDEX "schedules_workoutId_idx" ON "schedules"("workoutId");

-- CreateIndex
CREATE INDEX "analytics_clubId_timestamp_idx" ON "analytics"("clubId", "timestamp");

-- CreateIndex
CREATE INDEX "analytics_workoutId_idx" ON "analytics"("workoutId");

-- CreateIndex
CREATE INDEX "analytics_eventType_timestamp_idx" ON "analytics"("eventType", "timestamp");

-- CreateIndex
CREATE INDEX "music_tracks_energy_bpm_idx" ON "music_tracks"("energy", "bpm");

-- AddForeignKey
ALTER TABLE "club_admins" ADD CONSTRAINT "club_admins_clubId_fkey" FOREIGN KEY ("clubId") REFERENCES "clubs"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "videos" ADD CONSTRAINT "videos_workoutId_fkey" FOREIGN KEY ("workoutId") REFERENCES "workouts"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "schedules" ADD CONSTRAINT "schedules_clubId_fkey" FOREIGN KEY ("clubId") REFERENCES "clubs"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "schedules" ADD CONSTRAINT "schedules_workoutId_fkey" FOREIGN KEY ("workoutId") REFERENCES "workouts"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "analytics" ADD CONSTRAINT "analytics_clubId_fkey" FOREIGN KEY ("clubId") REFERENCES "clubs"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "analytics" ADD CONSTRAINT "analytics_workoutId_fkey" FOREIGN KEY ("workoutId") REFERENCES "workouts"("id") ON DELETE SET NULL ON UPDATE CASCADE;
