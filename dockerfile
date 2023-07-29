FROM node:lts-alpine
LABEL maintainer "fedi.dayeg@gmail.com"

WORKDIR /app
EXPOSE 3000

COPY package.json yarn.lock ./
RUN touch .env

RUN set -x && yarn

COPY . .

CMD [ "yarn", "start:dev" ]
