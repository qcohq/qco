"use client";

import { Badge } from "@qco/ui/components/badge";
import { Button } from "@qco/ui/components/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@qco/ui/components/select";
import { Separator } from "@qco/ui/components/separator";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@qco/ui/components/sheet";
import { Skeleton } from "@qco/ui/components/skeleton";
import { SlidersHorizontal } from "lucide-react";
import { useState } from "react";
import { CategoryFilter } from "@/features/catalog/components";
import { useCatalogTRPC } from "../hooks/use-catalog-trcp";
import { useCategoryData } from "../hooks/use-category-data";
import type { SortOption } from "../types/catalog";
import ProductCard from "./product-card";
import ProductFiltersPanelDynamic from "./product-filters-panel-dynamic";

interface CatalogPageLayoutProps {
  category?: string;
  subcategory?: string;
  subsubcategory?: string;
  title?: string;
}

const sortOptions: SortOption[] = [
  { value: "newest", label: "Сначала новые" },
  { value: "popular", label: "Популярные" },
  { value: "price-asc", label: "Сначала дешевые" },
  { value: "price-desc", label: "Сначала дорогие" },
  { value: "name-asc", label: "По алфавиту А-Я" },
  { value: "name-desc", label: "По алфавиту Я-А" },
];

export default function CatalogPageLayout({
  category,
  subcategory,
  subsubcategory,
  title,
}: CatalogPageLayoutProps) {
  const [isFilterDrawerOpen, setIsFilterDrawerOpen] = useState(false);

  // Получаем данные категории
  const { categoryData, isLoading: isCategoryLoading } =
    useCategoryData(category);

  // Получаем данные продуктов
  const {
    filters,
    draftFilters,
    sortBy,
    setSortBy,
    filteredProducts,
    updateFilter,
    applyFilters,
    clearFilters,
    removeFilter,
    isPending: isProductsLoading,
    isRefetching,
  } = useCatalogTRPC(category, subcategory);

  // Функция-обертка для setSortBy с правильной типизацией
  const handleSortChange = (value: string) => {
    setSortBy(value as "newest" | "price-asc" | "price-desc" | "name-asc" | "name-desc" | "popular");
  };

  const isLoading = isCategoryLoading || isProductsLoading;

  const getPageTitle = () => {
    if (title) return title;
    if (categoryData?.name) return categoryData.name;
    if (subsubcategory) return getSubsubcategoryName(subsubcategory);
    if (subcategory) return getSubcategoryName(subcategory);
    if (category) return getCategoryName(category);
    return "Каталог";
  };

  const getActiveFiltersCount = () => {
    let count = 0;
    if (filters.brands.length > 0) count += filters.brands.length;
    if (filters.inStock) count += 1;
    if (filters.onSale) count += 1;
    if (filters.priceRange[0] > 0 || filters.priceRange[1] < 1000000)
      count += 1;

    // Добавляем подсчет активных атрибутов
    Object.values(filters.attributes).forEach(values => {
      if (values.length > 0) count += values.length;
    });

    return count;
  };

  if (isLoading) {
    return <CatalogPageSkeleton />;
  }

  return (
    <div className="space-y-6">
      {/* Заголовок страницы */}
      <div>
        <h1 className="font-playfair text-3xl md:text-4xl font-bold mb-2">
          {getPageTitle()}
        </h1>
        <p className="text-muted-foreground">
          {filteredProducts.length === 0
            ? "Товары не найдены"
            : `Найдено ${filteredProducts.length} товаров`}
        </p>
      </div>

      {/* Панель управления */}
      <div className="flex items-center justify-between flex-nowrap gap-2 sm:gap-4 overflow-x-auto">
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            size="sm"
            className="lg:hidden"
            onClick={() => setIsFilterDrawerOpen(true)}
          >
            <SlidersHorizontal className="h-4 w-4 mr-2" />
            Фильтры
            {getActiveFiltersCount() > 0 && (
              <Badge variant="secondary" className="ml-2 text-xs">
                {getActiveFiltersCount()}
              </Badge>
            )}
          </Button>
        </div>

        <div className="flex items-center gap-2 sm:gap-4">
          {/* Сортировка */}
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground hidden sm:inline">
              Сортировать:
            </span>
            <Select value={sortBy} onValueChange={handleSortChange}>
              <SelectTrigger className="w-[150px] sm:w-[180px]">
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

      {/* Активные фильтры */}
      {getActiveFiltersCount() > 0 && (
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-sm text-muted-foreground">
            Активные фильтры:
          </span>

          {filters.brands.map((brand) => (
            <Badge
              key={brand}
              variant="secondary"
              className="cursor-pointer"
              onClick={() => removeFilter("brands", brand)}
            >
              {brand} ×
            </Badge>
          ))}

          {filters.inStock && (
            <Badge
              variant="secondary"
              className="cursor-pointer"
              onClick={() => removeFilter("inStock", true)}
            >
              В наличии ×
            </Badge>
          )}

          {filters.onSale && (
            <Badge
              variant="secondary"
              className="cursor-pointer"
              onClick={() => removeFilter("onSale", true)}
            >
              Со скидкой ×
            </Badge>
          )}

          {(filters.priceRange[0] > 0 || filters.priceRange[1] < 1000000) && (
            <Badge
              variant="secondary"
              className="cursor-pointer"
              onClick={() => removeFilter("priceRange", "")}
            >
              {filters.priceRange[0].toLocaleString("ru-RU")} -{" "}
              {filters.priceRange[1].toLocaleString("ru-RU")} ₽ ×
            </Badge>
          )}

          {/* Активные фильтры атрибутов */}
          {Object.entries(filters.attributes).map(([attributeSlug, values]) =>
            values.map((value) => (
              <Badge
                key={`${attributeSlug}-${value}`}
                variant="secondary"
                className="cursor-pointer"
                onClick={() => {
                  const newValues = values.filter((v) => v !== value);
                  updateFilter("attributes", {
                    ...filters.attributes,
                    [attributeSlug]: newValues,
                  });
                }}
              >
                {value} ×
              </Badge>
            ))
          )}

          <Button
            variant="ghost"
            size="sm"
            onClick={clearFilters}
            className="text-xs"
          >
            Очистить все
          </Button>
        </div>
      )}

      {/* Кнопка открытия фильтров для мобильных */}
      <div className="block lg:hidden mb-4">
        <Button variant="outline" className="w-full" onClick={() => setIsFilterDrawerOpen(true)}>
          Фильтры
        </Button>
      </div>

      <div className="grid lg:grid-cols-4 gap-8">
        {/* Боковая панель - только на десктопе */}
        <div className="hidden lg:block space-y-8">
          <CategoryFilter
            activeCategory={category}
            activeSubcategory={subcategory}
            activeSubsubcategory={subsubcategory}
          />
          <Separator />
          <ProductFiltersPanelDynamic
            filters={draftFilters}
            appliedFilters={filters}
            onFilterChange={updateFilter}
            onClearFilters={() => {
              updateFilter("brands", []);
              updateFilter("sizes", []);
              updateFilter("colors", []);
              updateFilter("inStock", false);
              updateFilter("onSale", false);
              updateFilter("attributes", {} as any);
            }}
            onApply={applyFilters}
            isRefetching={isRefetching}
            categorySlug={category || "all"}
          />
        </div>

        {/* Товары */}
        <div className="lg:col-span-3">
          {filteredProducts.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-muted-foreground mb-4">
                По вашему запросу ничего не найдено
              </p>
              <Button variant="outline" onClick={clearFilters}>
                Сбросить фильтры
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
              {filteredProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Мобильная панель фильтров */}
      <Sheet open={isFilterDrawerOpen} onOpenChange={setIsFilterDrawerOpen}>
        <SheetContent
          side="left"
          className="w-full sm:max-w-md overflow-y-auto p-2 sm:p-6"
        >
          <SheetHeader>
            <SheetTitle>Фильтры и категории</SheetTitle>
          </SheetHeader>
          <div className="mt-6 space-y-6">
            <CategoryFilter
              activeCategory={category}
              activeSubcategory={subcategory}
              activeSubsubcategory={subsubcategory}
            />
            <Separator />
            <ProductFiltersPanelDynamic
              filters={draftFilters}
              appliedFilters={filters}
              onFilterChange={updateFilter}
              onClearFilters={() => {
                updateFilter("brands", []);
                updateFilter("sizes", []);
                updateFilter("colors", []);
                updateFilter("inStock", false);
                updateFilter("onSale", false);
                updateFilter("attributes", {} as any);
              }}
              onApply={() => {
                applyFilters();
                setIsFilterDrawerOpen(false);
              }}
              isRefetching={isRefetching}
              categorySlug={category || "all"}
            />
            {/* Кнопка перенесена в саму панель фильтров */}
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}

function CatalogPageSkeleton() {
  return (
    <div className="space-y-6">
      <div>
        <Skeleton className="h-10 w-64 mb-2" />
        <Skeleton className="h-4 w-48" />
      </div>

      <div className="flex items-center justify-between">
        <Skeleton className="h-10 w-32" />
        <div className="flex items-center gap-4">
          <Skeleton className="h-10 w-40" />
          <Skeleton className="h-10 w-20" />
        </div>
      </div>

      <div className="grid lg:grid-cols-4 gap-8">
        <div className="hidden lg:block space-y-8">
          <Skeleton className="h-96 w-full" />
          <Skeleton className="h-px w-full" />
          <Skeleton className="h-64 w-full" />
        </div>

        <div className="lg:col-span-3">
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
            {Array.from({ length: 9 }).map((_, i) => (
              <Skeleton key={i} className="h-96 w-full" />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// Вспомогательные функции
function getCategoryName(slug: string): string {
  const categoryMap: Record<string, string> = {
    women: "Женщинам",
    men: "Мужчинам",
    kids: "Детям",
    accessories: "Аксессуары",
    beauty: "Красота",
  };
  return categoryMap[slug] || slug;
}

function getSubcategoryName(slug: string): string {
  const subcategoryMap: Record<string, string> = {
    clothing: "Одежда",
    shoes: "Обувь",
    bags: "Сумки",
    accessories: "Аксессуары",
    jewelry: "Украшения",
    watches: "Часы",
    girls: "Девочкам",
    boys: "Мальчикам",
    fragrance: "Парфюмерия",
    skincare: "Уход за кожей",
    makeup: "Макияж",
  };
  return subcategoryMap[slug] || slug;
}

function getSubsubcategoryName(slug: string): string {
  const subsubcategoryMap: Record<string, string> = {
    dresses: "Платья",
    blouses: "Блузы",
    skirts: "Юбки",
    pants: "Брюки",
    jackets: "Жакеты",
    heels: "Туфли",
    boots: "Сапоги",
    sneakers: "Кроссовки",
    sandals: "Сандалии",
    handbags: "Сумки",
    clutches: "Клатчи",
    backpacks: "Рюкзаки",
    suits: "Костюмы",
    shirts: "Рубашки",
    earrings: "Серьги",
    necklaces: "Ожерелья",
    rings: "Кольца",
    luxury: "Люкс",
    sport: "Спортивные",
    classic: "Классические",
    perfume: "Духи",
    cologne: "Туалетная вода",
  };
  return subsubcategoryMap[slug] || slug;
}
