FROM node:12 as builder
WORKDIR /app

# install pnpm
RUN npm install -g pnpm

COPY ./package.yaml ./
COPY ./pnpm-workspaces.yaml ./
COPY ./.npmrc ./

# copy libraries
WORKDIR /app/libraries
COPY ./libraries/tokens ./tokens
COPY ./libraries/core-react ./core-react
COPY ./libraries/icons ./icons

# copy storefront
WORKDIR /app/apps
COPY ./apps/storefront ./storefront

# build storefront and dependencies
WORKDIR /app
RUN pnpm --filter ./libraries/tokens install && \
  pnpm --filter ./libraries/tokens run build

RUN pnpm --filter ./libraries/core-react install && \
  pnpm --filter ./libraries/core-react run build:for-storybook

RUN pnpm --filter ./apps/storefront install

# build storefront
ARG GATSBY_STAGE
RUN pnpm --filter ./apps/storefront run build
RUN mv ./apps/storefront/public ./storefront

# host
FROM nginx:1.15.8-alpine
WORKDIR /app
COPY --from=builder ./app/storefront /app
COPY ./apps/storefront/nginx.conf /etc/nginx/conf.d/default.conf
