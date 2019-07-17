FROM node:12-alpine as builder
WORKDIR /app

# install pacakges
COPY package*.yaml ./
RUN curl -sL https://unpkg.com/@pnpm/self-installer | node<Paste>
RUN pnpm install

# build
COPY . .
RUN pnpm run build

# host
FROM nginx:1.15.8-alpine
WORKDIR /app
COPY --from=builder /app/public /app
COPY nginx.conf /etc/nginx/conf.d/default.conf
