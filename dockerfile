# Thanks to https://www.youtube.com/watch?v=YlVmVO0zAfw for some tips

FROM node:16-alpine as builder

# production image
ENV NODE_ENV=production

WORKDIR /usr/src/app/config
COPY ./config/keys.js ./

WORKDIR /usr/src/app/validations
COPY ./validations/loginValidation.js ./
COPY ./validations/registerValidation.js ./

WORKDIR /usr/src/app
COPY package*.json ./

RUN npm ci --production

FROM node:16-alpine

USER node
COPY --from=builder /usr/src/app /app
WORKDIR /app

USER node
COPY db.js ./
EXPOSE 5000
CMD ["node","db.js"]