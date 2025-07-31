import type { TRPCRouterRecord } from "@trpc/server";
import { getAll } from "./get-all";
import { getBySlug } from "./get-by-slug";
import { getRoot } from "./get-root";
import { getTree } from "./get-tree";
import { getChildrenByParent } from "./get-children-by-parent";
import { getChildrenByParentSlug } from "./get-children-by-parent-slug";
import { getCategoryHierarchy } from "./get-category-hierarchy";
import { getCategoryHierarchyBySlug } from "./get-category-hierarchy-by-slug";

export const categoriesRouter = {
    getBySlug,
    getAll,
    getRoot,
    getTree,
    getChildrenByParent,
    getChildrenByParentSlug,
    getCategoryHierarchy,
    getCategoryHierarchyBySlug,
} satisfies TRPCRouterRecord; 