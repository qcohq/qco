import { eq } from '@qco/db'
import { categories } from '@qco/db/schema'
import { categorySlugInputV2, categorySchemaV2 } from '@qco/web-validators'
import { publicProcedure } from '../../trpc'

export const getBySlug = publicProcedure
    .input(categorySlugInputV2)
    .output(categorySchemaV2)
    .query(async ({ ctx, input }) => {
        const category = await ctx.db.query.categories.findFirst({
            where: eq(categories.slug, input.slug),
            columns: {
                id: true,
                name: true,
                slug: true,
                description: true,
                parentId: true,
                imageId: true,
                isActive: true,
                sortOrder: true,
                createdAt: true,
                updatedAt: true,
            },
        });

        if (!category) {
            throw new Error(`Категория со slug "${input.slug}" не найдена`);
        }

        return {
            ...category,
            imageKey: category.imageId, // Преобразуем imageId в imageKey для соответствия схеме
        };
    }) 
