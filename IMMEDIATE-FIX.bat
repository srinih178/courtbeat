@echo off
echo ===============================================
echo  CourtBeat - IMMEDIATE DATABASE FIX
echo ===============================================
echo.
echo This will seed your database directly
echo bypassing the broken bcrypt issue.
echo.
pause

echo Step 1: Copying seed file...
docker cp backend\prisma\seed.sql racket-fitness-db:/tmp/seed.sql
if %ERRORLEVEL% neq 0 (
    echo [ERROR] Failed to copy. Is Docker running?
    echo Run: docker-compose ps
    pause
    exit /b 1
)

echo Step 2: Seeding database...
docker exec -i racket-fitness-db psql -U postgres -d racket_fitness -f /tmp/seed.sql

echo.
echo Step 3: Verifying...
docker exec -i racket-fitness-db psql -U postgres -d racket_fitness -c "SELECT name, \"accessCode\" FROM clubs;"

echo.
echo ===============================================
echo Database seeded!
echo.
echo Now we need to fix bcrypt issue:
echo.
echo Step 4: Rebuild backend container...
docker-compose build --no-cache backend

echo.
echo Step 5: Restart containers...
docker-compose up -d

echo.
echo Waiting 20 seconds for backend to start...
timeout /t 20 /nobreak >nul

echo.
echo ===============================================
echo  DONE! Try PADEL2024 now at:
echo  http://localhost:3000/club
echo ===============================================
echo.
pause
