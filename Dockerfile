#Sample Dockerfile for NodeJS Apps
FROM node:20

ENV NODE_ENV=production

WORKDIR /app

# COPY ["package.json", "package-lock.json*", "./"]
COPY package*.json ./


# RUN npm install --production
RUN npm install

# Install production dependencies only
RUN npm ci --only=production

COPY . .

EXPOSE 2000

CMD [ "node", "./App.js" ]