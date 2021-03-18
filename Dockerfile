FROM node:10.24.0-alpine3.

LABEL maintainer="Clement Okyere"

WORKDIR /app

ARG DB
ARG JWTPRIVATEKEY

ENV  NODE_ENV=production
ENV DB=$DB
ENV jwtPrivateKey=$JWTPRIVATEKEY

COPY package*.json package-lock.json ./

RUN npm install --production

COPY . .

CMD ["node", "index.js"]