# Use Node 18 base image
FROM node:18

# Set working directory inside container
WORKDIR /app

# Copy only package files first for layer caching
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the remaining source code
COPY . .

# Expose the dev server port
EXPOSE 4713

# Run Vite dev server, binding to all interfaces on port 4713
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0", "--port", "4713"]
