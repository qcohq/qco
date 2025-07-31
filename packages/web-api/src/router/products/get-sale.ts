import { TRPCError } from "@trpc/server";
import { eq, and, desc, isNotNull, lt } from "@qco/db";
import { products, productFiles } from "@qco/db/schema";
import { publicProcedure } from "../../trpc";
import { getFileUrl } from "@qco/lib";
import { getSaleInputSchema, getSaleResponseSchema } from "@qco/web-validators";

export const getSale = publicProcedure
    .input(getSaleInputSchema)
    .output(getSaleResponseSchema)
    .query(async ({ ctx, input }) => {
        try {
            const { category, limit } = input;

            // Маппинг категорий на slug'ы
            const categorySlugMap = {
                men: "muzhchinam",
                women: "zhenschinam",
                kids: "detyam",
            };

            const categorySlug = categorySlugMap[category];

            // Получаем товары со скидкой для конкретной категории
            const productsData = await ctx.db.query.products.findMany({
                where: and(
                    eq(products.isActive, true),
                    isNotNull(products.salePrice),
                    lt(products.salePrice, products.basePrice)
                ),
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
                orderBy: [desc(products.updatedAt)],
            });

            // Фильтруем продукты по категории
            const filteredProducts = productsData.filter((product: any) => {
                return product.categories?.some((pc: any) =>
                    pc.category?.slug === categorySlug
                );
            });

            // Форматируем продукты в формат ProductItem
            const formattedProducts = filteredProducts.map((product: any) => {
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
                    basePrice: product.basePrice ? Number(product.basePrice) : 0,
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
                    image: image || undefined,
                    images: product.files?.map((f: any) => getFileUrl(f.file.path)).filter(Boolean) || [],
                    brand: product.brand?.name || "",
                    inStock: product.stock ? product.stock > 0 : true,
                    category: mainCategory?.name,
                    rating: product.rating || 0,
                };
            });

            return formattedProducts;
        } catch (error) {

            throw new TRPCError({
                code: "INTERNAL_SERVER_ERROR",
                message: "Failed to fetch sale products",
            });
        }
    }); 