"use client";

import { Badge } from "@qco/ui/components/badge";
import { Button } from "@qco/ui/components/button";
import { Card, CardContent } from "@qco/ui/components/card";
import { Input } from "@qco/ui/components/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@qco/ui/components/select";
import { AlertCircle, Search, SortAsc } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import type React from "react";
import { useState } from "react";
import { useProductSearch } from "../hooks/use-product-search";
import ProductCard from "./product-card";
import { CatalogSkeleton } from "@/features/catalog/components/catalog-skeleton";

export interface SearchFilters {
  categoryId?: string;
  brandId?: string;
  minPrice?: number;
  maxPrice?: number;
  sort:
  | "relevance"
  | "newest"
  | "price-asc"
  | "price-desc"
  | "name-asc"
  | "name-desc";
}

interface SearchResultsPageProps {
  searchQuery: string;
  filters: SearchFilters;
}

const popularSearches = [
  "платье",
  "джинсы",
  "кроссовки",
  "сумка",
  "куртка",
  "рубашка",
  "юбка",
  "ботинки",
  "свитер",
  "брюки",
];

const searchSuggestions = [
  { query: "платье", count: 156 },
  { query: "джинсы", count: 89 },
  { query: "кроссовки", count: 234 },
  { query: "сумка", count: 67 },
];

export default function SearchResultsPage({
  searchQuery,
  filters,
}: SearchResultsPageProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [currentQuery, setCurrentQuery] = useState(searchQuery);

  // Используем хук для поиска продуктов
  const { products, totalCount, isLoading, error } = useProductSearch({
    query: searchQuery,
    categoryId: filters.categoryId,
    brandId: filters.brandId,
    minPrice: filters.minPrice,
    maxPrice: filters.maxPrice,
    sort: filters.sort,
    limit: 20,
    offset: 0,
  });

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (currentQuery.trim()) {
      const params = new URLSearchParams(searchParams);
      params.set("q", currentQuery.trim());
      router.push(`/search?${params.toString()}`);
    }
  };

  const handleFilterChange = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams);
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    router.push(`/search?${params.toString()}`);
  };

  const clearFilters = () => {
    const params = new URLSearchParams();
    if (searchQuery) params.set("q", searchQuery);
    router.push(`/search?${params.toString()}`);
  };

  const hasActiveFilters =
    filters.categoryId ||
    filters.brandId ||
    filters.minPrice ||
    filters.maxPrice;

  if (isLoading) {
    return (
      <div className="space-y-6">
        {/* Поисковая строка */}
        <Card>
          <CardContent className="p-6">
            <form onSubmit={handleSearch} className="flex gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  type="text"
                  placeholder="Поиск товаров..."
                  value={currentQuery}
                  onChange={(e) => setCurrentQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Button type="submit">Найти</Button>
            </form>
          </CardContent>
        </Card>

        <div className="text-center py-16">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto mb-4" />
          <p className="text-muted-foreground">Поиск товаров...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        {/* Поисковая строка */}
        <Card>
          <CardContent className="p-6">
            <form onSubmit={handleSearch} className="flex gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  type="text"
                  placeholder="Поиск товаров..."
                  value={currentQuery}
                  onChange={(e) => setCurrentQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Button type="submit">Найти</Button>
            </form>
          </CardContent>
        </Card>

        <div className="text-center py-16">
          <AlertCircle className="h-16 w-16 mx-auto text-red-400 mb-6" />
          <h1 className="font-playfair text-3xl font-bold mb-4">
            Ошибка поиска
          </h1>
          <p className="text-muted-foreground mb-8">
            Не удалось выполнить поиск: {error.message}
          </p>
          <Button onClick={() => window.location.reload()} size="lg">
            Попробовать снова
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Поисковая строка */}
      <Card>
        <CardContent className="p-6">
          <form onSubmit={handleSearch} className="flex gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                type="text"
                placeholder="Поиск товаров..."
                value={currentQuery}
                onChange={(e) => setCurrentQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button type="submit">Найти</Button>
          </form>
        </CardContent>
      </Card>

      {/* Результаты поиска */}
      {searchQuery && (
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">
              Результаты поиска: "{searchQuery}"
            </h1>
            <p className="text-muted-foreground mt-1">
              Найдено товаров: {totalCount}
            </p>
          </div>

          {/* Сортировка */}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <SortAsc className="h-4 w-4" />
              <Select
                value={filters.sort}
                onValueChange={(value) => handleFilterChange("sort", value)}
              >
                <SelectTrigger className="w-48">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="relevance">По релевантности</SelectItem>
                  <SelectItem value="price-asc">
                    Цена: по возрастанию
                  </SelectItem>
                  <SelectItem value="price-desc">Цена: по убыванию</SelectItem>
                  <SelectItem value="name-asc">По названию А-Я</SelectItem>
                  <SelectItem value="name-desc">По названию Я-А</SelectItem>
                  <SelectItem value="newest">Сначала новые</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      )}

      {/* Активные фильтры */}
      {hasActiveFilters && (
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-sm font-medium">Активные фильтры:</span>
          {filters.categoryId && (
            <Badge variant="secondary" className="gap-1">
              Категория: {filters.categoryId}
              <button onClick={() => handleFilterChange("categoryId", "")}>
                ×
              </button>
            </Badge>
          )}
          {filters.brandId && (
            <Badge variant="secondary" className="gap-1">
              Бренд: {filters.brandId}
              <button onClick={() => handleFilterChange("brandId", "")}>
                ×
              </button>
            </Badge>
          )}
          {(filters.minPrice || filters.maxPrice) && (
            <Badge variant="secondary" className="gap-1">
              Цена: {filters.minPrice || 0} - {filters.maxPrice || "∞"} ₽
              <button
                onClick={() => {
                  handleFilterChange("minPrice", "");
                  handleFilterChange("maxPrice", "");
                }}
              >
                ×
              </button>
            </Badge>
          )}
          <Button variant="ghost" size="sm" onClick={clearFilters}>
            Очистить все
          </Button>
        </div>
      )}

      {/* Результаты */}
      {isLoading ? (
        <CatalogSkeleton count={8} showTitle={false} />
      ) : products.length === 0 ? (
        <div className="text-center py-16">
          <Search className="h-16 w-16 mx-auto text-gray-400 mb-6" />
          <h2 className="font-playfair text-2xl font-bold mb-4">
            Товары не найдены
          </h2>
          <p className="text-muted-foreground mb-8">
            По запросу "{searchQuery}" ничего не найдено. Попробуйте изменить
            поисковый запрос или фильтры.
          </p>

          {/* Популярные поиски */}
          <div className="space-y-4">
            <h3 className="font-medium">Популярные поиски:</h3>
            <div className="flex flex-wrap gap-2 justify-center">
              {popularSearches.map((search) => (
                <Button
                  key={search}
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setCurrentQuery(search);
                    const params = new URLSearchParams();
                    params.set("q", search);
                    router.push(`/search?${params.toString()}`);
                  }}
                >
                  {search}
                </Button>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}
