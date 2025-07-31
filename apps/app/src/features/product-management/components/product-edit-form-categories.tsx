"use client";

import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@qco/ui/components/form";
import { Input } from "@qco/ui/components/input";
import { Textarea } from "@qco/ui/components/textarea";
import type { ProductUpdateInput } from "@qco/validators";
import { useFormContext } from "react-hook-form";
import { CategoryHierarchySelect } from "~/components/category-hierarchy-select"; // Иерархический выбор категорий
import { BrandComboboxForm } from "./brand-combobox-form";

interface CategoryItem {
  id: string;
  name: string;
  children?: CategoryItem[];
}

interface ProductEditFormCategoriesProps {
  categories: CategoryItem[];
}

// Вспомогательная функция для преобразования категорий в массив строк ID
function categoriesToStringArray(
  categories: (string | { id: string; name: string })[] | null | undefined,
): string[] {
  if (!categories || !Array.isArray(categories)) {
    return [];
  }

  return categories
    .map((cat): string => {
      if (typeof cat === "string") {
        return cat;
      }
      if (typeof cat === "object" && "id" in cat) {
        return cat.id;
      }
      return "";
    })
    .filter(Boolean);
}

export function ProductEditFormCategories({
  categories,
}: ProductEditFormCategoriesProps) {
  const { control } = useFormContext<ProductUpdateInput>();

  // SearchableSelect делает запросы к API самостоятельно
  return (
    <section id="categories" className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="h-6 w-1 bg-primary rounded-full" />
        <div>
          <h2 className="text-lg font-semibold text-gray-900">
            Категории и атрибуты
          </h2>
          <p className="text-sm text-gray-500">
            Настройте категории, бренд и дополнительные характеристики товара
          </p>
        </div>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 p-6 space-y-6">
        <FormField
          control={control}
          name="categories"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-sm font-medium text-gray-700">
                Категории
              </FormLabel>
              <FormControl>
                <CategoryHierarchySelect
                  categories={categories}
                  value={categoriesToStringArray(field.value)}
                  showBadges
                  onChange={(values: string[]) => {
                    field.onChange(values);
                  }}
                  multiple={true}
                  placeholder="Выберите категории"
                />
              </FormControl>
              <FormDescription className="text-xs text-gray-500">
                Выберите категории, к которым относится товар
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <BrandComboboxForm
            name="brandId"
            label="Бренд"
            description="Выберите бренд товара"
            placeholder="Выберите бренд"
          />

        </div>

      </div>
    </section>
  );
}
