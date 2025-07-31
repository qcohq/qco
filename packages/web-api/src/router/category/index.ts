import type { TRPCRouterRecord } from '@trpc/server'
import { list } from './list'
import { getById } from './get-by-id'
import { getBySlug } from './get-by-slug'
import { getMenu } from './get-menu'
import { getCategoryIds } from './get-category-ids'
import { getChildrenByParentSlug } from './get-children-by-parent-slug'

export const categoryRouter = {
    list,
    getById,
    getBySlug,
    getMenu,
    getCategoryIds,
    getChildrenByParentSlug,
} satisfies TRPCRouterRecord 
