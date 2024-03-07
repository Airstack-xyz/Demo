FROM node:20.11-alpine

RUN mkdir -p /app

COPY . /app

WORKDIR /app

ARG NODE_ENV
ARG ENV

ENV ENV=$ENV

RUN echo 'node_env:' $NODE_ENV

RUN npm install --legacy-peer-deps
RUN ls ./node_modules/.bin
#RUN npm i next
RUN export ENV=${ENV} && npm run build-sh

EXPOSE 3000

#SPECIFIED CMD RUN IN TASK DEFINITION AS WE WANT TO RUN DIFFERENT COMMAND DEPENDING ON THE ENV