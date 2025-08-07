interface CategoryTree {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
  imageUrl?: string | null;
  productsCount?: number;
  order?: number | null;
  isActive?: boolean;
  isFeatured?: boolean;
  children?: CategoryTree[];
}

interface CategoryBreadcrumb {
  id: string;
  name: string;
  slug: string;
}

/**
 * Рекурсивно ищет категорию по slug в дереве категорий
 */
export function findCategoryBySlug(
  categories: CategoryTree[],
  targetSlug: string,
): CategoryTree | null {
  for (const category of categories) {
    if (category.slug === targetSlug) {
      return category;
    }

    if (category.children) {
      const found = findCategoryBySlug(category.children, targetSlug);
      if (found) {
        return found;
      }
    }
  }

  return null;
}

/**
 * Строит путь к категории (хлебные крошки)
 */
export function buildCategoryPath(
  categories: CategoryTree[],
  targetSlug: string,
  path: CategoryBreadcrumb[] = [],
): CategoryBreadcrumb[] | null {
  for (const category of categories) {
    const currentPath = [
      ...path,
      { id: category.id, name: category.name, slug: category.slug },
    ];

    if (category.slug === targetSlug) {
      return currentPath;
    }

    if (category.children) {
      const found = buildCategoryPath(
        category.children,
        targetSlug,
        currentPath,
      );
      if (found) {
        return found;
      }
    }
  }

  return null;
}

/**
 * Получает все дочерние категории (включая вложенные)
 */
export function getAllChildCategories(category: CategoryTree): CategoryTree[] {
  const children: CategoryTree[] = [];

  if (category.children) {
    for (const child of category.children) {
      children.push(child);
      children.push(...getAllChildCategories(child));
    }
  }

  return children;
}

/**
 * Получает количество товаров во всех дочерних категориях
 */
export function getTotalProductsCount(category: CategoryTree): number {
  let total = category.productsCount || 0;

  if (category.children) {
    for (const child of category.children) {
      total += getTotalProductsCount(child);
    }
  }

  return total;
}

/**
 * Проверяет, является ли категория листовой (без дочерних категорий)
 */
export function isLeafCategory(category: CategoryTree): boolean {
  return !category.children || category.children.length === 0;
}

/**
 * Получает все категории в плоском виде
 */
export function flattenCategoryTree(
  categories: CategoryTree[],
): CategoryTree[] {
  const result: CategoryTree[] = [];

  for (const category of categories) {
    result.push(category);
    if (category.children) {
      result.push(...flattenCategoryTree(category.children));
    }
  }

  return result;
}
