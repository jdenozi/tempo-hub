# ── Stage 1: Install dependencies ──
FROM node:20-alpine AS deps
WORKDIR /app
COPY package.json ./
COPY tempo-core/package.json ./tempo-core/
RUN npm install --ignore-scripts && npm rebuild

# ── Stage 2: Build ──
FROM node:20-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY --from=deps /app/package-lock.json ./package-lock.json
COPY tempo-core/ ./tempo-core/
COPY nuxt.config.ts app.config.ts tailwind.config.ts content.config.ts tsconfig.json package.json ./
COPY content/ ./content/
COPY locales/ ./locales/
COPY public/ ./public/
COPY components/ ./components/
COPY assets/ ./assets/
COPY layouts/ ./layouts/
COPY pages/ ./pages/
COPY server/ ./server/
COPY composables/ ./composables/
COPY .env ./
RUN npx nuxt prepare && npm run build

# ── Stage 3: Production ──
FROM node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NITRO_PORT=3000
ENV NITRO_HOST=0.0.0.0

RUN addgroup --system --gid 1001 nuxt \
    && adduser --system --uid 1001 nuxt

COPY --from=builder --chown=nuxt:nuxt /app/.output ./.output

USER nuxt
EXPOSE 3000

CMD ["node", ".output/server/index.mjs"]
