# Use official Node.js 18 image as base
FROM node:18

# Set working directory inside container
WORKDIR /app

# Copy package.json and package-lock.json first (for better caching)
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy all source files
COPY . .

# Expose the port Vite dev server listens on
EXPOSE 4173

# Start the Vite development server on 0.0.0.0 so it's accessible externally
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]
