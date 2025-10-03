# Use the official Node.js runtime as the base image
FROM node:18-alpine

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json (if available)
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production

# Copy the rest of the application code
COPY . .

# Create the .tmp directory for SQLite database
RUN mkdir -p .tmp

# Build the Strapi application
RUN npm run build

# Expose the port that Strapi runs on
EXPOSE 1337

# Set the default command to start Strapi
CMD ["npm", "start"]