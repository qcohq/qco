import type { TRPCRouterRecord } from "@trpc/server";

import { create } from "./create";
import { deleteItem } from "./delete";
import { getById } from "./get-by-id";
import { getCategoryTree } from "./tree";
import { getChildren } from "./get-children";
import { getFolderView } from "./get-folder-view";
import { updateCategory } from "./update";
import { updateCategoryOrder } from "./update-order";
import { list } from "./list";
import { getFirstLevel } from "./get-first-level";
import { checkSlug } from "./check-slug";
import { generateUniqueSlug } from "./generate-unique-slug";
import { recalculateCounts } from "./recalculate-counts";

export const categoriesRouter = {
    create,
    delete: deleteItem,
    getById,
    tree: getCategoryTree,
    getChildren,
    getFolderView,
    update: updateCategory,
    updateOrder: updateCategoryOrder,
    list,
    getFirstLevel,
    checkSlug,
    generateUniqueSlug,
    recalculateCounts,
} satisfies TRPCRouterRecord; 
