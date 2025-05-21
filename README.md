# Executive Onboard

Executive Onboard - это веб-приложение для отслеживания прогресса и управления задачами.

## Технологии

- React + TypeScript
- Vite
- Tailwind CSS
- Radix UI
- Express.js
- Drizzle ORM
- Neon Database

## Установка

1. Клонируйте репозиторий:

```bash
git clone https://github.com/yourusername/executive-onboard.git
cd executive-onboard
```

2. Установите зависимости:

```bash
npm install
```

3. Создайте файл `.env` в корневой директории и добавьте необходимые переменные окружения:

```env
DATABASE_URL=your_database_url
SESSION_SECRET=your_session_secret
```

4. Запустите миграции базы данных:

```bash
npm run db:push
```

## Разработка

Для запуска в режиме разработки:

```bash
npm run dev
```

Приложение будет доступно по адресу `http://localhost:5173`

## Сборка

Для сборки проекта:

```bash
npm run build
```

## Деплой

Проект настроен для деплоя на Railway. При пуше в ветку `main` происходит автоматический деплой.

## Структура проекта

```
├── client/             # Клиентская часть (React)
│   ├── src/           # Исходный код
│   └── public/        # Статические файлы
├── server/            # Серверная часть (Express)
├── shared/            # Общие типы и утилиты
└── dist/              # Собранные файлы
```

## Лицензия

MIT
