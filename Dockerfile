FROM node:20-alpine AS builder

WORKDIR /app

COPY server/package.json server/package-lock.json* ./server/
COPY client/package.json client/package-lock.json* ./client/
COPY package.json package-lock.json* ./

RUN npm ci

COPY server/ ./server/
COPY client/ ./client/

RUN npm run build

FROM node:20-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production

COPY --from=builder /app/server/dist ./server/dist
COPY --from=builder /app/server/package.json ./server/
COPY --from=builder /app/client/dist ./client/dist

RUN npm ci --omit=dev --prefix server

EXPOSE 5000

CMD ["node", "server/dist/index.js"]
