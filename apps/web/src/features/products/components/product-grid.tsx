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
import Link from "next/link";

interface ProductGridProps {
  categorySlug?: string;
}


export default function ProductGrid({ categorySlug }: ProductGridProps) {
  const [scrollPosition, setScrollPosition] = useState(0);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const trpc = useTRPC();

  // Создаем опции запросов с помощью queryOptions
  const newProductsQueryOptions = trpc.products.getNewArrivals.queryOptions({
    limit: 10,
    categorySlug,
  });
  const featuredProductsQueryOptions = trpc.products.getFeatured.queryOptions({
    limit: 8,
    categorySlug,
  });

  // Используем опции с хуком useQuery
  const {
    data: newProducts,
    isPending: isNewProductsLoading,
    error: newProductsError,
  } = useQuery(newProductsQueryOptions);
  const {
    data: featuredProducts,
    isPending: isFeaturedProductsLoading,
    error: featuredProductsError,
  } = useQuery(featuredProductsQueryOptions);
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

  return (
    <section className="py-16 overflow-hidden">
      <div className="container mx-auto px-4">
        {/* Новинки - горизонтальный скролл */}
        <div className="mb-16">
          <div className="text-center mb-8">
            <h2 className="font-playfair text-3xl md:text-4xl font-bold mb-4">
              Новинки
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Откройте для себя последние поступления от ведущих мировых брендов
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
                  {newProducts?.map((product, index) => (
                    <div
                      key={`new-${product.id}-${index}`}
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
                    key={`new-mobile-skeleton-${index}`}
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
                {newProducts?.map((product, index) => (
                  <div
                    key={`new-mobile-${product.id}-${index}`}
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
              Посмотреть все новинки
            </Button>
          </div>
        </div>

        {/* Избранные товары */}
        <div className="text-center mb-12">
          <h2 className="font-playfair text-3xl md:text-4xl font-bold mb-4">
            Избранные товары
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Откройте для себя нашу тщательно отобранную коллекцию роскошных
            товаров от ведущих мировых брендов
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
          <Link href={
            categorySlug === "zhenschinam"
              ? "/women/sale"
              : categorySlug === "muzhchinam"
                ? "/men/sale"
                : categorySlug === "detyam"
                  ? "/kids/sale"
                  : "/sale"
          }>
            <Button size="lg" variant="outline">
              Смотреть все товары
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
