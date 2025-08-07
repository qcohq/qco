#!/bin/bash

# Capacitor Setup Script for Eleganter (Bun)
# Этот скрипт автоматически устанавливает и настраивает Capacitor

set -e

echo "🚀 Начинаем установку Capacitor для Eleganter..."

# Проверяем, что мы в правильной директории
if [ ! -f "package.json" ]; then
    echo "❌ Ошибка: package.json не найден. Убедитесь, что вы находитесь в директории apps/web"
    exit 1
fi

# Проверяем версию Bun
echo "📦 Проверяем версию Bun..."
bun --version

# Устанавливаем Capacitor CLI и Core
echo "📦 Устанавливаем Capacitor CLI и Core..."
bun add @capacitor/cli @capacitor/core

# Устанавливаем основные плагины
echo "📦 Устанавливаем основные плагины..."
bun add @capacitor/app @capacitor/haptics @capacitor/keyboard @capacitor/status-bar @capacitor/splash-screen @capacitor/device

# Устанавливаем дополнительные плагины
echo "📦 Устанавливаем дополнительные плагины..."
bun add @capacitor/push-notifications @capacitor/camera @capacitor/photos @capacitor/geolocation @capacitor/filesystem

# Собираем проект
echo "🔨 Собираем проект..."
bun run build

# Инициализируем Capacitor (если еще не инициализирован)
if [ ! -f "capacitor.config.json" ]; then
    echo "🔧 Инициализируем Capacitor..."
    bunx cap init Eleganter com.eleganter.shop
else
    echo "✅ Capacitor уже инициализирован"
fi

# Синхронизируем Capacitor
echo "🔄 Синхронизируем Capacitor..."
bunx cap sync

echo ""
echo "✅ Установка Capacitor завершена!"
echo ""
echo "📱 Для добавления платформ выполните:"
echo "   bun add @capacitor/ios && bunx cap add ios"
echo "   bun add @capacitor/android && bunx cap add android"
echo ""
echo "🚀 Для запуска на устройствах:"
echo "   bunx cap open ios"
echo "   bunx cap open android"
echo ""
echo "🔧 Полезные команды:"
echo "   bunx cap doctor    - проверка конфигурации"
echo "   bunx cap ls        - список плагинов"
echo "   bunx cap sync      - синхронизация"
echo "" 