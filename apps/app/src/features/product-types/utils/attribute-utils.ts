import type { ProductTypeAttribute } from "@/features/product-attributes/types/attribute";
import type {
  AttributeFilters,
  AttributeSort,
} from "../components/attribute-filters";

/**
 * Фильтрует атрибуты по заданным критериям
 */
export function filterAttributes(
  attributes: ProductTypeAttribute[],
  filters: AttributeFilters,
): ProductTypeAttribute[] {
  return attributes.filter((attribute) => {
    // Поиск по названию и описанию
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      const nameMatch = attribute.name.toLowerCase().includes(searchLower);
      const descriptionMatch = attribute.description
        ?.toLowerCase()
        .includes(searchLower);

      if (!nameMatch && !descriptionMatch) {
        return false;
      }
    }

    // Фильтр по типу
    if (filters.type && attribute.type !== filters.type) {
      return false;
    }

    // Фильтр по обязательности
    if (
      filters.isRequired !== null &&
      attribute.isRequired !== filters.isRequired
    ) {
      return false;
    }

    // Фильтр по фильтруемости
    if (
      filters.isFilterable !== null &&
      attribute.isFilterable !== filters.isFilterable
    ) {
      return false;
    }

    // Фильтр по активности
    if (filters.isActive !== null && attribute.isActive !== filters.isActive) {
      return false;
    }

    return true;
  });
}

/**
 * Сортирует атрибуты по заданному полю и направлению
 */
export function sortAttributes(
  attributes: ProductTypeAttribute[],
  sort: AttributeSort,
): ProductTypeAttribute[] {
  return [...attributes].sort((a, b) => {
    let aValue: any;
    let bValue: any;

    switch (sort.field) {
      case "name":
        aValue = a.name.toLowerCase();
        bValue = b.name.toLowerCase();
        break;
      case "type":
        aValue = a.type.toLowerCase();
        bValue = b.type.toLowerCase();
        break;
      case "sortOrder":
        aValue = a.sortOrder || 0;
        bValue = b.sortOrder || 0;
        break;
      case "createdAt":
        aValue = new Date(a.createdAt).getTime();
        bValue = new Date(b.createdAt).getTime();
        break;
      default:
        return 0;
    }

    if (sort.direction === "asc") {
      return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
    }
    return aValue > bValue ? -1 : aValue < bValue ? 1 : 0;
  });
}

/**
 * Получает статистику по атрибутам
 */
export function getAttributeStats(attributes: ProductTypeAttribute[]) {
  const stats = {
    total: attributes.length,
    byType: {} as Record<string, number>,
    required: 0,
    filterable: 0,
    active: 0,
  };

  attributes.forEach((attr) => {
    // Подсчет по типам
    stats.byType[attr.type] = (stats.byType[attr.type] || 0) + 1;

    // Подсчет обязательных
    if (attr.isRequired) stats.required++;

    // Подсчет фильтруемых
    if (attr.isFilterable) stats.filterable++;

    // Подсчет активных
    if (attr.isActive) stats.active++;
  });

  return stats;
}

/**
 * Валидирует атрибут на основе его типа
 */
export function validateAttribute(attribute: ProductTypeAttribute): string[] {
  const errors: string[] = [];

  // Базовая валидация
  if (!attribute.name || attribute.name.trim().length < 2) {
    errors.push("Название атрибута должно содержать минимум 2 символа");
  }

  if (!attribute.slug || attribute.slug.trim().length === 0) {
    errors.push("Slug обязателен");
  }

  if (!/^[a-z0-9-]+$/.test(attribute.slug || "")) {
    errors.push("Slug может содержать только латинские буквы, цифры и дефисы");
  }

  // Валидация по типу
  switch (attribute.type) {
    case "select":
    case "multiselect":
      if (!attribute.options || attribute.options.length < 2) {
        errors.push(
          "Для типов 'Выбор из списка' и 'Множественный выбор' необходимо минимум 2 опции",
        );
      }
      break;

    case "number":
      if (attribute.minValue && attribute.maxValue) {
        const min = Number.parseFloat(attribute.minValue);
        const max = Number.parseFloat(attribute.maxValue);
        if (!Number.isNaN(min) && !Number.isNaN(max) && min >= max) {
          errors.push("Минимальное значение должно быть меньше максимального");
        }
      }
      if (attribute.defaultValue) {
        const num = Number.parseFloat(attribute.defaultValue);
        if (Number.isNaN(num)) {
          errors.push("Значение по умолчанию должно быть числом");
        } else {
          if (
            attribute.minValue &&
            num < Number.parseFloat(attribute.minValue)
          ) {
            errors.push("Значение по умолчанию меньше минимального");
          }
          if (
            attribute.maxValue &&
            num > Number.parseFloat(attribute.maxValue)
          ) {
            errors.push("Значение по умолчанию больше максимального");
          }
        }
      }
      break;
  }

  return errors;
}

/**
 * Генерирует slug из названия
 */
export function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

/**
 * Форматирует тип атрибута для отображения
 */
export function formatAttributeType(type: string): string {
  const typeMap: Record<string, string> = {
    text: "Текст",
    number: "Число",
    boolean: "Да/Нет",
    select: "Выбор из списка",
    multiselect: "Множественный выбор",
  };

  return typeMap[type] || type;
}

/**
 * Проверяет, является ли атрибут обязательным для заполнения
 */
export function isAttributeRequired(attribute: ProductTypeAttribute): boolean {
  return attribute.isRequired || false;
}

/**
 * Проверяет, можно ли использовать атрибут для фильтрации
 */
export function isAttributeFilterable(
  attribute: ProductTypeAttribute,
): boolean {
  return attribute.isFilterable || false;
}

/**
 * Получает опции атрибута в удобном формате для селекта
 */
export function getAttributeOptions(attribute: ProductTypeAttribute) {
  if (!attribute.options || attribute.options.length === 0) {
    return [];
  }

  return attribute.options.map((option) => ({
    label: option,
    value: option,
  }));
}
