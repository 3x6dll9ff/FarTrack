# Этап сборки
FROM node:20-slim AS builder

WORKDIR /app

# Устанавливаем необходимые системные зависимости
RUN apt-get update && apt-get install -y \
    python3 \
    make \
    g++ \
    curl \
    && rm -rf /var/lib/apt/lists/*

# Копируем файлы для установки зависимостей
COPY package.json package-lock.json .npmrc ./
RUN npm install

# Копируем исходный код
COPY . .

# Собираем приложение
RUN npm run build

# Этап запуска
FROM node:20-slim

WORKDIR /app

# Устанавливаем curl для health check
RUN apt-get update && apt-get install -y curl && rm -rf /var/lib/apt/lists/*

# Копируем только необходимые файлы
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/package.json ./
COPY --from=builder /app/package-lock.json ./
COPY --from=builder /app/.npmrc ./

# Устанавливаем только production зависимости
RUN npm ci --only=production --ignore-scripts

# Устанавливаем переменные окружения
ENV NODE_ENV=production
ENV PORT=3000
ENV RAILWAY_HEALTHCHECK_PATH=/health

# Открываем порт
EXPOSE 3000

# Добавляем health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=30s --retries=3 \
    CMD curl -f http://localhost:${PORT}/health || exit 1

# Запускаем приложение
CMD ["node", "dist/server.js"] 