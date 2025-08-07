# Eleganter Web App

Роскошный универмаг с поддержкой нативных мобильных приложений через Capacitor.

## 🚀 Быстрый старт

### Установка зависимостей
```bash
cd apps/web
bun install
```

### Разработка
```bash
bun run dev
```

### Сборка
```bash
bun run build
```

## 📱 Нативные приложения

Проект поддерживает создание нативных iOS и Android приложений через Capacitor.

### Быстрая установка Capacitor

**Windows:**
```powershell
bun run cap:setup:win
```

**macOS/Linux:**
```bash
bun run cap:setup
```

### Добавление платформ
```bash
# iOS
bun add @capacitor/ios
bunx cap add ios

# Android
bun add @capacitor/android
bunx cap add android
```

### Запуск нативных приложений
```bash
# Открыть в IDE
bunx cap open ios      # Xcode
bunx cap open android  # Android Studio

# Запуск на устройстве
bunx cap run ios       # iOS Simulator/Device
bunx cap run android   # Android Emulator/Device
```

## 🛠️ Доступные скрипты

### Основные команды
- `bun run dev` - запуск в режиме разработки
- `bun run build` - сборка проекта
- `bun run start` - запуск production сервера
- `bun run lint` - проверка кода

### Capacitor команды
- `bun run cap:setup` - автоматическая установка Capacitor (Linux/macOS)
- `bun run cap:setup:win` - автоматическая установка Capacitor (Windows)
- `bun run cap:sync` - синхронизация с нативными проектами
- `bun run cap:open:ios` - открыть iOS проект в Xcode
- `bun run cap:open:android` - открыть Android проект в Android Studio
- `bun run cap:run:ios` - запустить на iOS
- `bun run cap:run:android` - запустить на Android
- `bun run cap:doctor` - диагностика конфигурации
- `bun run cap:ls` - список установленных плагинов

## 🎯 Нативные функции

Приложение поддерживает следующие нативные возможности:

- **Haptic Feedback** - тактильная обратная связь
- **Вибрация** - управление вибрацией устройства
- **Камера** - съемка фото
- **Геолокация** - получение местоположения
- **Поделиться** - нативный sharing
- **Push-уведомления** - push-сообщения
- **StatusBar** - управление статус-баром
- **SplashScreen** - экран загрузки

### Демо-страница
Перейдите на `/native-demo` для тестирования всех нативных функций.

## 📁 Структура проекта

```
apps/web/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── capacitor/          # Capacitor компоненты
│   │   └── ui/                 # UI компоненты
│   ├── hooks/                  # React хуки
│   │   └── use-capacitor.ts    # Хук для Capacitor
│   └── trpc/                   # tRPC конфигурация
├── public/                     # Статические файлы
│   ├── manifest.json           # PWA манифест
│   └── sw.js                   # Service Worker
├── resources/                  # Ресурсы для нативных приложений
│   ├── icon.svg               # Иконка приложения
│   └── splash.svg             # Splash screen
├── scripts/                    # Скрипты установки
│   ├── setup-capacitor.sh     # Bash скрипт
│   └── setup-capacitor.ps1    # PowerShell скрипт
├── capacitor.config.json       # Конфигурация Capacitor
├── next.config.mjs            # Конфигурация Next.js
└── package.json               # Зависимости и скрипты
```

## 🔧 Конфигурация

### Capacitor
Основная конфигурация находится в `capacitor.config.json`:
- Настройки для iOS и Android
- Конфигурация плагинов
- Настройки сервера и навигации

### Next.js
Обновлен для поддержки статического экспорта:
- `output: "export"` - статический экспорт
- `trailingSlash: true` - обязательно для статического экспорта
- `unoptimized: true` - для изображений в статическом экспорте

## 📚 Документация

- [Быстрый старт](./QUICK_START.md) - быстрое начало работы
- [Capacitor Setup](./CAPACITOR_SETUP.md) - подробное руководство по Capacitor
- [Service Worker Troubleshooting](./SERVICE_WORKER_TROUBLESHOOTING.md) - решение проблем с SW

## 🐛 Troubleshooting

### Проблемы с Bun
```bash
bun --version          # Проверить версию
bun pm cache rm        # Очистить кэш
rm -rf node_modules && bun install  # Переустановить зависимости
```

### Проблемы с Capacitor
```bash
bunx cap doctor        # Диагностика
bunx cap sync          # Синхронизация
```

### Проблемы с Service Worker
```bash
# Очистить кэш SW
clearServiceWorkerCache()
```

## 🚀 Деплой

### Веб-версия
```bash
bun run build
# Развернуть папку out/
```

### Нативные приложения
1. iOS: через Xcode в App Store Connect
2. Android: через Android Studio в Google Play Console

## 📄 Лицензия

MIT License 