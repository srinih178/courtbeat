# 🚂 CourtBeat – Complete Railway Deployment Guide

Railway hosts your backend, frontend and database as separate services.
**Estimated time: 20 minutes.**

---

## Prerequisites

1. **GitHub account** – Push the code to a GitHub repo first
2. **Railway account** – Sign up free at https://railway.app

---

## Step 1 – Push to GitHub

```bash
# In the courtbeat folder
git init
git add .
git commit -m "CourtBeat initial commit"
```

Go to https://github.com/new and create a **new repository** (e.g. `courtbeat`).

```bash
git remote add origin https://github.com/YOUR_USERNAME/courtbeat.git
git push -u origin main
```

---

## Step 2 – Create a Railway Project

1. Go to https://railway.app → **New Project**
2. Click **"Deploy from GitHub repo"**
3. Connect your GitHub account if not already connected
4. Select your `courtbeat` repository
5. Railway will open a new project — **don't click Deploy yet**

---

## Step 3 – Add PostgreSQL Database

1. In your Railway project, click **"+ New"**
2. Select **"Database" → "PostgreSQL"**
3. Railway creates a managed Postgres instance automatically
4. Click on the Postgres service → **"Variables"** tab
5. Note the `DATABASE_URL` value (you'll need it for the backend)

---

## Step 4 – Deploy the Backend

### 4a. Add Backend Service

1. In your Railway project click **"+ New" → "GitHub Repo"**
2. Select your `courtbeat` repo
3. **IMPORTANT**: Set **Root Directory** = `backend`
4. Click **"Add Variables"** and set these:

| Variable | Value |
|---|---|
| `DATABASE_URL` | *Copy from Postgres service* |
| `JWT_SECRET` | `courtbeat-super-secret-jwt-key-2024` |
| `NODE_ENV` | `production` |
| `CORS_ORIGIN` | `*` (update to your frontend URL later) |

5. Railway will auto-detect the `Dockerfile` and build
6. Wait ~5 minutes for the build to complete
7. Once deployed, click **"Settings" → "Networking" → "Generate Domain"**
8. **Copy your backend URL** – looks like `https://courtbeat-backend-xxx.railway.app`

### 4b. Verify Backend Works

Visit: `https://YOUR_BACKEND_URL/api/health`

Should return: `{"status":"ok","timestamp":"..."}`

Also visit: `https://YOUR_BACKEND_URL/api/docs` for Swagger UI

---

## Step 5 – Deploy the Frontend

### 5a. Add Frontend Service

1. In your Railway project click **"+ New" → "GitHub Repo"**
2. Select your `courtbeat` repo again
3. **IMPORTANT**: Set **Root Directory** = `frontend`
4. Click **"Add Variables"** and set:

| Variable | Value |
|---|---|
| `NEXT_PUBLIC_API_URL` | `https://YOUR_BACKEND_URL/api` |
| `NODE_ENV` | `production` |

5. Railway detects the `Dockerfile` and builds
6. Wait ~5 minutes
7. Click **"Settings" → "Networking" → "Generate Domain"**
8. **Copy your frontend URL** – looks like `https://courtbeat-xxx.railway.app`

### 5b. Update Backend CORS

Go back to the **backend service → Variables** and update:
```
CORS_ORIGIN = https://YOUR_FRONTEND_URL.railway.app
```

Then redeploy the backend.

---

## Step 6 – Seed the Database

The backend automatically seeds on first start (via `start.sh`).
To verify, visit: `https://YOUR_BACKEND_URL/api/clubs`

Should return JSON with Diego's Padel Club and `accessCode: "PADEL2024"`.

If empty, manually trigger seed:

1. Go to backend service → **"Shell"** tab (Railway Pro) or
2. Use the Railway CLI:
   ```bash
   npm install -g @railway/cli
   railway login
   railway shell  # opens shell in backend container
   # Then run:
   npx prisma db seed
   ```

Or seed via the Postgres service directly:
1. Click Postgres service → **"Data"** tab
2. Railway has a built-in query editor
3. Paste the contents of `backend/prisma/seed.sql` and run

---

## Step 7 – Test Everything

1. Visit your **frontend URL**: `https://courtbeat-xxx.railway.app`
2. Click **"Member Access"**
3. Enter code: **`PADEL2024`**
4. Should load 10 workouts ✅

5. Visit **admin**: `https://courtbeat-xxx.railway.app/admin`
6. Login with `admin@padelclub.com` / `admin123` ✅

---

## Environment Variables Reference

### Backend Service Variables
```
DATABASE_URL     = postgresql://postgres:xxx@xxx.railway.internal:5432/railway
JWT_SECRET       = courtbeat-super-secret-jwt-key-2024
NODE_ENV         = production
PORT             = (set automatically by Railway)
CORS_ORIGIN      = https://your-frontend.railway.app
```

### Frontend Service Variables
```
NEXT_PUBLIC_API_URL = https://your-backend.railway.app/api
NODE_ENV            = production
PORT                = (set automatically by Railway)
```

---

## Railway Project Structure

```
Railway Project: CourtBeat
├── 🗄️  PostgreSQL          (managed database)
├── 🔧  courtbeat/backend   (NestJS API on port 4000)
└── 🌐  courtbeat/frontend  (Next.js app on port 3000)
```

Each service gets its own public URL.

---

## Troubleshooting

### Backend build fails

**Check:** Build logs in Railway dashboard → service → "Deployments" → click deployment

**Common fix:** Make sure root directory is set to `backend`

### "Invalid access code" in production

**Check:** Visit `https://YOUR_BACKEND_URL/api/clubs`

If empty:
1. Go to Postgres service → "Data" tab
2. Run `SELECT * FROM clubs;`
3. If empty, paste seed.sql and execute

### Frontend shows loading/error

**Check:** The `NEXT_PUBLIC_API_URL` variable is set correctly on the frontend service

It must be the **full URL** including `/api`:
```
NEXT_PUBLIC_API_URL = https://courtbeat-backend-xxx.railway.app/api
```

NOT just the domain.

### CORS errors in browser console

Update the backend `CORS_ORIGIN` variable to exactly match your frontend URL (no trailing slash).

### Prisma migration fails

Check backend logs. Most common cause: `DATABASE_URL` not set correctly.

Railway provides an **internal URL** (for inter-service communication) and a **public URL**. Use the internal `DATABASE_URL` from the Postgres service Variables tab.

---

## Alternative: Render.com Deployment

Railway free tier has limited hours. Render.com offers 750 free hours/month.

### Backend on Render

1. Go to https://render.com → New → Web Service
2. Connect GitHub repo
3. Settings:
   - **Root Directory:** `backend`
   - **Build Command:** `npm ci && npm rebuild bcrypt --build-from-source && npx prisma generate && npm run build`
   - **Start Command:** `./start.sh`
   - **Environment:** Node

4. Add environment variables (same as Railway)

### Frontend on Render

1. New → Web Service
2. Settings:
   - **Root Directory:** `frontend`
   - **Build Command:** `npm ci && npm run build`
   - **Start Command:** `npm start`
   - **Environment:** Node

3. Add `NEXT_PUBLIC_API_URL`

### Database on Render

1. New → PostgreSQL
2. Free tier: 1GB storage
3. Copy the **Internal Database URL** for backend

---

## Alternative: Fly.io Deployment

Fly.io is another excellent option with a generous free tier.

### Install Fly CLI
```bash
# Windows (PowerShell)
iwr https://fly.io/install.ps1 -useb | iex

# Then login
fly auth login
```

### Deploy Backend
```bash
cd courtbeat/backend
fly launch --name courtbeat-backend
# Edit fly.toml if needed
fly deploy
fly secrets set DATABASE_URL="..." JWT_SECRET="..."
```

### Deploy Frontend
```bash
cd courtbeat/frontend
fly launch --name courtbeat-frontend
fly deploy
fly secrets set NEXT_PUBLIC_API_URL="https://courtbeat-backend.fly.dev/api"
```

### Database on Fly.io
```bash
fly postgres create --name courtbeat-db
fly postgres attach --app courtbeat-backend courtbeat-db
```

---

## Custom Domain (Optional)

### Railway Custom Domain
1. Go to service → Settings → Networking
2. Click "Custom Domain"
3. Enter your domain (e.g. `app.courtbeat.com`)
4. Add CNAME record in your DNS pointing to Railway's provided value

### Cloudflare (Recommended for DNS)
1. Add your domain to Cloudflare
2. Create CNAME: `app` → Railway domain
3. Enable proxy (orange cloud) for HTTPS

---

## Production Checklist

Before going live:

- [ ] Backend deployed and `/api/health` returns OK
- [ ] Database seeded (clubs table has PADEL2024)
- [ ] Frontend deployed and loads homepage
- [ ] `NEXT_PUBLIC_API_URL` points to backend
- [ ] CORS_ORIGIN set to frontend URL
- [ ] PADEL2024 access code works end-to-end
- [ ] Admin login works
- [ ] Custom domain configured (optional)
- [ ] JWT_SECRET changed from default
- [ ] Environment variables secured

---

## Cost Estimate

### Railway
- **Free tier:** $5 credit/month (usually enough for testing)
- **Hobby plan:** $5/month (500 hours, enough for 1 project)
- **Pro plan:** $20/month (unlimited)

### Render
- **Free tier:** 750 hours/month (sleeps after 15min inactivity)
- **Starter:** $7/month per service (no sleep)

### Fly.io
- **Free tier:** 3 shared VMs + 3GB storage
- **Pay-as-you-go** otherwise

**Recommendation for demos:** Railway Hobby ($5/month) – easiest setup, no sleep issues.

---

## Quick Reference

```
Frontend URL:  https://courtbeat-xxx.railway.app
Backend URL:   https://courtbeat-backend-xxx.railway.app
API Docs:      https://courtbeat-backend-xxx.railway.app/api/docs
Health Check:  https://courtbeat-backend-xxx.railway.app/api/health

Club Code:   PADEL2024
Admin Email: admin@padelclub.com
Admin Pass:  admin123
```

---

**Your CourtBeat platform is now live and accessible worldwide!** 🎾🌍
