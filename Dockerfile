FROM node:20.11-alpine

RUN mkdir -p /app

COPY . /app

WORKDIR /app

ARG ENV
ENV ENV=$ENV

ARG PRIVY_APP_ID
ENV PRIVY_APP_ID=$PRIVY_APP_ID

RUN npm install --legacy-peer-deps
RUN ls ./node_modules/.bin

RUN export ENV=${ENV} && npm run build-sh

EXPOSE 3000
