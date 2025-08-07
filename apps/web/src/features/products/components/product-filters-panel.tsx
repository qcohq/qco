"use client";

import { Button } from "@qco/ui/components/button";
import { Checkbox } from "@qco/ui/components/checkbox";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@qco/ui/components/collapsible";
import { Input } from "@qco/ui/components/input";
import { Label } from "@qco/ui/components/label";
import { Separator } from "@qco/ui/components/separator";
import { Skeleton } from "@qco/ui/components/skeleton";
import { Switch } from "@qco/ui/components/switch";
import { ChevronDown, X } from "lucide-react";
import { useState } from "react";
import { RangeSlider } from "@/components/ui/range-slider";
import { useBrandsWithProducts } from "@/features/catalog/hooks/use-brands-with-products";
import { useCategoryAttributes } from "../hooks/use-category-attributes";
import DynamicAttributeFilter from "./dynamic-attribute-filter";
import type { CatalogFilters } from "../types/catalog";

interface ProductFiltersPanelProps {
  filters: CatalogFilters;
  onFilterChange: (filterType: keyof CatalogFilters, value: any) => void;
  onClearFilters: () => void;
  categorySlug?: string; // Добавляем параметр категории
}

const sizes = [
  "XS",
  "S",
  "M",
  "L",
  "XL",
  "XXL",
  "35",
  "36",
  "37",
  "38",
  "39",
  "40",
  "41",
  "42",
  "46",
  "48",
  "50",
  "52",
  "54",
];

const colors = [
  { value: "black", label: "Черный", hex: "#000000" },
  { value: "white", label: "Белый", hex: "#FFFFFF" },
  { value: "red", label: "Красный", hex: "#FF0000" },
  { value: "blue", label: "Синий", hex: "#0000FF" },
  { value: "navy", label: "Темно-синий", hex: "#000080" },
  { value: "brown", label: "Коричневый", hex: "#A52A2A" },
  { value: "beige", label: "Бежевый", hex: "#F5F5DC" },
  { value: "gray", label: "Серый", hex: "#808080" },
  { value: "gold", label: "Золотой", hex: "#FFD700" },
  { value: "silver", label: "Серебряный", hex: "#C0C0C0" },
  { value: "pink", label: "Розовый", hex: "#FFC0CB" },
];

export default function ProductFiltersPanel({
  filters,
  onFilterChange,
  onClearFilters,
  categorySlug,
}: ProductFiltersPanelProps) {
  const [openSections, setOpenSections] = useState<string[]>([
    "price",
    "brands",
    "sizes",
    "colors",
  ]);
  const { data: brands, isLoading: brandsLoading } = useBrandsWithProducts();
  const { attributes, isLoading: attributesLoading } = useCategoryAttributes(categorySlug);

  const toggleSection = (section: string) => {
    setOpenSections((prev) =>
      prev.includes(section)
        ? prev.filter((s) => s !== section)
        : [...prev, section],
    );
  };

  const handlePriceChange = (value: number[]) => {
    // Убеждаемся, что у нас есть два значения для диапазона
    if (value.length === 2) {
      onFilterChange("priceRange", value as [number, number]);
    }
  };

  const handleMinPriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Number.parseInt(e.target.value) || 0;
    const maxPrice = filters.priceRange[1];
    if (value <= maxPrice) {
      onFilterChange("priceRange", [value, maxPrice]);
    }
  };

  const handleMaxPriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Number.parseInt(e.target.value) || 500000;
    const minPrice = filters.priceRange[0];
    if (value >= minPrice) {
      onFilterChange("priceRange", [minPrice, value]);
    }
  };

  const handleBrandToggle = (brand: string) => {
    const currentBrands = filters.brands;
    const newBrands = currentBrands.includes(brand)
      ? currentBrands.filter((b) => b !== brand)
      : [...currentBrands, brand];
    onFilterChange("brands", newBrands);
  };

  const handleSizeToggle = (size: string) => {
    const currentSizes = filters.sizes;
    const newSizes = currentSizes.includes(size)
      ? currentSizes.filter((s) => s !== size)
      : [...currentSizes, size];
    onFilterChange("sizes", newSizes);
  };

  const handleColorToggle = (color: string) => {
    const currentColors = filters.colors;
    const newColors = currentColors.includes(color)
      ? currentColors.filter((c) => c !== color)
      : [...currentColors, color];
    onFilterChange("colors", newColors);
  };

  const availableSizes = ["XS", "S", "M", "L", "XL", "XXL"];
  const availableColors = ["Красный", "Синий", "Зеленый", "Черный", "Белый"];

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
          Очистить
        </Button>
      </div>

      {/* Цена */}
      <Collapsible
        open={openSections.includes("price")}
        onOpenChange={() => toggleSection("price")}
      >
        <CollapsibleTrigger asChild>
          <Button
            variant="ghost"
            className="w-full justify-between p-0 h-auto font-medium"
          >
            <span>Цена</span>
            <ChevronDown
              className={`h-4 w-4 transition-transform ${openSections.includes("price") ? "rotate-180" : ""}`}
            />
          </Button>
        </CollapsibleTrigger>
        <CollapsibleContent className="space-y-4 pt-4">
          <div className="space-y-4">
            <RangeSlider
              value={filters.priceRange}
              onValueChange={handlePriceChange}
              max={500000}
              min={0}
              step={1000}
              className="w-full"
              minStepsBetweenThumbs={1}
            />
            <div className="flex items-center gap-2">
              <div className="flex-1">
                <Label
                  htmlFor="min-price"
                  className="text-xs text-muted-foreground"
                >
                  От
                </Label>
                <Input
                  id="min-price"
                  type="number"
                  value={filters.priceRange[0]}
                  onChange={handleMinPriceChange}
                  min={0}
                  max={filters.priceRange[1]}
                  step={1000}
                  className="h-8 text-sm"
                  placeholder="0"
                />
              </div>
              <div className="flex-1">
                <Label
                  htmlFor="max-price"
                  className="text-xs text-muted-foreground"
                >
                  До
                </Label>
                <Input
                  id="max-price"
                  type="number"
                  value={filters.priceRange[1]}
                  onChange={handleMaxPriceChange}
                  min={filters.priceRange[0]}
                  max={500000}
                  step={1000}
                  className="h-8 text-sm"
                  placeholder="500000"
                />
              </div>
            </div>
          </div>
        </CollapsibleContent>
      </Collapsible>

      <Separator />

      {/* Бренды */}
      <Collapsible
        open={openSections.includes("brands")}
        onOpenChange={() => toggleSection("brands")}
      >
        <CollapsibleTrigger asChild>
          <Button
            variant="ghost"
            className="w-full justify-between p-0 h-auto font-medium"
          >
            <span>Бренды</span>
            <ChevronDown
              className={`h-4 w-4 transition-transform ${openSections.includes("brands") ? "rotate-180" : ""}`}
            />
          </Button>
        </CollapsibleTrigger>
        <CollapsibleContent className="space-y-3 pt-4">
          {brandsLoading ? (
            // Skeleton для загрузки
            Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="flex items-center space-x-2">
                <Skeleton className="h-4 w-4" />
                <Skeleton className="h-4 w-24" />
              </div>
            ))
          ) : brands && brands.length > 0 ? (
            brands.map((brand) => (
              <div key={brand.id} className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id={`brand-${brand.id}`}
                    checked={filters.brands.includes(brand.name)}
                    onCheckedChange={() => handleBrandToggle(brand.name)}
                  />
                  <Label
                    htmlFor={`brand-${brand.id}`}
                    className="text-sm cursor-pointer"
                  >
                    {brand.name}
                  </Label>
                </div>
                <span className="text-xs text-muted-foreground">
                  {brand.productsCount}
                </span>
              </div>
            ))
          ) : (
            <p className="text-sm text-muted-foreground">Бренды не найдены</p>
          )}
        </CollapsibleContent>
      </Collapsible>

      <Separator />

      {/* Динамические атрибуты */}
      {attributes.length > 0 && (
        <>
          <Separator />
          <div className="space-y-4">
            <h3 className="font-semibold text-sm">Характеристики</h3>
            {attributesLoading ? (
              // Skeleton для загрузки атрибутов
              Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="space-y-2">
                  <Skeleton className="h-4 w-24" />
                  <div className="space-y-1">
                    {Array.from({ length: 2 }).map((_, j) => (
                      <div key={j} className="flex items-center space-x-2">
                        <Skeleton className="h-4 w-4" />
                        <Skeleton className="h-4 w-20" />
                      </div>
                    ))}
                  </div>
                </div>
              ))
            ) : (
              attributes.map((attribute) => (
                <DynamicAttributeFilter
                  key={attribute.id}
                  attribute={attribute}
                  filters={filters}
                  onFilterChange={onFilterChange}
                />
              ))
            )}
          </div>
        </>
      )}

      <Separator />

      {/* Наличие и скидки */}
      <Collapsible
        open={openSections.includes("availability")}
        onOpenChange={() => toggleSection("availability")}
      >
        <CollapsibleTrigger asChild>
          <Button
            variant="ghost"
            className="w-full justify-between p-0 h-auto font-medium"
          >
            <span>Наличие и скидки</span>
            <ChevronDown
              className={`h-4 w-4 transition-transform ${openSections.includes("availability") ? "rotate-180" : ""}`}
            />
          </Button>
        </CollapsibleTrigger>
        <CollapsibleContent className="space-y-4 pt-4">
          <div className="flex items-center justify-between">
            <Label htmlFor="inStock" className="text-sm">
              В наличии
            </Label>
            <Switch
              id="inStock"
              checked={filters.inStock}
              onCheckedChange={(checked) => onFilterChange("inStock", checked)}
            />
          </div>
          <div className="flex items-center justify-between">
            <Label htmlFor="onSale" className="text-sm">
              Со скидкой
            </Label>
            <Switch
              id="onSale"
              checked={filters.onSale}
              onCheckedChange={(checked) => onFilterChange("onSale", checked)}
            />
          </div>
        </CollapsibleContent>
      </Collapsible>
    </div>
  );
}
