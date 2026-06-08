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

# --- Stage 3: Production Release Runtime ---
FROM node:20-alpine
WORKDIR /app

ENV NODE_ENV=production
ENV PORT=8080

COPY package*.json ./
RUN npm ci --only=production --no-audit

# Copy built backend and frontend
COPY --from=backend-builder /app/dist /app/dist
COPY --from=frontend-builder /app/dist /app/dist

# Expose server port
EXPOSE 8080

# Run with non-root security privileges for best practices
USER node

CMD ["node", "dist/server/index.js"]
