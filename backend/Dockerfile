FROM node:lts AS BASE
WORKDIR /app
COPY . .
RUN npm update \
    npm install
RUN npm run build

FROM node:lts-alpine AS PRODUCTION
# ENV NODE_ENV production
ENV PORT 5000
WORKDIR /app

COPY ./package.json /app
COPY --from=BASE /app/dist/ /app/dist/
COPY --from=BASE /app/node_modules /app/node_modules

CMD ["npm", "run", "start"]