/**
 * Преобразует строку в slug (URL-friendly строку)
 * - Переводит в нижний регистр
 * - Заменяет пробелы на дефисы
 * - Удаляет специальные символы
 * - Транслитерирует кириллицу в латиницу
 */
export function slugify(text: string): string {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-") // Replace spaces with -
    .replace(/&/g, "-and-") // Replace & with 'and'
    .replace(/[^\w-]+/g, "") // Remove all non-word characters
    .replace(/--+/g, "-") // Replace multiple - with single -
    .replace(/^-+/, "") // Trim - from start of text
    .replace(/-+$/, ""); // Trim - from end of text
}

/**
 * Проверяет, является ли строка допустимым slug
 * - Может содержать только строчные буквы, цифры и дефисы
 */
export function isValidSlug(text: string): boolean {
  return /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(text);
}
