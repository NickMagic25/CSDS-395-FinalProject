FROM node:16-alpine

WORKDIR /usr/src/app

COPY package*.json ./
COPY db.js ./

RUN npm install

EXPOSE 5000

CMD ["node","db.js"]