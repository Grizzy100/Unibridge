# Development Dockerfile for outpass-service
FROM node:24-alpine

# Install OpenSSL for Prisma
RUN apk add --no-cache openssl

# Set working directory
WORKDIR /usr/src/app

# Copy package files
COPY package*.json ./
COPY tsconfig.json ./

# Install ALL dependencies (including devDependencies for development)
RUN npm install

# Copy Prisma schema
COPY prisma ./prisma

# Generate Prisma Client
RUN npx prisma generate

# Copy source code
COPY . .

# Create uploads directory for file storage
RUN mkdir -p uploads

# Expose port
EXPOSE 3003

# Run in dev mode
CMD ["npm", "run", "dev"]
