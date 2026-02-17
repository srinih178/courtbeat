@echo off
echo ===============================================
echo  CourtBeat - Manual Database Seed
echo ===============================================
echo.

REM Check if using Docker or manual setup
echo Are you using Docker or Manual setup?
echo 1. Docker
echo 2. Manual (local PostgreSQL)
echo.
set /p SETUP_TYPE="Enter 1 or 2: "

if "%SETUP_TYPE%"=="1" goto DOCKER_SEED
if "%SETUP_TYPE%"=="2" goto MANUAL_SEED

echo Invalid choice!
pause
exit /b 1

:DOCKER_SEED
echo.
echo Seeding Docker database...
echo.

REM Copy SQL file to container
echo Step 1: Copying seed file to container...
docker cp backend\prisma\seed.sql racket-fitness-db:/tmp/seed.sql
if %ERRORLEVEL% neq 0 (
    echo [ERROR] Failed to copy file. Is container running?
    echo Run: docker-compose ps
    pause
    exit /b 1
)

REM Run seed
echo Step 2: Running seed SQL...
docker exec -i racket-fitness-db psql -U postgres -d racket_fitness -f /tmp/seed.sql
if %ERRORLEVEL% neq 0 (
    echo [ERROR] Failed to seed database
    pause
    exit /b 1
)

REM Verify
echo.
echo Step 3: Verifying data...
docker exec -i racket-fitness-db psql -U postgres -d racket_fitness -c "SELECT COUNT(*) as clubs FROM clubs;"
docker exec -i racket-fitness-db psql -U postgres -d racket_fitness -c "SELECT COUNT(*) as workouts FROM workouts;"
docker exec -i racket-fitness-db psql -U postgres -d racket_fitness -c "SELECT name, \"accessCode\" FROM clubs WHERE \"accessCode\"='PADEL2024';"

echo.
echo [SUCCESS] Database seeded!
echo Now try PADEL2024 at http://localhost:3000/club
echo.
pause
exit /b 0

:MANUAL_SEED
echo.
echo Seeding local database...
psql -U postgres -d racket_fitness -f backend\prisma\seed.sql
if %ERRORLEVEL% neq 0 (
    echo [ERROR] Failed to seed database
    echo Make sure PostgreSQL is running and password is correct
    pause
    exit /b 1
)

echo.
echo Verifying...
psql -U postgres -d racket_fitness -c "SELECT name, \"accessCode\" FROM clubs;"
echo.
echo [SUCCESS] Database seeded!
echo Now try PADEL2024 at http://localhost:3000/club
echo.
pause
exit /b 0
