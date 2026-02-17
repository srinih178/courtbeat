@echo off
REM Simple Docker Compose Setup for Racket Fitness Platform
REM This script only does Docker setup (the recommended method)

echo ===============================================
echo  Racket Fitness Platform - Simple Setup
echo ===============================================
echo.

REM Check Docker
where docker >nul 2>nul
if %ERRORLEVEL% neq 0 (
    echo ERROR: Docker is not installed!
    echo Please install Docker Desktop from https://www.docker.com/products/docker-desktop/
    pause
    exit /b 1
)

echo Checking if Docker is running...
docker ps >nul 2>nul
if %ERRORLEVEL% neq 0 (
    echo ERROR: Docker is not running!
    echo Please start Docker Desktop and try again.
    pause
    exit /b 1
)

echo [OK] Docker is ready
echo.

REM Setup environment files
echo Creating environment files...
if not exist backend\.env (
    copy backend\.env.example backend\.env >nul
    echo [OK] Created backend\.env
)
if not exist frontend\.env.local (
    copy frontend\.env.example frontend\.env.local >nul
    echo [OK] Created frontend\.env.local
)
echo.

REM Start Docker
echo Starting application with Docker Compose...
echo This may take a few minutes on first run...
echo.
docker-compose up -d

if %ERRORLEVEL% neq 0 (
    echo ERROR: Failed to start containers
    pause
    exit /b 1
)

echo.
echo Waiting for services to start (15 seconds)...
timeout /t 15 /nobreak >nul

REM Setup database
echo.
echo Setting up database...
docker-compose exec -T backend npx prisma migrate dev --name init
docker-compose exec -T backend npm run prisma:seed

echo.
echo ===============================================
echo  SUCCESS! Your application is running!
echo ===============================================
echo.
echo Open these in your browser:
echo   - Club Player: http://localhost:3000
echo   - Admin Panel: http://localhost:3000/admin
echo   - API Docs: http://localhost:4000/api/docs
echo.
echo Login Details:
echo   - Club Code: PADEL2024
echo   - Admin Email: admin@padelclub.com
echo   - Admin Password: admin123
echo.
echo Useful Commands:
echo   - View logs: docker-compose logs -f
echo   - Stop app: docker-compose down
echo   - Restart: docker-compose restart
echo.
pause
