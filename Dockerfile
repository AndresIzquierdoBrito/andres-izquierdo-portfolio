# 1. Install all dependencies (needed for build)
FROM node:20-alpine AS development-dependencies-env
WORKDIR /app
RUN corepack enable && corepack prepare pnpm@9 --activate
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile

# 2. Install production dependencies only (for final runtime image)
FROM node:20-alpine AS production-dependencies-env
WORKDIR /app
RUN corepack enable && corepack prepare pnpm@9 --activate
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile --prod

# 3. Build the application
FROM node:20-alpine AS build-env
WORKDIR /app
RUN corepack enable && corepack prepare pnpm@9 --activate
COPY . .
COPY --from=development-dependencies-env /app/node_modules ./node_modules
RUN pnpm run build

# 4. Final production runner
FROM node:20-alpine
WORKDIR /app
ENV NODE_ENV=production

COPY package.json pnpm-lock.yaml ./
COPY --from=production-dependencies-env /app/node_modules ./node_modules
COPY --from=build-env /app/build ./build

CMD ["node_modules/.bin/react-router-serve", "./build/server/index.js"]