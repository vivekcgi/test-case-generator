FROM node:lts-alpine AS BASE
WORKDIR /app
COPY . .
RUN npm install \
    npm build

FROM node:lts-alpine AS PRODUCTION
ENV NODE_ENV production
ENV PORT 5000
WORKDIR /app

COPY ./package.json /app

COPY --from=BASE /app/dist/src /app/src/dist

CMD ["node", "./src/dist/index.js"]