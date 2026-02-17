# Connecting to Docker PostgreSQL with DB Clients

## Connection Details

When using Docker setup, PostgreSQL is accessible on your local machine:

```
Host: localhost
Port: 5432
Database: racket_fitness
Username: postgres
Password: password
```

---

## Option 1: pgAdmin (Recommended for PostgreSQL)

### Download
https://www.pgadmin.org/download/

### Setup Steps

1. **Open pgAdmin**
2. **Right-click "Servers"** → Register → Server

3. **General Tab:**
   - Name: `CourtBeat Docker`

4. **Connection Tab:**
   - Host: `localhost`
   - Port: `5432`
   - Maintenance database: `racket_fitness`
   - Username: `postgres`
   - Password: `password`
   - Save password: ✓ (check this)

5. **Click "Save"**

6. **Navigate to:**
   ```
   Servers → CourtBeat Docker → Databases → racket_fitness → Schemas → public → Tables
   ```

7. **You'll see:**
   - clubs
   - club_admins
   - workouts
   - videos
   - schedules
   - analytics
   - music_tracks
   - content_batches

### Query Data

Right-click `clubs` table → View/Edit Data → All Rows

Or use Query Tool:
```sql
SELECT * FROM clubs;
SELECT * FROM workouts;
SELECT name, "accessCode" FROM clubs WHERE "accessCode" = 'PADEL2024';
```

---

## Option 2: DBeaver (Universal DB Tool)

### Download
https://dbeaver.io/download/

### Setup Steps

1. **Open DBeaver**
2. **Click "New Database Connection"** (plug icon)
3. **Select "PostgreSQL"** → Next

4. **Connection Settings:**
   - Host: `localhost`
   - Port: `5432`
   - Database: `racket_fitness`
   - Username: `postgres`
   - Password: `password`
   - Save password: ✓

5. **Test Connection** (should succeed)
6. **Click "Finish"**

7. **Navigate:**
   ```
   racket_fitness → Schemas → public → Tables
   ```

### Query Data

Right-click connection → SQL Editor → New SQL Script

```sql
-- Check clubs
SELECT * FROM clubs;

-- Check workouts
SELECT COUNT(*) as total, type FROM workouts GROUP BY type;

-- Verify PADEL2024
SELECT name, "accessCode", email FROM clubs;
```

---

## Option 3: TablePlus (Modern UI)

### Download
https://tableplus.com/

### Setup Steps

1. **Open TablePlus**
2. **Click "Create a new connection"**
3. **Select PostgreSQL**

4. **Fill in:**
   - Name: `CourtBeat`
   - Host: `localhost`
   - Port: `5432`
   - User: `postgres`
   - Password: `password`
   - Database: `racket_fitness`

5. **Test** → **Connect**

---

## Option 4: Command Line (psql)

### If you have PostgreSQL installed locally:

```cmd
psql -h localhost -p 5432 -U postgres -d racket_fitness
```

When prompted, enter password: `password`

### Common Commands:

```sql
-- List all tables
\dt

-- View clubs
SELECT * FROM clubs;

-- View workouts
SELECT id, title, type FROM workouts;

-- Count records
SELECT COUNT(*) FROM clubs;
SELECT COUNT(*) FROM workouts;

-- Check access code
SELECT name, "accessCode" FROM clubs WHERE "accessCode" = 'PADEL2024';

-- Exit
\q
```

---

## Option 5: Docker Exec (No Installation Needed)

### Access PostgreSQL directly in Docker container:

```cmd
docker exec -it racket-fitness-db psql -U postgres -d racket_fitness
```

Then use psql commands as above.

---

## Common Queries

### Check if database is seeded:

```sql
-- Should return 1
SELECT COUNT(*) as club_count FROM clubs;

-- Should return 10
SELECT COUNT(*) as workout_count FROM workouts;

-- Should return 1
SELECT COUNT(*) as admin_count FROM club_admins;
```

### View all data:

```sql
-- Clubs with access codes
SELECT id, name, "accessCode", email, "subscriptionTier" 
FROM clubs;

-- Workouts summary
SELECT id, title, type, "sportType", difficulty, duration 
FROM workouts 
ORDER BY "sortOrder";

-- Admin accounts
SELECT id, email, name, "clubId" 
FROM club_admins;
```

### Insert test data:

```sql
-- Add a new workout
INSERT INTO workouts (
  id, title, description, type, "sportType", 
  difficulty, duration, "isActive", "createdAt", "updatedAt"
) VALUES (
  'test-workout-1',
  'Test Workout',
  'This is a test',
  'CONDITIONING',
  'GENERAL',
  'ALL_LEVELS',
  30,
  true,
  NOW(),
  NOW()
);
```

---

## Troubleshooting

### Cannot connect to localhost:5432

**Check Docker container is running:**
```cmd
docker ps | findstr racket-fitness-db
```

**Should show:**
```
racket-fitness-db   postgres:15-alpine   Up X minutes   0.0.0.0:5432->5432/tcp
```

**If not running:**
```cmd
docker-compose up -d
```

### Connection refused

**Check port 5432 is exposed:**
```cmd
netstat -ano | findstr :5432
```

**Restart database container:**
```cmd
docker-compose restart postgres
```

### Wrong password

**Password is:** `password`

**Check docker-compose.yml:**
```yaml
environment:
  POSTGRES_PASSWORD: password
```

If you changed it, use your custom password.

### Database doesn't exist

**Create it:**
```cmd
docker exec -it racket-fitness-db psql -U postgres -c "CREATE DATABASE racket_fitness;"
```

---

## Viewing Schema

### pgAdmin:
1. Navigate to table
2. Right-click → Properties
3. See columns, types, constraints

### DBeaver:
1. Right-click table → View Table
2. See structure

### SQL:
```sql
-- View table structure
\d clubs

-- Or
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_name = 'clubs';
```

---

## Backup & Restore

### Backup:

```cmd
# From Docker container
docker exec racket-fitness-db pg_dump -U postgres racket_fitness > backup.sql

# Or use pg_dump tool if installed locally
pg_dump -h localhost -p 5432 -U postgres racket_fitness > backup.sql
```

### Restore:

```cmd
# To Docker container
docker exec -i racket-fitness-db psql -U postgres racket_fitness < backup.sql

# Or use psql tool
psql -h localhost -p 5432 -U postgres -d racket_fitness < backup.sql
```

---

## Summary

**Best Options:**

1. **pgAdmin** - Best for PostgreSQL, full features
2. **DBeaver** - Universal, works with many databases
3. **Docker exec** - No installation, command line
4. **TablePlus** - Modern UI, paid but nice

**Connection String:**
```
postgresql://postgres:password@localhost:5432/racket_fitness
```

**Quick Test:**
```cmd
# Windows Command Prompt
docker exec racket-fitness-db psql -U postgres -d racket_fitness -c "SELECT COUNT(*) FROM clubs;"
```

Should return: `1` (if database is seeded)

---

## Next Steps

1. Choose a DB client from above
2. Connect using the credentials
3. Verify tables exist
4. Check data is seeded
5. Run queries to inspect/modify data

**Now you have full access to view and manage your Docker PostgreSQL database!** 🎉
