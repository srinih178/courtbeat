# Windows Setup - README

## Quick Setup (Recommended)

### Option 1: Simple Setup Script (Easiest)
```cmd
setup-simple.bat
```
This runs Docker Compose setup only (recommended for most users).

### Option 2: Full Setup Script
```cmd
setup.bat
```
This offers both Docker and manual setup options.

### Option 3: PowerShell Script
```powershell
powershell -ExecutionPolicy Bypass -File .\setup.ps1
```
Modern, colored output with better error handling.

---

## Prerequisites

Before running any setup script:

1. **Install Node.js 18+**
   - Download: https://nodejs.org/
   - Verify: `node --version`

2. **Install Docker Desktop**
   - Download: https://www.docker.com/products/docker-desktop/
   - **Start Docker Desktop** before running setup!
   - Verify: `docker --version`

---

## Troubleshooting

### Error: "The system cannot find the batch label specified"

**Cause:** File encoding issue or corrupted download.

**Solutions:**

1. **Use the simple setup instead:**
   ```cmd
   setup-simple.bat
   ```

2. **Use PowerShell script:**
   ```powershell
   powershell -ExecutionPolicy Bypass -File .\setup.ps1
   ```

3. **Manual Docker setup:**
   ```cmd
   REM Copy environment files
   copy backend\.env.example backend\.env
   copy frontend\.env.example frontend\.env.local
   
   REM Start Docker
   docker-compose up -d
   
   REM Wait 15 seconds
   timeout /t 15
   
   REM Setup database
   docker-compose exec -T backend npx prisma migrate dev --name init
   docker-compose exec -T backend npm run prisma:seed
   ```

### Error: "Docker is not recognized"

**Solutions:**
- Make sure Docker Desktop is **running** (check system tray)
- Restart Docker Desktop
- Open a **new** Command Prompt window
- Restart your computer

### Error: "docker-compose is not recognized"

**Solutions:**
- Use `docker compose` (without hyphen) instead
- Update Docker Desktop to latest version
- Install Docker Compose separately

### Error: "Port already in use"

**Solution:**
```cmd
REM Find process on port 3000
netstat -ano | findstr :3000

REM Kill process (replace PID)
taskkill /PID <PID_NUMBER> /F
```

### Script opens and closes immediately

**Solution:**
- Right-click the .bat file
- Select "Edit" to see any errors
- Or run from Command Prompt:
  ```cmd
  cd path\to\racket-fitness-platform
  setup-simple.bat
  ```

---

## Manual Setup (If Scripts Don't Work)

### Step 1: Create Environment Files
```cmd
copy backend\.env.example backend\.env
copy frontend\.env.example frontend\.env.local
```

### Step 2: Start Docker Compose
```cmd
docker-compose up -d
```

### Step 3: Wait for Database
```cmd
timeout /t 20
```

### Step 4: Run Migrations
```cmd
docker-compose exec backend npx prisma migrate dev --name init
```

### Step 5: Seed Database
```cmd
docker-compose exec backend npm run prisma:seed
```

### Step 6: Access Application
- Frontend: http://localhost:3000
- Admin: http://localhost:3000/admin
- API Docs: http://localhost:4000/api/docs

---

## Which Setup Script Should I Use?

| Script | Best For | Pros | Cons |
|--------|----------|------|------|
| `setup-simple.bat` | Most users | Simple, reliable | Docker only |
| `setup.bat` | Advanced users | Full options | More complex |
| `setup.ps1` | PowerShell users | Best output, modern | Requires PowerShell |
| Manual | Troubleshooting | Full control | More steps |

**Recommendation:** Start with `setup-simple.bat`

---

## Verifying Installation

After setup completes, check:

```cmd
REM Check Docker containers
docker-compose ps

REM Should show 3 running containers:
REM - racket-fitness-frontend
REM - racket-fitness-backend
REM - racket-fitness-db
```

---

## Common Commands

```cmd
REM Start application
docker-compose up -d

REM Stop application
docker-compose down

REM View logs
docker-compose logs -f

REM Restart services
docker-compose restart

REM Check status
docker-compose ps

REM Remove everything (fresh start)
docker-compose down -v
docker-compose up -d
```

---

## Getting Help

1. Check `WINDOWS-INSTALLATION-GUIDE.md` for detailed setup
2. Check `QUICKSTART-WINDOWS.md` for quick reference
3. Check `README.md` for full documentation
4. Open an issue on GitHub

---

## Demo Credentials

After successful setup:

- **Club Access Code:** `PADEL2024`
- **Admin Email:** `admin@padelclub.com`
- **Admin Password:** `admin123`

---

## Next Steps

1. Open http://localhost:3000 in your browser
2. Try club player access with code `PADEL2024`
3. Try admin login at http://localhost:3000/admin
4. Explore API at http://localhost:4000/api/docs
5. Read full documentation in `README.md`

---

**Still having issues?** Use the manual setup steps above or check the full Windows Installation Guide.
