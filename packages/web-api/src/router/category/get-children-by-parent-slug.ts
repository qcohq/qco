import { eq, and } from '@qco/db'
import { categories } from '@qco/db/schema'
import { publicProcedure } from '../../trpc'
import { z } from 'zod'

export const getChildrenByParentSlug = publicProcedure
    .input(z.object({
        parentSlug: z.string()
    }))
    .query(async ({ ctx, input }) => {
        // Сначала находим родительскую категорию по slug
        const parentCategory = await ctx.db.query.categories.findFirst({
            where: eq(categories.slug, input.parentSlug),
        })

        if (!parentCategory) {
            return []
        }

        // Получаем все дочерние категории для этого родителя
        const childCategories = await ctx.db.query.categories.findMany({
            where: and(
                eq(categories.parentId, parentCategory.id),
                eq(categories.isActive, true)
            ),
            orderBy: [categories.sortOrder, categories.name],
        })

        // Формируем результат
        return childCategories.map((category: any) => ({
            id: category.id,
            name: category.name,
            slug: category.slug,
            href: `/catalog/${parentCategory.slug}/${category.slug}`,
            order: category.sortOrder || 0,
        }))
    }) 
