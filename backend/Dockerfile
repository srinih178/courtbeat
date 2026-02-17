FROM node:18-slim

# Install OpenSSL and build tools
RUN apt-get update -y && \
    apt-get install -y \
    openssl \
    ca-certificates \
    python3 \
    make \
    g++ \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci

# Rebuild native modules inside container (critical for bcrypt)
RUN npm rebuild bcrypt --build-from-source

# Copy source code
COPY . .

# Generate Prisma Client
RUN npx prisma generate

# Expose port
EXPOSE 4000

# Start development server
CMD ["npm", "run", "start:dev"]
