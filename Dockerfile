FROM node:18

# Install serve globally first to leverage Docker cache
RUN npm install -g serve

WORKDIR /app

# Only copy package files first to cache node_modules unless dependencies change
COPY package*.json ./

# Install dependencies
RUN npm install

# Now copy the rest of the app
COPY . .

# Build the Vite app
RUN npm run build

# Expose Vite production port
EXPOSE 4173

# Serve built app
CMD ["serve", "-s", "dist", "-l", "4173"]
