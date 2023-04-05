FROM node:16

WORKDIR /app/backend

COPY package*.json ./

RUN npm install

COPY . .
EXPOSE 8085
CMD ["node", "index.js"]