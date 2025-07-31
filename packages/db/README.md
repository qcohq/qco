# Database Package

Этот пакет предоставляет унифицированный интерфейс для работы с базой данных, поддерживающий два режима:

## Режимы базы данных

### 1. NeonDB (по умолчанию)
Используется для serverless окружений (Vercel, Netlify и т.д.)

### 2. Self-hosted PostgreSQL
Используется для локальной разработки или собственных серверов

## Конфигурация

### Переменные окружения

- `POSTGRES_URL` - строка подключения к базе данных (обязательная)
- `DATABASE_TYPE` - тип базы данных: `"neon"` или `"postgres"` (по умолчанию: `"neon"`)

### Примеры конфигурации

#### NeonDB
```bash
DATABASE_TYPE=neon
POSTGRES_URL=postgresql://user:pass@host:6543/db
```

#### Self-hosted PostgreSQL
```bash
DATABASE_TYPE=postgres
POSTGRES_URL=postgresql://user:pass@localhost:5432/db
```

## Использование

### Основной клиент (HTTP)
```typescript
import { db } from "@qco/db/client";

// Используется для большинства операций
const users = await db.select().from(users);
```

### WebSocket клиент (Pool)
```typescript
import { db } from "@qco/db/client-ws";

// Используется для операций, требующих постоянного соединения
const result = await db.transaction(async (tx) => {
  // транзакции
});
```

## Автоматическое переключение

Система автоматически выбирает правильный драйвер на основе `DATABASE_TYPE`:

- `neon` → использует `@neondatabase/serverless`
- `postgres` → использует `pg` (node-postgres)

## Миграции

Для работы с миграциями используйте стандартные команды Drizzle:

```bash
# Применить миграции
bun run push

# Открыть Drizzle Studio
bun run studio
```

## Обратная совместимость

Если `DATABASE_TYPE` не указан, система по умолчанию использует NeonDB, что обеспечивает обратную совместимость с существующим кодом. 