FROM node:22.14.0-bullseye AS build-web

WORKDIR /app

ENV NODE_OPTIONS="--max-old-space-size=4096"

# Install OpenJDK 17 JRE for openapi-generator-cli
RUN apt-get update && \
    apt-get install -y openjdk-17-jre && \
    rm -rf /var/lib/apt/lists/*

COPY . .
RUN yarn
RUN yarn update:schema
RUN yarn build:web-readonly

FROM nginx:1.27.4-alpine AS release
COPY --from=build-web /app/.vite/renderer /usr/share/nginx/html

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
