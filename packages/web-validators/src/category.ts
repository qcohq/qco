import { z } from 'zod/v4'

export const categoryInput = z.object({
    limit: z.number().default(10),
    offset: z.number().default(0),
})

export const categoryIdInput = z.object({
    id: z.string(),
})

export const categorySlugInput = z.object({
    slug: z.string(),
})

export const categoryListInput = z.object({
    limit: z.number().default(10),
    offset: z.number().default(0),
    parentId: z.string().optional(),
    includeChildren: z.boolean().default(false),
})

export const createCategoryInput = z.object({
    name: z.string().min(1, 'Category name is required'),
    slug: z.string().min(1, 'Category slug is required'),
    description: z.string().optional(),
    parentId: z.string().optional(),
    imageKey: z.string().optional(),
    isActive: z.boolean().default(true),
    sortOrder: z.number().default(0),
})

export const updateCategoryInput = z.object({
    id: z.string(),
    name: z.string().min(1, 'Category name is required').optional(),
    slug: z.string().min(1, 'Category slug is required').optional(),
    description: z.string().optional(),
    parentId: z.string().optional(),
    imageKey: z.string().optional(),
    isActive: z.boolean().optional(),
    sortOrder: z.number().optional(),
})

export const categoryWithChildrenSchema: z.ZodType<any> = z.object({
    id: z.string(),
    name: z.string(),
    slug: z.string(),
    description: z.string().nullable(),
    parentId: z.string().nullable(),
    imageKey: z.string().nullable(),
    isActive: z.boolean(),
    sortOrder: z.number(),
    createdAt: z.date(),
    updatedAt: z.date(),
    children: z.array(z.lazy(() => categoryWithChildrenSchema)).optional(),
})

export const categorySchema = z.object({
    id: z.string(),
    name: z.string(),
    slug: z.string(),
    description: z.string().nullable(),
    parentId: z.string().nullable(),
    imageKey: z.string().nullable(),
    isActive: z.boolean(),
    sortOrder: z.number(),
    createdAt: z.date(),
    updatedAt: z.date(),
})

export type Category = z.infer<typeof categorySchema>
export type CategoryWithChildren = z.infer<typeof categoryWithChildrenSchema>
export type CreateCategoryInput = z.infer<typeof createCategoryInput>
export type UpdateCategoryInput = z.infer<typeof updateCategoryInput> 
