import { TRPCError } from "@trpc/server";
import { eq, and, desc, asc, inArray, count, sql, gte, lte, ne, isNull, isNotNull, gt } from "@qco/db";
import {
  products,
  productCategories,
  productFiles,
  files,
  brands,
  categories,
  productAttributeValues,
  productTypeAttributes
} from "@qco/db/schema";
import { publicProcedure } from "../../trpc";
import { getFileUrl } from "@qco/lib";
import {
  getByCategorySchema,
  getByCategoryResponseSchema
} from "@qco/web-validators";

export const getByCategory = publicProcedure
  .input(getByCategorySchema)
  .output(getByCategoryResponseSchema)
  .query(async ({ ctx, input }) => {
    try {
      const { categorySlug, limit, offset, sort, filters } = input;

      let categoryIds: string[] = [];

      // Функция для построения условий фильтрации
      const buildFilterConditions = async (productIds: string[]) => {
        const conditions = [eq(products.isActive, true)];

        if (productIds.length > 0) {
          conditions.push(inArray(products.id, productIds));
        }

        // Фильтр по брендам
        if (filters?.brands && filters.brands.length > 0) {
          const brandIds = await ctx.db
            .select({ id: brands.id })
            .from(brands)
            .where(inArray(brands.name, filters.brands));

          if (brandIds.length > 0) {
            const brandIdArray = brandIds.map(b => b.id);
            conditions.push(inArray(products.brandId, brandIdArray));
          }
        }

        // Фильтр по цене
        if (filters?.priceRange) {
          const [minPrice, maxPrice] = filters.priceRange;
          if (minPrice > 0) {
            conditions.push(sql`${products.basePrice} >= ${minPrice}`);
          }
          if (maxPrice < 1000000) {
            conditions.push(sql`${products.basePrice} <= ${maxPrice}`);
          }
        }

        // Фильтр по наличию на складе
        if (filters?.inStock) {
          conditions.push(sql`${products.stock} > 0`);
        }

        // Фильтр по скидкам
        if (filters?.onSale) {
          conditions.push(sql`${products.salePrice} > 0`);
        }

        return conditions;
      };

      // Функция для фильтрации по атрибутам
      const filterByAttributes = async (productIds: string[]) => {
        if (!filters?.attributes || Object.keys(filters.attributes).length === 0) {
          return productIds;
        }

        const attributeConditions = [];

        for (const [attributeSlug, values] of Object.entries(filters.attributes)) {
          if (values.length > 0) {
            // Получаем ID атрибута по slug
            const attribute = await ctx.db.query.productTypeAttributes.findFirst({
              where: eq(productTypeAttributes.slug, attributeSlug),
            });

            if (attribute) {
              // Получаем продукты с нужными значениями атрибутов
              const productsWithAttribute = await ctx.db
                .select({ productId: productAttributeValues.productId })
                .from(productAttributeValues)
                .where(and(
                  eq(productAttributeValues.attributeId, attribute.id),
                  inArray(productAttributeValues.value, values)
                ));

              const filteredProductIds = productsWithAttribute.map(p => p.productId);
              attributeConditions.push(filteredProductIds);
            }
          }
        }

        // Если есть условия по атрибутам, применяем их
        if (attributeConditions.length > 0) {
          // Находим пересечение всех условий (продукт должен соответствовать всем атрибутам)
          const commonProductIds = attributeConditions.reduce((acc, curr) =>
            acc.filter(id => curr.includes(id)), productIds
          );
          return commonProductIds;
        }

        return productIds;
      };

      // Специальная обработка для "all" - возвращаем все продукты
      if (categorySlug === "all") {
        // Получаем все активные категории
        const allCategories = await ctx.db.query.categories.findMany({
          columns: {
            id: true,
          },
        });
        categoryIds = allCategories.map((c: any) => c.id);
      } else {
        // Получаем категорию по slug
        const category = await ctx.db.query.categories.findFirst({
          where: eq(categories.slug, categorySlug),
        });

        if (!category) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: `Category with slug "${categorySlug}" not found`,
          });
        }

        // Получаем все подкатегории (если это родительская категория)
        const subcategories = await ctx.db.query.categories.findMany({
          where: eq(categories.parentId, category.id),
        });

        categoryIds = [category.id, ...subcategories.map((c: any) => c.id)];
      }

      // Получаем ID продуктов в этой категории
      const productCategoryIds = await ctx.db
        .select({ productId: productCategories.productId })
        .from(productCategories)
        .where(inArray(productCategories.categoryId, categoryIds));

      const productIds = productCategoryIds.map((pc: any) => pc.productId);

      // Применяем фильтры по атрибутам
      const filteredProductIds = await filterByAttributes(productIds);

      // Если это "all" и нет продуктов в категориях, получаем все активные продукты
      if (categorySlug === "all" && productIds.length === 0) {
        // Получаем все активные продукты без фильтрации по категориям
        const filterConditions = await buildFilterConditions([]);
        const productsData = await ctx.db.query.products.findMany({
          where: and(...filterConditions),
          with: {
            brand: {
              columns: {
                id: true,
                name: true,
                slug: true,
              },
            },
            // Убираем categories из with, так как это может вызывать конфликт
            variants: {
              columns: {
                id: true,
                name: true,
                sku: true,
                price: true,
                salePrice: true,
                isActive: true,
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
            },
          },
          limit,
          offset,
          orderBy: (() => {
            switch (sort) {
              case "price-asc":
                return [asc(products.basePrice)];
              case "price-desc":
                return [desc(products.basePrice)];
              case "name-asc":
                return [asc(products.name)];
              case "name-desc":
                return [desc(products.name)];
              case "popular":
                return [desc(products.isFeatured), desc(products.createdAt)];
              case "newest":
              default:
                return [desc(products.createdAt)];
            }
          })(),
        });

        // Получаем общее количество всех активных продуктов с фильтрами
        const totalCountResult = await ctx.db
          .select({ count: count() })
          .from(products)
          .where(and(...filterConditions));

        const totalCount = totalCountResult[0]?.count || 0;

        // Форматируем продукты
        const formattedProducts = await Promise.all(productsData.map(async (product: any) => {
          // Получаем главное изображение
          const mainImage = product.files?.find((f: any) => f.type === "main");
          const image = mainImage?.file?.path ? getFileUrl(mainImage.file.path) : null;

          // Получаем все изображения
          const images = product.files
            ?.filter((f: any) => f.file?.path)
            .map((f: any) => getFileUrl(f.file.path)) || [];

          // Получаем основную категорию отдельным запросом
          const productCategoriesData = await ctx.db
            .select({
              categoryId: productCategories.categoryId,
            })
            .from(productCategories)
            .where(eq(productCategories.productId, product.id))
            .limit(1);

          let mainCategory = null;
          if (productCategoriesData.length > 0) {
            const category = await ctx.db.query.categories.findFirst({
              where: eq(categories.id, productCategoriesData[0]!.categoryId),
              columns: {
                id: true,
                name: true,
                slug: true,
              },
            });
            mainCategory = category;
          }

          // Формируем варианты
          const variants = product.variants?.map((v: any) => ({
            id: v.id,
            name: v.name || `Вариант ${v.id}`,
            sku: v.sku,
            barcode: v.barcode,
            price: Number(v.price),
            salePrice: v.salePrice ? Number(v.salePrice) : null,
            costPrice: v.costPrice ? Number(v.costPrice) : null,
            stock: v.stock || 0,
            minStock: v.minStock || 0,
            weight: v.weight ? Number(v.weight) : null,
            width: v.width ? Number(v.width) : null,
            height: v.height ? Number(v.height) : null,
            depth: v.depth ? Number(v.depth) : null,
            isActive: v.isActive,
            isDefault: v.isDefault || false,
          })) || [];

          // Извлекаем цвета и размеры из атрибутов (если есть)
          const colors: string[] = [];
          const sizes: string[] = [];
          const tags: string[] = [];
          const features: string[] = [];
          const attributes: Record<string, string[]> = {};

          // Вычисляем дополнительные поля для фронтенда
          const basePrice = product.basePrice ? Number(product.basePrice) : null;
          const salePrice = product.salePrice ? Number(product.salePrice) : null;
          const onSale = Boolean(salePrice && basePrice && salePrice < basePrice);
          const inStock = (product.stock || 0) > 0;
          const rating = 0; // TODO: Добавить реальные рейтинги

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
            stock: product.stock,
            sku: product.sku,
            basePrice,
            salePrice,
            discountPercent: product.discountPercent,
            hasVariants: product.hasVariants || false,
            productTypeId: product.productTypeId,
            createdAt: product.createdAt,
            updatedAt: product.updatedAt,
            seoTitle: product.seoTitle,
            seoUrl: product.seoUrl,
            seoDescription: product.seoDescription,
            seoKeywords: product.seoKeywords,
            xmlId: product.xmlId,
            image,
            images,
            category: mainCategory ? mainCategory.name : null,
            brand: product.brand ? product.brand.name : null,
            variants,
            colors,
            sizes,
            tags,
            features,
            attributes,
            // Вычисляемые поля для фронтенда
            onSale,
            inStock,
            rating,
          };
        }));

        return {
          products: formattedProducts,
          totalCount,
          page: Math.floor(offset / limit) + 1,
          limit,
          totalPages: Math.ceil(totalCount / limit),
        };
      }

      if (filteredProductIds.length === 0) {
        return {
          products: [],
          totalCount: 0,
          page: Math.floor(offset / limit) + 1,
          limit,
          totalPages: 0,
        };
      }

      // Определяем сортировку
      const orderBy = (() => {
        switch (sort) {
          case "price-asc":
            return [asc(products.basePrice)];
          case "price-desc":
            return [desc(products.basePrice)];
          case "name-asc":
            return [asc(products.name)];
          case "name-desc":
            return [desc(products.name)];
          case "popular":
            return [desc(products.isFeatured), desc(products.createdAt)];
          case "newest":
          default:
            return [desc(products.createdAt)];
        }
      })();

      // Получаем продукты с применением фильтров
      const filterConditions = await buildFilterConditions(filteredProductIds);
      const productsData = await ctx.db.query.products.findMany({
        where: and(...filterConditions),
        with: {
          brand: {
            columns: {
              id: true,
              name: true,
              slug: true,
            },
          },
          // Убираем categories из with, так как это может вызывать конфликт
          variants: {
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
          },
        },
        limit,
        offset,
        orderBy,
      });

      // Получаем общее количество с применением фильтров
      const totalCountResult = await ctx.db
        .select({ count: count() })
        .from(products)
        .where(and(...filterConditions));

      const totalCount = totalCountResult[0]?.count || 0;

      // Форматируем продукты
      const formattedProducts = await Promise.all(productsData.map(async (product: any) => {
        // Получаем главное изображение
        const mainImage = product.files?.find((f: any) => f.type === "main");
        const image = mainImage?.file?.path ? getFileUrl(mainImage.file.path) : null;

        // Получаем все изображения, сортируя их так, чтобы основное было первым
        const images = product.files
          ?.filter((f: any) => f.file?.path)
          .sort(async (a: any, b: any) => {
            // Основное изображение (type === "main") должно быть первым
            if (a.type === "main" && b.type !== "main") return -1;
            if (a.type !== "main" && b.type === "main") return 1;
            // Если оба имеют одинаковый тип, сортируем по порядку
            return (a.order || 0) - (b.order || 0);
          })
          .map((f: any) => getFileUrl(f.file.path)) || [];

        // Получаем основную категорию отдельным запросом
        const productCategoriesData = await ctx.db
          .select({
            categoryId: productCategories.categoryId,
          })
          .from(productCategories)
          .where(eq(productCategories.productId, product.id))
          .limit(1);

        let mainCategory = null;
        if (productCategoriesData.length > 0) {
          const category = await ctx.db.query.categories.findFirst({
            where: eq(categories.id, productCategoriesData[0]!.categoryId),
            columns: {
              id: true,
              name: true,
              slug: true,
            },
          });
          mainCategory = category;
        }

        // Формируем варианты
        const variants = product.variants?.map((v: any) => ({
          id: v.id,
          name: v.name || `Вариант ${v.id}`,
          sku: v.sku,
          barcode: v.barcode,
          price: Number(v.price),
          salePrice: v.salePrice ? Number(v.salePrice) : null,
          costPrice: v.costPrice ? Number(v.costPrice) : null,
          stock: v.stock || 0,
          minStock: v.minStock || 0,
          weight: v.weight ? Number(v.weight) : null,
          width: v.width ? Number(v.width) : null,
          height: v.height ? Number(v.height) : null,
          depth: v.depth ? Number(v.depth) : null,
          isActive: v.isActive,
          isDefault: v.isDefault || false,
        })) || [];

        // Получаем атрибуты продукта
        const productAttributes = await ctx.db
          .select({
            attributeSlug: productTypeAttributes.slug,
            value: productAttributeValues.value,
          })
          .from(productAttributeValues)
          .innerJoin(
            productTypeAttributes,
            eq(productAttributeValues.attributeId, productTypeAttributes.id)
          )
          .where(eq(productAttributeValues.productId, product.id));

        // Извлекаем цвета и размеры из атрибутов
        const colors: string[] = [];
        const sizes: string[] = [];
        const tags: string[] = [];
        const features: string[] = [];
        const attributes: Record<string, string[]> = {};

        // Заполняем атрибуты
        productAttributes.forEach((attr) => {
          if (!attributes[attr.attributeSlug]) {
            attributes[attr.attributeSlug] = [];
          }
          const attributeValues = attributes[attr.attributeSlug];
          if (attributeValues && !attributeValues.includes(attr.value)) {
            attributeValues.push(attr.value);
          }

          // Специальная обработка для цветов и размеров
          if (attr.attributeSlug === 'color') {
            colors.push(attr.value);
          } else if (attr.attributeSlug === 'size') {
            sizes.push(attr.value);
          }
        });

        // Вычисляем дополнительные поля для фронтенда
        const basePrice = product.basePrice ? Number(product.basePrice) : null;
        const salePrice = product.salePrice ? Number(product.salePrice) : null;
        const onSale = Boolean(salePrice && basePrice && salePrice < basePrice);
        const inStock = (product.stock || 0) > 0;
        const rating = 0; // TODO: Добавить реальные рейтинги

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
          stock: product.stock,
          sku: product.sku,
          basePrice,
          salePrice,
          discountPercent: product.discountPercent,
          hasVariants: product.hasVariants || false,
          productTypeId: product.productTypeId,
          createdAt: product.createdAt,
          updatedAt: product.updatedAt,
          seoTitle: product.seoTitle,
          seoUrl: product.seoUrl,
          seoDescription: product.seoDescription,
          seoKeywords: product.seoKeywords,
          xmlId: product.xmlId,
          image,
          images,
          category: mainCategory ? mainCategory.name : null,
          brand: product.brand ? product.brand.name : null,
          variants,
          colors,
          sizes,
          tags,
          features,
          attributes,
          // Вычисляемые поля для фронтенда
          onSale,
          inStock,
          rating,
        };
      }));

      return {
        products: formattedProducts,
        totalCount,
        page: Math.floor(offset / limit) + 1,
        limit,
        totalPages: Math.ceil(totalCount / limit),
      };
    } catch (error) {

      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to fetch products by category",
      });
    }
  });
