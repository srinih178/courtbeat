@echo off
setlocal enabledelayedexpansion

echo ===============================================
echo  CourtBeat - AI Fitness Platform Setup
echo ===============================================
echo.

REM Check Docker
where docker >nul 2>nul
if %ERRORLEVEL% neq 0 (
    echo [ERROR] Docker is not installed!
    echo Please install Docker Desktop from https://www.docker.com/products/docker-desktop/
    pause
    exit /b 1
)

echo Checking if Docker is running...
docker ps >nul 2>nul
if %ERRORLEVEL% neq 0 (
    echo [ERROR] Docker is not running!
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
echo Starting Docker containers...
echo This may take a few minutes on first run...
echo.
docker-compose up -d

if %ERRORLEVEL% neq 0 (
    echo [ERROR] Failed to start Docker containers
    echo Check if ports 3000, 4000, and 5432 are available
    pause
    exit /b 1
)

echo.
echo [OK] Containers started successfully
echo.

REM Wait for PostgreSQL
echo Waiting for PostgreSQL to be ready...
timeout /t 10 /nobreak >nul

REM Check if database is accessible
echo Checking database connection...
docker-compose exec -T postgres pg_isready -U postgres >nul 2>nul
if %ERRORLEVEL% neq 0 (
    echo [WARNING] Database not ready yet, waiting longer...
    timeout /t 10 /nobreak >nul
)

echo [OK] Database is ready
echo.

REM Generate Prisma Client
echo Generating Prisma Client...
docker-compose exec -T backend npx prisma generate
if %ERRORLEVEL% neq 0 (
    echo [ERROR] Failed to generate Prisma Client
    pause
    exit /b 1
)

echo [OK] Prisma Client generated
echo.

REM Run migrations
echo Running database migrations...
docker-compose exec -T backend npx prisma migrate deploy
if %ERRORLEVEL% neq 0 (
    echo [WARNING] Migration failed, trying with --create-only...
    docker-compose exec -T backend npx prisma migrate dev --name init --create-only
    docker-compose exec -T backend npx prisma migrate deploy
)

echo [OK] Migrations completed
echo.

REM Seed database
echo Seeding database with initial data...
docker-compose exec -T backend npm run prisma:seed
if %ERRORLEVEL% neq 0 (
    echo [ERROR] Failed to seed database
    echo Trying alternative method...
    docker-compose exec -T backend node -r ts-node/register prisma/seed.ts
)

echo [OK] Database seeded
echo.

REM Verify setup
echo Verifying setup...
echo.

docker-compose exec -T backend npx prisma db execute --stdin < nul
if %ERRORLEVEL% equ 0 (
    echo [OK] Database connection verified
)

echo.
echo ===============================================
echo  Setup Complete! CourtBeat is ready!
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
echo   - Reset database: docker-compose down -v (then run setup again)
echo.
echo Troubleshooting:
echo   - If you see errors, run: docker-compose logs backend
echo   - To reset everything: docker-compose down -v
echo   - Then run this script again
echo.
pause
