# Bitcoin Checker

Приложение для отслеживания цен Bitcoin с использованием исторических данных Binance API.

## Архитектура

Проект состоит из трёх основных компонентов:

- **Frontend** (Nuxt 3) - веб-интерфейс для отображения графиков цен
- **Backend** (Node.js + Express) - API для получения данных из базы
- **Scraper** (Node.js) - сервис для импорта исторических данных с Binance
- **Database** (PostgreSQL) - хранение цен Bitcoin

## Требования

- Docker и Docker Compose
- Node.js 18+ (для локальной разработки)

## Быстрый старт

### 1. Клонирование репозитория

```bash
git clone <repository-url>
cd Bitcoin_checker
```

### 2. Сборка и запуск с Docker

```bash
# Сборка образов
docker-compose build

# Запуск всех сервисов
docker-compose up -d
```

### 3. Инициализация базы данных

После запуска контейнеров необходимо создать таблицу для хранения цен:

```bash
# Подключение к контейнеру с базой данных
docker-compose exec db psql -U postgres -d postgres

# Создание таблицы (выполнить в psql)
CREATE TABLE prices (
    id SERIAL PRIMARY KEY,
    timestamp TIMESTAMP NOT NULL UNIQUE,
    open_price DECIMAL(15,2) NOT NULL,
    high_price DECIMAL(15,2) NOT NULL,
    low_price DECIMAL(15,2) NOT NULL,
    close_price DECIMAL(15,2) NOT NULL
);

# Выход из psql
\q
```

**Альтернативно:** Таблица `prices` уже есть, и её можно импортировать `prices_table.csv`

### 4. Импорт исторических данных

Для загрузки данных за последний год выполните:

```bash
# Запуск импорта исторических данных
docker-compose exec importer npm run makeHistory
```

Этот скрипт загрузит дневные данные Bitcoin за последний год с Binance API. Если таблица `prices` не существует, она будет создана автоматически.

## Доступ к сервисам

После успешного запуска:

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:3001
- **Database**: localhost:5432 (postgres/postgres, без пароля)

## API Endpoints

### GET /prices

Получение цен Bitcoin

**Параметры:**

- `from` (опционально) - начальная дата в формате YYYY-MM-DD
- `to` (опционально) - конечная дата в формате YYYY-MM-DD

**Примеры:**

```bash
# Последние 100 записей
curl http://localhost:3001/prices

# Данные за период
curl "http://localhost:3001/prices?from=2024-01-01&to=2024-12-31"
```

## Управление контейнерами

```bash
# Просмотр логов
docker-compose logs -f

# Остановка всех сервисов
docker-compose down

# Перезапуск с пересборкой
docker-compose up --build

# Просмотр статуса контейнеров
docker-compose ps
```

## Разработка

### Локальная разработка без Docker

1. Установите PostgreSQL локально
2. Создайте базу данных и таблицу prices
3. Обновите настройки подключения в backend/index.js и scraper/importHistory.js
4. Установите зависимости:
   ```bash
   cd backend && npm install
   cd ../scraper && npm install
   cd ../frontend && npm install
   ```
5. Запустите сервисы:

   ```bash
   # Backend
   cd backend && npm start

   # Scraper (для импорта данных)
   cd scraper && npm run makeHistory

   # Frontend
   cd frontend && npm run dev
   ```

## Структура проекта

```
Bitcoin_checker/
├── backend/          # Node.js API сервер
├── frontend/         # Nuxt 3 веб-приложение
├── scraper/          # Сервис импорта данных
├── docker-compose.yml
└── README.md
```

## Устранение неполадок

### Backend не подключается к базе данных

- Убедитесь, что контейнер db запущен: `docker-compose ps`
- Проверьте логи: `docker-compose logs backend`

### Ошибка "database does not exist"

- Создайте таблицу prices согласно инструкции выше

### Проблемы с импортом данных

- Проверьте подключение к интернету
- Убедитесь, что таблица prices создана
- Проверьте логи importer: `docker-compose logs importer`

## Лицензия

MIT
