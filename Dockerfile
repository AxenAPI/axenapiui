FROM nexus-common.ru-central1.internal:5000/base/node:22.3.0 AS build-web

WORKDIR /app
COPY . .
RUN yarn
RUN yarn build:prod

FROM nexus-common.ru-central1.internal:5000/base/nginx:1.27.4 AS release
COPY --from=build-web /app/dist /usr/share/nginx/html

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
