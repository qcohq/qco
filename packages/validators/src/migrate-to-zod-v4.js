/**
 * Скрипт миграции валидаторов Zod с версии 3 на версию 4
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Получаем __dirname в ESM модуле
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const VALIDATORS_DIR = __dirname;

// Список файлов для обработки (исключаем скрипты миграции)
const files = fs.readdirSync(VALIDATORS_DIR)
  .filter(file => file.endsWith('.ts') && !file.includes('migrate'));

console.log(`Найдено ${files.length} файлов для миграции`);

// Функция для обновления содержимого файла
function migrateFile(filePath) {
  console.log(`Обработка файла: ${path.basename(filePath)}`);
  let content = fs.readFileSync(filePath, 'utf-8');
  const originalContent = content;

  // 1. Замена .message() на .error()
  content = content.replace(/\{\s*message:\s*(".*?"|`.*?`)\s*\}/g, '{ error: $1 }');

  // 2. Обновление строковых валидаторов
  content = content.replace(/z\.string\(\)\.email\(\)/g, 'z.email()');
  content = content.replace(/z\.string\(\)\.url\(\)/g, 'z.url()');
  content = content.replace(/z\.string\(\)\.uuid\(\)/g, 'z.uuid()');
  content = content.replace(/z\.string\(\)\.cuid\(\)/g, 'z.cuid()');
  content = content.replace(/z\.string\(\)\.cuid2\(\)/g, 'z.cuid2()');
  content = content.replace(/z\.string\(\)\.datetime\(\)/g, 'z.iso.datetime()');
  content = content.replace(/z\.string\(\)\.date\(\)/g, 'z.iso.date()');
  content = content.replace(/z\.string\(\)\.time\(\)/g, 'z.iso.time()');
  
  // 3. Замена z.string().ip() на z.union([z.ipv4(), z.ipv6()])
  content = content.replace(/z\.string\(\)\.ip\(\)/g, 'z.union([z.ipv4(), z.ipv6()])');
  
  // 4. Замена z.string().cidr() на z.union([z.cidrv4(), z.cidrv6()])
  content = content.replace(/z\.string\(\)\.cidr\(\)/g, 'z.union([z.cidrv4(), z.cidrv6()])');

  // Сохраняем обновленный файл только если были изменения
  if (content !== originalContent) {
    fs.writeFileSync(filePath, content, 'utf-8');
    console.log(`  Файл ${path.basename(filePath)} обновлен`);
    return true;
  }
    console.log(`  Файл ${path.basename(filePath)} не требует изменений`);
    return false;
}

// Обработка всех файлов
console.log(`Начинаем миграцию ${files.length} файлов...`);
let updatedCount = 0;

files.forEach(file => {
  const filePath = path.join(VALIDATORS_DIR, file);
  const updated = migrateFile(filePath);
  if (updated) updatedCount++;
});

console.log(`\nМиграция завершена. Обновлено файлов: ${updatedCount} из ${files.length}`);
console.log('Пожалуйста, проверьте файлы вручную на наличие ошибок и специфических случаев, которые скрипт мог пропустить.');
