FROM minidocks/librsvg
FROM node:16.17.0

RUN mkdir -p /app
RUN mkdir -p /app/packages
RUN mkdir -p /app/packages/admin
RUN mkdir -p /app/packages/rrrcn-services
RUN mkdir -p /app/patches
WORKDIR /app

COPY package*.json /app
COPY node_modules /app
COPY packages/admin/package*.json /app/packages/admin
COPY packages/rrrcn-services/package*.json /app/packages/rrrcn-services
RUN apt install imagemagick
RUN yarn

COPY packages/admin /app/packages/admin
COPY packages/rrrcn-services /app/packages/rrrcn-services
RUN mkdir -p /usr/share/fonts/ubuntu/

COPY packages/rrrcn-services/src/assets/Ubuntu-Regular.ttf /usr/share/fonts/ubuntu/
RUN fc-cache -f -v
WORKDIR /app/packages/admin


EXPOSE 1337

RUN NODE_ENV=production yarn build
ENV NODE_ENV=production
ENV PORT=1337
#USER node
CMD ["yarn", "start"]
