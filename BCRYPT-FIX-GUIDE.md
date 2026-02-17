# Fix bcrypt "Invalid ELF Header" Error

## Problem

You're seeing this error in backend logs:
```
Error: /app/node_modules/bcrypt/lib/binding/napi-v3/bcrypt_lib.node: invalid ELF header
```

**Root Cause:** bcrypt is a native module that was compiled on Windows but needs to run in Linux Docker container. The binary is incompatible.

---

## IMMEDIATE FIX (5 minutes)

Run this script:
```cmd
cd courtbeat
IMMEDIATE-FIX.bat
```

**What it does:**
1. Seeds database directly (bypasses broken backend)
2. Rebuilds backend container with bcrypt compiled correctly
3. Restarts everything

**Then test:** http://localhost:3000/club with PADEL2024

---

## COMPLETE FIX (10 minutes)

If immediate fix doesn't work, do full rebuild:

```cmd
cd courtbeat
FIX-BCRYPT-DOCKER.bat
```

**What it does:**
1. Stops all containers
2. Removes old backend image
3. Rebuilds from scratch (no cache)
4. Seeds database
5. Verifies everything works

---

## Manual Fix (Step by Step)

### Step 1: Stop Everything
```cmd
docker-compose down
```

### Step 2: Remove Backend Node Modules (if exists)
```cmd
rmdir /s /q backend\node_modules
```

This ensures Windows-compiled bcrypt isn't copied to container.

### Step 3: Rebuild Backend (No Cache)
```cmd
docker-compose build --no-cache backend
```

Wait 5-10 minutes for build to complete.

### Step 4: Start Containers
```cmd
docker-compose up -d
```

### Step 5: Wait for Database
```cmd
timeout /t 30
```

### Step 6: Seed Database
```cmd
docker cp backend\prisma\seed.sql racket-fitness-db:/tmp/seed.sql
docker exec -i racket-fitness-db psql -U postgres -d racket_fitness -f /tmp/seed.sql
```

### Step 7: Verify Backend Started
```cmd
docker-compose logs backend
```

Should NOT show bcrypt errors.

### Step 8: Test
```
http://localhost:3000/club
Code: PADEL2024
```

---

## Why This Happens

### The Issue:
1. You ran `npm install` on Windows (in backend folder)
2. bcrypt compiled native binaries for Windows
3. Docker COPY command copied these Windows binaries into Linux container
4. Linux container can't run Windows binaries → "invalid ELF header"

### The Fix:
1. ✅ Added `.dockerignore` to prevent copying node_modules
2. ✅ Updated Dockerfile to use `npm ci` (clean install)
3. ✅ Added `npm rebuild bcrypt --build-from-source` in Dockerfile
4. ✅ This compiles bcrypt INSIDE the container for Linux

---

## Prevent Future Issues

### Never run these in backend folder on Windows:
```cmd
❌ npm install
❌ npm ci
❌ npm rebuild
```

### Why?
These will compile native modules for Windows, which breaks Docker.

### Instead:
Let Docker handle all npm commands inside the container where they compile for Linux.

---

## Verify Fix Worked

### Check 1: Backend Logs Clean
```cmd
docker-compose logs backend | findstr bcrypt
```

Should return nothing (no bcrypt errors).

### Check 2: Backend Running
```cmd
docker-compose ps
```

Backend should show "Up" status.

### Check 3: API Responding
```cmd
curl http://localhost:4000/api/clubs
```

Should return JSON (not connection refused).

### Check 4: Database Has Data
```cmd
docker exec -i racket-fitness-db psql -U postgres -d racket_fitness -c "SELECT * FROM clubs;"
```

Should show Diego's Padel Club.

### Check 5: PADEL2024 Works
```
http://localhost:3000/club
Enter: PADEL2024
Should load 10 workouts
```

---

## Alternative: Manual Setup (Avoids Docker Issues)

If Docker continues to have issues, use manual setup:

```cmd
setup-manual.bat
```

This installs everything locally without Docker:
- PostgreSQL on Windows
- Node.js backend on Windows  
- Next.js frontend on Windows

**Advantages:**
- No Docker compatibility issues
- Faster development
- Easier debugging
- bcrypt works natively on Windows

**See:** MANUAL-WINDOWS-SETUP.md for complete guide

---

## Technical Details

### What .dockerignore Does:
```
node_modules     ← Prevents copying Windows node_modules
dist             ← Prevents copying built files
.env             ← Prevents copying local env
```

### What Dockerfile Does:
```dockerfile
# Clean install (no package-lock issues)
RUN npm ci

# Rebuild bcrypt for Linux inside container
RUN npm rebuild bcrypt --build-from-source

# Generate Prisma (also needs to be in container)
RUN npx prisma generate
```

### Key Points:
1. All native modules MUST be compiled inside container
2. Never copy node_modules from host to container
3. Use `.dockerignore` to prevent accidental copying
4. Use `npm ci` not `npm install` for clean state

---

## Quick Commands Reference

### Rebuild Backend Only:
```cmd
docker-compose build --no-cache backend
docker-compose up -d backend
```

### Check Backend Logs:
```cmd
docker-compose logs backend
docker-compose logs -f backend  # Follow logs
```

### Seed Database:
```cmd
docker cp backend\prisma\seed.sql racket-fitness-db:/tmp/seed.sql
docker exec -i racket-fitness-db psql -U postgres -d racket_fitness -f /tmp/seed.sql
```

### Full Reset:
```cmd
docker-compose down -v
docker-compose build --no-cache
docker-compose up -d
# Then seed database
```

---

## Success Indicators

✅ Backend logs show no bcrypt errors  
✅ Backend container stays up (doesn't restart)  
✅ Can curl http://localhost:4000/api/clubs  
✅ Database has clubs table with data  
✅ PADEL2024 works at localhost:3000/club  

---

## Still Not Working?

### Check these:

1. **Docker Desktop updated?**
   - Update to latest version
   - Restart Docker Desktop

2. **WSL 2 enabled?** (Windows 10/11)
   - Docker needs WSL 2 backend
   - Check Docker Desktop settings

3. **Enough disk space?**
   - Docker images need 5-10 GB
   - Check available space

4. **Antivirus blocking?**
   - Some antivirus blocks Docker builds
   - Try temporarily disabling

5. **Try manual setup:**
   ```cmd
   setup-manual.bat
   ```
   Avoids Docker entirely.

---

## Summary

**Problem:** bcrypt compiled for Windows, doesn't work in Linux container

**Solution:** Rebuild container with `.dockerignore` and proper Dockerfile

**Scripts:**
- `IMMEDIATE-FIX.bat` - Quick fix (5 min)
- `FIX-BCRYPT-DOCKER.bat` - Complete fix (10 min)

**Alternative:** Use `setup-manual.bat` to avoid Docker

**Result:** Backend starts cleanly, PADEL2024 works! 🎉
