"use client";

import Breadcrumbs, { type BreadcrumbItem } from "@/components/breadcrumbs";
import { useCategoryHierarchy } from "@/features/categories/hooks/use-category-hierarchy";

interface CategoryBreadcrumbsProps {
  categorySlug: string;
  subcategorySlug?: string;
}

export function CategoryBreadcrumbs({
  categorySlug,
  subcategorySlug,
}: CategoryBreadcrumbsProps) {
  const { categoryHierarchy, isLoading } = useCategoryHierarchy(categorySlug);
  if (isLoading || !categoryHierarchy) {
    const breadcrumbItems: BreadcrumbItem[] = [
      { label: "Главная", href: "/" },
      { label: "Загрузка...", href: undefined },
    ];
    return <Breadcrumbs items={breadcrumbItems} />;
  }

  const breadcrumbItems: BreadcrumbItem[] = [{ label: "Главная", href: "/" }];

  // Добавляем иерархию категорий (от корня к текущей категории)
  if (categoryHierarchy.length > 0) {
    categoryHierarchy.forEach((category, index) => {
      // Для последней категории не добавляем ссылку (текущая страница)
      if (index === categoryHierarchy.length - 1) {
        breadcrumbItems.push({ label: category.name, href: undefined });
      } else {
        // Для остальных категорий добавляем ссылки на соответствующие страницы
        breadcrumbItems.push({
          label: category.name,
          href: `/catalog/${category.slug}`,
        });
      }
    });
  }

  // Если есть подкатегория, добавляем её в конец
  if (subcategorySlug) {
    breadcrumbItems.push({ label: subcategorySlug, href: undefined });
  }

  return <Breadcrumbs items={breadcrumbItems} />;
}
