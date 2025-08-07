# Capacitor Setup Script for Eleganter (Bun) - PowerShell Version
# Этот скрипт автоматически устанавливает и настраивает Capacitor

param(
    [switch]$SkipBuild
)

Write-Host "🚀 Начинаем установку Capacitor для Eleganter..." -ForegroundColor Green

# Проверяем, что мы в правильной директории
if (-not (Test-Path "package.json")) {
    Write-Host "❌ Ошибка: package.json не найден. Убедитесь, что вы находитесь в директории apps/web" -ForegroundColor Red
    exit 1
}

# Проверяем версию Bun
Write-Host "📦 Проверяем версию Bun..." -ForegroundColor Yellow
try {
    $bunVersion = bun --version
    Write-Host "✅ Bun версия: $bunVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ Ошибка: Bun не установлен или не найден в PATH" -ForegroundColor Red
    exit 1
}

# Устанавливаем Capacitor CLI и Core
Write-Host "📦 Устанавливаем Capacitor CLI и Core..." -ForegroundColor Yellow
bun add @capacitor/cli @capacitor/core

# Устанавливаем основные плагины
Write-Host "📦 Устанавливаем основные плагины..." -ForegroundColor Yellow
bun add @capacitor/app @capacitor/haptics @capacitor/keyboard @capacitor/status-bar @capacitor/splash-screen @capacitor/device

# Устанавливаем дополнительные плагины
Write-Host "📦 Устанавливаем дополнительные плагины..." -ForegroundColor Yellow
bun add @capacitor/push-notifications @capacitor/camera @capacitor/photos @capacitor/geolocation @capacitor/filesystem

# Собираем проект (если не пропущено)
if (-not $SkipBuild) {
    Write-Host "🔨 Собираем проект..." -ForegroundColor Yellow
    bun run build
} else {
    Write-Host "⏭️ Пропускаем сборку проекта..." -ForegroundColor Yellow
}

# Инициализируем Capacitor (если еще не инициализирован)
if (-not (Test-Path "capacitor.config.json")) {
    Write-Host "🔧 Инициализируем Capacitor..." -ForegroundColor Yellow
    bunx cap init Eleganter com.eleganter.shop
} else {
    Write-Host "✅ Capacitor уже инициализирован" -ForegroundColor Green
}

# Синхронизируем Capacitor
Write-Host "🔄 Синхронизируем Capacitor..." -ForegroundColor Yellow
bunx cap sync

Write-Host ""
Write-Host "✅ Установка Capacitor завершена!" -ForegroundColor Green
Write-Host ""
Write-Host "📱 Для добавления платформ выполните:" -ForegroundColor Cyan
Write-Host "   bun add @capacitor/ios && bunx cap add ios" -ForegroundColor White
Write-Host "   bun add @capacitor/android && bunx cap add android" -ForegroundColor White
Write-Host ""
Write-Host "🚀 Для запуска на устройствах:" -ForegroundColor Cyan
Write-Host "   bunx cap open ios" -ForegroundColor White
Write-Host "   bunx cap open android" -ForegroundColor White
Write-Host ""
Write-Host "🔧 Полезные команды:" -ForegroundColor Cyan
Write-Host "   bunx cap doctor    - проверка конфигурации" -ForegroundColor White
Write-Host "   bunx cap ls        - список плагинов" -ForegroundColor White
Write-Host "   bunx cap sync      - синхронизация" -ForegroundColor White
Write-Host "" 