@echo off
echo ===============================================
echo  CourtBeat - Fix bcrypt Docker Issue
echo ===============================================
echo.
echo This will completely rebuild your containers
echo with bcrypt compiled correctly for Linux.
echo.
echo WARNING: This will take 5-10 minutes
echo.
pause

echo Step 1: Stopping all containers...
docker-compose down

echo.
echo Step 2: Removing old backend image...
docker rmi courtbeat-backend 2>nul
docker rmi courtbeat_backend 2>nul
docker rmi racket-fitness-backend 2>nul

echo.
echo Step 3: Rebuilding backend (this takes a while)...
docker-compose build --no-cache backend

echo.
echo Step 4: Starting all containers...
docker-compose up -d

echo.
echo Step 5: Waiting for database (30 seconds)...
timeout /t 30 /nobreak >nul

echo.
echo Step 6: Seeding database...
docker cp backend\prisma\seed.sql racket-fitness-db:/tmp/seed.sql
docker exec -i racket-fitness-db psql -U postgres -d racket_fitness -f /tmp/seed.sql

echo.
echo Step 7: Verifying...
docker exec -i racket-fitness-db psql -U postgres -d racket_fitness -c "SELECT COUNT(*) FROM clubs;"
docker exec -i racket-fitness-db psql -U postgres -d racket_fitness -c "SELECT name, \"accessCode\" FROM clubs;"

echo.
echo ===============================================
echo  COMPLETE!
echo ===============================================
echo.
echo Backend logs (check for errors):
docker-compose logs backend | tail -20
echo.
echo Test at: http://localhost:3000/club
echo Code: PADEL2024
echo.
pause
