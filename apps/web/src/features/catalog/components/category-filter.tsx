"use client";

import { Badge } from "@qco/ui/components/badge";
import { Button } from "@qco/ui/components/button";
import { ChevronDown, ChevronRight } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useCategoriesWithChildren } from "../hooks/use-categories-with-children";

interface CategoryFilterProps {
  /** Активная категория (slug) */
  activeCategory?: string;
  /** Активная подкатегория (slug) */
  activeSubcategory?: string;
  /** Активная под-подкатегория (slug) */
  activeSubsubcategory?: string;
  /** Скрывать ли категории без товаров (по умолчанию true) */
  hideEmptyCategories?: boolean;
}

interface CategoryItemProps {
  category: {
    id: string;
    name: string;
    slug: string;
    productsCount?: number;
    children?: CategoryItemProps["category"][];
  };
  isActive: boolean;
  isSubcategory?: boolean;
  level?: number;
  onToggle?: (categoryId: string) => void;
  expandedCategories?: Set<string>;
  activeCategory?: string;
  activeSubcategory?: string;
  hideEmptyCategories?: boolean;
}

/**
 * Компонент для отображения отдельной категории в фильтре
 */
function CategoryItem({
  category,
  isActive,
  isSubcategory = false,
  level = 0,
  onToggle,
  expandedCategories,
  activeCategory,
  activeSubcategory,
  hideEmptyCategories = false,
}: CategoryItemProps) {
  const hasChildren = category.children && category.children.length > 0;
  const isExpanded = expandedCategories?.has(category.id);

  // Определяем, является ли эта категория активной
  const isThisActive =
    activeCategory === category.slug || activeSubcategory === category.slug;

  // Функция для проверки, есть ли товары в категории или её подкатегориях
  const hasProductsInCategoryOrChildren = (
    category: CategoryItemProps["category"],
  ): boolean => {
    // Если у категории есть товары, показываем её
    if ((category.productsCount || 0) > 0) return true;

    // Если у категории есть дочерние категории с товарами, показываем её
    if (category.children && category.children.length > 0) {
      return category.children.some((child) => hasProductsInCategoryOrChildren(child));
    }

    return false;
  };

  // Фильтруем дочерние категории, если нужно скрыть пустые
  const filteredChildren = hideEmptyCategories
    ? category.children?.filter(hasProductsInCategoryOrChildren)
    : category.children;

  const hasVisibleChildren = filteredChildren && filteredChildren.length > 0;

  return (
    <div className="space-y-1">
      <div className="flex items-center">
        <Link
          href={`/catalog/${category.slug}`}
          className={`flex-1 flex items-center justify-between px-2 py-1.5 rounded text-sm transition-colors ${isThisActive
            ? "bg-primary text-primary-foreground font-medium"
            : "hover:bg-muted"
            } ${isSubcategory ? "ml-4" : ""}`}
        >
          <span className="truncate">{category.name}</span>
          <Badge
            variant={isThisActive ? "secondary" : "outline"}
            className="text-xs ml-2 flex-shrink-0"
          >
            {category.productsCount || 0}
          </Badge>
        </Link>

        {/* Кнопка раскрытия подкатегорий */}
        {hasVisibleChildren && (
          <Button
            variant="ghost"
            size="sm"
            className="h-6 w-6 p-0 ml-1"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onToggle?.(category.id);
            }}
          >
            {isExpanded ? (
              <ChevronDown className="h-3 w-3" />
            ) : (
              <ChevronRight className="h-3 w-3" />
            )}
          </Button>
        )}
      </div>

      {/* Рекурсивно отображаем подкатегории */}
      {hasVisibleChildren && isExpanded && (
        <div className="space-y-1">
          {filteredChildren!.map((childCategory) => (
            <CategoryItem
              key={childCategory.id}
              category={childCategory}
              isActive={false}
              isSubcategory={true}
              level={level + 1}
              onToggle={onToggle}
              expandedCategories={expandedCategories}
              activeCategory={activeCategory}
              activeSubcategory={activeSubcategory}
              hideEmptyCategories={hideEmptyCategories}
            />
          ))}
        </div>
      )}
    </div>
  );
}

/**
 * Компонент фильтра по категориям с иерархической структурой
 *
 * @example
 * ```tsx
 * <CategoryFilter
 *   activeCategory="women"
 *   activeSubcategory="dresses"
 *   hideEmptyCategories={true}
 * />
 * ```
 *
 * @features
 * - Отображает иерархическую структуру категорий
 * - Показывает количество товаров в каждой категории
 * - Выделяет активные категории и подкатегории
 * - Автоматически раскрывает категории с активными элементами
 * - Поддерживает скрытие пустых категорий
 * - Рекурсивное отображение подкатегорий
 * - Кликабельные ссылки на страницы категорий
 */
export function CategoryFilter({
  activeCategory,
  activeSubcategory,
  activeSubsubcategory,
  hideEmptyCategories = true,
}: CategoryFilterProps) {
  const { data: categories, isLoading } = useCategoriesWithChildren();
  console.log(categories);
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(
    new Set(),
  );

  const toggleCategory = (categoryId: string) => {
    setExpandedCategories((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(categoryId)) {
        newSet.delete(categoryId);
      } else {
        newSet.add(categoryId);
      }
      return newSet;
    });
  };

  // Функция для проверки, является ли категория или её подкатегории активными
  const isCategoryActive = (
    category: CategoryItemProps["category"],
  ): boolean => {
    if (activeCategory === category.slug) return true;
    if (activeSubcategory === category.slug) return true;

    // Проверяем подкатегории
    if (category.children) {
      return category.children.some((child) => isCategoryActive(child));
    }

    return false;
  };

  // Функция для проверки, содержит ли категория активную подкатегорию
  const hasActiveChild = (category: CategoryItemProps["category"]): boolean => {
    if (category.children) {
      return category.children.some(
        (child) => child.slug === activeSubcategory || hasActiveChild(child),
      );
    }
    return false;
  };

  // Функция для проверки, есть ли товары в категории или её подкатегориях
  const hasProductsInCategoryOrChildren = (
    category: CategoryItemProps["category"],
  ): boolean => {
    // Если у категории есть товары, показываем её
    if ((category.productsCount || 0) > 0) return true;

    // Если у категории есть дочерние категории с товарами, показываем её
    if (category.children && category.children.length > 0) {
      return category.children.some((child) => hasProductsInCategoryOrChildren(child));
    }

    return false;
  };

  // Функция для фильтрации категорий
  const filterCategories = (
    cats: CategoryItemProps["category"][],
  ): CategoryItemProps["category"][] => {
    if (!hideEmptyCategories) return cats;

    return cats.filter(hasProductsInCategoryOrChildren);
  };

  // Автоматически раскрываем категории, которые содержат активные элементы
  useEffect(() => {
    if (!categories) return;

    const newExpanded = new Set(expandedCategories);

    categories.forEach((category) => {
      if (isCategoryActive(category) || hasActiveChild(category)) {
        newExpanded.add(category.id);
      }
    });

    if (newExpanded.size !== expandedCategories.size) {
      setExpandedCategories(newExpanded);
    }
  }, [activeCategory, activeSubcategory, categories]);

  if (isLoading) {
    return (
      <div className="space-y-4">
        <h3 className="font-semibold text-sm">Категории</h3>
        <div className="space-y-2">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="h-4 bg-gray-200 rounded animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  if (!categories || categories.length === 0) {
    return (
      <div className="space-y-4">
        <h3 className="font-semibold text-sm">Категории</h3>
        <p className="text-sm text-muted-foreground">Категории не найдены</p>
      </div>
    );
  }

  // Фильтруем категории
  const filteredCategories = filterCategories(categories);

  return (
    <div className="space-y-4">
      <div className="space-y-1">
        {filteredCategories.map((category) => {
          const isActiveCategory = activeCategory === category.slug;
          const isActiveSubcategoryItem = activeSubcategory === category.slug;
          const isActive = isActiveCategory || isActiveSubcategoryItem;

          return (
            <CategoryItem
              key={category.id}
              category={category}
              isActive={isActive}
              onToggle={toggleCategory}
              expandedCategories={expandedCategories}
              activeCategory={activeCategory}
              activeSubcategory={activeSubcategory}
              hideEmptyCategories={hideEmptyCategories}
            />
          );
        })}
      </div>
    </div>
  );
}
