import { db } from "../../client-ws";
import { admins } from "../../schemas/admin";
import { processProductImages } from "./files";
import {
  createProductAttributes,
  createProductVariants,
  createProductVariantsFromSizesColors,
} from "./variants-attributes";
import type { ProductData } from "./types";

/**
 * Process a single product: create or update, link categories and brand, process images, attributes, variants.
 */
import { sql } from "drizzle-orm";
import {
  products,
  productAttributeValues,
  productCategories,
  productFiles,
  productVariants,
} from "../../schemas";

export async function processProduct(
  product: ProductData,
  brandNameToId: Record<string, string>,
  xmlIdToCategoryId: Record<string, string>,
): Promise<void> {
  await db.transaction(async (tx: any) => {
    // Try to find existing product by xmlId
    const slug = product.link.replace("/product/", "").replace("/", "");

    const [existing] = await tx
      .select()
      .from(products)
      .where(sql`xml_id = ${product.xmlId}`);
    let productId: string;

    if (existing) {
      productId = existing.id;
      // Удаляем старые атрибуты и варианты перед созданием новых, чтобы не было задвоения
      await tx
        .delete(productAttributeValues)
        .where(
          sql`attribute_id IN (SELECT id FROM product_attributes WHERE product_id = ${productId})`,
        );
      await tx.delete(productAttributeValues).where(sql`product_id = ${productId}`);
      await tx
        .delete(productAttributeValues)
        .where(
          sql`variant_id IN (SELECT id FROM product_variants WHERE product_id = ${productId})`,
        );
      await tx.delete(productVariants).where(sql`product_id = ${productId}`);
      // Update price if changed
      await tx
        .update(products)
        .set({
          basePrice: product.price !== undefined ? String(product.price) : null,
          salePrice:
            product.priceDiscount !== undefined && product.priceDiscount > 0
              ? String(product.priceDiscount)
              : null,
          discountPercent:
            product.priceDiscount && product.price
              ? Math.round(100 - (product.priceDiscount / product.price) * 100)
              : null,
          slug,
        })
        .where(sql`id = ${productId}`);
    } else {
      // Create new product
      const brandId =
        product.brand && brandNameToId[product.brand.toLowerCase()];
      const [created] = await tx
        .insert(products)
        .values({
          name: product.name,
          slug,
          xmlId: product.xmlId,
          basePrice: product.price !== undefined ? String(product.price) : null,
          salePrice:
            product.priceDiscount !== undefined && product.priceDiscount > 0
              ? String(product.priceDiscount)
              : null,
          discountPercent:
            product.priceDiscount && product.price
              ? Math.round(100 - (product.priceDiscount / product.price) * 100)
              : null,
          isActive: true,
          isFeatured: false,
          brandId: brandId ?? null,
        })
        .returning();
      if (!created) throw new Error(`Failed to create product ${product.name}`);
      productId = created.id;
      // Link categories
      if (product.categoryIds && product.categoryIds.length > 0) {
        const cats = product.categoryIds
          .map((xml) => {
            const categoryId = xmlIdToCategoryId[xml];
            return categoryId ? { productId, categoryId } : null;
          })
          .filter(
            (x): x is { productId: string; categoryId: string } => x !== null,
          );
        if (cats.length > 0) {
          await tx.insert(productCategories).values(cats);
        }
      }
    }
    // Images
    const [admin] = await tx
      .select({ id: admins.id })
      .from(admins)
      .where(sql`email = ${"seedadmin@example.com"}`);
    const adminId = admin?.id;
    if (!adminId) throw new Error("Admin not found");
    // Проверяем, есть ли уже изображения для продукта
    const existingImages = await tx
      .select()
      .from(productFiles)
      .where(sql`product_id = ${productId}`);
    if (
      product.images &&
      product.images.length > 0 &&
      (!existingImages || existingImages.length === 0)
    ) {
      await processProductImages(
        tx,
        productId,
        product.xmlId,
        product.name,
        product.images,
        adminId,
      );
    }

    // Если есть sizes, но нет атрибута size — создаём его на лету
    const hasSizeAttr = product.attributes?.some(
      (attr) => attr.slug === "size",
    );
    const hasColorAttr = product.attributes?.some(
      (attr) => attr.slug === "color",
    );
    if (product.sizes && product.sizes.length > 0) {
      if (!hasSizeAttr) {
        await createProductAttributes(tx, productId, [
          {
            name: "Размер",
            slug: "size",
            type: "select",
            options: product.sizes.map((s: any) =>
              typeof s === "string"
                ? { label: s, value: s }
                : { label: s.main, value: s.main },
            ),
          },
        ]);
      }
    }
    if (product.colors && product.colors.length > 0) {
      if (!hasColorAttr) {
        await createProductAttributes(tx, productId, [
          {
            name: "Цвет",
            slug: "color",
            type: "color",
            options: product.colors
              .map((c: any) => {
                if (typeof c === "string") {
                  return { label: c, value: c };
                }
                return {
                  label: c.name,
                  value: c.xmlId || c.name,
                  metadata: c.hex ? { hex: c.hex } : undefined,
                };
              })
              .filter((opt: any) => opt.label && opt.label.trim() !== ""),
          },
        ]);
      }
    }
    if (product.sizes && product.sizes.length > 0) {
      await createProductVariantsFromSizesColors(
        tx,
        productId,
        product.name,
        product.xmlId,
        product.sizes,
        product.colors,
      );
    } else if (product.variants && product.variants.length > 0) {
      // Variants (old format)
      await createProductVariants(
        tx,
        productId,
        product.name,
        product.variants,
      );
    }
  });
}

export function generateAttributes(product: ProductData): ProductData {
  if (!product.attributes) {
    const attributes = [];
    if (product.sizes && product.sizes.length > 0) {
      attributes.push({
        name: "Размер",
        slug: "size",
        type: "select",
        options: product.sizes.map((s: any) =>
          typeof s === "string"
            ? { label: s, value: s }
            : { label: s.main, value: s.main },
        ),
      });
    }
    if (product.colors && product.colors.length > 0) {
      attributes.push({
        name: "Цвет",
        slug: "color",
        type: "color",
        options: product.colors
          .map((c: any) => {
            if (typeof c === "string") {
              return { label: c, value: c };
            }
            return {
              label: c.name,
              value: c.xmlId || c.name,
              metadata: c.hex ? { hex: c.hex } : undefined,
            };
          })
          .filter((opt: any) => opt.label && opt.label.trim() !== ""),
      });
    }
    return { ...product, attributes };
  }
  return product;
}
