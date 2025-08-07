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
import { useEffect, useState } from "react";
import { useDebouncedPriceFilter } from "../hooks/use-debounced-price-filter";

interface ProductFiltersProps {
  activeFilters: {
    brands: string[];
    priceRange: [number, number];
    sizes: string[];
    colors: string[];
  };
  onFilterChange: (filterType: string, value: any) => void;
}

const brands = [
  { id: "nike", name: "Nike" },
  { id: "adidas", name: "Adidas" },
  { id: "puma", name: "Puma" },
  { id: "reebok", name: "Reebok" },
  { id: "under-armour", name: "Under Armour" },
];

const sizes = ["XS", "S", "M", "L", "XL", "XXL"];

const colors = [
  "Черный",
  "Белый",
  "Красный",
  "Синий",
  "Зеленый",
  "Желтый",
  "Розовый",
  "Серый",
];

export default function ProductFilters({
  activeFilters,
  onFilterChange,
}: ProductFiltersProps) {
  const [openSections, setOpenSections] = useState<string[]>([
    "price",
    "brands",
    "sizes",
  ]);

  // Используем умный дебаунсинг для фильтра цены
  const {
    localPriceRange,
    isDebouncing,
    handleSliderChange,
  } = useDebouncedPriceFilter({
    initialPriceRange: activeFilters.priceRange,
    onPriceChange: (priceRange) => onFilterChange("priceRange", priceRange),
    debounceDelay: 800,
  });

  // Sync with parent component
  useEffect(() => {
    // Синхронизация происходит в хуке useDebouncedPriceFilter
  }, [activeFilters.priceRange]);

  const handleBrandChange = (brandId: string, checked: boolean) => {
    const newBrands = checked
      ? [...activeFilters.brands, brandId]
      : activeFilters.brands.filter((id) => id !== brandId);

    onFilterChange("brands", newBrands);
  };

  const handleSizeChange = (size: string, checked: boolean) => {
    const newSizes = checked
      ? [...activeFilters.sizes, size]
      : activeFilters.sizes.filter((s) => s !== size);

    onFilterChange("sizes", newSizes);
  };

  const handleColorChange = (color: string, checked: boolean) => {
    const newColors = checked
      ? [...activeFilters.colors, color]
      : activeFilters.colors.filter((c) => c !== color);

    onFilterChange("colors", newColors);
  };

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
      <h3 className="font-semibold">Фильтры</h3>

      {/* Price Range */}
      <Collapsible
        open={isSectionOpen("price")}
        onOpenChange={() => toggleSection("price")}
      >
        <CollapsibleTrigger className="flex items-center justify-between w-full">
          <div className="flex items-center gap-2">
            <h4 className="font-medium text-sm">Цена</h4>
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
              value={[localPriceRange[0], localPriceRange[1]]}
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
          <h4 className="font-medium text-sm">Бренды</h4>
          <ChevronDown
            className={`h-4 w-4 transition-transform ${isSectionOpen("brands") ? "rotate-180" : ""}`}
          />
        </CollapsibleTrigger>
        <CollapsibleContent className="pt-4 space-y-2">
          {brands.map((brand) => (
            <div key={brand.id} className="flex items-center space-x-2">
              <Checkbox
                id={`brand-${brand.id}`}
                checked={activeFilters.brands.includes(brand.id)}
                onCheckedChange={(checked) =>
                  handleBrandChange(brand.id, checked as boolean)
                }
              />
              <Label
                htmlFor={`brand-${brand.id}`}
                className="text-sm font-normal cursor-pointer"
              >
                {brand.name}
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
          <h4 className="font-medium text-sm">Размеры</h4>
          <ChevronDown
            className={`h-4 w-4 transition-transform ${isSectionOpen("sizes") ? "rotate-180" : ""}`}
          />
        </CollapsibleTrigger>
        <CollapsibleContent className="pt-4">
          <div className="grid grid-cols-3 gap-2">
            {sizes.map((size) => (
              <div key={size} className="flex items-center space-x-2">
                <Checkbox
                  id={`size-${size}`}
                  checked={activeFilters.sizes.includes(size)}
                  onCheckedChange={(checked) =>
                    handleSizeChange(size, checked as boolean)
                  }
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
          <h4 className="font-medium text-sm">Цвета</h4>
          <ChevronDown
            className={`h-4 w-4 transition-transform ${isSectionOpen("colors") ? "rotate-180" : ""}`}
          />
        </CollapsibleTrigger>
        <CollapsibleContent className="pt-4 space-y-2">
          {colors.map((color) => (
            <div key={color} className="flex items-center space-x-2">
              <Checkbox
                id={`color-${color}`}
                checked={activeFilters.colors.includes(color)}
                onCheckedChange={(checked) =>
                  handleColorChange(color, checked as boolean)
                }
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
