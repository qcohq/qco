import type { PgTransaction } from "drizzle-orm/pg-core";
import { createId } from "@paralleldrive/cuid2";
import { sql } from "drizzle-orm";

import type * as schema from "../../schema";
import type { ProductData } from "./types";
import {
  productVariants,
} from "../../schemas/products";
import {
  productTypeAttributes,
  productAttributeValues,
} from "../../schemas/product-types";

/**
 * Создает атрибуты продукта на основе данных из JSON
 */
/**
 * Universal product attribute creation function.
 * Removes old attributes/values and creates new ones for the product.
 *
 * @param tx - Drizzle transaction
 * @param productId - Product ID
 * @param attributes - Array of attributes (name, slug, type, options, etc)
 * @returns Promise of created attributes with values
 */
export async function createProductAttributes(
  tx: PgTransaction<any, typeof schema, any>,
  productId: string,
  attributes: {
    name: string;
    slug: string;
    type: string;
    options: { label: string; value: string; metadata?: Record<string, any> }[];
    description?: string;
    metadata?: Record<string, any>;
  }[]
) {
  // Remove old variants and their attribute links
  const oldVariants = await tx
    .select({ id: productVariants.id })
    .from(productVariants)
    .where(sql`product_id = ${productId}`);
  const oldVariantIds = oldVariants.map((v) => v.id);
  if (oldVariantIds.length > 0) {
    await tx
      .delete(productVariants)
      .where(sql`id IN (${oldVariantIds.map((id) => `'${id}'`).join(",")})`);
  }

  // Remove old attribute values
  await tx
    .delete(productAttributeValues)
    .where(sql`product_id = ${productId}`);

  // Create new attribute values
  const createdAttributeValues = [];
  for (const attr of attributes) {
    // Находим или создаем атрибут типа продукта
    const attributeId = createId(); // Временный ID, в реальности нужно найти существующий или создать новый

    // Создаем значение атрибута для продукта
    const [createdAttrValue] = await tx
      .insert(productAttributeValues)
      .values({
        productId,
        attributeId,
        value: JSON.stringify(attr.options),
      })
      .returning();
    if (!createdAttrValue) {
      console.error(`Failed to create attribute value for ${attr.name}`);
      continue;
    }
    createdAttributeValues.push(createdAttrValue);
  }
  return createdAttributeValues;
}

/**
 * Создает варианты продукта на основе размеров и цветов из JSON
 */
export async function createProductVariantsFromSizesColors(
  tx: PgTransaction<any, typeof schema, any>,
  productId: string,
  productName: string,
  productXmlId: string,
  sizes: ProductData["sizes"],
  colors: ProductData["colors"],
) {
  if (!sizes || !Array.isArray(sizes) || sizes.length === 0) {
    return [];
  }

  console.log(
    `🔄 Обработка ${sizes.length} размеров для продукта ${productName}`,
  );

  const createdVariants = [];

  // Создаем варианты для каждой комбинации размера и цвета
  for (const size of sizes) {
    for (const color of colors || []) {
      const variantName = `${productName} - ${size.main} - ${color.name}`;
      const variantSku = `${productXmlId}-${size.main}-${color.name.substring(0, 3)}`;

      // Создаем вариант
      const [createdVariant] = await tx
        .insert(productVariants)
        .values({
          productId: productId,
          sku: variantSku,
          name: variantName,
          isDefault: size.available && size.online,
          stock: size.available && size.online ? 10 : 0,
          isActive: size.available && size.online,
          price: size.price,
          salePrice: size.priceDiscount > 0 ? size.priceDiscount : null,
        } as any)
        .returning();

      if (!createdVariant) {
        console.warn(
          `⚠️ Не удалось создать вариант ${variantName} для продукта ${productName}`,
        );
        continue;
      }

      console.log(
        `✅ Вариант ${variantName} успешно создан для продукта ${productName}`,
      );
      createdVariants.push(createdVariant);
    }
  }

  return createdVariants;
}

/**
 * Создает варианты продукта на основе данных из JSON
 */
export async function createProductVariants(
  tx: PgTransaction<any, typeof schema, any>,
  productId: string,
  productName: string,
  variants: ProductData["variants"],
) {
  if (!variants || !Array.isArray(variants) || variants.length === 0) {
    return [];
  }

  console.log(
    `🔄 Обработка ${variants.length} вариантов для продукта ${productName}`,
  );

  const createdVariants = [];

  // Создаем варианты продукта
  for (const variantData of variants) {
    const variantName = variantData.name ?? productName;

    // Создаем вариант
    const [createdVariant] = await tx
      .insert(productVariants)
      .values({
        productId: productId,
        sku: variantData.sku ?? `${productId}-${createId().substring(0, 6)}`,
        name: variantName,
        isDefault: variantData.isDefault ?? false,
        stock: variantData.stock ?? 0,
        isActive: variantData.isActive ?? true,
        price: variantData.price ?? null,
        salePrice: variantData.salePrice ?? null,
        costPrice: variantData.costPrice ?? null,
        barcode: variantData.barcode ?? null,
        minStock: variantData.minStock ?? 0,
        weight: variantData.weight ?? null,
        width: variantData.width ?? null,
        height: variantData.height ?? null,
        depth: variantData.depth ?? null,
      } as any)
      .returning();

    if (!createdVariant) {
      console.warn(`⚠️ Не удалось создать вариант для продукта ${productName}`);
      continue;
    }

    console.log(
      `✅ Вариант ${variantName} успешно создан для продукта ${productName}`,
    );
    createdVariants.push(createdVariant);
  }

  return createdVariants;
}
