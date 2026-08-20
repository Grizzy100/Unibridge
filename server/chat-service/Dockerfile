FROM node:20-alpine

RUN apk add --no-cache openssl ca-certificates

# Set working directory
WORKDIR /usr/src/app

# Copy package files
COPY package*.json ./
COPY tsconfig.json ./

# Install all dependencies for development mode with retry options
RUN npm config set fetch-retry-maxtimeout 600000 && npm config set fetch-retries 5 && npm install

# Copy source code
COPY . .

# Expose port
EXPOSE 3006

# Run in dev mode
CMD ["npm", "run", "dev"]

