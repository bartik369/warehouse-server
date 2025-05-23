# Этап 1: сборка приложения

FROM node:20-alpine3.17 AS builder

WORKDIR /app

# Используем openssl 1.1 (важно для Prisma)

RUN echo "https://mirror.yandex.ru/mirrors/alpine/v3.17/main/" > /etc/apk/repositories \
&& echo "https://mirror.yandex.ru/mirrors/alpine/v3.17/community/" >> /etc/apk/repositories \
&& apk update \
&& apk add --no-cache openssl1.1-compat

COPY package*.json ./

RUN npm install --legacy-peer-deps --fetch-retries=5 --fetch-retry-maxtimeout=60000 --verbose

COPY . .

RUN npx prisma generate

RUN npm run build

# Этап 2: production-контейнер

FROM node:20-alpine3.17

WORKDIR /app

# Устанавливаем runtime openssl 1.1

RUN echo "https://mirror.yandex.ru/mirrors/alpine/v3.17/main/" > /etc/apk/repositories \
&& echo "https://mirror.yandex.ru/mirrors/alpine/v3.17/community/" >> /etc/apk/repositories \
&& apk update \
&& apk add --no-cache openssl1.1-compat

COPY --from=builder /app/node_modules ./node_modules

COPY --from=builder /app/dist ./dist

# Копируем сгенерированные бинарники Prisma (важно!)

COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma

COPY prisma ./prisma

ENV NODE_ENV=production

EXPOSE 5000

CMD ["node", "dist/src/main.js"]