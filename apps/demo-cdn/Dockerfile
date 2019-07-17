FROM node:11-alpine as builder
WORKDIR /app

# install packges
COPY package*.yaml ./
RUN apk add --update \
    curl \
    && rm -rf /var/cache/apk/*
RUN curl -sL https://unpkg.com/@pnpm/self-installer | node
RUN pnpm install --frozen-lockfile

# build
COPY . .
RUN pnpm run build

# host
FROM nginx:1.15.8-alpine
WORKDIR /app
COPY --from=builder /app/dist/cdn /app
COPY nginx.conf /etc/nginx/conf.d/default.conf
