# Use the official Node.js image as the base image
FROM node:22-alpine

# Set the working directory inside the container
WORKDIR /app

# Copy only the necessary files for npm install
COPY package*.json ./

# Copy environment files if needed
# COPY .env.* ./
COPY .env ./

# Copy the rest of the application code
COPY . .

# Install dependencies
RUN rm -rf node_modules package-lock.json
RUN npm cache clean --force
RUN npm install

# Build the Next.js app (conditional based on the build argument)
ARG NODE_ENV=development
RUN if [ "$NODE_ENV" = "production" ]; then npm run build; fi

# Expose the port the app runs on
EXPOSE 3000

# Command to run the Next.js app (conditional based on the environment)
ENTRYPOINT ["sh", "-c"]
CMD if [ "$NODE_ENV" = "production" ]; then npm start; else npm run dev; fi
