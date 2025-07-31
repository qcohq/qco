"use client";

import { CategoryRow } from "./category-row";
import type { CategoryListItem } from "./types";

// TODO: Использовать тип из схемы пропсов таблицы категорий, если появится в @qco/validators
interface CategoryTableProps {
  categories: CategoryListItem[];
  allCategories: CategoryListItem[];
  onDelete: (category: CategoryListItem) => void;
}

export function CategoryTable({
  categories,
  allCategories,
  onDelete,
}: CategoryTableProps) {
  return (
    <table className="min-w-full divide-y divide-gray-200">
      <thead>
        <tr className="bg-muted/50">
          <th className="px-4 py-2 text-left text-sm font-medium">Название</th>
          <th className="px-4 py-2 text-left text-sm font-medium">Slug</th>
          <th className="px-4 py-2 text-left text-sm font-medium">Описание</th>
          <th className="px-4 py-2 text-left text-sm font-medium">Статус</th>
          <th className="px-4 py-2 text-left text-sm font-medium">Рекомендуемая</th>
          <th className="px-4 py-2 text-left text-sm font-medium">Сортировка</th>
          <th className="px-4 py-2 text-right text-sm font-medium">Действия</th>
        </tr>
      </thead>
      <tbody>
        {categories.map((category) => (
          <CategoryRow
            key={category.id}
            category={category}
            subcategories={allCategories.filter(
              (c) => c.parentId === category.id,
            )}
            allCategories={allCategories}
            level={0}
            onDelete={onDelete}
          />
        ))}
      </tbody>
    </table>
  );
}
