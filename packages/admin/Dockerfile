FROM node:16.17.0

RUN mkdir -p /app
RUN mkdir -p /app/packages
RUN mkdir -p /app/packages/admin
RUN mkdir -p /app/packages/rrrcn-services
RUN mkdir -p /app/patches
WORKDIR /app

COPY package*.json /app
COPY ./packages/admin/package*.json /app/packages/admin
COPY ./packages/rrrcn-services/package*.json /app/packages/rrrcn-services


RUN yarn
COPY ./packages/admin /app/packages/admin
COPY ./packages/rrrcn-services /app/packages/rrrcn-services

ARG HOST
ARG PORT
ARG APP_KEYS
ARG API_TOKEN_SALT
ARG ADMIN_JWT_SECRET
ARG JWT_SECRET
ENV NODE_ENV=production
EXPOSE $PORT

RUN yarn build_admin
#USER node

WORKDIR /app/packages/admin


CMD ["yarn", "start"]
