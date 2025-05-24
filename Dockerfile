# Этап 1: сборка приложения
FROM node:20-alpine AS builder

WORKDIR /app

# Устанавливаем openssl1.1-compat (если Prisma этого требует)
RUN apk add --no-cache openssl1.1-compat

COPY package*.json ./
RUN npm install --legacy-peer-deps

COPY . .
RUN npx prisma generate
RUN npm run build

# Этап 2: production
FROM node:20-alpine AS production

WORKDIR /app

# Устанавливаем openssl1.1-compat, если нужно
RUN apk add --no-cache openssl1.1-compat

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
