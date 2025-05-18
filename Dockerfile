# Этап 1: сборка приложения
FROM node:20-alpine AS builder

WORKDIR /app

# Копируем зависимости и устанавливаем
COPY package*.json ./
RUN npm install --legacy-peer-deps --fetch-retries=5 --fetch-retry-maxtimeout=60000 --verbose

# Копируем весь код
COPY . .

# Сборка TypeScript
RUN npm run build

# Этап 2: production-контейнер
FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
COPY prisma ./prisma

ENV NODE_ENV=production

EXPOSE 5000

CMD ["node", "dist/main.js"]