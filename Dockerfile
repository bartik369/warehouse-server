# Этап 1: сборка приложения
FROM node:20-alpine AS builder

WORKDIR /app

# Установка зависимостей, необходимых для Prisma и сборки
RUN apk add --no-cache openssl1.1-compat

COPY package*.json ./

# Установка npm-зависимостей
RUN npm install --legacy-peer-deps --fetch-retries=5 --fetch-retry-maxtimeout=60000 --verbose

COPY . .

# Генерация Prisma-клиента
RUN npx prisma generate

# Сборка TypeScript/приложения
RUN npm run build

# Этап 2: production-образ
FROM node:20-alpine AS production

WORKDIR /app

# Установка openssl для запуска приложения (если нужно)
RUN apk add --no-cache openssl1.1-compat

# Копирование нужных файлов из builder
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma
COPY --from=builder /app/node_modules/@prisma ./node_modules/@prisma
COPY --from=builder /app/prisma ./prisma

ENV NODE_ENV=production

EXPOSE 5000

CMD ["node", "dist/src/main.js"]


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
