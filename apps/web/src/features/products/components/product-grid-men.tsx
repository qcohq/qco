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

const CATEGORY_SLUG = "muzhchinam";

export default function ProductGridMen() {
  const [scrollPosition, setScrollPosition] = useState(0);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const trpc = useTRPC();

  // Получаем товары для мужчин через getByCategory
  const newProductsQueryOptions = trpc.products.getByCategory.queryOptions({
    categorySlug: CATEGORY_SLUG,
    limit: 10,
    sort: "newest",
  });
  // sort: 'popular' вместо 'featured', так как 'featured' не поддерживается
  const featuredProductsQueryOptions = trpc.products.getByCategory.queryOptions(
    { categorySlug: CATEGORY_SLUG, limit: 8, sort: "popular" },
  );

  const {
    data: newProductsData,
    isPending: isNewProductsLoading,
    error: newProductsError,
  } = useQuery(newProductsQueryOptions);
  const {
    data: featuredProductsData,
    isPending: isFeaturedProductsLoading,
    error: featuredProductsError,
  } = useQuery(featuredProductsQueryOptions);

  // Привести товары к нужному виду для ProductCard (добавить недостающие поля)
  const normalizeProduct = (product: any) => ({
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
  });
  const newProducts = (newProductsData?.products || []).map(normalizeProduct);
  const featuredProducts = (featuredProductsData?.products || []).map(
    normalizeProduct,
  );

  const scroll = (direction: "left" | "right") => {
    if (scrollContainerRef.current) {
      const scrollAmount = 220;
      const newPosition =
        direction === "left"
          ? scrollPosition - scrollAmount
          : scrollPosition + scrollAmount;

      scrollContainerRef.current.scrollTo({
        left: newPosition,
        behavior: "smooth",
      });
      setScrollPosition(newPosition);
    }
  };

  const displayNewProducts =
    newProducts && newProducts.length > 0
      ? Array.from({ length: 10 }).map(
        (_, i) => newProducts[i % newProducts.length],
      )
      : [];

  return (
    <section className="py-16 overflow-hidden">
      <div className="container mx-auto px-4">
        {/* Новинки для мужчин */}
        <div className="mb-16">
          <div className="text-center mb-8">
            <h2 className="font-playfair text-3xl md:text-4xl font-bold mb-4">
              Новинки для мужчин
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Только для мужчин: последние поступления от ведущих брендов
            </p>
          </div>

          {/* Desktop version with arrows */}
          <div className="relative hidden md:block">
            <Button
              variant="outline"
              size="icon"
              className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white shadow-lg"
              onClick={() => scroll("left")}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>

            <Button
              variant="outline"
              size="icon"
              className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white shadow-lg"
              onClick={() => scroll("right")}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>

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
                      key={`new-men-${product.id}-${index}`}
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
                    key={`new-men-mobile-skeleton-${index}`}
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
                    key={`new-men-mobile-${product.id}-${index}`}
                    className="w-44 flex-shrink-0"
                  >
                    <ProductCard product={product} />
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="text-center mt-8">
            <Button size="lg" variant="outline">
              Посмотреть все новинки для мужчин
            </Button>
          </div>
        </div>

        {/* Избранные товары для мужчин */}
        <div className="text-center mb-12">
          <h2 className="font-playfair text-3xl md:text-4xl font-bold mb-4">
            Избранные товары для мужчин
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Эксклюзивная подборка мужских товаров
          </p>
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

        <div className="text-center mt-12">
          <Button size="lg" variant="outline">
            Смотреть все мужские товары
          </Button>
        </div>
      </div>
    </section>
  );
}
