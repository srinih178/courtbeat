# API Documentation

Base URL: `http://localhost:4000/api` (Development)  
Interactive Docs: `http://localhost:4000/api/docs` (Swagger UI)

## Authentication

Most admin endpoints require JWT authentication.

### Login
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "admin@padelclub.com",
  "password": "admin123"
}

Response:
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "admin": {
    "id": "uuid",
    "name": "Diego Martinez",
    "email": "admin@padelclub.com",
    "club": {...}
  }
}
```

Use token in subsequent requests:
```http
Authorization: Bearer <access_token>
```

## Clubs

### Get Club by Access Code (Public)
```http
GET /api/clubs/access/:code

Example: GET /api/clubs/access/PADEL2024

Response:
{
  "id": "uuid",
  "name": "Diego's Padel Club",
  "accessCode": "PADEL2024",
  "subscriptionTier": "BASE",
  "hasReformer": false,
  ...
}
```

### Get Club Stats
```http
GET /api/clubs/:id/stats

Response:
{
  "club": {...},
  "stats": {
    "totalWorkouts": 145,
    "totalSessions": 89,
    "scheduledWorkouts": 12
  }
}
```

### Create Club
```http
POST /api/clubs
Content-Type: application/json

{
  "name": "New Padel Club",
  "email": "contact@newclub.com",
  "address": "123 Main St",
  "contactPerson": "John Doe",
  "contactPhone": "+1-555-0199"
}
```

### Update Club
```http
PATCH /api/clubs/:id
Content-Type: application/json

{
  "name": "Updated Club Name",
  "hasReformer": true
}
```

### Upgrade to Premium
```http
PATCH /api/clubs/:id/upgrade
```

## Workouts

### Get All Workouts
```http
GET /api/workouts?type=PILATES&sportType=PADEL&difficulty=ALL_LEVELS&hasReformerAccess=false

Query Parameters:
- type: CONDITIONING | PILATES | ZUMBA | SPORT_SPECIFIC | REFORMER_PILATES
- sportType: PADEL | PICKLEBALL | TENNIS | GENERAL
- difficulty: BEGINNER | INTERMEDIATE | ADVANCED | ALL_LEVELS
- requiresReformer: boolean
- hasReformerAccess: boolean (filters based on club access)

Response:
[
  {
    "id": "uuid",
    "title": "Padel Pre-Match Conditioning",
    "description": "...",
    "type": "CONDITIONING",
    "sportType": "PADEL",
    "difficulty": "ALL_LEVELS",
    "duration": 20,
    "requiresRacket": true,
    "requiresMat": false,
    "requiresReformer": false,
    "hasVerbalCues": true,
    "hasVisualMods": false,
    "videos": [
      {
        "id": "uuid",
        "streamUrl": "https://stream.mux.com/...",
        "duration": 1200
      }
    ]
  }
]
```

### Get Popular Workouts
```http
GET /api/workouts/popular?limit=10
```

### Get Workout by ID
```http
GET /api/workouts/:id

Response:
{
  "id": "uuid",
  "title": "Zumba with Racket - High Energy",
  "description": "...",
  "videos": [...],
  "schedules": [...]
}
```

### Create Workout
```http
POST /api/workouts
Content-Type: application/json
Authorization: Bearer <token>

{
  "title": "New Workout",
  "description": "Description here",
  "type": "PILATES",
  "sportType": "GENERAL",
  "difficulty": "INTERMEDIATE",
  "duration": 30,
  "requiresRacket": false,
  "requiresMat": true,
  "requiresReformer": false,
  "hasVerbalCues": true
}
```

### Update Workout
```http
PATCH /api/workouts/:id
Content-Type: application/json
Authorization: Bearer <token>

{
  "title": "Updated Title",
  "duration": 35
}
```

## Videos

### Upload Video for Workout
```http
POST /api/videos/upload/:workoutId
Content-Type: multipart/form-data
Authorization: Bearer <token>

Body: FormData with 'file' field
Max size: 500MB

Response:
{
  "id": "uuid",
  "workoutId": "uuid",
  "fileName": "workout.mp4",
  "isProcessed": false,
  "muxAssetId": null,
  "streamUrl": null
}
```

### Get Videos for Workout
```http
GET /api/videos/workout/:workoutId
```

### Get Video by ID
```http
GET /api/videos/:id
```

### Delete Video
```http
DELETE /api/videos/:id
Authorization: Bearer <token>
```

## Schedules

### Create Schedule
```http
POST /api/schedules
Content-Type: application/json
Authorization: Bearer <token>

{
  "clubId": "uuid",
  "workoutId": "uuid",
  "scheduledAt": "2024-02-15T10:00:00Z"
}
```

### Get Club Schedules
```http
GET /api/schedules/club/:clubId?upcoming=true

Query Parameters:
- upcoming: true (future schedules) | false (past schedules)

Response:
[
  {
    "id": "uuid",
    "scheduledAt": "2024-02-15T10:00:00Z",
    "duration": 30,
    "isCompleted": false,
    "workout": {
      "id": "uuid",
      "title": "Morning Pilates",
      "videos": [...]
    }
  }
]
```

### Mark Schedule Complete
```http
PATCH /api/schedules/:id/complete
Authorization: Bearer <token>
```

### Delete Schedule
```http
DELETE /api/schedules/:id
Authorization: Bearer <token>
```

## Analytics

### Track Event (Public)
```http
POST /api/analytics/track
Content-Type: application/json

{
  "clubId": "uuid",
  "eventType": "workout_played",
  "workoutId": "uuid",
  "metadata": {
    "deviceType": "tv",
    "duration": 1800
  }
}

Event Types:
- club_accessed
- session_started
- workout_played
- workout_completed
- workout_paused
```

### Get Club Analytics
```http
GET /api/analytics/club/:clubId/stats?days=30
Authorization: Bearer <token>

Response:
{
  "totalEvents": 542,
  "workoutPlays": 145,
  "sessions": 89,
  "uniqueWorkouts": 12,
  "workoutBreakdown": [
    {
      "workoutId": "uuid",
      "_count": 23
    }
  ],
  "periodDays": 30
}
```

## Music

### Get All Music Tracks
```http
GET /api/music?energy=high

Query Parameters:
- energy: low | medium | high

Response:
[
  {
    "id": "uuid",
    "title": "Energetic Warm-up",
    "artist": "Various",
    "source": "epidemic",
    "fileUrl": "/music/warmup-energetic.mp3",
    "duration": 180,
    "bpm": 128,
    "energy": "high",
    "genre": "Electronic"
  }
]
```

### Add Music Track
```http
POST /api/music
Content-Type: application/json
Authorization: Bearer <token>

{
  "title": "Latin Dance Beats",
  "artist": "Various",
  "source": "artlist",
  "fileUrl": "/music/latin-dance.mp3",
  "duration": 240,
  "bpm": 135,
  "energy": "high",
  "genre": "Latin"
}
```

## Error Responses

All endpoints return standard error responses:

```json
{
  "statusCode": 400,
  "message": "Validation failed",
  "error": "Bad Request"
}
```

Common status codes:
- 200: Success
- 201: Created
- 400: Bad Request
- 401: Unauthorized
- 403: Forbidden
- 404: Not Found
- 409: Conflict
- 500: Internal Server Error

## Rate Limiting

- Club access endpoints: 100 requests/minute
- Analytics tracking: 1000 requests/minute
- Admin endpoints: 60 requests/minute
- File uploads: 10 requests/minute

## Webhooks

### Mux Video Processing
When video processing completes, Mux sends webhook:

```http
POST /api/webhooks/mux
Content-Type: application/json

{
  "type": "video.asset.ready",
  "data": {
    "id": "mux-asset-id",
    "status": "ready",
    "playback_ids": [...]
  }
}
```

## Testing

Use the Swagger UI at `/api/docs` for interactive API testing with built-in request examples and response schemas.

Example with curl:
```bash
# Get workouts
curl http://localhost:4000/api/workouts

# Login
curl -X POST http://localhost:4000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@padelclub.com","password":"admin123"}'

# Get club stats (with auth)
curl http://localhost:4000/api/clubs/uuid/stats \
  -H "Authorization: Bearer <token>"
```
