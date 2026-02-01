# Development Dockerfile for user-service
FROM node:24-alpine

# Install OpenSSL for Prisma
RUN apk add --no-cache openssl

# Set working directory
WORKDIR /usr/src/app

# Copy package files
COPY package*.json ./
COPY tsconfig.json ./

# Install ALL dependencies 
RUN npm install

# Copy Prisma schema
COPY prisma ./prisma

# Generate Prisma Client
RUN npx prisma generate --schema prisma/schema.prisma

# Copy source code
COPY . .

# Expose port
EXPOSE 3001

# Run in dev mode
CMD ["npm", "run", "dev"]
