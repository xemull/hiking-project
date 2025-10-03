# Use the official Node.js runtime as the base image (using full Debian instead of Alpine)
FROM node:18

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json (if available)
COPY package*.json ./

# Install dependencies (including dev dependencies needed for build)
RUN npm install

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