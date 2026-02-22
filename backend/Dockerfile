# ---- Build stage ----
FROM node:18-slim AS builder

RUN apt-get update -y && \
    apt-get install -y openssl ca-certificates python3 make g++ && \
    rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Copy package files
COPY package*.json ./
RUN npm ci

# Rebuild bcrypt for Linux
RUN npm rebuild bcrypt --build-from-source

# Copy source
COPY . .

# Generate Prisma Client
RUN npx prisma generate

# Build TypeScript
RUN npm run build

# Verify build succeeded
RUN ls -la dist/ && test -f dist/main.js

# ---- Production stage ----
FROM node:18-slim

RUN apt-get update -y && \
    apt-get install -y openssl ca-certificates && \
    rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Copy package files and install production dependencies
COPY package*.json ./
RUN npm ci --omit=dev

# Rebuild bcrypt for production
RUN npm rebuild bcrypt --build-from-source

# Copy compiled application
COPY --from=builder /app/dist ./dist

# Copy Prisma files
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma
COPY --from=builder /app/node_modules/@prisma ./node_modules/@prisma
COPY prisma ./prisma

# Copy startup script
COPY start.sh ./start.sh
RUN chmod +x start.sh

# Verify critical files exist
RUN test -f dist/main.js && \
    test -f start.sh && \
    test -d node_modules/.prisma

EXPOSE 4000
ENV NODE_ENV=production

CMD ["./start.sh"]
