# Use the official Node.js image as the base image
FROM node:22-alpine

# Set the working directory inside the container
WORKDIR /app

# Copy the package.json and package-lock.json files
COPY package*.json ./

COPY .env ./

# # Copy the rest of the application code
COPY . .

# Install dependencies
RUN npm install

# Build the Next.js app
# production
# RUN npm run build

# Expose the port the app runs on
EXPOSE 3000

# Command to run the Next.js app
# production
# CMD ["npm", "start"]
CMD ["npm", "run", "dev"]