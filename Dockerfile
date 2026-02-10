# Dockerfile for AI Workforce Frontend
# Place this file in your frontend project root

# Stage 1: Build
FROM node:20-alpine AS builder

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy source code
COPY . .

# Build the app
RUN npm install -g @angular/cli
RUN npm run build

# Expose port 80
EXPOSE 5173

# Enter Point
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0", "--port", "5173"]

