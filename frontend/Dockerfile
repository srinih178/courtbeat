FROM node:20-slim AS builder

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .

# Build with public API URL as build arg
ARG NEXT_PUBLIC_API_URL
ENV NEXT_PUBLIC_API_URL=${NEXT_PUBLIC_API_URL}

RUN npm run build

# ---- Production stage ----
FROM node:20-slim

WORKDIR /app

# Copy the standalone output
COPY --from=builder /app/.next/standalone ./

# Copy static files
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/public ./public

# Copy startup script
COPY start.sh ./start.sh
RUN chmod +x start.sh

# Verify server.js exists
RUN test -f server.js && echo "✅ server.js found" || echo "❌ server.js not found"

EXPOSE 3000
ENV NODE_ENV=production
ENV HOSTNAME=0.0.0.0

CMD ["./start.sh"]
