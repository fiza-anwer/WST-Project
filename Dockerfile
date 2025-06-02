# Use Node.js LTS Alpine image for small size
FROM node:18-alpine

# Set working directory inside the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json first for better caching
COPY package*.json ./

# Install dependencies
RUN npm install --production

# Copy all files from your project root into the container
COPY . .

# Expose port (default Express port, change if different)
EXPOSE 3000

# Start the app (change index.js if your main file is named differently)
CMD ["node", "server.js"]
