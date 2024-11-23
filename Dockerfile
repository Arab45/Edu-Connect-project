#Sample Dockerfile for NodeJS Apps

FROM node:20

ENV NODE_ENV=production

WORKDIR /src

# COPY ["package.json", "package-lock.json*", "./"]
COPY package*.json ./


# RUN npm install --production
RUN npm install

COPY . .

EXPOSE 2000

CMD [ "node", "App.js" ]