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
  .filter((file) => file.endsWith('.ts') && !file.includes('migrate'));

console.log(`Найдено ${files.length} файлов для миграции`);

// Функция для обновления содержимого файла
function migrateFile(filePath) {
  console.log(`Обработка файла: ${path.basename(filePath)}`);
  const content = fs.readFileSync(filePath, 'utf-8');
  const originalContent = content;

  // 1. Замена .message() на .error()
  let updatedContent = content.replace(/\{\s*message:\s*(".*?"|`.*?`)\s*\}/g, '{ error: $1 }');

  // 2. Обновление строковых валидаторов
  updatedContent = updatedContent.replace(/z\.string\(\)\.email\(\)/g, 'z.email()');
  updatedContent = updatedContent.replace(/z\.string\(\)\.url\(\)/g, 'z.url()');
  updatedContent = updatedContent.replace(/z\.string\(\)\.uuid\(\)/g, 'z.uuid()');
  updatedContent = updatedContent.replace(/z\.string\(\)\.cuid\(\)/g, 'z.cuid()');
  updatedContent = updatedContent.replace(/z\.string\(\)\.cuid2\(\)/g, 'z.cuid2()');
  updatedContent = updatedContent.replace(/z\.string\(\)\.datetime\(\)/g, 'z.iso.datetime()');
  updatedContent = updatedContent.replace(/z\.string\(\)\.date\(\)/g, 'z.iso.date()');
  updatedContent = updatedContent.replace(/z\.string\(\)\.time\(\)/g, 'z.iso.time()');
  
  // 3. Замена z.string().ip() на z.union([z.ipv4(), z.ipv6()])
  updatedContent = updatedContent.replace(/z\.string\(\)\.ip\(\)/g, 'z.union([z.ipv4(), z.ipv6()])');
  
  // 4. Замена z.string().cidr() на z.union([z.cidrv4(), z.cidrv6()])
  updatedContent = updatedContent.replace(/z\.string\(\)\.cidr\(\)/g, 'z.union([z.cidrv4(), z.cidrv6()])');

  // Сохраняем обновленный файл только если были изменения
  if (updatedContent !== originalContent) {
    fs.writeFileSync(filePath, updatedContent, 'utf-8');
    console.log(`  Файл ${path.basename(filePath)} обновлен`);
    return true;
  }
    console.log(`  Файл ${path.basename(filePath)} не требует изменений`);
    return false;
}

// Обработка всех файлов
console.log(`Начинаем миграцию ${files.length} файлов...`);
let updatedCount = 0;

files.forEach((file) => {
  const filePath = path.join(VALIDATORS_DIR, file);
  const updated = migrateFile(filePath);
  if (updated) updatedCount++;
});

console.log(`\nМиграция завершена. Обновлено файлов: ${updatedCount} из ${files.length}`);
console.log('Пожалуйста, проверьте файлы вручную на наличие ошибок и специфических случаев, которые скрипт мог пропустить.');
