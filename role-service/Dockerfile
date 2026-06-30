# -------- BUILD STAGE --------
FROM public.ecr.aws/docker/library/node:20-alpine AS builder

WORKDIR /app

# Install native build dependencies
RUN apk add --no-cache python3 make g++

# Copy package files
COPY package*.json .npmrc* ./

# Install all dependencies
RUN npm install --include=dev --legacy-peer-deps

# Copy source code
COPY . .

# Build TypeScript
RUN npm run build

# -------- PRODUCTION STAGE --------
FROM public.ecr.aws/docker/library/node:20-alpine

WORKDIR /app

# Production environment
ENV NODE_ENV=production

# Copy package files
COPY package*.json .npmrc* ./

# Install production dependencies only
RUN npm install --omit=dev --legacy-peer-deps --no-audit --no-fund && rm -f .npmrc

# Copy compiled app
COPY --from=builder /app/dist ./dist

# Copy config folder if exists
COPY --from=builder /app/config ./config

# Copy migrations folder if exists
COPY --from=builder /app/migrations ./migrations

# Run as non-root user
USER node

# Expose service port
EXPOSE 3016

# Healthcheck
HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
CMD node -e "require('http').get('http://localhost:3016/health',(res)=>process.exit(res.statusCode===200?0:1)).on('error',()=>process.exit(1))"

# Start app
CMD ["sh", "-c", "npx sequelize-cli db:migrate && node dist/server.js"]


