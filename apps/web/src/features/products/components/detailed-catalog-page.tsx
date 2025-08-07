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
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@qco/ui/components/sheet";
import { Separator } from "@qco/ui/components/separator";
import { SlidersHorizontal } from "lucide-react";
import { useState } from "react";
import { useCatalogTRPC } from "../hooks/use-catalog-trcp";
import ProductCard from "./product-card";
import ProductFiltersPanelDynamic from "./product-filters-panel-dynamic";

interface DetailedCatalogPageProps {
  category?: string;
  subcategory?: string;
  searchQuery?: string;
  title?: string;
}

export default function DetailedCatalogPage({
  category,
  subcategory,
  searchQuery,
  title = "Каталог",
}: DetailedCatalogPageProps) {
  const [isFilterDrawerOpen, setIsFilterDrawerOpen] = useState(false);

  const {
    filters,
    sortBy,
    setSortBy,
    filteredProducts,
    updateFilter,
    clearFilters,
    removeFilter,
    isPending,
    error,
  } = useCatalogTRPC(category, subcategory, searchQuery);

  const getDisplayTitle = () => {
    if (searchQuery) return `Поиск: "${searchQuery}"`;
    if (subcategory) return getSubcategoryName(subcategory);
    if (category) return getCategoryName(category);
    return title;
  };

  // Функции для получения названий категорий (можно вынести в отдельный файл)
  const getCategoryName = (categorySlug: string) => {
    const categoryMap: Record<string, string> = {
      clothing: "Одежда",
      shoes: "Обувь",
      accessories: "Аксессуары",
      sports: "Спорт",
      casual: "Повседневная одежда",
      formal: "Деловая одежда",
    };
    return categoryMap[categorySlug] || categorySlug;
  };

  const getSubcategoryName = (subcategorySlug: string) => {
    const subcategoryMap: Record<string, string> = {
      "t-shirts": "Футболки",
      shirts: "Рубашки",
      pants: "Брюки",
      dresses: "Платья",
      jackets: "Куртки",
      sneakers: "Кроссовки",
      boots: "Сапоги",
      bags: "Сумки",
      watches: "Часы",
    };
    return subcategoryMap[subcategorySlug] || subcategorySlug;
  };

  if (isPending) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="font-playfair text-3xl md:text-4xl font-bold mb-2">
            Загрузка...
          </h1>
          <p className="text-muted-foreground">Загрузка товаров...</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="animate-pulse">
              <div className="aspect-[3/4] bg-gray-200 rounded-lg mb-4" />
              <div className="h-4 bg-gray-200 rounded mb-2" />
              <div className="h-6 bg-gray-200 rounded w-3/4" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-16">
        <h2 className="font-playfair text-2xl font-bold mb-4">
          Ошибка загрузки
        </h2>
        <p className="text-muted-foreground">
          Не удалось загрузить товары. Попробуйте обновить страницу.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Заголовок */}
      <div>
        <h1 className="font-playfair text-3xl md:text-4xl font-bold mb-2">
          {getDisplayTitle()}
        </h1>
        <p className="text-muted-foreground">
          {filteredProducts.length === 0
            ? "Товары не найдены"
            : `Найдено ${filteredProducts.length} товаров`}
        </p>
      </div>

      {/* Панель управления */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            size="sm"
            className="lg:hidden"
            onClick={() => setIsFilterDrawerOpen(true)}
          >
            <SlidersHorizontal className="h-4 w-4 mr-2" />
            Фильтры
          </Button>
        </div>

        <div className="flex items-center gap-4">
          {/* Сортировка */}
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground hidden sm:inline">
              Сортировать:
            </span>
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-[180px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="newest">Сначала новые</SelectItem>
                <SelectItem value="price-asc">Сначала дешевые</SelectItem>
                <SelectItem value="price-desc">Сначала дорогие</SelectItem>
                <SelectItem value="popular">Популярные</SelectItem>
                <SelectItem value="name-asc">По алфавиту А-Я</SelectItem>
                <SelectItem value="name-desc">По алфавиту Я-А</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Активные фильтры */}
      {(filters.brands.length > 0 ||
        filters.sizes.length > 0 ||
        filters.colors.length > 0 ||
        filters.inStock ||
        filters.onSale ||
        filters.priceRange[0] > 0 ||
        filters.priceRange[1] < 1000000) && (
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

            {filters.sizes.map((size) => (
              <Badge
                key={size}
                variant="secondary"
                className="cursor-pointer"
                onClick={() => removeFilter("sizes", size)}
              >
                {size} ×
              </Badge>
            ))}

            {filters.colors.map((color) => (
              <Badge
                key={color}
                variant="secondary"
                className="cursor-pointer"
                onClick={() => removeFilter("colors", color)}
              >
                {color} ×
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

      <div className="grid lg:grid-cols-4 gap-8">
        {/* Боковая панель - только на десктопе */}
        <div className="hidden lg:block space-y-8">
          <ProductFiltersPanelDynamic
            filters={filters}
            onFilterChange={updateFilter}
            onClearFilters={clearFilters}
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
              <button
                onClick={clearFilters}
                className="text-primary hover:underline"
              >
                Сбросить фильтры
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
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
          className="w-full sm:max-w-md overflow-y-auto"
        >
          <SheetHeader>
            <SheetTitle>Фильтры</SheetTitle>
          </SheetHeader>
          <div className="mt-6">
            <ProductFiltersPanelDynamic
              filters={filters}
              onFilterChange={updateFilter}
              onClearFilters={clearFilters}
              categorySlug={category || "all"}
            />
            <div className="pt-4">
              <Button
                className="w-full"
                onClick={() => setIsFilterDrawerOpen(false)}
              >
                Применить фильтры ({filteredProducts.length})
              </Button>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}
