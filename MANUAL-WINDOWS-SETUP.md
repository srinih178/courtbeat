# CourtBeat - Manual Windows Setup (No Docker)

## Prerequisites

Download and install these:

1. **Node.js 18+** - https://nodejs.org/
2. **PostgreSQL 15** - https://www.postgresql.org/download/windows/
3. **Git** (optional) - https://git-scm.com/download/win

---

## Step 1: Install PostgreSQL

### Download PostgreSQL
1. Go to https://www.postgresql.org/download/windows/
2. Download PostgreSQL 15 installer
3. Run the installer

### Installation Settings
- **Password:** Use `password` (or remember your custom password)
- **Port:** 5432 (default)
- **Locale:** Default
- **Install components:** PostgreSQL Server, pgAdmin 4, Command Line Tools

### After Installation
1. Open pgAdmin 4
2. Right-click "Databases"
3. Create → Database
4. Name: `racket_fitness`
5. Click Save

---

## Step 2: Setup Backend

### Navigate to Backend Folder
```cmd
cd courtbeat\backend
```

### Create Environment File
Create a file called `.env` in the `backend` folder with this content:

```env
# Database
DATABASE_URL="postgresql://postgres:password@localhost:5432/racket_fitness?schema=public"

# JWT
JWT_SECRET="your-super-secret-jwt-key-change-in-production-12345"

# Server
PORT=4000
NODE_ENV=development

# Mux (optional - for video streaming)
MUX_TOKEN_ID=""
MUX_TOKEN_SECRET=""
```

**Important:** Replace `password` with your PostgreSQL password if different.

### Install Dependencies
```cmd
npm install
```

This will take 2-3 minutes.

### Generate Prisma Client
```cmd
npx prisma generate
```

### Run Database Migrations
```cmd
npx prisma migrate deploy
```

If this fails, try the SQL method:
```cmd
# Open psql
psql -U postgres -d racket_fitness

# Then paste the contents of: prisma/seed.sql
# Or run:
psql -U postgres -d racket_fitness < prisma/seed.sql
```

### Seed the Database

**Method 1: Using Prisma (preferred)**
```cmd
npm run prisma:seed
```

**Method 2: Direct SQL (if bcrypt fails)**
```cmd
psql -U postgres -d racket_fitness -f prisma/seed.sql
```

**Method 3: Manual via pgAdmin**
1. Open pgAdmin 4
2. Navigate to racket_fitness database
3. Tools → Query Tool
4. Open `prisma/seed.sql`
5. Execute (F5)

### Verify Database
```cmd
psql -U postgres -d racket_fitness -c "SELECT name, accessCode FROM clubs;"
```

Should show: `Diego's Padel Club | PADEL2024`

### Start Backend
```cmd
npm run start:dev
```

Backend should start on http://localhost:4000

---

## Step 3: Setup Frontend

### Open New Terminal
Keep backend running, open a new Command Prompt window.

### Navigate to Frontend
```cmd
cd courtbeat\frontend
```

### Create Environment File
Create `.env.local` in the `frontend` folder:

```env
NEXT_PUBLIC_API_URL=http://localhost:4000/api
```

### Install Dependencies
```cmd
npm install
```

### Start Frontend
```cmd
npm run dev
```

Frontend should start on http://localhost:3000

---

## Step 4: Access the Application

Open your browser:

1. **Homepage:** http://localhost:3000
2. **Club Access:** http://localhost:3000/club
   - Code: `PADEL2024`
3. **Admin:** http://localhost:3000/admin
   - Email: `admin@padelclub.com`
   - Password: `admin123`
4. **API Docs:** http://localhost:4000/api/docs

---

## Troubleshooting

### Issue: "Cannot connect to database"

**Check PostgreSQL is running:**
```cmd
# Open Services
services.msc

# Find "postgresql-x64-15"
# Status should be "Running"
```

**If not running:**
```cmd
# Start PostgreSQL
net start postgresql-x64-15
```

**Test connection:**
```cmd
psql -U postgres -c "SELECT version();"
```

### Issue: "Port 5432 already in use"

Another PostgreSQL instance might be running:
```cmd
netstat -ano | findstr :5432
```

Stop the process or change the port in DATABASE_URL.

### Issue: "PADEL2024 returns invalid"

**Verify database has data:**
```cmd
psql -U postgres -d racket_fitness

# Inside psql:
SELECT * FROM clubs;
SELECT * FROM workouts;
```

If empty, re-run the seed:
```cmd
psql -U postgres -d racket_fitness -f backend/prisma/seed.sql
```

### Issue: "bcrypt error" during seed

This is a native module issue. Use the SQL seed instead:
```cmd
cd backend
psql -U postgres -d racket_fitness -f prisma/seed.sql
```

### Issue: Backend won't start

**Check if port 4000 is free:**
```cmd
netstat -ano | findstr :4000
```

**Kill process if occupied:**
```cmd
taskkill /PID <PID_NUMBER> /F
```

### Issue: Frontend won't start

**Check if port 3000 is free:**
```cmd
netstat -ano | findstr :3000
```

**Or change port:**
```cmd
# In frontend folder
npm run dev -- -p 3001
```

Then update NEXT_PUBLIC_API_URL if needed.

---

## Common Commands

### PostgreSQL
```cmd
# Connect to database
psql -U postgres -d racket_fitness

# List tables
\dt

# View clubs
SELECT * FROM clubs;

# View workouts
SELECT * FROM workouts;

# Exit psql
\q
```

### Backend
```cmd
# Start dev server
npm run start:dev

# Run migrations
npx prisma migrate deploy

# Seed database
npm run prisma:seed

# Reset database
npx prisma migrate reset
```

### Frontend
```cmd
# Start dev server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

---

## Database Schema

### Main Tables
- **clubs** - Club information
- **club_admins** - Admin users
- **workouts** - Workout library
- **videos** - Video content
- **schedules** - Scheduled sessions
- **analytics** - Usage tracking
- **music_tracks** - Music library
- **content_batches** - Batch operations

### Sample Data
- 1 Club (Diego's Padel Club)
- 1 Admin (admin@padelclub.com)
- 10 Workouts (various types)

---

## Running in Background

### Using PM2 (optional)

**Install PM2:**
```cmd
npm install -g pm2
```

**Start backend:**
```cmd
cd backend
pm2 start "npm run start:dev" --name courtbeat-backend
```

**Start frontend:**
```cmd
cd frontend
pm2 start "npm run dev" --name courtbeat-frontend
```

**View status:**
```cmd
pm2 status
pm2 logs
```

**Stop services:**
```cmd
pm2 stop all
pm2 delete all
```

---

## Production Build

### Backend
```cmd
cd backend
npm run build
npm start
```

### Frontend
```cmd
cd frontend
npm run build
npm start
```

---

## File Structure

```
courtbeat/
├── backend/
│   ├── src/
│   │   ├── modules/      # API modules
│   │   ├── common/       # Shared utilities
│   │   └── main.ts       # Entry point
│   ├── prisma/
│   │   ├── schema.prisma # Database schema
│   │   ├── seed.ts       # TypeScript seed
│   │   └── seed.sql      # SQL seed (backup)
│   ├── .env              # Environment variables
│   └── package.json
│
└── frontend/
    ├── src/
    │   ├── app/          # Pages
    │   └── components/   # React components
    ├── .env.local        # Environment variables
    └── package.json
```

---

## Environment Variables

### Backend (.env)
```env
DATABASE_URL="postgresql://USER:PASSWORD@localhost:5432/racket_fitness?schema=public"
JWT_SECRET="your-secret-key"
PORT=4000
NODE_ENV=development
```

### Frontend (.env.local)
```env
NEXT_PUBLIC_API_URL=http://localhost:4000/api
```

---

## Tips

### Use Windows Terminal
- Better than Command Prompt
- Multiple tabs
- Modern interface
- Download from Microsoft Store

### Use VS Code
- Open project: `code courtbeat`
- Integrated terminal
- IntelliSense for TypeScript
- Recommended extensions already configured

### Keep Both Running
- Terminal 1: Backend (port 4000)
- Terminal 2: Frontend (port 3000)
- Both need to stay open

---

## Next Steps

1. ✅ Verify both servers running
2. ✅ Test club access with PADEL2024
3. ✅ Test admin login
4. ✅ Browse workouts
5. ✅ Check API docs at localhost:4000/api/docs

---

## Support

**Check logs:**
- Backend: Shows in terminal where you ran `npm run start:dev`
- Frontend: Shows in terminal where you ran `npm run dev`

**Database issues:**
- Use pgAdmin 4 for visual database management
- Run queries directly to check data

**Still stuck?**
1. Check all services running (PostgreSQL, backend, frontend)
2. Verify environment files created correctly
3. Check ports are not occupied
4. Review error messages in terminals

---

**You're all set! CourtBeat running without Docker.** 🚀
