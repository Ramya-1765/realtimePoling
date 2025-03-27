# Use Node.js as the base image
FROM node:18-alpine

# Set the working directory
WORKDIR /app

# Copy package.json and package-lock.json first to leverage Docker caching
COPY package.json package-lock.json ./

# Install dependencies
RUN npm install

# Copy the rest of the frontend files
COPY . .

# Build the frontend
RUN npm run build

# Expose the frontend port (Vite default: 5173)
EXPOSE 5173

# Start the frontend server
CMD ["npm", "run", "dev", "--", "--host"]
