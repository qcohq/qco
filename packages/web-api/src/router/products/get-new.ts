import { TRPCError } from "@trpc/server";
import { eq, and, desc, gte } from "@qco/db";
import { products, productFiles } from "@qco/db/schema";
import { publicProcedure } from "../../trpc";
import { getFileUrl } from "@qco/lib";
import { getNewInputSchema, getNewResponseSchema } from "@qco/web-validators";

export const getNew = publicProcedure
    .input(getNewInputSchema)
    .output(getNewResponseSchema)
    .query(async ({ ctx, input }) => {
        try {
            const { category, limit, days } = input;

            // Вычисляем дату, начиная с которой товары считаются новыми
            const cutoffDate = new Date();
            cutoffDate.setDate(cutoffDate.getDate() - days);

            // Маппинг категорий на slug'ы
            const categorySlugMap = {
                men: "muzhchinam",
                women: "zhenskaya-odezhda",
                kids: "detyam",
            };

            const categorySlug = categorySlugMap[category];

            // Получаем новые товары для конкретной категории
            const productsData = await ctx.db.query.products.findMany({
                where: and(
                    eq(products.isActive, true),
                    eq(products.isNew, true),
                    //gte(products.createdAt, cutoffDate)
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
                orderBy: [desc(products.createdAt)],
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
                    name: product.name,
                    slug: product.slug,
                    description: product.description,
                    basePrice: product.basePrice ? Number(product.basePrice) : 0,
                    salePrice: product.salePrice ? Number(product.salePrice) : null,
                    onSale: Boolean(product.salePrice && product.basePrice && product.salePrice < product.basePrice),
                    image: image || undefined,
                    images: product.files?.map((f: any) => getFileUrl(f.file.path)).filter(Boolean) || [],
                    brand: product.brand?.name || "",
                    inStock: product.stock ? product.stock > 0 : true,
                    category: mainCategory?.name,
                    isNew: product.isNew || false,
                    rating: product.rating || 0,
                };
            });

            return formattedProducts;
        } catch (error) {

            throw new TRPCError({
                code: "INTERNAL_SERVER_ERROR",
                message: "Failed to fetch new products",
            });
        }
    }); 
