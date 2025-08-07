"use client";

import { Skeleton } from "@qco/ui/components/skeleton";
import type { BrandListItem } from "@qco/web-validators";
import { BrandCard } from "./brand-card";

interface BrandsGridProps {
  brands: BrandListItem[];
  isLoading?: boolean;
  error?: Error | null;
  className?: string;
}

export function BrandsGrid({
  brands,
  isLoading,
  error,
  className = "",
}: BrandsGridProps) {
  if (isLoading) {
    return (
      <>
        {/* Desktop Skeleton */}
        <div
          className={`hidden md:grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-x-8 gap-y-12 items-center justify-items-center ${className}`}
        >
          {Array.from({ length: 12 }, (_, index) => (
            <div
              key={`desktop-brand-skeleton-${index}`}
              className="w-full h-20 flex items-center justify-center p-4 rounded-lg"
            >
              <Skeleton className="w-24 h-8" />
            </div>
          ))}
        </div>

        {/* Mobile Skeleton */}
        <div className="md:hidden">
          <div className="flex gap-6 overflow-x-auto pb-4 scrollbar-hide -mx-4 px-4">
            {Array.from({ length: 9 }, (_, index) => (
              <div
                key={`mobile-brand-skeleton-${index}`}
                className="flex-shrink-0 w-36 h-20 flex items-center justify-center p-3 rounded-lg"
              >
                <Skeleton className="w-20 h-6" />
              </div>
            ))}
          </div>
        </div>
      </>
    );
  }

  if (error) {
    return (
      <div className="text-center py-16">
        <h2 className="text-2xl font-bold mb-4">Ошибка загрузки брендов</h2>
        <p className="text-muted-foreground">Попробуйте обновить страницу</p>
      </div>
    );
  }

  if (brands.length === 0) {
    return (
      <div className="text-center py-16">
        <p className="text-muted-foreground mb-4">Бренды временно недоступны</p>
      </div>
    );
  }

  return (
    <>
      {/* Desktop Grid */}
      <div
        className={`hidden md:grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-x-8 gap-y-12 items-center justify-items-center ${className}`}
      >
        {brands.map((brand) => (
          <BrandCard key={brand.id} brand={brand} />
        ))}
      </div>

      {/* Mobile Grid - Horizontal Scroll */}
      <div className="md:hidden">
        <div className="flex gap-6 overflow-x-auto pb-4 scrollbar-hide -mx-4 px-4">
          {brands.slice(0, 9).map((brand) => (
            <BrandCard
              key={`mobile-${brand.id}`}
              brand={brand}
              className="flex-shrink-0 w-36"
            />
          ))}
        </div>
      </div>
    </>
  );
}
