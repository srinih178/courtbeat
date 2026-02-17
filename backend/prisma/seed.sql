-- CourtBeat Database Seed - Direct SQL
-- Use this if Prisma seed fails

-- Insert Club
INSERT INTO clubs (id, name, email, "accessCode", "contactPerson", "contactPhone", "subscriptionTier", "hasReformer", "isActive", "createdAt", "updatedAt")
VALUES (
  'club-001',
  'Diego''s Padel Club',
  'diego@padelclub.com',
  'PADEL2024',
  'Diego Martinez',
  '+1-555-0123',
  'BASE',
  false,
  true,
  NOW(),
  NOW()
) ON CONFLICT (id) DO NOTHING;

-- Insert Admin (password: admin123)
-- Note: This is a valid bcrypt hash for 'admin123'
INSERT INTO club_admins (id, "clubId", email, "passwordHash", name, "createdAt", "updatedAt")
VALUES (
  'admin-001',
  'club-001',
  'admin@padelclub.com',
  '$2b$10$EixZaYVK1fsbw1ZfbX3OXePaWxn96p36YQlWOLlLkj2DfGBLN3UiS',
  'Diego Martinez',
  NOW(),
  NOW()
) ON CONFLICT (id) DO NOTHING;

-- Insert Workouts
INSERT INTO workouts (id, title, description, type, "sportType", difficulty, duration, "requiresReformer", "requiresRacket", "requiresMat", "hasVerbalCues", "hasVisualMods", "isActive", "sortOrder", "createdAt", "updatedAt")
VALUES 
  ('workout-001', 'Padel Pre-Match Conditioning', 'Dynamic warm-up and conditioning routine designed specifically for padel players. Includes mobility work, agility drills, and court movement patterns.', 'CONDITIONING', 'PADEL', 'ALL_LEVELS', 20, false, true, false, true, false, true, 1, NOW(), NOW()),
  ('workout-002', 'Core Strength for Racket Sports', 'Bodyweight Pilates-inspired core workout focusing on rotational strength and stability for improved racket control.', 'PILATES', 'GENERAL', 'INTERMEDIATE', 30, false, false, true, true, false, true, 2, NOW(), NOW()),
  ('workout-003', 'Zumba with Racket - High Energy', 'Fun, dance-based cardio workout incorporating racket movements. Perfect for building endurance while having fun!', 'ZUMBA', 'GENERAL', 'ALL_LEVELS', 45, false, true, false, true, false, true, 3, NOW(), NOW()),
  ('workout-004', 'Tennis Mobility & Flexibility', 'Comprehensive stretching and mobility session targeting tennis-specific movement patterns and injury prevention.', 'CONDITIONING', 'TENNIS', 'BEGINNER', 25, false, false, true, true, false, true, 4, NOW(), NOW()),
  ('workout-005', 'Pickleball Power Training', 'High-intensity interval training designed for pickleball players. Focus on explosive power and quick reactions.', 'SPORT_SPECIFIC', 'PICKLEBALL', 'ADVANCED', 30, false, true, false, true, false, true, 5, NOW(), NOW()),
  ('workout-006', 'Bodyweight Pilates Flow', 'Flowing Pilates sequence using only bodyweight. Perfect for building core strength and control.', 'PILATES', 'GENERAL', 'INTERMEDIATE', 35, false, false, true, true, true, true, 6, NOW(), NOW()),
  ('workout-007', 'Recovery & Stretching Session', 'Gentle recovery workout with deep stretching and breathing exercises. Great for rest days.', 'CONDITIONING', 'GENERAL', 'ALL_LEVELS', 20, false, false, true, true, false, true, 7, NOW(), NOW()),
  ('workout-008', 'Racket Dance Party - Latin Beats', 'Upbeat Zumba-style workout with Latin music. Incorporates racket movements for sport-specific benefits.', 'ZUMBA', 'GENERAL', 'ALL_LEVELS', 40, false, true, false, true, false, true, 8, NOW(), NOW()),
  ('workout-009', 'Padel Footwork Drills', 'Court-specific footwork and agility training. Improve your movement patterns and court coverage.', 'SPORT_SPECIFIC', 'PADEL', 'INTERMEDIATE', 25, false, true, false, true, false, true, 9, NOW(), NOW()),
  ('workout-010', 'Total Body Conditioning', 'Full-body workout combining cardio, strength, and flexibility. No equipment needed except a mat.', 'CONDITIONING', 'GENERAL', 'ALL_LEVELS', 40, false, false, true, true, true, true, 10, NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- Verify data
SELECT 'Clubs: ' || COUNT(*) FROM clubs;
SELECT 'Admins: ' || COUNT(*) FROM club_admins;
SELECT 'Workouts: ' || COUNT(*) FROM workouts;
