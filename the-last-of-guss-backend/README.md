# The Last of Guss — Backend

## Установка и запуск

```bash
npm install
npx prisma migrate dev --name init
npm run build
npm run start
```

## Переменные в .env

```
DATABASE_URL=postgresql://user:password@localhost:5432/guss
JWT_SECRET=supersecret
ROUND_DURATION=60
COOLDOWN_DURATION=30
```

## Стек

- Fastify
- Prisma + PostgreSQL
- JWT аутентификация
