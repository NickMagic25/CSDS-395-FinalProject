# Thanks to https://www.youtube.com/watch?v=YlVmVO0zAfw for some tips

FROM node:16-alpine as builder

# production image
ENV NODE_ENV=production

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm ci --production

USER node
COPY db.js ./
COPY API_helper.js ./

FROM node:16-alpine

USER node
COPY --from=builder /usr/src/app /app
WORKDIR /app

# expose port and start server
EXPOSE 5000
CMD ["node","db.js"]