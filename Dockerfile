# --- Stage 1: Build Frontend Assets ---
FROM node:20-alpine AS frontend-builder
WORKDIR /app
COPY package*.json ./
RUN npm ci --no-audit
COPY . .
RUN npm run build:frontend

# --- Stage 2: Compile Backend TS ---
FROM node:20-alpine AS backend-builder
WORKDIR /app
COPY package*.json ./
RUN npm ci --no-audit
COPY . .
RUN npm run build:backend

# --- Stage 3: Production Runtime ---
FROM node:20-alpine
WORKDIR /app

ENV NODE_ENV=production
ENV PORT=8080

# Install only production dependencies
COPY package*.json ./
RUN npm ci --only=production --no-audit

# Copy compiled backend (dist/server/) from backend-builder
COPY --from=backend-builder /app/dist/server ./dist/server

# Copy compiled frontend (dist/assets, dist/index.html) from frontend-builder
COPY --from=frontend-builder /app/dist/index.html ./dist/index.html
COPY --from=frontend-builder /app/dist/assets ./dist/assets

# Ensure node user owns all app files
RUN chown -R node:node /app

EXPOSE 8080

# Run as non-root for security
USER node

CMD ["node", "dist/server/index.js"]
