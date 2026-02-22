# 🎾 CourtBeat – AI-Powered Fitness Platform

Professional fitness content for padel, pickleball, and tennis clubs.

## Quick Start (Cloud)

See [RAILWAY-DEPLOY.md](./RAILWAY-DEPLOY.md) for full deployment guide.

## Quick Start (Local)

### Manual Setup (Recommended)
```bash
# 1. Install PostgreSQL 15 + Node.js 18

# 2. Create database
psql -U postgres -c "CREATE DATABASE racket_fitness;"

# 3. Backend
cd backend
cp .env.example .env
# Edit .env with your PostgreSQL password
npm install
npx prisma migrate deploy
npx prisma db seed
npm run start:dev

# 4. Frontend (new terminal)
cd frontend
echo "NEXT_PUBLIC_API_URL=http://localhost:4000/api" > .env.local
npm install
npm run dev
```

### Docker Setup
```bash
docker-compose up -d
# Wait 30s then seed:
docker cp backend/prisma/seed.sql racket-fitness-db:/tmp/seed.sql
docker exec -i racket-fitness-db psql -U postgres -d racket_fitness -f /tmp/seed.sql
```

## Access

| URL | Description |
|-----|-------------|
| http://localhost:3000 | Homepage |
| http://localhost:3000/club | Member access |
| http://localhost:3000/admin | Admin dashboard |
| http://localhost:4000/api/docs | API documentation |

## Credentials

- **Club Code:** `PADEL2024`
- **Admin:** `admin@padelclub.com` / `admin123`

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | Next.js 14, TypeScript, Tailwind CSS |
| Backend | NestJS, TypeScript, Prisma |
| Database | PostgreSQL 15 |
| Video | Mux |
| Deployment | Railway / Docker |

## Railway Deployment

This project is structured for Railway deployment:
- `backend/` → Backend service (NestJS)
- `frontend/` → Frontend service (Next.js)
- PostgreSQL → Railway managed database

See **[RAILWAY-DEPLOY.md](./RAILWAY-DEPLOY.md)** for step-by-step instructions.
