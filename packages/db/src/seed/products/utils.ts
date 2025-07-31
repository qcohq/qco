import { createId } from "@paralleldrive/cuid2";
import slugify from "@sindresorhus/slugify";
import { sql } from "drizzle-orm";
import { products } from "../../schemas";

/**
 * Создает уникальный slug для продукта, добавляя суффикс при необходимости
 */
export async function createUniqueSlug(tx: any, baseName: string): Promise<string> {
  const baseSlug = slugify(baseName);
  let currentSlug = baseSlug;
  let attempt = 0;
  const maxAttempts = 10;

  while (attempt < maxAttempts) {
    // Проверяем, существует ли уже продукт с таким slug
    const existingProduct = await tx
      .select()
      .from(products)
      .where(sql`slug = ${currentSlug}`)
      .limit(1);

    if (existingProduct.length === 0) {
      return currentSlug; // Slug уникален, возвращаем его
    }

    // Генерируем новый slug с суффиксом
    attempt++;
    currentSlug = `${baseSlug}-${attempt}`;
  }

  // Если превысили максимальное количество попыток, добавляем случайный суффикс
  return `${baseSlug}-${createId().substring(0, 6)}`;
}
