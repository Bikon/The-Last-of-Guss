# 🦆 The Last of Guss — Frontend

Браузерная игра, где выжившие соревнуются в скорости тапов по мутировавшему гусю G-42. Это клиентская часть на React.

---

## 🚀 Быстрый старт

### 1. Установка зависимостей

```bash
npm install
```

### 2. Запуск dev-сервера

```bash
npm run dev
```

Открой [http://localhost:5173](http://localhost:5173) в браузере.

---

## ⚙️ Конфигурация

Фронтенд ожидает, что backend работает по адресу:

```
http://localhost:3000
```

Настраивается через `vite.config.ts`:

```ts
server: {
  proxy: {
    '/api': 'http://localhost:3000'
  }
}
```

---

## 🧱 Стек технологий

- ✅ React 18 + TypeScript
- ✅ Vite
- ✅ Zustand — глобальное хранилище состояния
- ✅ Axios — API-клиент
- ✅ React Router v6 — маршрутизация

---

## 📁 Основные файлы

| Файл                       | Назначение                         |
|---------------------------|------------------------------------|
| `src/pages/LoginPage.tsx` | Страница входа                     |
| `src/pages/RoundsPage.tsx`| Список раундов                     |
| `src/pages/RoundPage.tsx` | Страница раунда и тапов            |
| `src/store/useUserStore.ts` | Хранилище пользователя             |
| `src/api/*.ts`            | Функции для общения с backend'ом   |

---

## 📸 Интерфейсы

- `/login` — вход по имени и паролю (авторизация через куки)
- `/rounds` — список активных и запланированных раундов
- `/round/:id` — игра (тапы, счёт, статус)

---

## 📦 Сборка

```bash
npm run build
```

Итоговая сборка будет в папке `dist/`.

---

## 🛠 Зависимости

```bash
npm install react react-dom react-router-dom axios zustand
npm install -D typescript vite @vitejs/plugin-react @types/react @types/react-dom
```

---

## 🧪 Поддержка

Если тебе нужно собрать backend, см. [the-last-of-guss-backend](../the-last-of-guss-backend/README.md)
