FROM node:18-alpine AS base
RUN npm install -g pnpm

FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

# Copy workspace files and package.json files for dependency resolution
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml babel.config.cjs tsconfig.base.json ./
COPY packages/eds-demo/package.json ./packages/eds-demo/
COPY packages/eds-tokens/package.json ./packages/eds-tokens/
COPY packages/eds-tokens-build/package.json ./packages/eds-tokens-build/
COPY packages/eds-tokens-sync/package.json ./packages/eds-tokens-sync/

# Install all dependencies
RUN pnpm install --no-frozen-lockfile

FROM base AS builder
WORKDIR /app

# Copy everything from deps and source code
COPY --from=deps /app ./
COPY packages/ ./packages/

# Build dependencies and the demo app
RUN pnpm --filter @equinor/eds-tokens-sync run build && \
    pnpm --filter @equinor/eds-tokens-build run build && \
    pnpm --filter @equinor/eds-tokens run build && \
    pnpm --filter eds-demo run build

FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production PORT=3000

RUN addgroup -S nextjs && \
    adduser -S --uid 12345 nextjs && \
    apk add --no-cache tini && \
    npm install -g pnpm

# Copy the built workspace
COPY --from=builder --chown=nextjs:nextjs /app ./

USER nextjs
EXPOSE 3000

ENTRYPOINT ["/sbin/tini", "--"]
WORKDIR /app/packages/eds-demo
CMD ["pnpm", "start"]