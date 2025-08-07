"use client";

import { Button } from "@qco/ui/components/button";
import { useQuery } from "@tanstack/react-query";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useRef, useState } from "react";
import { useTRPC } from "@/trpc/react";
import ProductCard from "./product-card";
import {
  ProductGridSkeleton,
  ProductRowSkeleton,
  ProductSkeleton,
} from "./product-skeleton";

const CATEGORY_SLUG = "detyam";

export default function ProductGridKids() {
  const trpc = useTRPC();
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [scrollPosition, setScrollPosition] = useState(0);

  // Получаем новинки для категории детей
  const newProductsQueryOptions = trpc.products.getByCategory.queryOptions({
    categorySlug: CATEGORY_SLUG,
    limit: 10,
    sort: "newest",
  });
  const {
    data: newProductsData,
    isLoading: isNewProductsLoading,
    error: newProductsError,
  } = useQuery(newProductsQueryOptions);
  const newProducts = newProductsData?.products?.map(normalizeProduct) || [];

  // Получаем популярные товары для категории детей
  const featuredProductsQueryOptions = trpc.products.getByCategory.queryOptions(
    {
      categorySlug: CATEGORY_SLUG,
      limit: 8,
      sort: "popular",
    },
  );
  const {
    data: featuredProductsData,
    isLoading: isFeaturedProductsLoading,
    error: featuredProductsError,
  } = useQuery(featuredProductsQueryOptions);
  const featuredProducts =
    featuredProductsData?.products?.map(normalizeProduct) || [];

  // Нормализуем данные товаров для совместимости с ProductCard
  function normalizeProduct(product: any) {
    return {
      id: product.id,
      name: product.name,
      slug: product.slug,
      inStock:
        typeof product.inStock === "boolean"
          ? product.inStock
          : product.stock
            ? product.stock > 0
            : true,
      basePrice: product.basePrice ?? 0,
      onSale: Boolean(
        typeof product.onSale === "boolean"
          ? product.onSale
          : !!product.salePrice
      ),
      brand: product.brand ?? "",
      description: product.description ?? "",
      salePrice: product.salePrice,
      image: product.image,
      images: product.images ?? [],
      isNew: product.isNew ?? false,
      rating: product.rating ?? 0,
      attributes: product.attributes ?? {},
      tags: product.tags ?? [],
      features: product.features ?? [],
      variants: product.variants ?? [],
      relatedProducts: product.relatedProducts ?? [],
    };
  }

  // Дублируем товары для заполнения слайдера, если их меньше 10
  const displayNewProducts =
    newProducts && newProducts.length > 0
      ? Array.from({ length: 10 }).map(
        (_, i) => newProducts[i % newProducts.length],
      )
      : [];

  // Функции для скролла
  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: -200, behavior: "smooth" });
      setScrollPosition(Math.max(0, scrollPosition - 200));
    }
  };

  const scrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: 200, behavior: "smooth" });
      setScrollPosition(scrollPosition + 200);
    }
  };

  return (
    <section className="container py-8 space-y-8">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold tracking-tight">
            Новинки для детей
          </h2>
          <div className="hidden md:flex items-center gap-2">
            <Button
              variant="outline"
              size="icon"
              onClick={scrollLeft}
              disabled={scrollPosition <= 0}
            >
              <ChevronLeft className="h-4 w-4" />
              <span className="sr-only">Прокрутить влево</span>
            </Button>
            <Button variant="outline" size="icon" onClick={scrollRight}>
              <ChevronRight className="h-4 w-4" />
              <span className="sr-only">Прокрутить вправо</span>
            </Button>
          </div>
        </div>

        <div>
          {/* Desktop version - controlled scroll with buttons */}
          <div className="hidden md:block">
            <div className="overflow-x-hidden pb-4" ref={scrollContainerRef}>
              {isNewProductsLoading ? (
                <ProductRowSkeleton count={10} />
              ) : newProductsError ? (
                <div className="text-center py-8 text-muted-foreground">
                  Ошибка загрузки новинок
                </div>
              ) : (
                <div className="flex gap-6 w-max">
                  {displayNewProducts.map((product, index) => (
                    <div
                      key={`new-kids-${product.id}-${index}`}
                      className="w-52 flex-shrink-0 first:ml-4 last:mr-4"
                    >
                      <ProductCard product={product} />
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Mobile version - horizontal scroll layout */}
          <div className="md:hidden">
            {isNewProductsLoading ? (
              <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
                {Array.from({ length: 10 }).map((_, index) => (
                  <div
                    key={`new-kids-mobile-skeleton-${index}`}
                    className="w-44 flex-shrink-0"
                  >
                    <ProductSkeleton />
                  </div>
                ))}
              </div>
            ) : newProductsError ? (
              <div className="text-center py-8 text-muted-foreground">
                Ошибка загрузки новинок
              </div>
            ) : (
              <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
                {displayNewProducts.map((product, index) => (
                  <div
                    key={`new-kids-mobile-${product.id}-${index}`}
                    className="w-44 flex-shrink-0"
                  >
                    <ProductCard product={product} />
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold tracking-tight">
            Популярные товары для детей
          </h2>
        </div>

        {isFeaturedProductsLoading ? (
          <ProductGridSkeleton count={8} />
        ) : featuredProductsError ? (
          <div className="text-center py-8 text-muted-foreground">
            Ошибка загрузки избранных товаров
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-8">
            {featuredProducts?.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
