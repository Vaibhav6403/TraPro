# Base image with Node.js
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy dependency files first (for better caching)
COPY package*.json ./

# Install dependencies including devDependencies
RUN npm install

# Copy rest of the source code
COPY . .

# Build the Vue app (creates a 'dist/' folder)
RUN npm run build

# Install a simple static file server to serve 'dist'
RUN npm install -g serve

# Set working directory to the build output
WORKDIR /app/dist

# Expose the port serve will use
EXPOSE 3030

# Command to run the server
CMD ["serve", "-s", ".", "-l", "3000"]