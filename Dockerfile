# TODO bump to node 20
FROM node:18-bullseye-slim AS base
ARG APP=frontend
 
FROM base AS builder
ARG APP
WORKDIR /app
RUN npm install -g turbo
COPY . .
RUN turbo prune --scope=$APP --docker

# Add lockfile and package.json's of isolated subworkspace
FROM base AS installer
ARG APP
WORKDIR /app
 
# First install the dependencies (as they change less often)
COPY --from=builder /app/out/json/ .
COPY --from=builder /app/out/pnpm-lock.yaml ./pnpm-lock.yaml 
RUN corepack enable
RUN pnpm install --frozen-lockfile
 
# Build the project
COPY --from=builder /app/out/full/ .
RUN pnpm turbo run build --filter=$APP...

FROM base AS runner-backend
ARG APP
WORKDIR /app
 
# Don't run production as root
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs
USER nextjs
 
# TODO use production deps only
COPY --from=installer /app/node_modules ./node_modules
COPY --from=installer /app/apps/$APP/node_modules ./apps/$APP/node_modules
COPY --from=installer /app/apps/$APP/package.json .
COPY --from=installer --chown=nextjs:nodejs /app/apps/$APP/dist ./apps/$APP
 
ENV BIN "apps/$APP/index.js"
CMD ["sh", "-c", "node $BIN"]

FROM base AS runner-frontend
ARG APP
WORKDIR /app
 
# Don't run production as root
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs
USER nextjs
 
COPY --from=installer /app/apps/$APP/next.config.js .
COPY --from=installer /app/apps/$APP/package.json .
 
# Automatically leverage output traces to reduce image size
# https://nextjs.org/docs/advanced-features/output-file-tracing
COPY --from=installer --chown=nextjs:nodejs /app/apps/$APP/.next/standalone ./
COPY --from=installer --chown=nextjs:nodejs /app/apps/$APP/.next/static ./apps/$APP/.next/static
COPY --from=installer --chown=nextjs:nodejs /app/apps/$APP/public ./apps/$APP/public
 
ENV BIN "apps/$APP/server.js"
CMD ["sh", "-c", "node $BIN"]
