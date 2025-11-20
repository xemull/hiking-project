# Use the official Node.js runtime as the base image
FROM node:18-bullseye-slim

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json from the canonical Strapi app
COPY tmb-cms-clean/package*.json ./

# Install dependencies
RUN npm ci --only=production

# Copy the Strapi application code (tmb-cms-clean)
COPY tmb-cms-clean .

# Create the .tmp directory for SQLite database (Strapi expects this path)
RUN mkdir -p .tmp

# Build the Strapi application
RUN npm run build

# Expose the port that Strapi runs on
EXPOSE 1337

# Set the default command to start Strapi
CMD ["npm", "start"]
