"use client";

import { Button } from "@qco/ui/components/button";
import { Checkbox } from "@qco/ui/components/checkbox";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@qco/ui/components/collapsible";
import { Label } from "@qco/ui/components/label";
import { Separator } from "@qco/ui/components/separator";
import { Slider } from "@qco/ui/components/slider";
import { ChevronDown, Clock } from "lucide-react";
import { useState } from "react";
import { useDebouncedPriceFilter } from "../hooks/use-debounced-price-filter";
import type { CatalogFilters } from "../types/catalog";

interface CatalogFiltersSidebarProps {
  filters: Partial<CatalogFilters> & {
    priceRange: [number, number];
  };
  onFilterChange: (filterType: keyof CatalogFilters, value: any) => void;
  onClearFilters: () => void;
}

export default function CatalogFiltersSidebar({
  filters,
  onFilterChange,
  onClearFilters,
}: CatalogFiltersSidebarProps) {
  // Обеспечиваем значения по умолчанию для всех полей
  const safeFilters = {
    brands: filters.brands || [],
    sizes: filters.sizes || [],
    colors: filters.colors || [],
    categories: filters.categories || [],
    priceRange: filters.priceRange,
    inStock: filters.inStock || false,
    onSale: filters.onSale || false,
    attributes: filters.attributes || {},
  };

  const [openSections, setOpenSections] = useState<string[]>([
    "price",
    "brands",
    "sizes",
    "colors",
  ]);

  // Используем умный дебаунсинг для фильтра цены
  const {
    localPriceRange,
    isDebouncing,
    handleSliderChange,
  } = useDebouncedPriceFilter({
    initialPriceRange: safeFilters.priceRange,
    onPriceChange: (priceRange) => onFilterChange("priceRange", priceRange),
    debounceDelay: 800,
  });

  const toggleSection = (section: string) => {
    setOpenSections((prev) =>
      prev.includes(section)
        ? prev.filter((s) => s !== section)
        : [...prev, section],
    );
  };

  const isSectionOpen = (section: string) => openSections.includes(section);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold">Фильтры</h3>
        <Button
          variant="ghost"
          size="sm"
          onClick={onClearFilters}
          className="text-xs"
        >
          Очистить все
        </Button>
      </div>

      {/* Price Range */}
      <Collapsible
        open={isSectionOpen("price")}
        onOpenChange={() => toggleSection("price")}
      >
        <CollapsibleTrigger className="flex items-center justify-between w-full">
          <div className="flex items-center gap-2">
            <h4 className="font-medium">Цена</h4>
            {isDebouncing && (
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <Clock className="h-3 w-3 animate-pulse" />
                <span>Применяется...</span>
              </div>
            )}
          </div>
          <ChevronDown
            className={`h-4 w-4 transition-transform ${isSectionOpen("price") ? "rotate-180" : ""}`}
          />
        </CollapsibleTrigger>
        <CollapsibleContent className="pt-4 space-y-4">
          <div className="px-2">
            <Slider
              value={localPriceRange}
              onValueChange={handleSliderChange}
              max={500000}
              step={5000}
              className="w-full"
            />
            <div className="flex justify-between text-sm text-muted-foreground mt-2">
              <span>{localPriceRange[0].toLocaleString("ru-RU")} ₽</span>
              <span>{localPriceRange[1].toLocaleString("ru-RU")} ₽</span>
            </div>
          </div>
        </CollapsibleContent>
      </Collapsible>

      <Separator />

      {/* Brands */}
      <Collapsible
        open={isSectionOpen("brands")}
        onOpenChange={() => toggleSection("brands")}
      >
        <CollapsibleTrigger className="flex items-center justify-between w-full">
          <h4 className="font-medium">Бренды</h4>
          <ChevronDown
            className={`h-4 w-4 transition-transform ${isSectionOpen("brands") ? "rotate-180" : ""}`}
          />
        </CollapsibleTrigger>
        <CollapsibleContent className="pt-4 space-y-2">
          {safeFilters.brands.map((brand) => (
            <div key={brand} className="flex items-center space-x-2">
              <Checkbox
                id={`brand-${brand}`}
                checked={safeFilters.brands.includes(brand)}
                onCheckedChange={(checked) => {
                  const newBrands = checked
                    ? [...safeFilters.brands, brand]
                    : safeFilters.brands.filter((b) => b !== brand);
                  onFilterChange("brands", newBrands);
                }}
              />
              <Label
                htmlFor={`brand-${brand}`}
                className="text-sm font-normal cursor-pointer"
              >
                {brand}
              </Label>
            </div>
          ))}
        </CollapsibleContent>
      </Collapsible>

      <Separator />

      {/* Sizes */}
      <Collapsible
        open={isSectionOpen("sizes")}
        onOpenChange={() => toggleSection("sizes")}
      >
        <CollapsibleTrigger className="flex items-center justify-between w-full">
          <h4 className="font-medium">Размеры</h4>
          <ChevronDown
            className={`h-4 w-4 transition-transform ${isSectionOpen("sizes") ? "rotate-180" : ""}`}
          />
        </CollapsibleTrigger>
        <CollapsibleContent className="pt-4">
          <div className="grid grid-cols-3 gap-2">
            {safeFilters.sizes.map((size) => (
              <div key={size} className="flex items-center space-x-2">
                <Checkbox
                  id={`size-${size}`}
                  checked={safeFilters.sizes.includes(size)}
                  onCheckedChange={(checked) => {
                    const newSizes = checked
                      ? [...safeFilters.sizes, size]
                      : safeFilters.sizes.filter((s) => s !== size);
                    onFilterChange("sizes", newSizes);
                  }}
                />
                <Label
                  htmlFor={`size-${size}`}
                  className="text-sm font-normal cursor-pointer"
                >
                  {size}
                </Label>
              </div>
            ))}
          </div>
        </CollapsibleContent>
      </Collapsible>

      <Separator />

      {/* Colors */}
      <Collapsible
        open={isSectionOpen("colors")}
        onOpenChange={() => toggleSection("colors")}
      >
        <CollapsibleTrigger className="flex items-center justify-between w-full">
          <h4 className="font-medium">Цвета</h4>
          <ChevronDown
            className={`h-4 w-4 transition-transform ${isSectionOpen("colors") ? "rotate-180" : ""}`}
          />
        </CollapsibleTrigger>
        <CollapsibleContent className="pt-4 space-y-2">
          {safeFilters.colors.map((color) => (
            <div key={color} className="flex items-center space-x-2">
              <Checkbox
                id={`color-${color}`}
                checked={safeFilters.colors.includes(color)}
                onCheckedChange={(checked) => {
                  const newColors = checked
                    ? [...safeFilters.colors, color]
                    : safeFilters.colors.filter((c) => c !== color);
                  onFilterChange("colors", newColors);
                }}
              />
              <Label
                htmlFor={`color-${color}`}
                className="text-sm font-normal cursor-pointer"
              >
                {color}
              </Label>
            </div>
          ))}
        </CollapsibleContent>
      </Collapsible>
    </div>
  );
}
