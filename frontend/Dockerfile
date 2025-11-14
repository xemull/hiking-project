# Build stage
FROM node:18-alpine AS builder

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy source code
COPY . .

# Set build-time environment variables
ENV NEXT_PUBLIC_STRAPI_URL=https://cms-service-623946599151.europe-west2.run.app
ENV NEXT_PUBLIC_CUSTOM_BACKEND_URL=https://backend-service-623946599151.europe-west2.run.app
ENV NEXT_PUBLIC_SITE_URL=https://frontend-service-623946599151.europe-west2.run.app

# Build the application
RUN npm run build

# Production stage
FROM node:18-alpine AS runner

WORKDIR /app

# Copy built application
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/public ./public
COPY --from=builder /app/next.config.ts ./next.config.ts

# Expose port
EXPOSE 3000

# Start the application
CMD ["node", "server.js"]