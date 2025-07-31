import { TRPCError } from "@trpc/server";
import { eq, inArray } from "drizzle-orm";

import { products, productVariantOptions, productVariantOptionValues } from "@qco/db/schema";
import { previewVariantsSchema } from "@qco/validators";
import { protectedProcedure } from "../../trpc";

// Вспомогательная функция для генерации всех возможных комбинаций
function generateCombinations(
  attributes: { id: string; name: string; values: { id: string; value: string }[] }[],
) {
  const result: {
    value: { id: string; value: string };
    attributeName: string;
  }[][] = [];

  function generate(
    current: { value: { id: string; value: string }; attributeName: string }[],
    index: number,
  ) {
    if (index === attributes.length) {
      result.push([...current]);
      return;
    }

    const attribute = attributes[index];
    if (!attribute) {
      return;
    }
    for (const value of attribute.values) {
      current.push({
        value,
        attributeName: attribute.name
      });
      generate(current, index + 1);
      current.pop();
    }
  }

  generate([], 0);
  return result;
}

// Функция для генерации умного названия варианта
function generateVariantName(
  combination: { value: { id: string; value: string }; attributeName: string }[],
  productName: string
): string {
  if (combination.length === 0) return productName;

  // Сортируем атрибуты по важности (размер обычно важнее цвета)
  const sortedCombination = [...combination].sort((a, b) => {
    const aPriority = getAttributePriority(a.attributeName);
    const bPriority = getAttributePriority(b.attributeName);
    return bPriority - aPriority;
  });

  const values = sortedCombination.map(item => item.value.value);
  return `${productName} - ${values.join(" / ")}`;
}

// Функция для определения приоритета атрибута
function getAttributePriority(attributeName: string): number {
  const priorities: Record<string, number> = {
    'Размер': 10,
    'Size': 10,
    'Размеры': 10,
    'Sizes': 10,
    'Цвет': 8,
    'Color': 8,
    'Цвета': 8,
    'Colors': 8,
    'Материал': 6,
    'Material': 6,
    'Стиль': 4,
    'Style': 4,
    'Модель': 2,
    'Model': 2,
  };

  return priorities[attributeName] || 0;
}

// Функция для генерации SKU
function generateSKU(
  combination: { value: { id: string; value: string }; attributeName: string }[],
  productSku: string | null
): string {
  if (combination.length === 0) return productSku || 'VAR-001';

  // Создаем префикс из SKU продукта или используем VAR
  const prefix = productSku ? productSku.replace(/[^A-Z0-9]/gi, '') : 'VAR';

  // Создаем суффикс из значений атрибутов
  const suffix = combination
    .map(item => item.value.value.substring(0, 3).toUpperCase())
    .join('-');

  return `${prefix}-${suffix}`;
}

// Функция для группировки атрибутов по логическим группам
function groupAttributes(
  attributes: { id: string; name: string; values: { id: string; value: string }[] }[]
): { id: string; name: string; values: { id: string; value: string }[] }[] {
  // Определяем логические группы атрибутов
  const _sizeGroup = ['Размер', 'Size', 'Размеры', 'Sizes'];
  const _colorGroup = ['Цвет', 'Color', 'Цвета', 'Colors'];
  const _materialGroup = ['Материал', 'Material', 'Материалы', 'Materials'];
  const _styleGroup = ['Стиль', 'Style', 'Модель', 'Model', 'Тип', 'Type'];

  // Сортируем атрибуты по группам
  return attributes.sort((a, b) => {
    const aGroup = getAttributeGroup(a.name);
    const bGroup = getAttributeGroup(b.name);

    if (aGroup !== bGroup) {
      return aGroup - bGroup;
    }

    // Если в одной группе, сортируем по алфавиту
    return a.name.localeCompare(b.name);
  });
}

// Функция для определения группы атрибута
function getAttributeGroup(attributeName: string): number {
  const sizeGroup = ['Размер', 'Size', 'Размеры', 'Sizes'];
  const colorGroup = ['Цвет', 'Color', 'Цвета', 'Colors'];
  const materialGroup = ['Материал', 'Material', 'Материалы', 'Materials'];
  const styleGroup = ['Стиль', 'Style', 'Модель', 'Model', 'Тип', 'Type'];

  if (sizeGroup.includes(attributeName)) return 1;
  if (colorGroup.includes(attributeName)) return 2;
  if (materialGroup.includes(attributeName)) return 3;
  if (styleGroup.includes(attributeName)) return 4;
  return 5; // Остальные атрибуты
}

export const previewVariants = protectedProcedure
  .input(previewVariantsSchema)
  .mutation(async ({ ctx, input }) => {
    try {
      // Проверяем существование продукта
      const product = await ctx.db.query.products.findFirst({
        where: eq(products.id, input.productId),
      });

      if (!product) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: `Товар с ID ${input.productId} не найден`,
        });
      }

      // Получаем все опции вариантов и их значения
      const options = await ctx.db.query.productVariantOptions.findMany({
        where: inArray(productVariantOptions.id, input.optionIds),
        with: {
          values: {
            orderBy: (fields, { asc }) => [asc(fields.sortOrder)],
          },
        },
      });

      if (options.length === 0) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Не найдены опции для предпросмотра вариантов",
        });
      }

      // Проверяем, что все опции принадлежат данному продукту
      const invalidOptions = options.filter(option => option.productId !== input.productId);
      if (invalidOptions.length > 0) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Некоторые опции не принадлежат данному продукту",
        });
      }

      // Группируем опции логически
      const groupedOptions = groupAttributes(
        options.map(option => ({
          id: option.id,
          name: option.name,
          values: option.values.map(value => ({
            id: value.id,
            value: value.value,
          })),
        })),
      );

      // Генерируем все возможные комбинации
      const combinations = generateCombinations(groupedOptions);

      // Форматируем результат для отображения
      const preview = combinations.map((combination, index) => {
        const optionCombinations = combination.map((item) => ({
          optionId: item.value.id,
          valueId: item.value.id,
          value: item.value.value,
          optionName: item.attributeName,
        }));

        // Генерируем умное название и SKU
        const variantName = generateVariantName(combination, product.name || 'Товар');
        const variantSku = generateSKU(combination, product.sku);

        return {
          id: `preview-${index}`,
          name: variantName,
          sku: variantSku,
          barcode: null,
          optionCombinations,
          optionGroups: groupAttributesByType(optionCombinations),
          // Добавляем цены из основного продукта
          price: product.basePrice ? Number(product.basePrice) : null,
          salePrice: product.salePrice ? Number(product.salePrice) : null,
          costPrice: null, // По умолчанию null для предпросмотра
          stock: 0,
          minStock: 0,
          weight: null,
          width: null,
          height: null,
          depth: null,
          isActive: true,
          isDefault: false,
        };
      });

      return {
        count: preview.length,
        variants: preview,
        groupedOptions: groupedOptions.map(option => ({
          id: option.id,
          name: option.name,
          group: getAttributeGroupName(option.name),
          values: option.values,
        })),
      };
    } catch (error) {

      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Не удалось предпросмотреть варианты продукта",
        cause: error,
      });
    }
  });

// Функция для группировки опций по типам
function groupAttributesByType(optionCombinations: any[]) {
  const groups: Record<string, any[]> = {};

  optionCombinations.forEach(option => {
    const group = getAttributeGroupName(option.optionName);
    if (!groups[group]) {
      groups[group] = [];
    }
    groups[group].push(option);
  });

  return groups;
}

// Функция для получения названия группы атрибута
function getAttributeGroupName(attributeName: string): string {
  const sizeGroup = ['Размер', 'Size', 'Размеры', 'Sizes'];
  const colorGroup = ['Цвет', 'Color', 'Цвета', 'Colors'];
  const materialGroup = ['Материал', 'Material', 'Материалы', 'Materials'];
  const styleGroup = ['Стиль', 'Style', 'Модель', 'Model', 'Тип', 'Type'];

  if (sizeGroup.includes(attributeName)) return 'Размеры';
  if (colorGroup.includes(attributeName)) return 'Цвета';
  if (materialGroup.includes(attributeName)) return 'Материалы';
  if (styleGroup.includes(attributeName)) return 'Стили';
  return 'Другие';
}
