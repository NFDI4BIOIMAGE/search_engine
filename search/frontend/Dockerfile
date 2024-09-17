# Use the official Node.js image
FROM node:16-alpine

# Set the working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package.json package-lock.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Build the application
RUN npm run build

# Install 'serve' to serve the static files
RUN npm install -g serve

# Expose port 80
EXPOSE 80

# Serve the build folder
CMD ["serve", "-s", "dist", "-l", "80"]
