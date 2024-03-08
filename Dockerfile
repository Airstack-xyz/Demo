FROM node:20.11-alpine

RUN mkdir -p /app

COPY . /app

WORKDIR /app

ARG ENV
ENV ENV=$ENV

RUN npm install --legacy-peer-deps
RUN ls ./node_modules/.bin

RUN export ENV=${ENV} && npm run build-sh

EXPOSE 3000
