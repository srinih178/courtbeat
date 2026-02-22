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

# Copy source code
COPY . .

# Generate Prisma Client
RUN npx prisma generate

# Build TypeScript
RUN npm run build && \
    echo "✅ Build completed" && \
    echo "Checking dist contents..." && \
    ls -la dist/ && \
    echo "Searching for main.js..." && \
    (test -f dist/main.js && echo "Found at dist/main.js" || \
     test -f dist/src/main.js && echo "Found at dist/src/main.js" || \
     (echo "WARNING: main.js not in expected location. Showing all .js files:" && find dist -name "*.js" | head -10))

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

# Copy pre-built bcrypt from builder
COPY --from=builder /app/node_modules/bcrypt ./node_modules/bcrypt

# Copy ALL compiled output
COPY --from=builder /app/dist ./dist

# Copy Prisma files
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma
COPY --from=builder /app/node_modules/@prisma ./node_modules/@prisma
COPY prisma ./prisma

# Copy startup script
COPY start.sh ./start.sh
RUN chmod +x start.sh

EXPOSE 4000
ENV NODE_ENV=production

CMD ["./start.sh"]
