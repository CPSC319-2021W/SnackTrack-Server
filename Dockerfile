FROM node:14.15.4-alpine3.12

LABEL version="1.0"
LABEL description="This is Dockerfile for the backend of SnackTrack app."

ENV APP_HOME /backend
ENV PATH ${APP_HOME}/node_modules/.bin:$PATH
ENV PORT 5050
ENV NODE_ENV dev

WORKDIR ${APP_HOME}

COPY package.json .

RUN apk update \
    && apk upgrade \
    && apk add --no-cache bash \
    && yarn install \
    && yarn set version 1.22.10

COPY . ${APP_HOME}

EXPOSE ${PORT}