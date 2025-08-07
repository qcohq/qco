"use client";

import { notFound } from "next/navigation";
import { useMemo, useState } from "react";
import { SlidersHorizontal } from "lucide-react";
import { Badge } from "@qco/ui/components/badge";
import { Button } from "@qco/ui/components/button";
import { Separator } from "@qco/ui/components/separator";
import { Skeleton } from "@qco/ui/components/skeleton";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@qco/ui/components/sheet";
import type { ProductItem } from "@qco/web-validators";
import Link from "next/link";
import BrandFiltersSidebar from "@/features/products/components/brand-filters-sidebar";
import ProductsList from "@/features/products/components/products-list";
import { useBrand } from "../hooks/use-brand";
import { useBrandProducts } from "../hooks/use-brand-products";
import type { CatalogFilters } from "@/features/products/types/catalog";

interface BrandDetailPageProps {
  slug: string;
}

function filterProducts(products: ProductItem[], filters: CatalogFilters) {
  return products.filter((product) => {
    // Фильтр по цене
    const price = product.salePrice ?? product.basePrice ?? 0;
    if (price < filters.priceRange[0] || price > filters.priceRange[1])
      return false;

    // Фильтр по размерам
    if (
      filters.sizes.length > 0 &&
      (!product.sizes ||
        !product.sizes.some((size) =>
          filters.sizes.includes(size),
        ))
    )
      return false;

    // Фильтр по цветам
    if (
      filters.colors.length > 0 &&
      (!product.colors ||
        !product.colors.some((color) =>
          filters.colors.includes(color),
        ))
    )
      return false;

    // Фильтр по наличию
    if (filters.inStock && !product.inStock) return false;

    // Фильтр по скидкам
    if (filters.onSale && !(product.salePrice && product.basePrice && product.salePrice < product.basePrice)) return false;

    // Фильтр по динамическим атрибутам
    if (filters.attributes && Object.keys(filters.attributes).length > 0) {
      for (const [attributeSlug, selectedValues] of Object.entries(filters.attributes)) {
        if (selectedValues.length > 0) {
          const productAttribute = product.attributes?.[attributeSlug];
          if (!productAttribute || !selectedValues.some((value: string) =>
            Array.isArray(productAttribute) && productAttribute.includes(value)
          )) {
            return false;
          }
        }
      }
    }

    return true;
  });
}

function BrandProductsWithFilters({ products, brandSlug }: { products: ProductItem[]; brandSlug: string }) {
  const [filters, setFilters] = useState<CatalogFilters>({
    priceRange: [0, 500000] as [number, number],
    brands: [],
    sizes: [],
    colors: [],
    categories: [],
    inStock: false,
    onSale: false,
    attributes: {},
  });
  const [isFilterDrawerOpen, setIsFilterDrawerOpen] = useState(false);

  const filteredProducts = useMemo(
    () => filterProducts(products, filters),
    [products, filters],
  );

  return (
    <div>
      {/* Мобильная кнопка фильтров */}
      <div className="flex justify-between items-center mb-6 lg:hidden">
        <h3 className="text-lg font-semibold">Товары ({filteredProducts.length})</h3>
        <Sheet open={isFilterDrawerOpen} onOpenChange={setIsFilterDrawerOpen}>
          <SheetTrigger asChild>
            <Button variant="outline">
              <SlidersHorizontal className="h-4 w-4 mr-2" />
              Фильтры
            </Button>
          </SheetTrigger>
          <SheetContent>
            <SheetHeader>
              <SheetTitle>Фильтры</SheetTitle>
            </SheetHeader>
            <div className="mt-6 space-y-6">
              <BrandFiltersSidebar
                filters={filters}
                onFilterChange={(type, value) =>
                  setFilters((prev) => ({ ...prev, [type]: value }))
                }
                onClearFilters={() =>
                  setFilters({
                    priceRange: [0, 500000] as [number, number],
                    brands: [],
                    sizes: [],
                    colors: [],
                    categories: [],
                    inStock: false,
                    onSale: false,
                    attributes: {},
                  })
                }
                brandSlug={brandSlug}
              />
            </div>
          </SheetContent>
        </Sheet>
      </div>

      <div className="grid lg:grid-cols-4 gap-8">
        {/* Desktop Sidebar */}
        <div className="hidden lg:block">
          <BrandFiltersSidebar
            filters={filters}
            onFilterChange={(type, value) =>
              setFilters((prev) => ({ ...prev, [type]: value }))
            }
            onClearFilters={() =>
              setFilters({
                priceRange: [0, 500000] as [number, number],
                brands: [],
                sizes: [],
                colors: [],
                categories: [],
                inStock: false,
                onSale: false,
                attributes: {},
              })
            }
            brandSlug={brandSlug}
          />
        </div>

        {/* Products */}
        <div className="lg:col-span-3">
          <ProductsList products={filteredProducts} />
        </div>
      </div>
    </div>
  );
}

export function BrandPageSkeleton() {
  return (
    <div className="grid lg:grid-cols-4 gap-8 mt-8">
      {/* Скелетон фильтров */}
      <div className="hidden lg:block space-y-6">
        <div className="h-8 w-32 bg-gray-200 rounded animate-pulse mb-4" />
        {/* Цена */}
        <div className="h-6 w-20 bg-gray-200 rounded animate-pulse mb-2" />
        <Skeleton className="h-8 w-full mb-2" />
        <Skeleton className="h-8 w-full mb-2" />
        <div className="h-6 w-20 bg-gray-200 rounded animate-pulse mb-2" />
        {/* Размеры */}
        <div className="grid grid-cols-4 gap-2 mb-2">
          {Array.from({ length: 8 }).map((_, i) => (
            <Skeleton key={`size-skeleton-${i}`} className="h-6 w-8" />
          ))}
        </div>
        <div className="h-6 w-20 bg-gray-200 rounded animate-pulse mb-2" />
        {/* Цвета */}
        <div className="grid grid-cols-2 gap-2">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={`color-skeleton-${i}`} className="h-6 w-16" />
          ))}
        </div>
      </div>
      {/* Скелетон товаров */}
      <div className="lg:col-span-3">
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-8">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={`product-skeleton-${i}`} className="space-y-4">
              <Skeleton className="aspect-[3/4] w-full rounded-lg" />
              <div className="space-y-2">
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export function BrandDetailPage({ slug }: BrandDetailPageProps) {
  const {
    brand,
    isLoading: isBrandLoading,
    error: brandError,
  } = useBrand(slug);
  const {
    products: brandProducts,
    totalCount,
    isLoading: isProductsLoading,
    error: productsError,
  } = useBrandProducts({
    brandSlug: slug,
    limit: 8,
    sort: "newest",
  });

  if (isBrandLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="space-y-12">
          {/* Brand Header Skeleton */}
          <div className="text-center space-y-6">
            <div className="w-48 h-32 mx-auto bg-gray-50 rounded-lg flex items-center justify-center">
              <div className="w-32 h-20 bg-gray-200 rounded animate-pulse" />
            </div>
            <div>
              <div className="h-12 w-64 mx-auto mb-4 bg-gray-200 rounded animate-pulse" />
              <div className="h-6 w-96 mx-auto bg-gray-200 rounded animate-pulse" />
            </div>
            <div className="flex items-center justify-center gap-8">
              <div className="text-center">
                <div className="h-4 w-16 mb-2 bg-gray-200 rounded animate-pulse" />
                <div className="h-4 w-12 bg-gray-200 rounded animate-pulse" />
              </div>
              <div className="w-px h-8 bg-gray-300" />
              <div className="text-center">
                <div className="h-4 w-16 mb-2 bg-gray-200 rounded animate-pulse" />
                <div className="h-4 w-12 bg-gray-200 rounded animate-pulse" />
              </div>
              <div className="w-px h-8 bg-gray-300" />
              <div className="text-center">
                <div className="h-4 w-16 mb-2 bg-gray-200 rounded animate-pulse" />
                <div className="h-4 w-12 bg-gray-200 rounded animate-pulse" />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (brandError || !brand) {
    notFound();
  }

  return (
    <div className="space-y-12">
      {/* Brand Header */}
      <div className="text-center space-y-6">
        <div>
          <h1 className="font-playfair text-4xl md:text-5xl font-bold mb-4">
            {brand.name}
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            {brand.shortDescription || brand.description || ""}
          </p>
        </div>

        {/* Categories */}
        <div className="flex flex-wrap justify-center gap-2">
          {/* Пока пустой массив, можно добавить логику получения категорий */}
        </div>
      </div>

      <Separator />

      {/* Products Section */}
      <div>
        <div className="flex items-center justify-between mb-8">
          <h2 className="font-playfair text-3xl font-bold">
            Товары {brand.name}
          </h2>
          <Button asChild>
            <Link href={`/catalog?brand=${brand.name.toLowerCase()}`}>
              Смотреть все
            </Link>
          </Button>
        </div>

        {isProductsLoading ? (
          <BrandPageSkeleton />
        ) : productsError ? (
          <div className="text-center py-16">
            <p className="text-muted-foreground mb-4">
              Ошибка загрузки товаров
            </p>
            <Button variant="outline" asChild>
              <Link href="/catalog">Посмотреть другие товары</Link>
            </Button>
          </div>
        ) : (
          <BrandProductsWithFilters products={brandProducts} brandSlug={slug} />
        )}
      </div>
    </div>
  );
}
