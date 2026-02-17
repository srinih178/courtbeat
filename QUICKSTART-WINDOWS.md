# 🚀 Quick Start Guide - Windows

## Get Started in 5 Minutes on Windows

### Prerequisites
Download and install these if you don't have them:

1. **Node.js 18+** - [Download](https://nodejs.org/en/download/)
   - Choose "Windows Installer (.msi)" for your system (64-bit recommended)
   - Use default installation settings
   - Verify: Open Command Prompt and type `node --version`

2. **Docker Desktop** - [Download](https://www.docker.com/products/docker-desktop/)
   - Requires Windows 10/11 Pro, Enterprise, or Education (64-bit)
   - OR Windows 10/11 Home with WSL 2
   - Start Docker Desktop after installation

3. **Git** (Optional) - [Download](https://git-scm.com/download/win)

### Step 1: Extract the Project

1. **Extract the ZIP file**
   - Right-click `racket-fitness-platform-poc.zip`
   - Select "Extract All..."
   - Choose a location (e.g., `C:\Projects\`)
   - Click "Extract"

2. **Open the folder**
   - Navigate to the extracted folder
   - You should see: `backend`, `frontend`, `setup.bat`, `setup.ps1`, etc.

### Step 2: Run Setup Script

**Option A: Using Command Prompt (Easier)**
1. Hold `Shift` + Right-click in the project folder
2. Select "Open Command window here" or "Open PowerShell window here"
3. Type: `setup.bat`
4. Press Enter
5. Choose option **1** (Docker Compose - Recommended)

**Option B: Using PowerShell (Modern)**
1. Hold `Shift` + Right-click in the project folder
2. Select "Open PowerShell window here"
3. Type: `powershell -ExecutionPolicy Bypass -File .\setup.ps1`
4. Press Enter
5. Choose option **1** (Docker Compose - Recommended)

**Note:** If you get a security warning in PowerShell, that's normal. The script is safe.

### Step 3: Access the Application

Once setup completes, open your web browser:

**🎯 Member Access (Club Player)**
1. Go to: `http://localhost:3000`
2. Click "Club Player"
3. Enter access code: `PADEL2024`
4. Browse and play workouts!

**⚙️ Admin Access**
1. Go to: `http://localhost:3000`
2. Click "Club Admin"
3. Login:
   - Email: `admin@padelclub.com`
   - Password: `admin123`
4. Manage workouts and schedules

**📚 API Documentation**
- Swagger UI: `http://localhost:4000/api/docs`
- Test API endpoints directly in your browser

## Common Windows Commands

### Using Command Prompt

**Start all services:**
```cmd
docker-compose up -d
```

**View logs:**
```cmd
docker-compose logs -f
```

**Stop services:**
```cmd
docker-compose down
```

**Restart everything:**
```cmd
docker-compose restart
```

**Check running containers:**
```cmd
docker-compose ps
```

### Using PowerShell

**Start all services:**
```powershell
docker-compose up -d
```

**View logs:**
```powershell
docker-compose logs -f
```

**Stop services:**
```powershell
docker-compose down
```

### Manual Development (No Docker)

**Backend (Terminal 1 - Command Prompt or PowerShell):**
```cmd
cd backend
npm install
npm run start:dev
```

**Frontend (Terminal 2 - Command Prompt or PowerShell):**
```cmd
cd frontend
npm install
npm run dev
```

**Database (Requires PostgreSQL installed on Windows):**
```cmd
cd backend
npx prisma migrate dev
npm run prisma:seed
```

## Troubleshooting Windows Issues

### "docker-compose is not recognized"

**Solution:**
- Make sure Docker Desktop is running (check system tray)
- Restart Docker Desktop
- Open a new Command Prompt/PowerShell window
- Try again

### "Port 3000 is already in use"

**Solution:**
```cmd
REM Find what's using port 3000
netstat -ano | findstr :3000

REM Kill the process (replace PID with actual number)
taskkill /PID <PID> /F

REM Or change the port in docker-compose.yml
```

### "Cannot connect to database"

**Solution:**
```cmd
REM Check if PostgreSQL container is running
docker-compose ps

REM Restart database
docker-compose restart postgres

REM Wait 10 seconds then try again
timeout /t 10
```

### PowerShell Execution Policy Error

**Solution:**
```powershell
# Run PowerShell as Administrator
Set-ExecutionPolicy -Scope CurrentUser -ExecutionPolicy Bypass

# Or run the script with bypass:
powershell -ExecutionPolicy Bypass -File .\setup.ps1
```

### Docker Desktop not starting

**Solution:**
1. Enable Virtualization in BIOS (Intel VT-x or AMD-V)
2. Enable Hyper-V (Windows Features)
3. Enable WSL 2 (for Windows Home)
4. Restart computer
5. Start Docker Desktop

### WSL 2 Installation (Windows Home)

```powershell
# Run in PowerShell as Administrator
wsl --install

# Restart computer
# Then install Docker Desktop
```

## File Paths in Windows

The project uses forward slashes (`/`) in configuration files, but Windows uses backslashes (`\`). This is normal and Docker handles it automatically.

**Windows path:** `C:\Projects\racket-fitness-platform\backend`  
**Docker path:** `/app` (inside container)

## Accessing Files

**Backend code:** `backend\src\`  
**Frontend code:** `frontend\src\`  
**Database schema:** `backend\prisma\schema.prisma`  
**Environment variables:**
- Backend: `backend\.env`
- Frontend: `frontend\.env.local`

## Windows-Specific Tips

### Opening Multiple Terminals

**Windows Terminal (Recommended):**
1. Install from Microsoft Store
2. Open Windows Terminal
3. Click `+` to open new tabs
4. Run backend in one tab, frontend in another

**Command Prompt:**
1. Open new windows: `Win + R`, type `cmd`, press Enter
2. Navigate to project: `cd C:\Projects\racket-fitness-platform`

### Editing Files

**Recommended Editors:**
- Visual Studio Code (Free) - [Download](https://code.visualstudio.com/)
- WebStorm (Paid) - [Download](https://www.jetbrains.com/webstorm/)

**Open in VS Code:**
```cmd
cd racket-fitness-platform
code .
```

## Testing the POC on Windows

### 1. Test Club Access
- Open Edge/Chrome: `http://localhost:3000/club`
- Enter code: `PADEL2024`
- Select and play a workout

### 2. Test Admin Features
- Open: `http://localhost:3000/admin`
- Login with demo credentials
- Create a schedule
- View analytics

### 3. Test API
- Open: `http://localhost:4000/api/docs`
- Try endpoints in Swagger UI

## Next Steps

1. ✅ Read full documentation: `README.md`
2. 📖 Review API docs: `API.md`
3. 🚀 Deploy to production: `DEPLOYMENT.md`
4. 🎨 Customize for your club
5. 📹 Add video content

## Demo Credentials

**Club Access Code:** `PADEL2024`

**Admin Login:**
- Email: `admin@padelclub.com`
- Password: `admin123`

**Database (if using local PostgreSQL):**
- Host: `localhost`
- Port: `5432`
- Database: `racket_fitness`
- User: `postgres`
- Password: `password`

## Windows Shortcuts

**Open folder in Explorer:**
```cmd
explorer .
```

**Open in VS Code:**
```cmd
code .
```

**Clear terminal:**
```cmd
cls
```

**Stop running process:** `Ctrl + C`

**View command history:** Press `↑` arrow key

---

**🎉 You're all set! Your Racket Fitness Platform is running on Windows.**

**Need help?** Check the full README.md or open an issue on GitHub.

## Video Tutorial Links

- [Installing Node.js on Windows](https://www.youtube.com/results?search_query=install+nodejs+windows)
- [Installing Docker Desktop on Windows](https://www.youtube.com/results?search_query=install+docker+desktop+windows)
- [Using Windows Terminal](https://www.youtube.com/results?search_query=windows+terminal+tutorial)
