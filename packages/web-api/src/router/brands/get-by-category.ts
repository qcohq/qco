import type { brands, brandFiles, files } from "@qco/db/schema";
import { categories, brandCategories } from "@qco/db/schema";
import { getFileUrl } from "@qco/lib";
import { eq, desc, and } from "@qco/db";
import { publicProcedure } from "../../trpc";
import { z } from "zod";
import type { BrandWithFiles } from "@qco/web-validators";

export const getBrandsByCategory = publicProcedure
    .input(z.object({
        categorySlug: z.string().min(1, "Category slug is required"),
        limit: z.number().min(1).max(50).default(12)
    }))
    .query(async ({ ctx, input }) => {
        const { categorySlug, limit } = input;

        // Сначала находим категорию по slug
        const category = await ctx.db.query.categories.findFirst({
            where: eq(categories.slug, categorySlug),
        });

        if (!category) {
            return [];
        }

        // Получаем бренды, связанные с этой категорией
        const brandCategoriesData = await ctx.db.query.brandCategories.findMany({
            where: eq(brandCategories.categoryId, category.id),
            with: {
                brand: {
                    with: {
                        files: {
                            with: {
                                file: true,
                            },
                        },
                    },
                },
            },
        });

        // Фильтруем активные бренды и берем только нужное количество
        const activeBrands = brandCategoriesData
            .filter((bc: any) => bc.brand?.isActive)
            .map((bc: any) => bc.brand as BrandWithFiles);

        // Формируем список брендов с логотипом
        return activeBrands.map((brand: BrandWithFiles) => {
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
                logo: logoFile?.file?.path ? getFileUrl(logoFile.file.path) : null,
            };
        });
    }); 
