
# Use the official Node.js image as the base image
FROM node:22-alpine

# Set the working directory inside the container
WORKDIR /app

# Copy package files for installing dependencies
COPY package*.json ./

# Copy the rest of the application code
COPY . .

# Set a build argument for NODE_ENV with a default value of development, else use the value passed in e.g. NODE_ENV=production
ARG NODE_ENV=development

# Print the NODE_ENV value
RUN echo "NODE_ENV is set to: $NODE_ENV"

# Copy environment file into the container
COPY .env.$NODE_ENV ./.env

# Install dependencies
RUN npm cache clean --force && rm -rf node_modules package-lock.json && npm install next && npm install

# Build the Next.js app if NODE_ENV is production
RUN if [ "$NODE_ENV" = "production" ]; then npm run build; fi

# Expose the port the app runs on
EXPOSE 3000

# Command to run the Next.js app based on NODE_ENV
CMD ["sh", "-c", "if [ \"$NODE_ENV\" = \"production\" ]; then npm start; else npm run dev; fi"]