@echo off
setlocal enabledelayedexpansion

echo ===============================================
echo  Racket Fitness Platform - Windows Setup
echo ===============================================
echo.

REM Check prerequisites
echo Checking prerequisites...
echo.

where node >nul 2>nul
if %ERRORLEVEL% neq 0 (
    echo [ERROR] Node.js is not installed!
    echo Please install Node.js 18+ from https://nodejs.org/
    pause
    exit /b 1
)

where npm >nul 2>nul
if %ERRORLEVEL% neq 0 (
    echo [ERROR] npm is not installed!
    pause
    exit /b 1
)

where docker >nul 2>nul
if %ERRORLEVEL% neq 0 (
    echo [ERROR] Docker is not installed!
    echo Please install Docker Desktop from https://www.docker.com/products/docker-desktop/
    pause
    exit /b 1
)

where docker-compose >nul 2>nul
if %ERRORLEVEL% neq 0 (
    echo [ERROR] Docker Compose is not installed!
    echo Please install Docker Desktop which includes Docker Compose
    pause
    exit /b 1
)

echo [SUCCESS] All prerequisites met!
echo.

REM Setup environment files
echo Setting up environment files...
echo.

if not exist backend\.env (
    copy backend\.env.example backend\.env >nul
    echo [SUCCESS] Created backend\.env from example
) else (
    echo [WARNING] backend\.env already exists, skipping
)

if not exist frontend\.env.local (
    copy frontend\.env.example frontend\.env.local >nul
    echo [SUCCESS] Created frontend\.env.local from example
) else (
    echo [WARNING] frontend\.env.local already exists, skipping
)

echo.

REM Choose setup method
echo Choose setup method:
echo   1) Docker Compose (Recommended - Easiest)
echo   2) Local Development (Manual setup)
echo.
set /p choice="Enter choice (1 or 2): "

if "%choice%"=="1" (
    goto DOCKER_SETUP
)
if "%choice%"=="2" (
    goto LOCAL_SETUP
)

echo [ERROR] Invalid choice. Exiting.
pause
exit /b 1

:DOCKER_SETUP
echo.
echo Starting with Docker Compose...
echo.

REM Start services
echo Starting Docker containers...
docker-compose up -d
if %ERRORLEVEL% neq 0 (
    echo [ERROR] Failed to start Docker containers
    echo Make sure Docker Desktop is running
    pause
    exit /b 1
)

echo.
echo Waiting for database to be ready...
timeout /t 15 /nobreak >nul

REM Run migrations
echo Running database migrations...
docker-compose exec -T backend npx prisma migrate dev --name init
if %ERRORLEVEL% neq 0 (
    echo [WARNING] Migration might have already run, continuing...
)

REM Seed database
echo Seeding database...
docker-compose exec -T backend npm run prisma:seed
if %ERRORLEVEL% neq 0 (
    echo [WARNING] Seed might have already run, continuing...
)

echo.
echo ===============================================
echo  Setup Complete!
echo ===============================================
echo.
echo Application is running:
echo   Frontend: http://localhost:3000
echo   Backend API: http://localhost:4000
echo   API Docs: http://localhost:4000/api/docs
echo.
echo Demo Credentials:
echo   Club Access Code: PADEL2024
echo   Admin Email: admin@padelclub.com
echo   Admin Password: admin123
echo.
echo Commands:
echo   View logs: docker-compose logs -f
echo   Stop services: docker-compose down
echo.
pause
goto END

:LOCAL_SETUP
echo.
echo Setting up local development...
echo.

REM Install backend dependencies
echo Installing backend dependencies...
cd backend
if not exist node_modules (
    call npm install
    if %ERRORLEVEL% neq 0 (
        echo [ERROR] Failed to install backend dependencies
        cd ..
        pause
        exit /b 1
    )
) else (
    echo [INFO] Backend dependencies already installed
)

REM Generate Prisma Client
echo Generating Prisma Client...
call npx prisma generate
if %ERRORLEVEL% neq 0 (
    echo [ERROR] Failed to generate Prisma Client
    cd ..
    pause
    exit /b 1
)

REM Run migrations
echo.
echo Running database migrations...
echo [WARNING] Make sure PostgreSQL is running on localhost:5432
echo.
echo Press any key when database is ready...
pause >nul
call npx prisma migrate dev --name init
if %ERRORLEVEL% neq 0 (
    echo [WARNING] Migration might have failed or already exists
)

REM Seed database
echo Seeding database...
call npm run prisma:seed
if %ERRORLEVEL% neq 0 (
    echo [WARNING] Seed might have failed or already exists
)

cd ..

REM Install frontend dependencies
echo.
echo Installing frontend dependencies...
cd frontend
if not exist node_modules (
    call npm install
    if %ERRORLEVEL% neq 0 (
        echo [ERROR] Failed to install frontend dependencies
        cd ..
        pause
        exit /b 1
    )
) else (
    echo [INFO] Frontend dependencies already installed
)
cd ..

echo.
echo ===============================================
echo  Setup Complete!
echo ===============================================
echo.
echo To start the application, open TWO terminal windows:
echo.
echo Terminal 1 (Backend):
echo   cd backend
echo   npm run start:dev
echo.
echo Terminal 2 (Frontend):
echo   cd frontend
echo   npm run dev
echo.
echo Access:
echo   Frontend: http://localhost:3000
echo   Backend API: http://localhost:4000
echo   API Docs: http://localhost:4000/api/docs
echo.
echo Demo Credentials:
echo   Club Access Code: PADEL2024
echo   Admin Email: admin@padelclub.com
echo   Admin Password: admin123
echo.
pause
goto END

:END
echo.
echo For more information, see README.md
echo.
exit /b 0
