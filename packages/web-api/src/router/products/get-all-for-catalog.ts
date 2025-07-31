import { TRPCError } from "@trpc/server";
import { eq, and, desc, asc, count } from "@qco/db";
import { products, productFiles, brands, categories, productCategories } from "@qco/db/schema";
import { publicProcedure } from "../../trpc";
import { getFileUrl } from "@qco/lib";
import {
    getAllForCatalogInputSchema,
    getAllForCatalogResponseSchema
} from "@qco/web-validators";

export const getAllForCatalog = publicProcedure
    .input(getAllForCatalogInputSchema)
    .output(getAllForCatalogResponseSchema)
    .query(async ({ ctx, input }) => {
        try {
            const { limit, offset, sort } = input;

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

            // Получаем все активные продукты
            const productsData = await ctx.db.query.products.findMany({
                where: eq(products.isActive, true),
                with: {
                    brand: {
                        columns: {
                            id: true,
                            name: true,
                            slug: true,
                        },
                    },
                    categories: {
                        with: {
                            category: {
                                columns: {
                                    id: true,
                                    name: true,
                                    slug: true,
                                },
                            },
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
                        orderBy: [
                            // Сначала файлы с типом "main", затем остальные по порядку
                            desc(eq(productFiles.type, "main")),
                            asc(productFiles.order),
                        ],
                    },
                },
                limit,
                offset,
                orderBy,
            });

            // Получаем общее количество активных продуктов
            const totalCountResult = await ctx.db
                .select({ count: count() })
                .from(products)
                .where(eq(products.isActive, true));

            const totalCount = totalCountResult[0]?.count || 0;

            // Форматируем продукты
            const formattedProducts = productsData.map((product: any) => {
                // Получаем главное изображение (первый файл в отсортированном списке)
                const mainImage = product.files?.[0];
                const image = mainImage?.file?.path ? getFileUrl(mainImage.file.path) : null;

                // Получаем основную категорию
                const mainCategory = product.categories?.[0]?.category;

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
                    basePrice: product.basePrice ? Number(product.basePrice) : null,
                    salePrice: product.salePrice ? Number(product.salePrice) : null,
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
                    // Вычисляемые поля для фронтенда
                    image,
                    category: mainCategory ? mainCategory.name : null,
                    brand: product.brand ? product.brand.name : null,
                };
            });

            return {
                products: formattedProducts,
                totalCount,
                page: Math.floor(offset / limit) + 1,
                limit,
                totalPages: Math.ceil(totalCount / limit),
            };
        } catch (error) {
            if (error instanceof TRPCError) {
                throw error;
            }
            throw new TRPCError({
                code: "INTERNAL_SERVER_ERROR",
                message: "Failed to fetch catalog products",
            });
        }
    }); 