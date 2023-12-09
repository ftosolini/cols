FROM node:20.9-alpine as build
WORKDIR /app
COPY *.json ./
RUN yarn install --frozen-lockfile
COPY ./src ./
RUN yarn run build

FROM node:20.9-alpine as runner
WORKDIR /app
COPY --from=build /app/dist ./dist
COPY --from=build /app/package*.json ./
RUN yarn install --frozen-lockfile --production
CMD yarn start:prod
