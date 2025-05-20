# Этап сборки
FROM node:20-alpine AS builder

WORKDIR /app

# Копируем только файлы, необходимые для установки зависимостей
COPY package.json .npmrc ./
COPY package-lock.json ./

# Устанавливаем зависимости
RUN npm install --force

# Копируем исходный код
COPY . .

# Собираем приложение
RUN npm run build

# Этап запуска
FROM node:20-alpine

WORKDIR /app

# Копируем только необходимые файлы из этапа сборки
COPY --from=builder /app/package.json ./
COPY --from=builder /app/package-lock.json ./
COPY --from=builder /app/.npmrc ./
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules

# Запускаем приложение
CMD ["npm", "start"] 