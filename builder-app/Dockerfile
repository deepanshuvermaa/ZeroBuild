FROM node:20-slim

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install ALL dependencies (including devDeps needed for vite build)
RUN npm ci

# Copy source
COPY . .

# Build frontend
RUN npm run build

# Prune devDependencies after build
RUN npm prune --omit=dev

# Create uploads directory
RUN mkdir -p server/uploads

# Expose port
EXPOSE 3001

# Start server
CMD ["node", "server/index.js"]
