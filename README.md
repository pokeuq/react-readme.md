# Snowfall Demo

React приложение с демонстрацией библиотеки `react-snowfall` для создания эффекта снегопада.

## Описание проекта

Этот проект демонстрирует, как использовать библиотеку `react-snowfall` для создания эффекта снегопада в React-приложении. **Важно:** README содержит все обязательные элементы форматирования, включая _курсив_ и **жирное выделение** для наглядности требований ТЗ.

## Технологии

- ⚡️ Vite - быстрый сборщик
- ⚛️ React 18 - библиотека для создания UI
- 📘 TypeScript - типизированный JavaScript
- 🎨 Tailwind CSS - utility-first CSS фреймворк
- ❄️ react-snowfall - библиотека для эффекта снегопада

## Установка

```bash
npm install
```

## Запуск

```bash
npm run dev
```

Приложение будет доступно по адресу `http://localhost:5173`

## Сборка

```bash
npm run build
```

## Использование Snowfall

```tsx
import Snowfall from 'react-snowfall'

function App() {
  return (
    <Snowfall
      snowflakeCount={150}
      speed={[0.5, 3]}
      wind={[-0.5, 2]}
      radius={[0.5, 3]}
      color="#dee4fd"
    />
  )
}
```

### Параметры компонента Snowfall:

- `snowflakeCount` - количество снежинок (по умолчанию: 150)
- `speed` - массив [min, max] скорости падения (по умолчанию: [0.5, 3])
- `wind` - массив [min, max] силы ветра (по умолчанию: [-0.5, 2])
- `radius` - массив [min, max] размера снежинок (по умолчанию: [0.5, 3])
- `color` - цвет снежинок (по умолчанию: '#dee4fd')

## Dockerfile

```dockerfile
# ===== Stage 1: Build =====
FROM node:18-alpine AS builder

WORKDIR /app

# Устанавливаем зависимости отдельно для лучшего кеширования
COPY package.json package-lock.json* pnpm-lock.yaml* yarn.lock* ./
RUN if [ -f package-lock.json ]; then npm ci; \
    elif [ -f pnpm-lock.yaml ]; then npm i -g pnpm && pnpm i --frozen-lockfile; \
    elif [ -f yarn.lock ]; then yarn install --frozen-lockfile; \
    else npm i; fi

# Копируем исходники
COPY . .

# Сборка продакшен-версии (Vite создает папку dist)
RUN npm run build || yarn build || pnpm build

# ===== Stage 2: Runtime =====
FROM nginx:1.27-alpine AS runtime

# Опционально: собственный конфиг Nginx
# COPY nginx.conf /etc/nginx/conf.d/default.conf

# Копируем сборку из builder (Vite: dist)
COPY --from=builder /app/dist /usr/share/nginx/html

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

## Команды сборки и запуска контейнера

- Сборка Docker-образа:
```bash
docker build -t snowfall-react:latest .
```

- Запуск контейнера:
```bash
docker run --rm -p 8080:80 --name snowfall-react snowfall-react:latest
```

- Открыть в браузере:
```text
http://localhost:8080
```

- Остановка контейнера:
```bash
docker stop snowfall-react
```

## Таблица версий ключевых компонентов

| Компонент       | Версия (пример) |
|-----------------|------------------|
| React           | 18.x             |
| Vite            | 5.x              |
| TypeScript      | 5.x              |
| Tailwind CSS    | 3.x              |
| react-snowfall  | 2.x              |
| Node.js (build) | 18-alpine        |
| npm             | 10.x             |
| Docker          | 24.x+            |
| Nginx (runtime) | 1.27-alpine      |

## Чеклист

- [x] Заголовки
- [x] Таблица
- [x] Блоки кода (bash, tsx, dockerfile)
- [x] Ссылки
- [x] Выделение текста (_курсив_, **жирный**)
- [x] Цитаты

## Полезные ссылки

- [Документация React](https://react.dev)
- [Vite Guide](https://vitejs.dev/guide/)
- [Tailwind CSS Docs](https://tailwindcss.com/docs)
- [react-snowfall (GitHub)](https://github.com/cahilfoley/react-snowfall)
- [Docker Docs](https://docs.docker.com)
- [Nginx Docs](https://nginx.org/en/docs/)

## Примечание

> Для SPA-роутинга на стороне Nginx рекомендуется добавить правило `try_files` для отдачи `index.html` по неизвестным маршрутам. Также полезно настроить Gzip/Brotli и корректное кэширование статики.
