# Racket Fitness Platform - PowerShell Setup Script
# For Windows 10/11

Write-Host "===============================================" -ForegroundColor Cyan
Write-Host " Racket Fitness Platform - Windows Setup" -ForegroundColor Cyan
Write-Host "===============================================" -ForegroundColor Cyan
Write-Host ""

# Check prerequisites
Write-Host "Checking prerequisites..." -ForegroundColor Yellow
Write-Host ""

# Check Node.js
if (-not (Get-Command node -ErrorAction SilentlyContinue)) {
    Write-Host "[ERROR] Node.js is not installed!" -ForegroundColor Red
    Write-Host "Please install Node.js 18+ from https://nodejs.org/" -ForegroundColor Red
    Read-Host "Press Enter to exit"
    exit 1
}

# Check npm
if (-not (Get-Command npm -ErrorAction SilentlyContinue)) {
    Write-Host "[ERROR] npm is not installed!" -ForegroundColor Red
    Read-Host "Press Enter to exit"
    exit 1
}

# Check Docker
if (-not (Get-Command docker -ErrorAction SilentlyContinue)) {
    Write-Host "[ERROR] Docker is not installed!" -ForegroundColor Red
    Write-Host "Please install Docker Desktop from https://www.docker.com/products/docker-desktop/" -ForegroundColor Red
    Read-Host "Press Enter to exit"
    exit 1
}

# Check Docker Compose
if (-not (Get-Command docker-compose -ErrorAction SilentlyContinue)) {
    Write-Host "[ERROR] Docker Compose is not installed!" -ForegroundColor Red
    Write-Host "Please install Docker Desktop which includes Docker Compose" -ForegroundColor Red
    Read-Host "Press Enter to exit"
    exit 1
}

Write-Host "[SUCCESS] All prerequisites met!" -ForegroundColor Green
Write-Host ""

# Setup environment files
Write-Host "Setting up environment files..." -ForegroundColor Yellow
Write-Host ""

if (-not (Test-Path "backend\.env")) {
    Copy-Item "backend\.env.example" "backend\.env"
    Write-Host "[SUCCESS] Created backend\.env from example" -ForegroundColor Green
} else {
    Write-Host "[WARNING] backend\.env already exists, skipping" -ForegroundColor Yellow
}

if (-not (Test-Path "frontend\.env.local")) {
    Copy-Item "frontend\.env.example" "frontend\.env.local"
    Write-Host "[SUCCESS] Created frontend\.env.local from example" -ForegroundColor Green
} else {
    Write-Host "[WARNING] frontend\.env.local already exists, skipping" -ForegroundColor Yellow
}

Write-Host ""

# Choose setup method
Write-Host "Choose setup method:" -ForegroundColor Cyan
Write-Host "  1) Docker Compose (Recommended - Easiest)"
Write-Host "  2) Local Development (Manual setup)"
Write-Host ""

$choice = Read-Host "Enter choice (1 or 2)"

switch ($choice) {
    "1" {
        Write-Host ""
        Write-Host "Starting with Docker Compose..." -ForegroundColor Cyan
        Write-Host ""
        
        # Start services
        docker-compose up -d
        
        Write-Host ""
        Write-Host "Waiting for database to be ready..." -ForegroundColor Yellow
        Start-Sleep -Seconds 10
        
        # Run migrations
        Write-Host "Running database migrations..." -ForegroundColor Yellow
        docker-compose exec -T backend npx prisma migrate dev --name init
        
        # Seed database
        Write-Host "Seeding database..." -ForegroundColor Yellow
        docker-compose exec -T backend npm run prisma:seed
        
        Write-Host ""
        Write-Host "===============================================" -ForegroundColor Green
        Write-Host " Setup Complete!" -ForegroundColor Green
        Write-Host "===============================================" -ForegroundColor Green
        Write-Host ""
        Write-Host "Application is running:" -ForegroundColor Cyan
        Write-Host "  Frontend: http://localhost:3000" -ForegroundColor White
        Write-Host "  Backend API: http://localhost:4000" -ForegroundColor White
        Write-Host "  API Docs: http://localhost:4000/api/docs" -ForegroundColor White
        Write-Host ""
        Write-Host "Demo Credentials:" -ForegroundColor Cyan
        Write-Host "  Club Access Code: PADEL2024" -ForegroundColor White
        Write-Host "  Admin Email: admin@padelclub.com" -ForegroundColor White
        Write-Host "  Admin Password: admin123" -ForegroundColor White
        Write-Host ""
        Write-Host "Commands:" -ForegroundColor Cyan
        Write-Host "  View logs: docker-compose logs -f" -ForegroundColor White
        Write-Host "  Stop services: docker-compose down" -ForegroundColor White
        Write-Host ""
        Read-Host "Press Enter to exit"
    }
    
    "2" {
        Write-Host ""
        Write-Host "Setting up local development..." -ForegroundColor Cyan
        Write-Host ""
        
        # Install backend dependencies
        Write-Host "Installing backend dependencies..." -ForegroundColor Yellow
        Set-Location backend
        npm install
        
        # Generate Prisma Client
        Write-Host "Generating Prisma Client..." -ForegroundColor Yellow
        npx prisma generate
        
        # Run migrations
        Write-Host "Running database migrations..." -ForegroundColor Yellow
        Write-Host "[WARNING] Make sure PostgreSQL is running on localhost:5432" -ForegroundColor Yellow
        Write-Host ""
        Read-Host "Press Enter when database is ready"
        npx prisma migrate dev --name init
        
        # Seed database
        Write-Host "Seeding database..." -ForegroundColor Yellow
        npm run prisma:seed
        
        Set-Location ..
        
        # Install frontend dependencies
        Write-Host "Installing frontend dependencies..." -ForegroundColor Yellow
        Set-Location frontend
        npm install
        Set-Location ..
        
        Write-Host ""
        Write-Host "===============================================" -ForegroundColor Green
        Write-Host " Setup Complete!" -ForegroundColor Green
        Write-Host "===============================================" -ForegroundColor Green
        Write-Host ""
        Write-Host "To start the application:" -ForegroundColor Cyan
        Write-Host ""
        Write-Host "Terminal 1 (PowerShell - Backend):" -ForegroundColor Yellow
        Write-Host "  cd backend" -ForegroundColor White
        Write-Host "  npm run start:dev" -ForegroundColor White
        Write-Host ""
        Write-Host "Terminal 2 (PowerShell - Frontend):" -ForegroundColor Yellow
        Write-Host "  cd frontend" -ForegroundColor White
        Write-Host "  npm run dev" -ForegroundColor White
        Write-Host ""
        Write-Host "Access:" -ForegroundColor Cyan
        Write-Host "  Frontend: http://localhost:3000" -ForegroundColor White
        Write-Host "  Backend API: http://localhost:4000" -ForegroundColor White
        Write-Host "  API Docs: http://localhost:4000/api/docs" -ForegroundColor White
        Write-Host ""
        Write-Host "Demo Credentials:" -ForegroundColor Cyan
        Write-Host "  Club Access Code: PADEL2024" -ForegroundColor White
        Write-Host "  Admin Email: admin@padelclub.com" -ForegroundColor White
        Write-Host "  Admin Password: admin123" -ForegroundColor White
        Write-Host ""
        Read-Host "Press Enter to exit"
    }
    
    default {
        Write-Host "[ERROR] Invalid choice. Exiting." -ForegroundColor Red
        Read-Host "Press Enter to exit"
        exit 1
    }
}
