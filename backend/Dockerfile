# Use an official Node.js runtime as a parent image.
# The 'alpine' version is lightweight and secure.
FROM node:18-alpine

# Set the working directory inside the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install only the production dependencies to keep the image small
RUN npm ci --only=production

# Copy the rest of your application code into the container
COPY . .

# Make your app's port available to the outside world
EXPOSE 8080

# Define the command to run your app
CMD [ "node", "index.js" ]