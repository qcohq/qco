import { and, eq, inArray, desc, asc, ne } from "@qco/db";
import {
  categories,
  productAttributeValues,
  productCategories,
  productFiles,
  products,
  productVariants,
  productVariantOptions,
  productVariantOptionCombinations,
  productVariantOptionValues,
} from "@qco/db/schema";
import { getFileUrl } from "@qco/lib";
import {
  getProductDetailInputSchema,
  productDetailSchema,
} from "@qco/web-validators";
import { TRPCError } from "@trpc/server";
import { publicProcedure } from "../../trpc";

export const getBySlug = publicProcedure
  .input(getProductDetailInputSchema)
  .output(productDetailSchema)
  .query(async ({ ctx, input }) => {
    try {
      const { slug } = input;

      // Получаем продукт с базовой информацией
      const product = await ctx.db.query.products.findFirst({
        where: and(eq(products.slug, slug), eq(products.isActive, true)),
        with: {
          brand: {
            columns: {
              id: true,
              name: true,
              slug: true,
            },
          },
          files: {
            with: {
              file: {
                columns: {
                  id: true,
                  path: true,
                },
              },
            },
            orderBy: (files, { asc, sql }) => [
              // Сначала сортируем по типу: main должен быть первым
              asc(sql`CASE WHEN ${files.type} = 'main' THEN 0 ELSE 1 END`),
              // Затем по порядку
              asc(files.order),
            ],
          },
        },
      });

      if (!product) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: `Product with slug "${slug}" not found`,
        });
      }

      // Получаем категории отдельным запросом
      const productCategoriesData = await ctx.db
        .select({
          categoryId: productCategories.categoryId,
        })
        .from(productCategories)
        .where(eq(productCategories.productId, product.id));

      let mainCategory = null;
      if (productCategoriesData.length > 0 && productCategoriesData[0]?.categoryId) {
        const category = await ctx.db.query.categories.findFirst({
          where: eq(categories.id, productCategoriesData[0].categoryId),
          columns: {
            id: true,
            name: true,
            slug: true,
          },
        });
        mainCategory = category;
      }

      // Получаем варианты продукта с их опциями (размер, цвет и т.д.)
      const variants = await ctx.db.query.productVariants.findMany({
        where: eq(productVariants.productId, product.id),
        columns: {
          id: true,
          name: true,
          sku: true,
          barcode: true,
          price: true,
          salePrice: true,
          costPrice: true,
          stock: true,
          minStock: true,
          weight: true,
          width: true,
          height: true,
          depth: true,
          isActive: true,
          isDefault: true,
          createdAt: true,
          updatedAt: true,
        },
        with: {
          optionCombinations: {
            with: {
              option: {
                columns: {
                  id: true,
                  name: true,
                  slug: true,
                  type: true,
                  sortOrder: true,
                },
              },
              optionValue: {
                columns: {
                  id: true,
                  value: true,
                  displayName: true,
                  metadata: true,
                  sortOrder: true,
                },
              },
            },
          },
        },
        orderBy: (fields, { asc, desc }) => [
          desc(fields.isDefault), // Сначала default варианты
          asc(fields.name)
        ],
      });

      // Получаем все опции продукта для формирования общих списков размеров и цветов
      const allProductOptions = await ctx.db.query.productVariantOptions.findMany({
        where: eq(productVariantOptions.productId, product.id),
        with: {
          values: {
            orderBy: (fields, { asc }) => [asc(fields.sortOrder), asc(fields.displayName)],
          },
        },
        orderBy: (fields, { asc }) => [asc(fields.sortOrder), asc(fields.name)],
      });

      // Получаем атрибуты типа продукта (материал, сезон и т.д.)
      const productTypeAttributesData =
        (await ctx.db.query.productAttributeValues.findMany({
          where: eq(productAttributeValues.productId, product.id),
          with: {
            attribute: {
              columns: {
                id: true,
                name: true,
                slug: true,
                type: true,
                options: true,
                sortOrder: true,
              },
            },
          },
        })) || [];

      // Сортируем атрибуты типа продукта по sortOrder
      productTypeAttributesData.sort(
        (a, b) => (a.attribute.sortOrder || 0) - (b.attribute.sortOrder || 0),
      );

      // Формируем цвета и размеры из опций продукта
      const colors: Array<{ name: string; value: string; hex?: string }> = [];
      const sizes: Array<{ name: string; value: string; inStock?: boolean }> = [];

      // Получаем все уникальные значения опций и проверяем их наличие в вариантах
      for (const option of allProductOptions) {
        const isColorOption = option.name.toLowerCase().includes("цвет") ||
          option.name.toLowerCase().includes("color");
        const isSizeOption = option.name.toLowerCase().includes("размер") ||
          option.name.toLowerCase().includes("size");

        if (isColorOption) {
          for (const value of option.values) {
            // Проверяем есть ли варианты с этим цветом
            const hasVariantWithColor = variants.some(variant =>
              variant.optionCombinations?.some(combo =>
                combo.optionValue.id === value.id && variant?.stock && variant.stock > 0
              )
            );

            colors.push({
              name: value.displayName || value.value,
              value: value.value,
              hex: value.metadata?.hex || undefined,
            });
          }
        } else if (isSizeOption) {
          for (const value of option.values) {
            // Проверяем есть ли варианты с этим размером
            const hasVariantWithSize = variants.some(variant =>
              variant.optionCombinations?.some(combo =>
                combo.optionValue.id === value.id && variant.stock && variant.stock > 0
              )
            );

            sizes.push({
              name: value.displayName || value.value,
              value: value.value,
              inStock: hasVariantWithSize,
            });
          }
        }
      }

      // Формируем атрибуты типа продукта (материал, сезон и т.д.)
      const attributes: Record<string, string[]> = {};
      for (const attr of productTypeAttributesData) {
        if (!attributes[attr.attribute.name]) {
          attributes[attr.attribute.name] = [];
        }
        if (!attributes[attr.attribute.name].includes(attr.value)) {
          attributes[attr.attribute.name].push(attr.value);
        }
      }

      // Получаем главное изображение
      const mainImage = product.files?.find((f) => f.type === "main");
      const image = mainImage?.file?.path
        ? getFileUrl(mainImage.file.path)
        : null;

      // Форматируем все изображения, сортируя их так, чтобы основное было первым
      const images =
        product.files
          ?.map((f) => ({
            id: f.id,
            url: f.file?.path
              ? getFileUrl(f.file.path)
              : "https://via.placeholder.com/400x400?text=No+Image",
            alt: f.alt || null,
            type: f.type,
            order: f.order || 0,
          }))
          .filter(
            (f) =>
              f.url !== "https://via.placeholder.com/400x400?text=No+Image",
          ) // Фильтруем изображения без URL
          .sort((a, b) => {
            // Основное изображение (type === "main") должно быть первым
            if (a.type === "main" && b.type !== "main") return -1;
            if (a.type !== "main" && b.type === "main") return 1;
            // Если оба имеют одинаковый тип, сортируем по порядку
            return (a.order || 0) - (b.order || 0);
          }) || [];

      // Форматируем варианты продукта с их опциями
      const formattedVariants = variants.map((variant) => {
        // Создаем опции варианта на основе комбинаций опций (размер, цвет и т.д.)
        // Сортируем опции по sortOrder опции, затем по имени
        const variantOptions = variant.optionCombinations
          ?.sort((a, b) => {
            const sortOrderA = a.option.sortOrder || 0;
            const sortOrderB = b.option.sortOrder || 0;
            if (sortOrderA !== sortOrderB) {
              return sortOrderA - sortOrderB;
            }
            return a.option.name.localeCompare(b.option.name);
          })
          ?.map((combination) => ({
            option: combination.option.name,
            value: combination.optionValue.displayName || combination.optionValue.value,
            metadata: combination.optionValue.metadata,
          })) || [];

        return {
          id: variant.id,
          productId: product.id,
          name: variant.name || `Вариант ${variant.id}`,
          sku: variant.sku,
          barcode: variant.barcode,
          price: Number(variant.price),
          salePrice: variant.salePrice ? Number(variant.salePrice) : null,
          costPrice: variant.costPrice ? Number(variant.costPrice) : null,
          stock: variant.stock || 0,
          minStock: variant.minStock || 0,
          weight: variant.weight ? Number(variant.weight) : null,
          width: variant.width ? Number(variant.width) : null,
          height: variant.height ? Number(variant.height) : null,
          depth: variant.depth ? Number(variant.depth) : null,
          isActive: variant.isActive,
          isDefault: variant.isDefault || false,
          createdAt: new Date(variant.createdAt || new Date()),
          updatedAt: new Date(variant.updatedAt || new Date()),
          options: variantOptions,
        };
      });

      // Получаем теги и особенности (пока пустые массивы)
      const tags: string[] = [];
      const features: string[] = [];

      // Получаем связанные продукты (из той же категории)
      let relatedProducts: any[] = [];
      if (mainCategory) {
        const relatedProductIds = await ctx.db
          .select({
            productId: productCategories.productId,
          })
          .from(productCategories)
          .where(eq(productCategories.categoryId, mainCategory.id));

        if (relatedProductIds.length > 0) {
          const relatedProductIdList = relatedProductIds
            .map((r) => r.productId)
            .filter((id: string) => id !== product.id)
            .slice(0, 4);

          if (relatedProductIdList.length > 0) {
            relatedProducts = await ctx.db.query.products.findMany({
              where: and(
                eq(products.isActive, true),
                inArray(products.id, relatedProductIdList),
              ),
              columns: {
                id: true,
                name: true,
                slug: true,
                basePrice: true,
                salePrice: true,
              },
              with: {
                files: {
                  with: {
                    file: {
                      columns: {
                        path: true,
                      },
                    },
                  },
                  orderBy: [
                    // Сначала файлы с типом "main", затем остальные по порядку
                    desc(eq(productFiles.type, "main")),
                    asc(productFiles.order),
                  ],
                },
              },
            });
          }
        }
      }

      const formattedRelatedProducts = relatedProducts.map((p) => ({
        id: p.id,
        name: p.name,
        slug: p.slug,
        image: p.files?.[0]?.file?.path
          ? getFileUrl(p.files[0].file.path)
          : null,
        basePrice: p.basePrice ? Number(p.basePrice) : null,
        salePrice: p.salePrice ? Number(p.salePrice) : null,
      }));

      return {
        id: product.id,
        brandId: product.brandId,
        name: product.name,
        slug: product.slug,
        description: product.description,
        isActive: product.isActive,
        isFeatured: product.isFeatured,
        isPopular: product.isPopular || false,
        isNew: product.isNew || false,
        stock: product.stock || null,
        sku: product.sku || null,
        basePrice: product.basePrice ? Number(product.basePrice) : null,
        salePrice: product.salePrice ? Number(product.salePrice) : null,
        discountPercent: product.discountPercent || null,
        hasVariants: product.hasVariants || false,
        productTypeId: product.productTypeId,
        createdAt: new Date(product.createdAt),
        updatedAt: new Date(product.updatedAt),
        seoTitle: product.seoTitle,
        seoUrl: product.seoUrl,
        seoDescription: product.seoDescription,
        seoKeywords: product.seoKeywords,
        xmlId: product.xmlId,
        // Вычисляемые поля для фронтенда
        image,
        images,
        category: mainCategory?.name || null,
        brand: product.brand?.name || null,
        brandSlug: product.brand?.slug || null,
        variants: formattedVariants,
        colors,
        sizes,
        tags,
        features,
        attributes,
        relatedProducts: formattedRelatedProducts,
      };
    } catch (error) {
      console.error("Error fetching product by slug:", error);

      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to fetch product by slug",
        cause: error,
      });
    }
  });
