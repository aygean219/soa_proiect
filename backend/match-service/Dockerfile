FROM node:lts-alpine
# Instalează curl
RUN apk update && apk add curl
COPY package.json ./
COPY package-lock.json ./

RUN npm install

COPY match-service ./
COPY utils ./utils

ENTRYPOINT node main.js