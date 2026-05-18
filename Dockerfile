# ── Stage 1: Build frontend ──────────────────────────────────────────────────
FROM node:20-alpine AS frontend-build

WORKDIR /app/FRONTEND

COPY FRONTEND/package.json FRONTEND/package-lock.json* ./
RUN npm ci

COPY FRONTEND/ ./
RUN npm run build

# ── Stage 2: Production backend + static assets ──────────────────────────────
FROM node:20-alpine AS production

WORKDIR /app/BACKEND

RUN apk add --no-cache wget

ENV NODE_ENV=production
ENV SERVE_FRONTEND=true

COPY BACKEND/package.json BACKEND/package-lock.json* ./
RUN npm ci --omit=dev

COPY BACKEND/ ./
COPY --from=frontend-build /app/FRONTEND/dist/public /app/FRONTEND/dist/public

EXPOSE 3000

HEALTHCHECK --interval=30s --timeout=5s --start-period=15s --retries=3 \
  CMD wget -qO- http://127.0.0.1:3000/api/health || exit 1

CMD ["node", "server.js"]
