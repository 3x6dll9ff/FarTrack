# Этап сборки
FROM node:20-alpine AS builder

WORKDIR /app

# Устанавливаем только необходимые системные зависимости
RUN apk add --no-cache libc6-compat

# Копируем файлы для установки зависимостей
COPY package.json package-lock.json .npmrc ./
RUN npm install --no-optional

# Копируем исходный код
COPY . .

# Собираем приложение
RUN npm run build

# Этап запуска
FROM node:20-alpine

WORKDIR /app

# Устанавливаем только необходимые системные зависимости
RUN apk add --no-cache libc6-compat

# Копируем только необходимые файлы
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/package.json ./
COPY --from=builder /app/package-lock.json ./
COPY --from=builder /app/.npmrc ./

# Устанавливаем только production зависимости
RUN npm ci --only=production --no-optional --ignore-scripts

# Устанавливаем переменные окружения
ENV NODE_ENV=production
ENV PORT=3000

# Открываем порт
EXPOSE 3000

# Запускаем приложение
CMD ["node", "dist/server.js"] 