FROM node:18-alpine AS base

FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app
COPY package.json package-lock.json* ./
RUN npm ci

FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build

FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production \
    PORT=3000 \
    USER=nextjs \
    UID=12345

RUN addgroup -S "$USER" && \
    adduser -S --uid "$UID" "$USER" && \
    apk add --no-cache tini

COPY --from=builder --chown="$USER":"$USER" /app/.next/standalone ./
COPY --from=builder --chown="$USER":"$USER" /app/.next/static ./.next/static

USER "$UID"

EXPOSE 3000

ENTRYPOINT ["/sbin/tini", "--"]
CMD ["node", "server.js"]