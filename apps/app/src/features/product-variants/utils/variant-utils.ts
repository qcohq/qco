import type { ProductVariant, ProductAttribute } from "../types";

/**
 * Форматирует цену для отображения
 */
export function formatPrice(price?: number | null): string {
    if (price === null || price === undefined) {
        return "Цена не указана";
    }
    return new Intl.NumberFormat("ru-RU", {
        style: "currency",
        currency: "RUB",
    }).format(price);
}

/**
 * Проверяет, есть ли у варианта скидка
 */
export function hasDiscount(variant: ProductVariant): boolean {
    return variant.salePrice !== null &&
        variant.salePrice !== undefined &&
        variant.price !== null &&
        variant.price !== undefined &&
        variant.salePrice < variant.price;
}

/**
 * Получает текущую цену варианта (со скидкой или базовую)
 */
export function getCurrentPrice(variant: ProductVariant): number | null {
    if (hasDiscount(variant)) {
        return variant.salePrice;
    }
    return variant.price;
}

/**
 * Вычисляет процент скидки
 */
export function getDiscountPercentage(variant: ProductVariant): number | null {
    if (!hasDiscount(variant) || !variant.price) {
        return null;
    }
    return Math.round(((variant.price - variant.salePrice!) / variant.price) * 100);
}

/**
 * Проверяет, есть ли товар в наличии
 */
export function isInStock(variant: ProductVariant): boolean {
    return variant.stock !== null && variant.stock > 0;
}

/**
 * Получает строку с атрибутами варианта
 */
export function getAttributesString(variant: ProductVariant): string {
    if (!variant.attributes || variant.attributes.length === 0) {
        return "Без атрибутов";
    }
    return variant.attributes
        .map((attr) => `${attr.option}: ${attr.value}`)
        .join(", ");
}

/**
 * Фильтрует варианты по наличию
 */
export function filterVariantsByStock(
    variants: ProductVariant[],
    inStock: boolean
): ProductVariant[] {
    if (inStock) {
        return variants.filter(isInStock);
    }
    return variants;
}

/**
 * Сортирует варианты по цене
 */
export function sortVariantsByPrice(
    variants: ProductVariant[],
    ascending = true
): ProductVariant[] {
    return [...variants].sort((a, b) => {
        const priceA = getCurrentPrice(a) ?? 0;
        const priceB = getCurrentPrice(b) ?? 0;
        return ascending ? priceA - priceB : priceB - priceA;
    });
}

/**
 * Группирует варианты по атрибутам
 */
export function groupVariantsByAttributes(variants: ProductVariant[]): Record<string, ProductVariant[]> {
    const groups: Record<string, ProductVariant[]> = {};

    variants.forEach(variant => {
        const attributesString = getAttributesString(variant);
        if (!groups[attributesString]) {
            groups[attributesString] = [];
        }
        groups[attributesString].push(variant);
    });

    return groups;
}

/**
 * Проверяет, является ли опция цветовой
 */
export function isColorOption(option: ProductAttribute): boolean {
    const name = option.name.toLowerCase();
    return name.includes("цвет") || name.includes("color") || option.type === "color";
}

/**
 * Получает цвет из метаданных значения опции
 */
export function getOptionValueColor(value: any): string | null {
    return value.metadata?.hex || null;
}

/**
 * Валидирует данные варианта
 */
export function validateVariantData(variant: Partial<ProductVariant>): {
    isValid: boolean;
    errors: string[];
} {
    const errors: string[] = [];

    if (variant.price !== null && variant.price !== undefined && variant.price < 0) {
        errors.push("Цена не может быть отрицательной");
    }

    if (variant.salePrice !== null && variant.salePrice !== undefined && variant.salePrice < 0) {
        errors.push("Цена со скидкой не может быть отрицательной");
    }

    if (variant.stock !== null && variant.stock !== undefined && variant.stock < 0) {
        errors.push("Количество на складе не может быть отрицательным");
    }

    if (variant.price !== null && variant.salePrice !== null &&
        variant.price !== undefined && variant.salePrice !== undefined &&
        variant.salePrice >= variant.price) {
        errors.push("Цена со скидкой должна быть меньше базовой цены");
    }

    return {
        isValid: errors.length === 0,
        errors,
    };
} 