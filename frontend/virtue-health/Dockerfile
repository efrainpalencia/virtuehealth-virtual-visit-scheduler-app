# Stage 1: Build
FROM node:18 as builder

WORKDIR /app

# Install dependencies
COPY package.json package-lock.json ./
RUN npm install --legacy-peer-deps

# Build the application
COPY . .
RUN npm run build

# Stage 2: Serve
FROM nginx:alpine

WORKDIR /usr/share/nginx/html

# Copy built files from the builder stage
COPY --from=builder /app/dist .

# Expose the application port
EXPOSE 80

# Start Nginx server
CMD ["nginx", "-g", "daemon off;"]
