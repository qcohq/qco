import slugify from "@sindresorhus/slugify";

/**
 * Генерирует slug из названия
 * @param name - Название для генерации slug
 * @returns Сгенерированный slug
 */
export function generateSlugFromName(name: string): string {
  if (!name || name.trim() === "") {
    return "";
  }

  return slugify(name, {
    lowercase: true,
    separator: "-",
    preserveLeadingUnderscore: false,
    preserveTrailingUnderscore: false,
  });
}

/**
 * Проверяет, является ли строка валидным slug
 * @param slug - Строка для проверки
 * @returns true если slug валиден
 */
export function isValidSlug(slug: string): boolean {
  const slugRegex = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
  return slugRegex.test(slug);
}

/**
 * Очищает slug от недопустимых символов
 * @param slug - Slug для очистки
 * @returns Очищенный slug
 */
export function cleanSlug(slug: string): string {
  return slug
    .toLowerCase()
    .replace(/[^a-z0-9-]/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}
