# CourtBeat - AI Fitness Platform

AI-powered fitness platform for racket sports clubs with on-demand workout streaming, AI avatar content, and club management.

## 🏋️ Overview

CourtBeat delivers professional fitness content to padel, pickleball, and tennis clubs without requiring paid instructors. Features include Zumba-style racket dance sessions, bodyweight Pilates, sport-specific conditioning, and AI-generated workout content with dynamic music overlays.

## 🏗️ Architecture

- **Frontend**: Next.js 14 + Tailwind CSS (TV/tablet optimized)
- **Backend**: NestJS + TypeScript
- **Database**: PostgreSQL 15
- **Video Streaming**: Mux + FFmpeg
- **AI Avatars**: Synthesia/HeyGen integration ready
- **Deployment**: Docker + Docker Compose
- **CI/CD**: GitHub Actions

## 📁 Project Structure

```
racket-fitness-platform/
├── backend/               # NestJS API server
│   ├── src/
│   │   ├── modules/      # Feature modules
│   │   ├── common/       # Shared utilities
│   │   └── main.ts       # Entry point
│   ├── prisma/           # Database schema & migrations
│   └── package.json
├── frontend/             # Next.js web app
│   ├── src/
│   │   ├── app/          # App router pages
│   │   ├── components/   # React components
│   │   └── lib/          # Utilities
│   └── package.json
├── .github/workflows/    # CI/CD pipelines
├── docker-compose.yml    # Local development
└── README.md
```

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- Docker & Docker Compose
- PostgreSQL 15+ (or use Docker)

### Automated Setup

**Windows:**
```cmd
setup.bat
```
Or with PowerShell:
```powershell
powershell -ExecutionPolicy Bypass -File .\setup.ps1
```

**Linux/Mac:**
```bash
chmod +x setup.sh
./setup.sh
```

Choose option 1 (Docker Compose) for the easiest setup.

### Manual Setup

1. **Install dependencies**
```bash
# Backend
cd backend
npm install

# Frontend
cd ../frontend
npm install
```

2. **Configure environment variables**
```bash
# Backend (.env)
cp backend/.env.example backend/.env

# Frontend (.env.local)
cp frontend/.env.example frontend/.env.local
```

3. **Start with Docker Compose**
```bash
docker-compose up -d
```

4. **Run database migrations**
```bash
cd backend
npx prisma migrate dev
npx prisma db seed
```

5. **Access the application**
- Frontend: http://localhost:3000
- Backend API: http://localhost:4000
- API Docs: http://localhost:4000/api

## 🎯 Features (Phase 1 POC)

### Club Owner Features
- ✅ Schedule daily workout sessions
- ✅ TV/tablet broadcast ready (no login required)
- ✅ Basic usage analytics dashboard
- ✅ Upload filmed content (Zumba, etc.)
- ✅ Manage workout playlists

### Member Features
- ✅ On-demand workout access via QR/URL
- ✅ Sport-specific routines (padel/pickleball/tennis)
- ✅ Zumba with racket sessions
- ✅ Bodyweight Pilates & conditioning
- ✅ Verbal modification cues (active/less active)
- ✅ Music-matched workout experience

### Technical Features
- ✅ AI avatar video generation integration (Synthesia/HeyGen)
- ✅ Royalty-free music overlay (Epidemic/Artlist compatible)
- ✅ Video streaming with Mux
- ✅ Batch content creation workflow
- ✅ Multi-club support
- ✅ Anonymous usage tracking

## 🎬 Video Content Pipeline

1. **AI Avatar Creation**: Script → Synthesia/HeyGen → MP4
2. **Music Overlay**: FFmpeg batch processing
3. **Upload to Mux**: Automatic encoding & streaming
4. **Playlist Assignment**: Schedule for club broadcast

## 📊 Database Schema

- **Clubs**: Club information and settings
- **Workouts**: Workout metadata (type, duration, difficulty)
- **Videos**: Video assets with streaming URLs
- **Schedules**: Planned workout sessions
- **Analytics**: Usage tracking (anonymous)

## 🔐 Authentication

- **Club Access**: Simple club-specific URLs (no member login)
- **Admin Panel**: Basic auth for club owners
- **API**: JWT tokens for backend services

## 🧪 Testing

```bash
# Backend tests
cd backend
npm run test
npm run test:e2e

# Frontend tests
cd frontend
npm run test
```

## 📦 Deployment

### Production Build
```bash
# Build all services
docker-compose -f docker-compose.prod.yml build

# Deploy
docker-compose -f docker-compose.prod.yml up -d
```

### Environment Variables (Production)
- `DATABASE_URL`: PostgreSQL connection string
- `MUX_TOKEN_ID`: Mux API token
- `MUX_TOKEN_SECRET`: Mux API secret
- `SYNTHESIA_API_KEY`: Synthesia API key (optional)
- `HEYGE_API_KEY`: HeyGen API key (optional)
- `JWT_SECRET`: JWT signing secret
- `NEXT_PUBLIC_API_URL`: Backend API URL

## 🎯 Roadmap

### Phase 1 (Current - 4 weeks)
- [x] Core platform architecture
- [x] 10-15 AI workouts with verbal cues
- [x] TV/tablet player interface
- [x] Club admin panel
- [x] Music integration pipeline

### Phase 1.5 (2 weeks)
- [ ] Visual side-by-side modifications
- [ ] Split-screen avatar demos
- [ ] Enhanced accessibility features

### Phase 2 (4 weeks)
- [ ] Multi-club expansion (2-3 clubs)
- [ ] Premium reformer Pilates tier
- [ ] Advanced analytics
- [ ] Payment integration

## 📄 License

Proprietary - All rights reserved

## 🤝 Support

For questions or issues, contact: support@racketfitness.platform
