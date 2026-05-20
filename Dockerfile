# Use an official Node.js runtime as a parent image
FROM node:14.18.0

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json (if available)
COPY package*.json ./

# Install dependencies
RUN git config --global url."https://".insteadOf git://
RUN npm install --force --loglevel verbose
RUN npm install -g serve
RUN rm -fr node_modules

# Copy the rest of the application files
COPY . .

# Expose necessary ports (if applicable)
EXPOSE 3000 

# Define the command to run the application
CMD ["node", "discord.js"]

