/**
 * Скрипт миграции валидаторов Zod с версии 3 на версию 4
 * 
 * Основные изменения:
 * 1. Замена .message() на .error()
 * 2. Обновление строковых валидаторов (.email(), .url() и т.д.) на новый синтаксис
 * 3. Обновление синтаксиса для .refine()
 * 4. Обновление других методов согласно руководству
 */

const fs = require('fs');
const path = require('path');

const VALIDATORS_DIR = __dirname;

// Список файлов для обработки
const files = fs.readdirSync(VALIDATORS_DIR)
  .filter(file => file.endsWith('.ts') && file !== 'migration-script.js');

// Функция для обновления содержимого файла
function migrateFile(filePath) {
  console.log(`Обработка файла: ${filePath}`);
  let content = fs.readFileSync(filePath, 'utf-8');

  // 1. Замена .message() на .error()
  content = content.replace(/\.min\((\d+),\s*{\s*message:\s*"([^"]+)"\s*}\)/g, '.min($1, { error: "$2" })');
  content = content.replace(/\.max\((\d+),\s*{\s*message:\s*"([^"]+)"\s*}\)/g, '.max($1, { error: "$2" })');
  content = content.replace(/\.regex\(([^,]+),\s*{\s*message:\s*"([^"]+)"\s*}\)/g, '.regex($1, { error: "$2" })');
  content = content.replace(/\.cuid2\({\s*message:\s*"([^"]+)"\s*}\)/g, '.cuid2({ error: "$1" })');
  content = content.replace(/\.multipleOf\(([^,]+),\s*{\s*message:\s*"([^"]+)"\s*}\)/g, '.multipleOf($1, { error: "$2" })');

  // 2. Обновление строковых валидаторов
  // Замена z.string().email() на z.email()
  content = content.replace(/z\.string\(\)\.email\(\)/g, 'z.email()');
  content = content.replace(/z\.string\(\)\.url\(\)/g, 'z.url()');
  content = content.replace(/z\.string\(\)\.uuid\(\)/g, 'z.uuid()');
  content = content.replace(/z\.string\(\)\.cuid\(\)/g, 'z.cuid()');
  content = content.replace(/z\.string\(\)\.cuid2\(\)/g, 'z.cuid2()');
  
  // Замена z.string().ip() на z.union([z.ipv4(), z.ipv6()])
  content = content.replace(/z\.string\(\)\.ip\(\)/g, 'z.union([z.ipv4(), z.ipv6()])');
  
  // Замена z.string().cidr() на z.union([z.cidrv4(), z.cidrv6()])
  content = content.replace(/z\.string\(\)\.cidr\(\)/g, 'z.union([z.cidrv4(), z.cidrv6()])');

  // 3. Обновление синтаксиса для .refine()
  // Это более сложное изменение, поэтому просто добавим комментарий для ручной проверки
  if (content.includes('.refine(')) {
    content = content.replace(/\.refine\((.*?),\s*{/g, (match) => {
      return `/* ПРОВЕРИТЬ REFINE НА СООТВЕТСТВИЕ ZOD V4 */ ${match}`;
    });
  }

  // Сохраняем обновленный файл
  fs.writeFileSync(filePath, content, 'utf-8');
  console.log(`Файл ${filePath} обновлен`);
}

// Обработка всех файлов
console.log(`Начинаем миграцию ${files.length} файлов...`);
files.forEach(file => {
  const filePath = path.join(VALIDATORS_DIR, file);
  migrateFile(filePath);
});

console.log('Миграция завершена. Пожалуйста, проверьте файлы вручную на наличие ошибок.');
