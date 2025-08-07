"use client";

import { Skeleton } from "@qco/ui/components/skeleton";
import type { ProductItem } from "@qco/web-validators";
import { useQuery } from "@tanstack/react-query";
import ProductCard from "@/features/products/components/product-card";
import { useTRPC } from "@/trpc/react";

export function CatalogNewProducts() {
  const trpc = useTRPC();

  const {
    data: newProducts,
    isLoading,
    error,
  } = useQuery(
    trpc.products.getNew.queryOptions({
      category: "women", // Можно сделать динамическим
      limit: 4,
      days: 30,
    }),
  );

  if (isLoading) {
    return (
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Новинки</h2>
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-8">
          {Array.from({ length: 4 }, (_, i) => (
            <div key={`new-product-skeleton-${i}`} className="space-y-4">
              <Skeleton className="aspect-[3/4] w-full rounded-lg" />
              <div className="space-y-2">
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error || !newProducts || newProducts.length === 0) {
    return null; // Скрываем секцию, если нет новинок
  }

  // Преобразуем данные в формат ProductItem
  const products: ProductItem[] = newProducts.map((product) => ({
    id: product.id,
    name: product.name,
    slug: product.slug,
    description: product.description || undefined,
    basePrice: product.basePrice || 0,
    salePrice: product.salePrice || undefined,
    onSale: product.onSale || false,
    image: product.image || undefined,
    images: product.images || undefined,
    brand: product.brand || "",
    inStock: product.inStock || true,
    category: product.category || undefined,
    isNew: product.isNew || true, // Новинки всегда помечены как новые
    rating: product.rating || 4.5,
  }));

  return (
    <div className="mb-8">
      <h2 className="text-xl font-semibold mb-4">Новинки</h2>
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-8">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
}
