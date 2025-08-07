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
import { SlidersHorizontal } from "lucide-react";
import { useCatalogTRPC } from "../hooks/use-catalog-trcp";
import ProductCard from "./product-card";
import ProductFiltersPanelDynamic from "./product-filters-panel-dynamic";

export default function CatalogPage() {
  // Используем хук для получения продуктов каталога
  const { filteredProducts, isPending, error, filters, updateFilter } =
    useCatalogTRPC();

  // Адаптер для функции фильтрации
  const handleFilterChange = (filterType: string, value: any) => {
    updateFilter(filterType as any, value);
  };

  if (isPending) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="font-playfair text-3xl md:text-4xl font-bold mb-2">
              Каталог
            </h1>
            <p className="text-muted-foreground">Загрузка товаров...</p>
          </div>
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
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-playfair text-3xl md:text-4xl font-bold mb-2">
            Каталог
          </h1>
          <p className="text-muted-foreground">
            {filteredProducts.length === 0
              ? "Товары не найдены"
              : `Найдено ${filteredProducts.length} товаров`}
          </p>
        </div>

        <div className="flex items-center gap-4">
          {/* Mobile Filters */}
          <Sheet>
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
              <ProductFiltersPanelDynamic
                filters={filters}
                onFilterChange={updateFilter}
                onClearFilters={() => {
                  updateFilter("brands", []);
                  updateFilter("sizes", []);
                  updateFilter("colors", []);
                  updateFilter("inStock", false);
                  updateFilter("onSale", false);
                  // Ценовой диапазон сбрасывается автоматически в хуке
                }}
                categorySlug="all"
              />
            </SheetContent>
          </Sheet>
        </div>
      </div>

      <div className="grid lg:grid-cols-4 gap-8">
        {/* Desktop Filters */}
        <div className="hidden lg:block">
          <ProductFiltersPanelDynamic
            filters={filters}
            onFilterChange={updateFilter}
            onClearFilters={() => {
              updateFilter("brands", []);
              updateFilter("sizes", []);
              updateFilter("colors", []);
              updateFilter("inStock", false);
              updateFilter("onSale", false);
              // Ценовой диапазон сбрасывается автоматически в хуке
            }}
            categorySlug="all"
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
