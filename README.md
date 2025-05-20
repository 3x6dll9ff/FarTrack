# Executive Onboard

Приложение для отслеживания и управления достижениями в Farcaster.

## Технологии

- React 18
- TypeScript
- Vite
- Tailwind CSS
- Radix UI
- React Query
- Framer Motion
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

3. Создайте файл `.env` в корневой директории:

```env
VITE_WARPCAST_API_KEY=your_api_key_here
```

4. Запустите сервер разработки:

```bash
npm run dev
```

## Структура проекта

```
client/
  ├── src/
  │   ├── api/        # API клиенты
  │   ├── components/ # React компоненты
  │   ├── hooks/      # React хуки
  │   ├── lib/        # Утилиты и конфигурация
  │   └── pages/      # Страницы приложения
  └── index.html
server/
  ├── index.ts        # Точка входа сервера
  └── routes/         # API маршруты
shared/
  └── schema/         # Общие типы и схемы
```

## Разработка

- `npm run dev` - запуск сервера разработки
- `npm run build` - сборка проекта
- `npm run start` - запуск production сборки
- `npm run check` - проверка типов TypeScript
- `npm run db:push` - обновление схемы базы данных

## Лицензия

MIT
