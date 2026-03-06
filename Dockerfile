# ─────────────────────────────────────────────────────────────────────────────
# StableBridge Web — Multi-stage Dockerfile for Next.js standalone apps
#
# Usage:
#   docker build --build-arg APP_NAME=merchant-portal -t stablebridge/merchant-portal .
#   docker build --build-arg APP_NAME=admin-portal -t stablebridge/admin-portal .
# ─────────────────────────────────────────────────────────────────────────────

# ── Stage 1: Install dependencies ──────────────────────────────────────────
FROM node:24-alpine AS deps
RUN corepack enable && corepack prepare pnpm@10.11.0 --activate
WORKDIR /app

COPY pnpm-lock.yaml pnpm-workspace.yaml package.json .npmrc ./
COPY apps/merchant-portal/package.json ./apps/merchant-portal/
COPY apps/admin-portal/package.json ./apps/admin-portal/
COPY packages/@stablebridge/api-client/package.json ./packages/@stablebridge/api-client/
COPY packages/@stablebridge/auth/package.json ./packages/@stablebridge/auth/
COPY packages/@stablebridge/testing/package.json ./packages/@stablebridge/testing/
COPY packages/@stablebridge/types/package.json ./packages/@stablebridge/types/
COPY packages/@stablebridge/ui/package.json ./packages/@stablebridge/ui/
COPY packages/@stablebridge/utils/package.json ./packages/@stablebridge/utils/

RUN pnpm install --frozen-lockfile

# ── Stage 2: Build the app ─────────────────────────────────────────────────
FROM node:24-alpine AS builder
ARG APP_NAME=merchant-portal
RUN corepack enable && corepack prepare pnpm@10.11.0 --activate
WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules
COPY --from=deps /app/apps/merchant-portal/node_modules ./apps/merchant-portal/node_modules
COPY --from=deps /app/apps/admin-portal/node_modules ./apps/admin-portal/node_modules
COPY --from=deps /app/packages/@stablebridge/api-client/node_modules ./packages/@stablebridge/api-client/node_modules
COPY --from=deps /app/packages/@stablebridge/auth/node_modules ./packages/@stablebridge/auth/node_modules
COPY --from=deps /app/packages/@stablebridge/testing/node_modules ./packages/@stablebridge/testing/node_modules
COPY --from=deps /app/packages/@stablebridge/types/node_modules ./packages/@stablebridge/types/node_modules
COPY --from=deps /app/packages/@stablebridge/ui/node_modules ./packages/@stablebridge/ui/node_modules
COPY --from=deps /app/packages/@stablebridge/utils/node_modules ./packages/@stablebridge/utils/node_modules
COPY . .

RUN pnpm turbo build --filter=${APP_NAME}

# ── Stage 3: Production runner ─────────────────────────────────────────────
FROM node:24-alpine AS runner
ARG APP_NAME=merchant-portal
ENV NODE_ENV=production
WORKDIR /app

RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nextjs

COPY --from=builder --chown=nextjs:nodejs /app/apps/${APP_NAME}/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/apps/${APP_NAME}/.next/static ./apps/${APP_NAME}/.next/static
COPY --from=builder --chown=nextjs:nodejs /app/apps/${APP_NAME}/public* ./public/

USER nextjs
EXPOSE 3000
ENV HOSTNAME="0.0.0.0"
ENV PORT=3000
ENV APP_NAME=${APP_NAME}

CMD node apps/${APP_NAME}/server.js
