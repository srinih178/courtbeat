# Deployment Guide

## Overview
This guide covers deploying the Racket Fitness Platform to various hosting providers.

## Prerequisites
- Domain name (optional but recommended)
- SSL certificates (for HTTPS)
- Hosting provider account
- Database hosting (or managed PostgreSQL)

## Environment Variables

### Required Production Variables

**Backend (.env)**:
```bash
DATABASE_URL=postgresql://user:password@host:5432/dbname?schema=public
JWT_SECRET=<generate-strong-secret>
PORT=4000
NODE_ENV=production
CORS_ORIGIN=https://yourdomain.com

# Optional - Video Streaming
MUX_TOKEN_ID=<your-mux-token>
MUX_TOKEN_SECRET=<your-mux-secret>

# Optional - AI Avatar APIs
SYNTHESIA_API_KEY=<your-key>
HEYGEN_API_KEY=<your-key>
```

**Frontend (.env.production)**:
```bash
NEXT_PUBLIC_API_URL=https://api.yourdomain.com
NEXT_PUBLIC_ENV=production
```

## Deployment Options

### Option 1: Docker on VPS (DigitalOcean, Linode, etc.)

1. **Provision a VPS**
   - Minimum: 2 CPU cores, 4GB RAM
   - Install Docker and Docker Compose

2. **Clone repository**
   ```bash
   git clone <your-repo>
   cd racket-fitness-platform
   ```

3. **Configure environment**
   ```bash
   cp backend/.env.example backend/.env
   # Edit backend/.env with production values
   ```

4. **Deploy with Docker Compose**
   ```bash
   docker-compose -f docker-compose.prod.yml up -d
   ```

5. **Run migrations**
   ```bash
   docker-compose -f docker-compose.prod.yml exec backend npx prisma migrate deploy
   docker-compose -f docker-compose.prod.yml exec backend npm run prisma:seed
   ```

6. **Setup SSL with Let's Encrypt** (optional)
   ```bash
   # Install certbot
   sudo apt install certbot python3-certbot-nginx
   
   # Generate certificates
   sudo certbot --nginx -d yourdomain.com -d api.yourdomain.com
   ```

### Option 2: AWS (ECS + RDS)

1. **Create RDS PostgreSQL instance**
   - Engine: PostgreSQL 15
   - Instance class: db.t3.micro or higher
   - Note connection string

2. **Build and push Docker images to ECR**
   ```bash
   # Login to ECR
   aws ecr get-login-password --region us-east-1 | docker login --username AWS --password-stdin <account-id>.dkr.ecr.us-east-1.amazonaws.com
   
   # Build and push backend
   cd backend
   docker build -f Dockerfile.prod -t racket-backend:latest .
   docker tag racket-backend:latest <account-id>.dkr.ecr.us-east-1.amazonaws.com/racket-backend:latest
   docker push <account-id>.dkr.ecr.us-east-1.amazonaws.com/racket-backend:latest
   
   # Build and push frontend
   cd ../frontend
   docker build -f Dockerfile.prod -t racket-frontend:latest .
   docker tag racket-frontend:latest <account-id>.dkr.ecr.us-east-1.amazonaws.com/racket-frontend:latest
   docker push <account-id>.dkr.ecr.us-east-1.amazonaws.com/racket-frontend:latest
   ```

3. **Create ECS Services**
   - Configure task definitions with environment variables
   - Setup Application Load Balancer
   - Configure health checks

4. **Run migrations**
   ```bash
   # Via ECS Exec or separate task
   aws ecs execute-command --cluster <cluster> --task <task-id> --command "npx prisma migrate deploy"
   ```

### Option 3: Vercel (Frontend) + Railway/Render (Backend)

**Frontend on Vercel:**
1. Connect GitHub repository
2. Configure build settings:
   - Framework: Next.js
   - Root directory: `frontend`
   - Build command: `npm run build`
   - Output directory: `.next`
3. Add environment variables:
   - `NEXT_PUBLIC_API_URL`: Your backend URL

**Backend on Railway/Render:**
1. Create new service from GitHub
2. Select `backend` directory
3. Add PostgreSQL database
4. Configure environment variables
5. Deploy

### Option 4: Heroku

**Backend:**
```bash
cd backend
heroku create racket-fitness-api
heroku addons:create heroku-postgresql:mini
heroku config:set NODE_ENV=production
heroku config:set JWT_SECRET=<your-secret>
git push heroku main
heroku run npx prisma migrate deploy
```

**Frontend:**
```bash
cd frontend
heroku create racket-fitness-web
heroku config:set NEXT_PUBLIC_API_URL=https://racket-fitness-api.herokuapp.com/api
git push heroku main
```

## Database Migrations

### Production Migration Workflow

1. **Test locally**
   ```bash
   npm run prisma:migrate
   ```

2. **Create migration**
   ```bash
   npx prisma migrate dev --name <migration-name>
   ```

3. **Deploy to production**
   ```bash
   npx prisma migrate deploy
   ```

## Monitoring & Maintenance

### Health Checks
- Backend: `GET /api/health`
- Database: Monitor connection pool
- Frontend: Monitor Next.js build logs

### Logs
```bash
# Docker
docker-compose -f docker-compose.prod.yml logs -f

# PM2 (if using)
pm2 logs

# Cloud providers
# Use provider-specific log viewers (CloudWatch, GCP Logs, etc.)
```

### Backups
```bash
# PostgreSQL backup
pg_dump -h localhost -U postgres racket_fitness > backup.sql

# Restore
psql -h localhost -U postgres racket_fitness < backup.sql

# Automated backups (example with cron)
0 2 * * * pg_dump -h localhost -U postgres racket_fitness > /backups/backup-$(date +\%Y\%m\%d).sql
```

## Security Checklist

- [ ] Use strong JWT_SECRET (32+ random characters)
- [ ] Enable HTTPS/SSL
- [ ] Configure CORS properly
- [ ] Use environment variables (never hardcode secrets)
- [ ] Keep dependencies updated
- [ ] Enable database connection encryption
- [ ] Setup firewall rules
- [ ] Regular security audits
- [ ] Implement rate limiting
- [ ] Setup monitoring and alerts

## Performance Optimization

1. **Database**
   - Enable connection pooling
   - Add indexes for frequent queries
   - Regular VACUUM and ANALYZE

2. **Backend**
   - Enable response caching
   - Use CDN for video streaming
   - Implement request throttling

3. **Frontend**
   - Enable Next.js image optimization
   - Use CDN for static assets
   - Implement code splitting

## Scaling

### Horizontal Scaling
- Add more application instances
- Use load balancer
- Setup Redis for session storage

### Database Scaling
- Read replicas for analytics
- Connection pooling (PgBouncer)
- Consider managed database service

## Troubleshooting

### Common Issues

**Database connection errors:**
```bash
# Check DATABASE_URL format
# Verify database is accessible
# Check firewall rules
```

**Video upload failures:**
```bash
# Check Mux credentials
# Verify file size limits
# Check disk space
```

**CORS errors:**
```bash
# Verify CORS_ORIGIN setting
# Check frontend URL configuration
```

## Support

For deployment issues:
1. Check logs
2. Review environment variables
3. Verify all services are running
4. Consult provider documentation

## Resources

- [Docker Documentation](https://docs.docker.com/)
- [Next.js Deployment](https://nextjs.org/docs/deployment)
- [NestJS Deployment](https://docs.nestjs.com/deployment)
- [Prisma Deployment](https://www.prisma.io/docs/guides/deployment)
