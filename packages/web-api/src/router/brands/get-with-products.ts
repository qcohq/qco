import { brands, products } from "@qco/db/schema";
import { getFileUrl } from "@qco/lib";
import { eq, sql } from "@qco/db";
import { publicProcedure } from "../../trpc";
import { brandsListSchema } from "@qco/web-validators";
import type { BrandWithFiles } from "@qco/web-validators";

export const getWithProducts = publicProcedure
    .output(brandsListSchema)
    .query(async ({ ctx }) => {
        // Получаем бренды, которые содержат активные товары
        const brandsWithProducts = await ctx.db
            .select({
                brandId: products.brandId,
                count: sql<number>`count(*)`,
            })
            .from(products)
            .where(eq(products.isActive, true))
            .groupBy(products.brandId);

        // Получаем ID брендов с товарами
        const brandIdsWithProducts = brandsWithProducts
            .map(({ brandId }) => brandId)
            .filter(Boolean); // Убираем null значения

        if (brandIdsWithProducts.length === 0) {
            return [];
        }

        // Получаем все активные бренды с файлами
        const brandsData = await ctx.db.query.brands.findMany({
            where: eq(brands.isActive, true),
            with: {
                files: {
                    with: {
                        file: true,
                    },
                },
            },
        }) as BrandWithFiles[];

        // Фильтруем бренды, оставляя только те, которые содержат товары
        const filteredBrands = brandsData.filter((brand) =>
            brandIdsWithProducts.includes(brand.id)
        );

        // Преобразуем в Map для быстрого доступа к количеству товаров
        const countMap = new Map<string, number>(
            brandsWithProducts
                .filter(({ brandId }) => brandId) // Убираем null значения
                .map(({ brandId, count }) => [brandId!, Number(count)])
        );

        // Формируем результат
        return filteredBrands.map((brand) => {
            const logoFile = brand.files?.find((f) => f.type === "logo");
            return {
                id: brand.id,
                name: brand.name,
                slug: brand.slug,
                description: brand.description,
                shortDescription: brand.shortDescription,
                website: brand.website,
                email: brand.email,
                phone: brand.phone,
                isActive: brand.isActive,
                isFeatured: brand.isFeatured,
                foundedYear: brand.foundedYear,
                countryOfOrigin: brand.countryOfOrigin,
                brandColor: brand.brandColor,
                metaTitle: brand.metaTitle,
                metaDescription: brand.metaDescription,
                metaKeywords: brand.metaKeywords,
                createdAt: brand.createdAt,
                updatedAt: brand.updatedAt,
                createdBy: brand.createdBy,
                updatedBy: brand.updatedBy,
                logo: logoFile?.file.path ? getFileUrl(logoFile.file.path) : null,
                productsCount: countMap.get(brand.id) || 0,
            };
        });
    }); 
