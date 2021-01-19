FROM node:14 as builder
WORKDIR /app

# install pnpm
RUN npm install -g pnpm@latest

COPY ./package.yaml ./
COPY ./pnpm-workspaces.yaml ./
COPY ./.npmrc ./

# copy storefront
WORKDIR /app/apps
COPY ./apps/storefront ./storefront

# build storefront and dependencies
WORKDIR /app

RUN pnpm m i

# build storefront
ARG GATSBY_STAGE
RUN pnpm build:storefront

# host
FROM nginx:1.15.8-alpine
WORKDIR /app
COPY --from=builder ./app/apps/storefront/public/ .
COPY ./apps/storefront/nginx.conf /etc/nginx/conf.d/default.conf
