@echo off
setlocal enabledelayedexpansion

echo ===============================================
echo  CourtBeat - Docker Setup
echo ===============================================
echo.

REM Check Docker
where docker >nul 2>nul
if %ERRORLEVEL% neq 0 (
    echo [ERROR] Docker is not installed!
    echo Try manual setup: setup-manual.bat
    pause
    exit /b 1
)

docker ps >nul 2>nul
if %ERRORLEVEL% neq 0 (
    echo [ERROR] Docker is not running!
    pause
    exit /b 1
)

echo [OK] Docker is ready
echo.

REM Setup environment files
if not exist backend\.env (
    copy backend\.env.example backend\.env >nul
)
if not exist frontend\.env.local (
    copy frontend\.env.example frontend\.env.local >nul
)

REM Clean and build
echo Cleaning old containers...
docker-compose down -v >nul 2>nul

echo Building images (this takes 5-10 minutes)...
docker-compose build --no-cache
if %ERRORLEVEL% neq 0 (
    echo [ERROR] Build failed
    pause
    exit /b 1
)

REM Start services
echo Starting containers...
docker-compose up -d

echo Waiting for database (30 seconds)...
timeout /t 30 /nobreak >nul

REM Copy SQL file to backend container
echo Copying seed file...
docker cp backend\prisma\seed.sql racket-fitness-backend:/tmp/seed.sql
if %ERRORLEVEL% neq 0 (
    echo [ERROR] Failed to copy seed file
    echo Container might not be running yet, waiting 10 more seconds...
    timeout /t 10 /nobreak >nul
    docker cp backend\prisma\seed.sql racket-fitness-backend:/tmp/seed.sql
)

REM Generate Prisma
echo Generating Prisma Client...
docker-compose exec -T backend npx prisma generate

REM Run migrations
echo Running migrations...
docker-compose exec -T backend npx prisma migrate deploy

REM Seed using SQL file directly in postgres container
echo Seeding database...
docker exec -i racket-fitness-db psql -U postgres -d racket_fitness -f /tmp/seed.sql
if %ERRORLEVEL% neq 0 (
    echo [WARNING] Direct seed failed, trying alternative...
    docker cp backend\prisma\seed.sql racket-fitness-db:/tmp/seed.sql
    docker exec -i racket-fitness-db psql -U postgres -d racket_fitness -f /tmp/seed.sql
)

REM Verify
echo.
echo Verifying data...
docker exec -i racket-fitness-db psql -U postgres -d racket_fitness -c "SELECT COUNT(*) as clubs FROM clubs;"
docker exec -i racket-fitness-db psql -U postgres -d racket_fitness -c "SELECT name, \"accessCode\" FROM clubs WHERE \"accessCode\"='PADEL2024';"

echo.
echo ===============================================
echo  Setup Complete!
echo ===============================================
echo.
echo Open: http://localhost:3000
echo Code: PADEL2024
echo Admin: admin@padelclub.com / admin123
echo.
echo Database Connection (for pgAdmin/DBeaver):
echo   Host: localhost
echo   Port: 5432
echo   Database: racket_fitness
echo   User: postgres
echo   Password: password
echo.
pause
