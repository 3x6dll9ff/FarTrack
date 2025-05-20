FROM node:20-alpine

WORKDIR /app

# Копируем файлы конфигурации
COPY package.json .npmrc ./
COPY package-lock.json ./

# Устанавливаем зависимости
RUN npm install --force

# Копируем исходный код
COPY . .

# Собираем приложение
RUN npm run build

# Запускаем приложение
CMD ["npm", "start"] 