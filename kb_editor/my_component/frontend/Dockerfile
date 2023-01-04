FROM node:16.16.0

WORKDIR '/app'
COPY . /app

RUN npm i --force
EXPOSE 8051

CMD ["npm", "start"]