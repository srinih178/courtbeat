# ---- Build stage ----
FROM node:18-slim AS builder

RUN apt-get update -y && \
    apt-get install -y openssl ca-certificates python3 make g++ && \
    rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Copy package files
COPY package*.json ./
RUN npm ci

# Rebuild bcrypt for Linux (in builder stage)
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

# Copy package.json
COPY package*.json ./

# Install production dependencies only
RUN npm ci --omit=dev

# Copy the ALREADY BUILT bcrypt from builder stage (don't rebuild)
COPY --from=builder /app/node_modules/bcrypt ./node_modules/bcrypt

# Copy compiled application
COPY --from=builder /app/dist ./dist

# Copy Prisma files (client + migrations)
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma
COPY --from=builder /app/node_modules/@prisma ./node_modules/@prisma
COPY prisma ./prisma

# Copy startup script
COPY start.sh ./start.sh
RUN chmod +x start.sh

# Verify everything is in place
RUN test -f dist/main.js && \
    test -f start.sh && \
    test -d node_modules/.prisma && \
    test -d node_modules/bcrypt

EXPOSE 4000
ENV NODE_ENV=production

CMD ["./start.sh"]
