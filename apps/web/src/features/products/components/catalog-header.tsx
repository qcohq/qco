"use client";

import { Button } from "@qco/ui/components/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@qco/ui/components/select";
import { SlidersHorizontal } from "lucide-react";
import type { SortOption } from "../types/catalog";

interface CatalogHeaderProps {
  title: string;
  productsCount: number;
  sortBy: string;
  onSortChange: (sort: string) => void;
  onFiltersToggle: () => void;
}

const sortOptions: SortOption[] = [
  { value: "newest", label: "Сначала новые" },
  { value: "popular", label: "Популярные" },
  { value: "price-asc", label: "Сначала дешевые" },
  { value: "price-desc", label: "Сначала дорогие" },
  { value: "name-asc", label: "По алфавиту А-Я" },
  { value: "name-desc", label: "По алфавиту Я-А" },
];

export default function CatalogHeader({
  title,
  productsCount,
  sortBy,
  onSortChange,
  onFiltersToggle,
}: CatalogHeaderProps) {
  return (
    <div className="space-y-4">
      {/* Заголовок */}
      <div>
        <h1 className="font-playfair text-3xl md:text-4xl font-bold mb-2">
          {title}
        </h1>
        <p className="text-muted-foreground">
          {productsCount === 0
            ? "Товары не найдены"
            : `Найдено ${productsCount} товаров`}
        </p>
      </div>

      {/* Панель управления */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <Button
          variant="outline"
          size="sm"
          className="lg:hidden"
          onClick={onFiltersToggle}
        >
          <SlidersHorizontal className="h-4 w-4 mr-2" />
          Фильтры
        </Button>

        <div className="flex items-center gap-4 ml-auto">
          {/* Сортировка */}
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground hidden sm:inline">
              Сортировать:
            </span>
            <Select value={sortBy} onValueChange={onSortChange}>
              <SelectTrigger className="w-[180px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {sortOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>
    </div>
  );
}
