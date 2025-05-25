FROM node:20-alpine3.17 AS builder

WORKDIR /app

RUN apk update && apk add --no-cache \
    openssl \
    openssl-dev \
    ca-certificates \
    libc6-compat

COPY package*.json ./
RUN npm install --legacy-peer-deps
COPY . .
RUN npx prisma generate
RUN npm run build

FROM node:20-alpine3.17 AS production

WORKDIR /app

RUN apk update && apk add --no-cache \
    openssl \
    openssl-dev \
    ca-certificates \
    libc6-compat

COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma
COPY --from=builder /app/node_modules/@prisma/client ./node_modules/@prisma/client
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/prisma ./prisma

COPY --from=builder /app/uploads ./uploads
RUN ln -s /app/uploads /uploads

ENV NODE_ENV=production
EXPOSE 5000

CMD ["sh", "-c", "npx prisma migrate deploy || npx prisma db push --accept-data-loss && node dist/src/main.js"]