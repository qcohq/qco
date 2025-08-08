"use client";

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
  SheetTrigger,
} from "@qco/ui/components/sheet";
import { Separator } from "@qco/ui/components/separator";
import { SlidersHorizontal } from "lucide-react";
import { useState } from "react";
import { CategorySidebar } from "@/features/catalog/components";
import { useCatalogTRPC } from "../hooks/use-catalog-trcp";
import ProductCard from "./product-card";
import ProductFiltersPanelDynamic from "./product-filters-panel-dynamic";

interface EnhancedCatalogPageProps {
  categorySlug?: string;
  subcategorySlug?: string;
  subsubcategorySlug?: string;
}

export default function EnhancedCatalogPage({
  categorySlug,
  subcategorySlug,
  subsubcategorySlug,
}: EnhancedCatalogPageProps) {
  const [isFilterDrawerOpen, setIsFilterDrawerOpen] = useState(false);

  // Используем хук для получения продуктов каталога
  const {
    filteredProducts,
    isPending,
    isRefetching,
    error,
    filters,
    draftFilters,
    updateFilter,
    applyFilters,
    sortBy,
    setSortBy,
  } = useCatalogTRPC(categorySlug, subcategorySlug);

  // Адаптер для функции фильтрации
  const handleFilterChange = (filterType: string, value: any) => {
    updateFilter(filterType as any, value);
  };

  // Get category, subcategory and subsubcategory names for display
  const categoryName = getCategoryName(categorySlug);
  const subcategoryName = getSubcategoryName(subcategorySlug);
  const subsubcategoryName = getSubSubcategoryName(subsubcategorySlug);

  if (isPending && filteredProducts.length === 0) {
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

  // Определяем заголовок страницы
  const getPageTitle = () => {
    if (subsubcategorySlug && subsubcategoryName) {
      return subsubcategoryName;
    }
    if (subcategorySlug && subcategoryName) {
      return subcategoryName;
    }
    if (categorySlug && categoryName) {
      return categoryName;
    }
    return "Каталог";
  };

  // Определяем подзаголовок
  const getPageSubtitle = () => {
    const parts = [];
    if (categorySlug && categoryName) parts.push(categoryName);
    if (subcategorySlug && subcategoryName) parts.push(subcategoryName);
    if (subsubcategorySlug && subsubcategoryName) parts.push(subsubcategoryName);

    if (parts.length > 1) {
      return parts.join(" > ");
    }
    return "";
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="font-playfair text-3xl md:text-4xl font-bold mb-2">
          {getPageTitle()}
        </h1>
        {getPageSubtitle() && (
          <p className="text-muted-foreground mb-2">{getPageSubtitle()}</p>
        )}
        <p className="text-muted-foreground">
          {filteredProducts.length === 0
            ? "Товары не найдены"
            : `Найдено ${filteredProducts.length} товаров`}
        </p>
      </div>

      {/* Controls */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          {/* Sort */}
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-48">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="newest">Сначала новые</SelectItem>
              <SelectItem value="price-asc">Сначала дешевые</SelectItem>
              <SelectItem value="price-desc">Сначала дорогие</SelectItem>
              <SelectItem value="popular">Популярные</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Mobile Filters */}
        <Sheet open={isFilterDrawerOpen} onOpenChange={setIsFilterDrawerOpen}>
          <SheetTrigger asChild>
            <Button variant="outline" className="md:hidden">
              <SlidersHorizontal className="h-4 w-4 mr-2" />
              Фильтры
            </Button>
          </SheetTrigger>
          <SheetContent>
            <SheetHeader>
              <SheetTitle>Фильтры</SheetTitle>
            </SheetHeader>
            <div className="mt-6 space-y-6">
              <CategorySidebar
                categorySlug={categorySlug}
                subcategorySlug={subcategorySlug}
                subsubcategorySlug={subsubcategorySlug}
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
                categorySlug={categorySlug || "all"}
              />
            </div>
          </SheetContent>
        </Sheet>
      </div>

      <div className="grid lg:grid-cols-4 gap-8">
        {/* Desktop Sidebar */}
        <div className="hidden lg:block">
          <CategorySidebar
            categorySlug={categorySlug}
            subcategorySlug={subcategorySlug}
            subsubcategorySlug={subsubcategorySlug}
          />
          <Separator className="my-6" />
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
            categorySlug={categorySlug || "all"}
          />
        </div>

        {/* Products */}
        <div className="lg:col-span-3">
          {filteredProducts.length === 0 ? (
            <div className="text-center py-16">
              <h2 className="font-playfair text-2xl font-bold mb-4">
                Товары не найдены
              </h2>
              <p className="text-muted-foreground">
                Попробуйте изменить фильтры или поисковый запрос
              </p>
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
    </div>
  );
}

// Вспомогательные функции для получения названий категорий
function getCategoryName(slug?: string): string {
  if (!slug) return "";

  const categoryMap: Record<string, string> = {
    women: "Женщинам",
    men: "Мужчинам",
    kids: "Детям",
    accessories: "Аксессуары",
    beauty: "Красота",
  };
  return categoryMap[slug] || slug;
}

function getSubcategoryName(slug?: string): string {
  if (!slug) return "";

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

function getSubSubcategoryName(slug?: string): string {
  if (!slug) return "";

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
