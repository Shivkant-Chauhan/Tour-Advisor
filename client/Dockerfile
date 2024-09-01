FROM node:16.13.0 AS frontend

COPY ./client/package.json .
RUN npm i --legacy-peer-deps

COPY . .