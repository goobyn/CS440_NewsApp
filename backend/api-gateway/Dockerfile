# Use Node.js as the base image
FROM node:16

# Set the working directory inside the container
WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install

# Copy the source code
COPY . .

# Expose the service port
EXPOSE 4000

# Start the API Gateway
CMD ["node", "server.js"]
