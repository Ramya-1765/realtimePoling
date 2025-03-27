# Use Node.js instead of Bun for better compatibility
FROM node:18-alpine

# Set the working directory
WORKDIR /app

# Copy package.json and bun.lockb
COPY package.json ./

# Install dependencies using npm instead of Bun
RUN npm install

# Copy the rest of the backend files
COPY . .

# Expose the backend port
EXPOSE 5010

# Start the server
CMD ["node", "server.js"]
