# Build stage
FROM node:18-bullseye as build

WORKDIR /app

COPY ./ ./
RUN npm install
RUN npm run build
RUN npm prune --production

# ----------------------

# Production stage
FROM node:18-alpine

WORKDIR /app

COPY --from=build /app/build build/
COPY --from=build /app/node_modules node_modules/
COPY package.json .

HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
	CMD curl -f http://localhost:3000/api/healthcheck || exit 1

CMD node build/index.js