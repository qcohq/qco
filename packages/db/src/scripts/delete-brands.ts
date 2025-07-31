// Удаляет все бренды и связанные файлы брендов из базы данных
// Запуск: bun with-env bun run src/scripts/delete-brands.ts

import { db } from "../client";
import { brands, brandFiles } from "../schemas/brands";

async function deleteAllBrands(): Promise<void> {
  console.log("Удаляем все файлы брендов...");
  await db.delete(brandFiles);
  console.log("Удаляем все бренды...");
  await db.delete(brands);
  console.log("✅ Все бренды и их файлы удалены");
}

// Запуск только если файл вызывается напрямую
if (require.main === module) {
  deleteAllBrands()
    .catch((err) => {
      console.error("Ошибка при удалении брендов:", err);
      process.exit(1);
    })
    .then(() => process.exit(0));
}
