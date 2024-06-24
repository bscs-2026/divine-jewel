# Use the official Node.js image as the base image
FROM node:22-alpine

# Set the working directory inside the container
WORKDIR /app

# Copy the package.json and package-lock.json files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Build the Next.js app
RUN npm run build

# # Copy the rest of the application code
COPY . .
# RUN rm -rf node_modules

# Expose the port the app runs on
EXPOSE 3000

# Command to run the Next.js app
CMD ["npm", "start"]
