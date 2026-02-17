@echo off
setlocal enabledelayedexpansion

echo ===============================================
echo  CourtBeat - Manual Setup Helper
echo ===============================================
echo.

REM Check PostgreSQL
where psql >nul 2>nul
if %ERRORLEVEL% neq 0 (
    echo [ERROR] PostgreSQL is not installed or not in PATH!
    echo.
    echo Please install PostgreSQL 15 from:
    echo https://www.postgresql.org/download/windows/
    echo.
    echo After installation, add to PATH:
    echo C:\Program Files\PostgreSQL\15\bin
    pause
    exit /b 1
)

echo [OK] PostgreSQL found
echo.

REM Check Node.js
where node >nul 2>nul
if %ERRORLEVEL% neq 0 (
    echo [ERROR] Node.js is not installed!
    echo Please install Node.js 18+ from https://nodejs.org/
    pause
    exit /b 1
)

echo [OK] Node.js found
echo.

REM Setup backend
echo Setting up backend...
cd backend

REM Check if .env exists
if not exist .env (
    echo Creating .env file...
    (
        echo DATABASE_URL="postgresql://postgres:password@localhost:5432/racket_fitness?schema=public"
        echo JWT_SECRET="courtbeat-secret-key-change-in-production"
        echo PORT=4000
        echo NODE_ENV=development
    ) > .env
    echo [OK] .env created
    echo.
    echo [IMPORTANT] Edit backend\.env and set your PostgreSQL password!
    pause
)

REM Install dependencies
echo Installing backend dependencies...
call npm install
if %ERRORLEVEL% neq 0 (
    echo [ERROR] Failed to install backend dependencies
    pause
    exit /b 1
)

echo [OK] Backend dependencies installed
echo.

REM Generate Prisma Client
echo Generating Prisma Client...
call npx prisma generate
if %ERRORLEVEL% neq 0 (
    echo [ERROR] Failed to generate Prisma Client
    pause
    exit /b 1
)

echo [OK] Prisma Client generated
echo.

REM Run migrations
echo Running database migrations...
call npx prisma migrate deploy
if %ERRORLEVEL% neq 0 (
    echo [WARNING] Migration failed, will try SQL seed
)

echo [OK] Migrations completed
echo.

REM Seed database
echo Seeding database...
call npm run prisma:seed
if %ERRORLEVEL% neq 0 (
    echo [WARNING] Prisma seed failed, trying SQL seed...
    psql -U postgres -d racket_fitness -f prisma\seed.sql
    if %ERRORLEVEL% neq 0 (
        echo [ERROR] SQL seed also failed
        echo Please manually run: psql -U postgres -d racket_fitness -f backend\prisma\seed.sql
    )
)

echo [OK] Database seeded
echo.

cd ..

REM Setup frontend
echo Setting up frontend...
cd frontend

REM Check if .env.local exists
if not exist .env.local (
    echo Creating .env.local file...
    echo NEXT_PUBLIC_API_URL=http://localhost:4000/api > .env.local
    echo [OK] .env.local created
)

REM Install dependencies
echo Installing frontend dependencies...
call npm install
if %ERRORLEVEL% neq 0 (
    echo [ERROR] Failed to install frontend dependencies
    pause
    exit /b 1
)

echo [OK] Frontend dependencies installed
echo.

cd ..

echo.
echo ===============================================
echo  Setup Complete!
echo ===============================================
echo.
echo To start the application:
echo.
echo Terminal 1 (Backend):
echo   cd backend
echo   npm run start:dev
echo.
echo Terminal 2 (Frontend):
echo   cd frontend
echo   npm run dev
echo.
echo Then open: http://localhost:3000
echo.
echo Demo Credentials:
echo   Club Code: PADEL2024
echo   Admin Email: admin@padelclub.com
echo   Admin Password: admin123
echo.
echo See MANUAL-WINDOWS-SETUP.md for detailed instructions
echo.
pause
