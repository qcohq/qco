FROM node:22-alpine AS base

FROM base AS builder
RUN apk update
RUN apk add --no-cache libc6-compat
# Install bun
RUN npm install -g bun
# Set working directory
WORKDIR /app
# Install turbo globally
RUN npm install -g turbo@^2.5.5
COPY . .

# Generate a partial monorepo with a pruned lockfile for a target workspace.
# Using @qco/web as the target workspace
RUN turbo prune @qco/web --docker

# Add lockfile and package.json's of isolated subworkspace
FROM base AS installer
RUN apk update
RUN apk add --no-cache libc6-compat
# Install bun
RUN npm install -g bun
WORKDIR /app

# First install the dependencies (as they change less often)
COPY --from=builder /app/out/json/ .
COPY --from=builder /app/bun.lock .
RUN bun install

# Build the project
COPY --from=builder /app/out/full/ .
ARG POSTGRES_URL
ENV POSTGRES_URL=$POSTGRES_URL
ENV CI=true
ENV NEXT_PUBLIC_VAPID_PUBLIC_KEY=BDkvXMUbfIzQUvVMhKfFfw4C_dpbGDx0VtRKQ8HU_Lhn-tFSkbrOGh1ubPtq7zd2Pu_hhRRq3R7Cv4BD3B34VnQ
ENV NEXT_PUBLIC_APP_URL=https://eleganter.shop
RUN bun turbo run build --filter=@qco/web

FROM base AS runner
WORKDIR /app

# Don't run production as root
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs
USER nextjs

# Automatically leverage output traces to reduce image size
# https://nextjs.org/docs/advanced-features/output-file-tracing
COPY --from=installer --chown=nextjs:nodejs /app/apps/web/.next/standalone ./
COPY --from=installer --chown=nextjs:nodejs /app/apps/web/.next/static ./apps/web/.next/static
COPY --from=installer --chown=nextjs:nodejs /app/apps/web/public ./apps/web/public

# Expose port
EXPOSE 3000

# Use node to run the server
CMD ["node", "apps/web/server.js"]