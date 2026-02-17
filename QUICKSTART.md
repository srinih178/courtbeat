# CourtBeat - Quick Start Guide

## Choose Your Setup Method

### Option 1: Manual Setup (Recommended) ⭐
**Best for:** Windows users who want reliability and control
**Time:** 10-15 minutes
**Prerequisites:** PostgreSQL, Node.js

[Jump to Manual Setup](#manual-setup)

### Option 2: Docker Setup
**Best for:** Users familiar with Docker
**Time:** 5-10 minutes (if it works)
**Prerequisites:** Docker Desktop
**Note:** May have compatibility issues on some Windows systems

[Jump to Docker Setup](#docker-setup)

---

## Manual Setup

### Prerequisites

1. **PostgreSQL 15**
   - Download: https://www.postgresql.org/download/windows/
   - During install, set password to `password` (or remember your choice)
   - Install pgAdmin 4 when prompted

2. **Node.js 18+**
   - Download: https://nodejs.org/
   - Use LTS version

### Quick Steps

#### 1. Create Database
```cmd
# Open pgAdmin 4
# Right-click "Databases" → Create → Database
# Name: racket_fitness
# Save
```

OR via command line:
```cmd
psql -U postgres -c "CREATE DATABASE racket_fitness;"
```

#### 2. Run Setup Script
```cmd
cd courtbeat
setup-manual.bat
```

**What it does:**
- Creates .env files
- Installs dependencies
- Runs database migrations
- Seeds sample data

#### 3. Edit Backend .env (if needed)
```cmd
# Edit backend\.env
# Change password if you didn't use "password"
DATABASE_URL="postgresql://postgres:YOUR_PASSWORD@localhost:5432/racket_fitness?schema=public"
```

#### 4. Start Backend
```cmd
# Terminal 1
cd backend
npm run start:dev
```

Wait for: `Nest application successfully started`

#### 5. Start Frontend
```cmd
# Terminal 2 (new window)
cd frontend
npm run dev
```

Wait for: `Ready in X ms`

#### 6. Open Browser
```
http://localhost:3000
```

### Troubleshooting Manual Setup

**Issue: "Cannot connect to database"**
```cmd
# Check PostgreSQL is running
services.msc
# Find "postgresql-x64-15" - should be "Running"

# Test connection
psql -U postgres -c "SELECT version();"
```

**Issue: "PADEL2024 invalid"**
```cmd
# Check database has data
psql -U postgres -d racket_fitness -c "SELECT * FROM clubs;"

# If empty, run SQL seed
psql -U postgres -d racket_fitness -f backend\prisma\seed.sql
```

**Issue: "Port already in use"**
```cmd
# Check what's using port 4000
netstat -ano | findstr :4000

# Kill it
taskkill /PID <NUMBER> /F
```

**See full manual guide:** [MANUAL-WINDOWS-SETUP.md](./MANUAL-WINDOWS-SETUP.md)

---

## Docker Setup

### Prerequisites

1. **Docker Desktop**
   - Download: https://www.docker.com/products/docker-desktop/
   - Start Docker Desktop before running setup
   - Requires Windows 10/11 Pro or WSL2 on Home

### Quick Steps

#### 1. Run Setup
```cmd
cd courtbeat
setup-courtbeat.bat
```

**What it does:**
- Builds Docker images
- Starts PostgreSQL, backend, frontend
- Seeds database

**Wait:** 5-10 minutes for first-time build

#### 2. Open Browser
```
http://localhost:3000
```

### Troubleshooting Docker Setup

**Issue: Prisma/bcrypt errors**

This is a known issue with Docker on Windows. **Use manual setup instead:**
```cmd
setup-manual.bat
```

**Issue: "Docker is not running"**
```cmd
# Start Docker Desktop
# Wait for it to fully start
# Try again
```

**Issue: Containers won't start**
```cmd
# Clean everything
docker-compose down -v
docker system prune -f

# Try again
setup-courtbeat.bat
```

**Issue: Database not seeded**
```cmd
# Connect to database container
docker-compose exec postgres psql -U postgres -d racket_fitness

# Check data
SELECT * FROM clubs;

# If empty, exit and run:
docker-compose exec postgres psql -U postgres -d racket_fitness -f /app/prisma/seed.sql
```

---

## Verification

After setup (either method), verify:

### 1. Backend Running
```
http://localhost:4000/api/docs
```
Should show Swagger UI

### 2. Frontend Running
```
http://localhost:3000
```
Should show CourtBeat homepage

### 3. Database Has Data
**Manual:**
```cmd
psql -U postgres -d racket_fitness -c "SELECT name, accessCode FROM clubs;"
```

**Docker:**
```cmd
docker-compose exec postgres psql -U postgres -d racket_fitness -c "SELECT name, accessCode FROM clubs;"
```

Should show: `Diego's Padel Club | PADEL2024`

### 4. Test Access
```
1. Go to: http://localhost:3000/club
2. Enter code: PADEL2024
3. Should show 10 workouts
```

---

## Access Credentials

```
Club Access Code: PADEL2024

Admin Login:
  Email: admin@padelclub.com
  Password: admin123

Database (Manual Setup):
  Host: localhost
  Port: 5432
  Database: racket_fitness
  User: postgres
  Password: password (or your custom password)
```

---

## File Locations

### Manual Setup
```
Backend:  localhost:4000
Frontend: localhost:3000
Database: localhost:5432

Backend .env:     courtbeat\backend\.env
Frontend .env:    courtbeat\frontend\.env.local
Database backup:  courtbeat\backend\prisma\seed.sql
```

### Docker Setup
```
Backend:  localhost:4000 (container)
Frontend: localhost:3000 (container)
Database: localhost:5432 (container)

Logs: docker-compose logs -f
```

---

## Common Commands

### Manual Setup
```cmd
# Start backend
cd backend
npm run start:dev

# Start frontend
cd frontend  
npm run dev

# Check database
psql -U postgres -d racket_fitness
\dt
SELECT * FROM clubs;
\q

# Reset database
cd backend
npx prisma migrate reset
npm run prisma:seed
```

### Docker Setup
```cmd
# Start all
docker-compose up -d

# Stop all
docker-compose down

# View logs
docker-compose logs -f

# Restart
docker-compose restart

# Reset database
docker-compose down -v
setup-courtbeat.bat
```

---

## Which Method Should I Use?

### Use Manual Setup If:
- ✅ You want maximum reliability
- ✅ You're on Windows 10/11 Home
- ✅ Docker setup gave you errors
- ✅ You want to learn the stack
- ✅ You need to customize easily

### Use Docker Setup If:
- ✅ Docker Desktop is already working well for you
- ✅ You want isolated environment
- ✅ You're familiar with Docker
- ✅ You want easier cleanup (just delete containers)

**Recommendation:** Start with manual setup. It's more reliable on Windows.

---

## Next Steps

1. ✅ Verify app is running
2. ✅ Test club access (PADEL2024)
3. ✅ Test admin login
4. ✅ Browse workouts
5. ✅ Check admin pages

---

## Getting Help

**Documentation:**
- `MANUAL-WINDOWS-SETUP.md` - Full manual setup guide
- `DOCKER-SPACING-FIXES.md` - Docker troubleshooting
- `README.md` - Project overview
- `API.md` - API documentation

**Common Issues:**
- Database connection: Check PostgreSQL service running
- Invalid access code: Run seed.sql file
- Port conflicts: Check nothing else using 3000/4000/5432
- bcrypt errors: Use manual setup instead of Docker

---

## Support Checklist

Before asking for help, check:

- [ ] PostgreSQL/Docker is running
- [ ] Environment files created (.env, .env.local)
- [ ] Dependencies installed (npm install completed)
- [ ] Database seeded (clubs table has data)
- [ ] Ports not occupied (3000, 4000, 5432 free)
- [ ] Both backend and frontend running
- [ ] Checked terminal for error messages

---

**Ready to go! Choose your setup method above and get started.** 🚀
