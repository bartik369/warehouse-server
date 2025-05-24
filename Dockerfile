# Этап 1: сборка приложения
FROM node:20-alpine3.17 AS builder

WORKDIR /app

# Устанавливаем зависимости для Prisma
RUN apk update && apk add --no-cache \
    openssl \
    openssl-dev \
    ca-certificates \
    libc6-compat \
    && ln -s /lib/libc.musl-x86_64.so.1 /lib/ld-linux-x86-64.so.2

COPY package*.json ./

RUN npm install --legacy-peer-deps --fetch-retries=5 --fetch-retry-maxtimeout=60000 --verbose

COPY . .

RUN npx prisma generate
RUN npm run build

# Этап 2: production-контейнер
FROM node:20-alpine3.17 AS production

WORKDIR /app

# Устанавливаем runtime зависимости для Prisma
RUN apk update && apk add --no-cache \
    openssl \
    openssl-dev \
    ca-certificates \
    libc6-compat \
    && ln -s /lib/libc.musl-x86_64.so.1 /lib/ld-linux-x86-64.so.2

COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma
COPY --from=builder /app/node_modules/@prisma/client ./node_modules/@prisma/client
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/prisma ./prisma

ENV NODE_ENV=production
ENV LD_LIBRARY_PATH=/lib

EXPOSE 5000

CMD ["sh", "-c", "npx prisma migrate deploy || npx prisma migrate resolve --applied init && node dist/src/main.js"]



# # Этап 1: сборка приложения
# FROM node:20-alpine3.17 AS builder

# WORKDIR /app

# # Используем зеркало Яндекса и openssl1.1 (важно для Prisma)
# RUN echo "https://mirror.yandex.ru/mirrors/alpine/v3.17/main/" > /etc/apk/repositories \
#  && echo "https://mirror.yandex.ru/mirrors/alpine/v3.17/community/" >> /etc/apk/repositories \
#  && apk update \
#  && apk add --no-cache openssl1.1-compat

# COPY package*.json ./

# # Устанавливаем зависимости
# RUN npm install --legacy-peer-deps --fetch-retries=5 --fetch-retry-maxtimeout=60000 --verbose

# # Копируем весь проект
# COPY . .

# # Генерация клиента Prisma
# RUN npx prisma generate

# # Сборка проекта
# RUN npm run build


# # Этап 2: production-контейнер
# FROM node:20-alpine3.17 AS production

# WORKDIR /app

# # Используем зеркало Яндекса и openssl1.1
# RUN echo "https://mirror.yandex.ru/mirrors/alpine/v3.17/main/" > /etc/apk/repositories \
#  && echo "https://mirror.yandex.ru/mirrors/alpine/v3.17/community/" >> /etc/apk/repositories \
#  && apk update \
#  && apk add --no-cache openssl1.1-compat

# # Копируем зависимости
# COPY --from=builder /app/node_modules ./node_modules

# # Копируем Prisma бинарники
# COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma

# # Копируем собранный код и схему
# COPY --from=builder /app/dist ./dist
# COPY --from=builder /app/prisma ./prisma

# ENV NODE_ENV=production

# EXPOSE 5000

# CMD ["node", "dist/src/main.js"]
