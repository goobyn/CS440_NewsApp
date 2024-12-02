# Use Node.js as the base image
FROM node:16

# Set the working directory
WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install

# Copy the source code
COPY . .

# Expose the service port
EXPOSE 3003

# Start the server
CMD ["node", "server.js"]
