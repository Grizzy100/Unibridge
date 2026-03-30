FROM node:24-alpine

# Set working directory
WORKDIR /usr/src/app

# Copy package files
COPY package*.json ./
COPY tsconfig.json ./

# Install all dependencies for development mode
RUN npm install

# Copy source code
COPY . .

# Expose port
EXPOSE 3006

# Run in dev mode
CMD ["npm", "run", "dev"]
