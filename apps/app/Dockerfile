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
# Using @qco/app as the target workspace
RUN turbo prune @qco/app --docker

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
ARG NEXT_PUBLIC_WEB_APP_URL
ENV NEXT_PUBLIC_WEB_APP_URL=$NEXT_PUBLIC_WEB_APP_URL
ENV CI=true
RUN bun turbo run build --filter=@qco/app

FROM base AS runner
WORKDIR /app

# Don't run production as root
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs
USER nextjs

# Automatically leverage output traces to reduce image size
# https://nextjs.org/docs/advanced-features/output-file-tracing
COPY --from=installer --chown=nextjs:nodejs /app/apps/app/.next/standalone ./
COPY --from=installer --chown=nextjs:nodejs /app/apps/app/.next/static ./apps/app/.next/static
COPY --from=installer --chown=nextjs:nodejs /app/apps/app/public ./apps/app/public

# Expose port
EXPOSE 3000

# Use node to run the server
CMD ["node", "apps/app/server.js"]