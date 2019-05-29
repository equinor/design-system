FROM node:11-alpine as builder
WORKDIR /app

# install pacakges
RUN npm config set registry https://npm.equinor.com/
COPY package*.json ./
ARG NPM_TOKEN
RUN echo "//npm.equinor.com/:_authToken=$NPM_TOKEN" > .npmrc
RUN npm i --quiet

# build
COPY . .
ARG GATSBY_STAGE
ENV NODE_ENV=production
RUN npm run build

# host
FROM nginx:1.15.8-alpine
WORKDIR /app
COPY --from=builder /app/public /app
COPY nginx.conf /etc/nginx/conf.d/default.conf
