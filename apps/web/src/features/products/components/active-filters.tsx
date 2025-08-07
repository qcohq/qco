"use client";

import { Badge } from "@qco/ui/components/badge";
import { Button } from "@qco/ui/components/button";
import { X } from "lucide-react";
import type { CatalogFilters } from "../types/catalog";

interface ActiveFiltersProps {
  filters: CatalogFilters;
  onRemoveFilter: (filterType: keyof CatalogFilters, value: string) => void;
  onClearAll: () => void;
}

export default function ActiveFilters({
  filters,
  onRemoveFilter,
  onClearAll,
}: ActiveFiltersProps) {
  const hasActiveFilters =
    filters.brands.length > 0 ||
    filters.sizes.length > 0 ||
    filters.colors.length > 0 ||
    filters.priceRange[0] > 0 ||
    filters.priceRange[1] < 500000 ||
    filters.inStock;

  if (!hasActiveFilters) return null;

  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className="text-sm font-medium">Активные фильтры:</span>

      {/* Цена */}
      {(filters.priceRange[0] > 0 || filters.priceRange[1] < 500000) && (
        <Badge variant="secondary" className="flex items-center gap-1">
          {filters.priceRange[0].toLocaleString("ru-RU")} ₽ -{" "}
          {filters.priceRange[1].toLocaleString("ru-RU")} ₽
          <Button
            variant="ghost"
            size="icon"
            className="h-4 w-4 p-0 ml-1"
            onClick={() => onRemoveFilter("priceRange", "")}
          >
            <X className="h-3 w-3" />
          </Button>
        </Badge>
      )}

      {/* В наличии */}
      {filters.inStock && (
        <Badge variant="secondary" className="flex items-center gap-1">
          В наличии
          <Button
            variant="ghost"
            size="icon"
            className="h-4 w-4 p-0 ml-1"
            onClick={() => onRemoveFilter("inStock", "")}
          >
            <X className="h-3 w-3" />
          </Button>
        </Badge>
      )}

      {/* Бренды */}
      {filters.brands.map((brand) => (
        <Badge
          key={brand}
          variant="secondary"
          className="flex items-center gap-1"
        >
          {brand.toUpperCase()}
          <Button
            variant="ghost"
            size="icon"
            className="h-4 w-4 p-0 ml-1"
            onClick={() => onRemoveFilter("brands", brand)}
          >
            <X className="h-3 w-3" />
          </Button>
        </Badge>
      ))}

      {/* Размеры */}
      {filters.sizes.map((size) => (
        <Badge
          key={size}
          variant="secondary"
          className="flex items-center gap-1"
        >
          Размер: {size}
          <Button
            variant="ghost"
            size="icon"
            className="h-4 w-4 p-0 ml-1"
            onClick={() => onRemoveFilter("sizes", size)}
          >
            <X className="h-3 w-3" />
          </Button>
        </Badge>
      ))}

      {/* Цвета */}
      {filters.colors.map((color) => (
        <Badge
          key={color}
          variant="secondary"
          className="flex items-center gap-1"
        >
          Цвет: {color}
          <Button
            variant="ghost"
            size="icon"
            className="h-4 w-4 p-0 ml-1"
            onClick={() => onRemoveFilter("colors", color)}
          >
            <X className="h-3 w-3" />
          </Button>
        </Badge>
      ))}

      <Button
        variant="ghost"
        size="sm"
        onClick={onClearAll}
        className="text-sm"
      >
        Очистить все
      </Button>
    </div>
  );
}
