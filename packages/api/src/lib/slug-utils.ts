/**
 * Генерирует слаг из строки
 * @param text Исходная строка для преобразования в слаг
 * @returns Слаг, подходящий для URL
 */
export function generateSlug(text: string): string {
  return text
    .toLowerCase() // переводим в нижний регистр
    .replace(/[^\wа-яё\s-]/g, "") // удаляем специальные символы, кроме пробелов и дефисов
    .replace(/[а-яё]/g, (match) => { // транслитерация кириллицы
      const cyrillicToLatin: Record<string, string> = {
        "а": "a", "б": "b", "в": "v", "г": "g", "д": "d", "е": "e", "ё": "yo", 
        "ж": "zh", "з": "z", "и": "i", "й": "y", "к": "k", "л": "l", "м": "m", 
        "н": "n", "о": "o", "п": "p", "р": "r", "с": "s", "т": "t", "у": "u", 
        "ф": "f", "х": "h", "ц": "ts", "ч": "ch", "ш": "sh", "щ": "sch", "ъ": "", 
        "ы": "y", "ь": "", "э": "e", "ю": "yu", "я": "ya"
      };
      return cyrillicToLatin[match] ?? match;
    })
    .trim() // убираем пробелы по краям
    .replace(/\s+/g, "-") // заменяем пробелы на дефисы
    .replace(/-+/g, "-") // убираем повторяющиеся дефисы
    .replace(/^-+|-+$/g, ""); // убираем дефисы в начале и конце
}

/**
 * Проверяет, является ли строка валидным слагом
 * @param slug Строка для проверки
 * @returns true, если строка является валидным слагом
 */
export function isValidSlug(slug: string): boolean {
  return /^[a-z0-9-]+$/.test(slug);
}

/**
 * Генерирует уникальный слаг, добавляя случайное число, если слаг уже существует
 * @param baseSlug Базовый слаг
 * @param checkExists Функция для проверки существования слага
 * @returns Уникальный слаг
 */
export async function generateUniqueSlug(
  baseSlug: string, 
  checkExists: (slug: string) => Promise<boolean>
): Promise<string> {
  let slug = baseSlug;
  let exists = await checkExists(slug);
  
  // Если слаг уже существует, добавляем к нему случайное число
  if (exists) {
    let counter = 1;
    while (exists) {
      slug = `${baseSlug}-${counter}`;
      exists = await checkExists(slug);
      counter++;
    }
  }
  
  return slug;
}
