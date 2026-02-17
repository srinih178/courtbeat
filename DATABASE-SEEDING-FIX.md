# Database Seeding Troubleshooting

## Problem: PADEL2024 Returns "Invalid Access Code"

This means your database is empty. Let's fix it!

---

## Quick Fix

### Option 1: Run Seed Script (Easiest)
```cmd
cd courtbeat
seed-database.bat
```

Choose option 1 for Docker or 2 for Manual setup.

### Option 2: Manual Command

**For Docker:**
```cmd
docker cp backend\prisma\seed.sql courtbeat-backend:/tmp/seed.sql
docker-compose exec postgres psql -U postgres -d racket_fitness -f /tmp/seed.sql
```

**For Manual Setup:**
```cmd
psql -U postgres -d racket_fitness -f backend\prisma\seed.sql
```

---

## Verify Database Has Data

**Docker:**
```cmd
docker-compose exec postgres psql -U postgres -d racket_fitness -c "SELECT * FROM clubs;"
```

**Manual:**
```cmd
psql -U postgres -d racket_fitness -c "SELECT * FROM clubs;"
```

**Expected Output:**
```
 id        | name                  | accessCode | ...
-----------+-----------------------+------------+
 club-001  | Diego's Padel Club    | PADEL2024  | ...
```

If you see this, PADEL2024 should work!

---

## Why Did Seeding Fail?

Common reasons:

1. **Windows batch file syntax** - The `<<` heredoc doesn't work in batch files
2. **bcrypt native module** - Can't compile in Docker on Windows
3. **Container not ready** - Database wasn't fully started

**Solution:** Use the SQL seed file directly (bypasses all these issues)

---

## Complete Reset (If Nothing Works)

**Docker:**
```cmd
# Stop everything
docker-compose down -v

# Delete containers and volumes
docker system prune -f

# Start fresh
docker-compose up -d

# Wait 30 seconds
timeout /t 30

# Seed manually
docker cp backend\prisma\seed.sql courtbeat-backend:/tmp/seed.sql
docker-compose exec postgres psql -U postgres -d racket_fitness -f /tmp/seed.sql
```

**Manual:**
```cmd
# In psql or pgAdmin, run:
DROP DATABASE racket_fitness;
CREATE DATABASE racket_fitness;

# Then seed:
psql -U postgres -d racket_fitness -f backend\prisma\seed.sql
```

---

## Check Backend Can Connect

**Make sure backend .env has correct DATABASE_URL:**

Docker:
```env
DATABASE_URL="postgresql://postgres:password@postgres:5432/racket_fitness?schema=public"
```

Manual:
```env
DATABASE_URL="postgresql://postgres:YOUR_PASSWORD@localhost:5432/racket_fitness?schema=public"
```

**Test backend connection:**
```cmd
# Backend logs should show "Database connected"
# Docker:
docker-compose logs backend | findstr database

# Manual:
# Check terminal where backend is running
```

---

## Quick Verification Steps

1. **Database exists:**
   ```cmd
   # Docker:
   docker-compose exec postgres psql -U postgres -l | findstr racket_fitness
   
   # Manual:
   psql -U postgres -l | findstr racket_fitness
   ```

2. **Tables exist:**
   ```cmd
   # Docker:
   docker-compose exec postgres psql -U postgres -d racket_fitness -c "\dt"
   
   # Manual:
   psql -U postgres -d racket_fitness -c "\dt"
   ```
   
   Should show: clubs, workouts, club_admins, etc.

3. **Data exists:**
   ```cmd
   # Check clubs
   psql ... -c "SELECT COUNT(*) FROM clubs;"
   # Should return: 1
   
   # Check workouts
   psql ... -c "SELECT COUNT(*) FROM workouts;"
   # Should return: 10
   ```

---

## Alternative: Use pgAdmin

If command line isn't working:

1. Open pgAdmin 4
2. Connect to your database
3. Right-click racket_fitness → Query Tool
4. Open file: `backend\prisma\seed.sql`
5. Click Execute (F5)
6. Check for errors in output

---

## Still Not Working?

**Check these:**

- [ ] PostgreSQL is running (services.msc)
- [ ] Database "racket_fitness" exists
- [ ] Backend can connect (check .env DATABASE_URL)
- [ ] No errors when running seed.sql
- [ ] Tables have data (SELECT COUNT(*) FROM clubs;)
- [ ] Backend is running and showing no connection errors

**If backend shows connection errors:**
- Check DATABASE_URL password matches PostgreSQL
- Check PostgreSQL accepting connections on port 5432
- Try: `psql -U postgres -c "SELECT version();"` to test connection

---

## Success Checklist

After seeding, you should have:

- [x] 1 club (Diego's Padel Club)
- [x] Access code: PADEL2024
- [x] 1 admin (admin@padelclub.com)
- [x] 10 workouts
- [x] No errors in backend logs
- [x] http://localhost:3000/club accepts PADEL2024

---

## Quick Reference

**Seed commands:**

```cmd
# Docker
docker cp backend\prisma\seed.sql courtbeat-backend:/tmp/seed.sql
docker-compose exec postgres psql -U postgres -d racket_fitness -f /tmp/seed.sql

# Manual
psql -U postgres -d racket_fitness -f backend\prisma\seed.sql

# Verify
psql -U postgres -d racket_fitness -c "SELECT name, \"accessCode\" FROM clubs;"
```

**Should see:**
```
      name           | accessCode
---------------------+------------
 Diego's Padel Club  | PADEL2024
```

Now PADEL2024 should work! 🎉
