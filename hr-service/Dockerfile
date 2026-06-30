# # -------- BUILD STAGE --------
# FROM public.ecr.aws/docker/library/node:20-alpine AS builder

# WORKDIR /app

# # Install native build dependencies
# RUN apk add --no-cache python3 make g++

# # Copy package files
# COPY package*.json .npmrc* ./

# # Install all dependencies
# RUN npm install --include=dev --legacy-peer-deps

# # Copy source code
# COPY . .

# # Build TypeScript
# RUN npm run build

# # -------- PRODUCTION STAGE --------
# FROM public.ecr.aws/docker/library/node:20-alpine

# WORKDIR /app

# # Production environment
# ENV NODE_ENV=production

# # Copy package files
# COPY package*.json .npmrc* ./

# # Install production dependencies only
# RUN npm install --omit=dev --legacy-peer-deps --no-audit --no-fund && rm -f .npmrc

# # Copy compiled app
# COPY --from=builder /app/dist ./dist

# # Copy config folder if exists
# COPY --from=builder /app/config ./config

# # Copy migrations folder if exists
# COPY --from=builder /app/migrations ./migrations

# # Run as non-root user
# USER node

# # Expose service port
# EXPOSE 3004

# # Healthcheck
# HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
# CMD node -e "require('http').get('http://localhost:3004/health',(res)=>process.exit(res.statusCode===200?0:1)).on('error',()=>process.exit(1))"

# # Start app
# CMD ["sh", "-c", "npx sequelize-cli db:migrate && node dist/server.js"]




# -------- BUILD STAGE --------
FROM public.ecr.aws/docker/library/node:20-alpine AS builder

WORKDIR /app

# Install native build dependencies
RUN apk add --no-cache python3 make g++ build-base cairo-dev jpeg-dev pango-dev giflib-dev

# Copy package files
COPY package*.json .npmrc* ./

# Manually install canvas build dependencies globally and set NODE_PATH
RUN npm install -g node-addon-api prebuild-install
ENV NODE_PATH=/usr/local/lib/node_modules

# Install all dependencies
RUN npm install --include=dev --legacy-peer-deps

# Copy source code
COPY . .

# Build TypeScript
RUN npm run build

# Prune dev dependencies so we can copy a clean node_modules to production
RUN npm prune --omit=dev

# -------- PRODUCTION STAGE --------
FROM public.ecr.aws/docker/library/node:20-alpine

WORKDIR /app

# Production environment
ENV NODE_ENV=production

# IMPORTANT: install runtime graphics libraries for canvas
RUN apk add --no-cache cairo pango jpeg giflib pixman

# Copy package files
COPY package*.json .npmrc* ./

# Copy dependencies from builder
COPY --from=builder /app/node_modules ./node_modules

# Copy compiled app
COPY --from=builder /app/dist ./dist

# Copy config folder if exists
COPY --from=builder /app/config ./config

# Copy migrations folder if exists
COPY --from=builder /app/migrations ./migrations

USER node

EXPOSE 3004

HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
CMD node -e "require('http').get('http://localhost:3004/health',(res)=>process.exit(res.statusCode===200?0:1)).on('error',()=>process.exit(1))"

CMD ["sh", "-c", "npx sequelize-cli db:migrate && node dist/server.js"]