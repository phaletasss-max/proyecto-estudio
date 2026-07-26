FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install --production=false

COPY . .
RUN npm run build

ENV DISCORD_TOKEN=""

CMD ["node", "dist/index.js"]
