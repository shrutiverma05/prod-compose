FROM node:16

COPY . /app

WORKDIR /app/frontend

RUN npm i --force
EXPOSE 8009

CMD ["npm", "start"]
