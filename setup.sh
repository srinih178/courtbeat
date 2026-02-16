#!/bin/bash

echo "🏋️ Racket Fitness Platform - Setup Script"
echo "=========================================="
echo ""

# Check prerequisites
echo "📋 Checking prerequisites..."

command -v node >/dev/null 2>&1 || { echo "❌ Node.js is required but not installed. Please install Node.js 18+"; exit 1; }
command -v npm >/dev/null 2>&1 || { echo "❌ npm is required but not installed."; exit 1; }
command -v docker >/dev/null 2>&1 || { echo "❌ Docker is required but not installed."; exit 1; }
command -v docker-compose >/dev/null 2>&1 || { echo "❌ Docker Compose is required but not installed."; exit 1; }

echo "✅ All prerequisites met!"
echo ""

# Setup environment files
echo "🔧 Setting up environment files..."

if [ ! -f backend/.env ]; then
    cp backend/.env.example backend/.env
    echo "✅ Created backend/.env from example"
else
    echo "⚠️  backend/.env already exists, skipping"
fi

if [ ! -f frontend/.env.local ]; then
    cp frontend/.env.example frontend/.env.local
    echo "✅ Created frontend/.env.local from example"
else
    echo "⚠️  frontend/.env.local already exists, skipping"
fi

echo ""

# Choose setup method
echo "📦 Choose setup method:"
echo "  1) Docker Compose (Recommended - Easiest)"
echo "  2) Local Development (Manual setup)"
echo ""
read -p "Enter choice (1 or 2): " choice

case $choice in
  1)
    echo ""
    echo "🐳 Starting with Docker Compose..."
    echo ""
    
    # Start services
    docker-compose up -d
    
    echo ""
    echo "⏳ Waiting for database to be ready..."
    sleep 10
    
    # Run migrations
    echo "🔄 Running database migrations..."
    docker-compose exec backend npx prisma migrate dev
    
    # Seed database
    echo "🌱 Seeding database..."
    docker-compose exec backend npm run prisma:seed
    
    echo ""
    echo "✅ Setup complete!"
    echo ""
    echo "🚀 Application is running:"
    echo "   Frontend: http://localhost:3000"
    echo "   Backend API: http://localhost:4000"
    echo "   API Docs: http://localhost:4000/api/docs"
    echo ""
    echo "📋 Demo Credentials:"
    echo "   Club Access Code: PADEL2024"
    echo "   Admin Email: admin@padelclub.com"
    echo "   Admin Password: admin123"
    echo ""
    echo "💡 View logs: docker-compose logs -f"
    echo "💡 Stop services: docker-compose down"
    ;;
    
  2)
    echo ""
    echo "🛠️  Setting up local development..."
    echo ""
    
    # Install backend dependencies
    echo "📦 Installing backend dependencies..."
    cd backend
    npm install
    
    # Generate Prisma Client
    echo "🔄 Generating Prisma Client..."
    npx prisma generate
    
    # Run migrations
    echo "🔄 Running database migrations..."
    echo "⚠️  Make sure PostgreSQL is running on localhost:5432"
    echo ""
    read -p "Press Enter when database is ready..."
    npx prisma migrate dev
    
    # Seed database
    echo "🌱 Seeding database..."
    npm run prisma:seed
    
    cd ..
    
    # Install frontend dependencies
    echo "📦 Installing frontend dependencies..."
    cd frontend
    npm install
    cd ..
    
    echo ""
    echo "✅ Setup complete!"
    echo ""
    echo "🚀 To start the application:"
    echo ""
    echo "Terminal 1 (Backend):"
    echo "  cd backend"
    echo "  npm run start:dev"
    echo ""
    echo "Terminal 2 (Frontend):"
    echo "  cd frontend"
    echo "  npm run dev"
    echo ""
    echo "📋 Access:"
    echo "   Frontend: http://localhost:3000"
    echo "   Backend API: http://localhost:4000"
    echo "   API Docs: http://localhost:4000/api/docs"
    echo ""
    echo "📋 Demo Credentials:"
    echo "   Club Access Code: PADEL2024"
    echo "   Admin Email: admin@padelclub.com"
    echo "   Admin Password: admin123"
    ;;
    
  *)
    echo "❌ Invalid choice. Exiting."
    exit 1
    ;;
esac

echo ""
echo "📖 For more information, see README.md"
echo ""
