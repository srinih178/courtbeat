# 🚂 Deploying CourtBeat to Railway

Railway is the easiest way to host CourtBeat publicly. This guide covers everything from zero to live in ~15 minutes.

## What You'll Deploy

- **PostgreSQL** - Database (Railway managed)
- **Backend** - NestJS API (racket-fitness-backend)
- **Frontend** - Next.js app (what users see)

## Architecture

```
Internet → Frontend (Railway) → Backend API (Railway) → PostgreSQL (Railway)
```

---

## Prerequisites

1. GitHub account (free): https://github.com
2. Railway account (free tier): https://railway.app

---

## Step 1: Push Code to GitHub

Railway deploys from GitHub. You need to push your code there first.

### Create a GitHub repository

1. Go to https://github.com/new
2. Name: `courtbeat`
3. Set to **Private** (recommended)
4. Click **Create repository**

### Push your code

Extract the ZIP and open terminal in the `courtbeat` folder:

```bash
git init
git add .
git commit -m "Initial CourtBeat deployment"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/courtbeat.git
git push -u origin main
```

**Windows alternative:** Use GitHub Desktop - https://desktop.github.com

---

## Step 2: Create Railway Project

1. Go to https://railway.app
2. Click **Start a New Project**
3. Click **Deploy from GitHub repo**
4. Connect your GitHub account if not done
5. Select your `courtbeat` repository

Railway will detect the code but we need to configure 3 services.

---

## Step 3: Add PostgreSQL Database

1. In your Railway project, click **+ New**
2. Select **Database**
3. Select **Add PostgreSQL**
4. Railway provisions a PostgreSQL instance automatically
5. Click on the PostgreSQL service
6. Go to **Variables** tab
7. Copy the `DATABASE_URL` value — you'll need it later

---

## Step 4: Deploy the Backend

### Create Backend Service

1. Click **+ New**
2. Select **GitHub Repo**
3. Select your `courtbeat` repo
4. Click **Configure** and set **Root Directory** to: `backend`
5. Railway will auto-detect the nixpacks.toml

### Set Backend Environment Variables

Click on the backend service → **Variables** tab → Add these:

```
DATABASE_URL         = [paste the PostgreSQL DATABASE_URL from Step 3]
JWT_SECRET           = [generate a random 32+ char string, e.g. courtbeat-prod-secret-2024-xyz]
NODE_ENV             = production
PORT                 = 4000
CORS_ORIGIN          = https://[your-frontend-url].railway.app
```

**To get a random JWT secret (run in terminal):**
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### Backend will auto-deploy

Railway runs:
1. Install packages
2. Build TypeScript
3. On startup: migrate DB → seed data → start API

### Get your Backend URL

Click on backend service → **Settings** → copy the domain.
It will look like: `https://courtbeat-backend-production-xxxx.railway.app`

---

## Step 5: Deploy the Frontend

### Create Frontend Service

1. Click **+ New**
2. Select **GitHub Repo**
3. Select your `courtbeat` repo
4. Click **Configure** and set **Root Directory** to: `frontend`

### Set Frontend Environment Variables

Click on the frontend service → **Variables** tab:

```
NEXT_PUBLIC_API_URL  = https://[your-backend-url].railway.app/api
NODE_ENV             = production
```

Replace `[your-backend-url]` with the backend URL from Step 4.

### Get your Frontend URL

Click on frontend service → **Settings** → copy the domain.
It will look like: `https://courtbeat-production-xxxx.railway.app`

---

## Step 6: Update Backend CORS

Now that you have the frontend URL, update the backend:

1. Go to backend service → **Variables**
2. Update `CORS_ORIGIN` to your actual frontend URL:
   ```
   CORS_ORIGIN = https://courtbeat-production-xxxx.railway.app
   ```
3. Backend will automatically redeploy

---

## Step 7: Test Your Deployment

### Check Backend Health

Visit: `https://your-backend-url.railway.app/api/health`

Should return:
```json
{"status": "ok", "timestamp": "2024-..."}
```

### Check Backend API

Visit: `https://your-backend-url.railway.app/api/clubs`

Should return JSON with Diego's Padel Club.

### Test Frontend

Visit: `https://your-frontend-url.railway.app`

Should show the CourtBeat homepage!

### Test Club Access

1. Go to `https://your-frontend-url.railway.app/club`
2. Enter: `PADEL2024`
3. Should show 10 workouts!

---

## Troubleshooting

### Backend Won't Start

**Check logs:** Click backend service → **Deployments** → click latest → **View Logs**

**Common issues:**

| Error | Fix |
|-------|-----|
| `DATABASE_URL not set` | Add DATABASE_URL variable |
| `Cannot connect to database` | Make sure DATABASE_URL points to Railway PostgreSQL |
| `Migration failed` | Check migration files in `backend/prisma/migrations/` |
| `bcrypt error` | Nixpacks builds on Linux — should work. Try redeploying. |

### Frontend Won't Load

**Check logs:** Same as above but for frontend service.

**Common issues:**

| Error | Fix |
|-------|-----|
| `NEXT_PUBLIC_API_URL not set` | Add env variable |
| `Cannot connect to API` | Backend not running / wrong URL |
| `Build failed` | Check logs for TypeScript errors |

### PADEL2024 Still Invalid

The seed runner in `start.sh` runs automatically on startup.

**Check manually via Railway:**
1. Go to backend service
2. Click **Settings** → **Run Command**
3. Run: `npx prisma studio`
4. Or check logs for "✅ Club: Diego's Padel Club"

**Force reseed:**
1. Go to backend **Variables**
2. Add: `FORCE_RESEED=true`
3. Redeploy
4. Then remove the variable

---

## Custom Domain (Optional)

### Add your own domain:

1. Buy a domain (Namecheap, GoDaddy, Cloudflare, etc.)
2. In Railway, click on the service → **Settings** → **Domains**
3. Click **Custom Domain**
4. Enter your domain: e.g., `courtbeat.yourdomain.com`
5. Railway shows DNS settings to add at your domain registrar

**Typical DNS setup:**
```
Type: CNAME
Name: courtbeat (or @)
Value: [railway-provided-value]
TTL: 3600
```

---

## Environment Variables Reference

### Backend Required Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `DATABASE_URL` | PostgreSQL connection | `postgresql://...` |
| `JWT_SECRET` | JWT signing secret | 32+ random chars |
| `NODE_ENV` | Environment | `production` |
| `PORT` | API port | `4000` |
| `CORS_ORIGIN` | Frontend URL | `https://xxx.railway.app` |

### Frontend Required Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `NEXT_PUBLIC_API_URL` | Backend API URL | `https://xxx.railway.app/api` |
| `NODE_ENV` | Environment | `production` |

---

## Railway Pricing

**Free Tier:**
- $5 free credit per month
- Enough for demo/testing
- Sleeps after inactivity (first request wakes it up)

**Hobby Plan ($5/month):**
- No sleeping
- More resources
- Good for small clubs

**Pro Plan ($20/month):**
- Full resources
- Multiple services
- Good for production

---

## Alternative Platforms

If Railway doesn't work, try these alternatives:

### Render (render.com)

**Backend:**
- Service type: Web Service
- Root directory: `backend`
- Build command: `npm ci && npm rebuild bcrypt --build-from-source && npx prisma generate && npm run build`
- Start command: `npx prisma migrate deploy && node dist/seed-runner.js && node dist/main`

**Frontend:**
- Service type: Web Service  
- Root directory: `frontend`
- Build command: `npm ci && npm run build`
- Start command: `node server.js`

**Database:**
- Add PostgreSQL from Render dashboard
- Copy DATABASE_URL to backend env vars

### Fly.io (fly.io)

Uses Docker directly — the Dockerfiles in the project work with Fly.io.

### Digital Ocean App Platform

Similar to Railway — connect GitHub, set env vars, deploy.

### Vercel (Frontend Only)

Vercel hosts only the Next.js frontend (not the backend or database).

1. Push to GitHub
2. Go to vercel.com → New Project
3. Select `courtbeat` repo
4. Set **Root Directory** to `frontend`
5. Add env var: `NEXT_PUBLIC_API_URL`
6. Deploy

For backend, host separately on Railway/Render.

---

## File Structure for Railway

```
courtbeat/
├── backend/
│   ├── nixpacks.toml       ← Railway build config
│   ├── railway.json        ← Railway deploy config
│   ├── Dockerfile          ← Docker alternative
│   ├── src/
│   │   └── seed-runner.ts  ← Auto-seeds database
│   └── prisma/
│       └── migrations/     ← DB schema migrations
│
└── frontend/
    ├── nixpacks.toml       ← Railway build config
    ├── railway.json        ← Railway deploy config
    └── next.config.mjs    ← output: standalone ✓
```

---

## Quick Reference

### Backend starts with:
```
npx prisma migrate deploy    → applies schema changes
node dist/seed-runner.js     → seeds data if empty
node dist/main               → starts API server
```

### Frontend starts with:
```
node server.js               → Next.js standalone server
```

### Health checks:
```
Backend: GET /api/health → {"status":"ok"}
Frontend: GET / → 200 OK
```

---

## After Deployment

Share these with your club:

```
🎾 CourtBeat is Live!

Member Access:
  URL: https://your-frontend-url.railway.app/club
  Code: PADEL2024

Admin Dashboard:
  URL: https://your-frontend-url.railway.app/admin
  Email: admin@padelclub.com
  Password: admin123

API Docs:
  URL: https://your-backend-url.railway.app/api/docs
```

**Important:** Change the admin password after first login in production!

---

## Success Checklist

- [ ] Code pushed to GitHub
- [ ] PostgreSQL service created in Railway
- [ ] Backend service deployed (Root dir: `backend`)
- [ ] Backend env vars set (DATABASE_URL, JWT_SECRET, etc.)
- [ ] Frontend service deployed (Root dir: `frontend`)
- [ ] Frontend env var set (NEXT_PUBLIC_API_URL)
- [ ] Backend CORS_ORIGIN updated to frontend URL
- [ ] `/api/health` returns `{"status":"ok"}`
- [ ] `/api/clubs` returns JSON data
- [ ] Frontend homepage loads
- [ ] PADEL2024 shows 10 workouts

**You're live! Share the URL with your clubs! 🎾🚀**
