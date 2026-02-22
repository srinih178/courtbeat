# ---- Build stage ----
FROM node:18-slim AS builder

RUN apt-get update -y && \
    apt-get install -y openssl ca-certificates python3 make g++ && \
    rm -rf /var/lib/apt/lists/*

WORKDIR /app

COPY package*.json ./
RUN npm ci

# Rebuild bcrypt compiled for Linux
RUN npm rebuild bcrypt --build-from-source

COPY . .

# Generate Prisma Client
RUN npx prisma generate

# Build TypeScript
RUN npm run build

# ---- Production stage ----
FROM node:18-slim

RUN apt-get update -y && \
    apt-get install -y openssl ca-certificates python3 make g++ && \
    rm -rf /var/lib/apt/lists/*

WORKDIR /app

COPY package*.json ./
RUN npm ci --omit=dev

# Rebuild bcrypt for Linux in production image
RUN npm rebuild bcrypt --build-from-source

# Copy compiled output
COPY --from=builder /app/dist ./dist

# Copy Prisma (generated client + migrations + schema)
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma
COPY --from=builder /app/node_modules/@prisma ./node_modules/@prisma
COPY prisma ./prisma

# Copy start script
COPY start.sh ./start.sh
RUN chmod +x start.sh

EXPOSE 4000
ENV NODE_ENV=production

CMD ["./start.sh"]
