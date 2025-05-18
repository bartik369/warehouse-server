# Этап 1: сборка приложения
FROM node:18-alpine AS builder

WORKDIR /app

# Установка зависимостей
COPY package*.json ./
RUN npm install

# Копируем исходники
COPY . .

# Компилируем TypeScript → JavaScript
RUN npm run build

# Этап 2: production-контейнер
FROM node:18-alpine

WORKDIR /app

# Устанавливаем только production-зависимости
COPY package*.json ./
RUN npm install --only=production

# Копируем собранный код и необходимые папки
COPY --from=builder /app/dist ./dist
COPY prisma ./prisma

# Настройка переменных окружения (лучше .env передавать на сервер и монтировать в compose)
ENV NODE_ENV=production

# Открываем порт
EXPOSE 5000

# Prisma миграции можно выполнить отдельно или через entrypoint
CMD ["node", "dist/main.js"]
