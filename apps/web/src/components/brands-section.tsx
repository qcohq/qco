"use client";

import type { FeaturedBrand } from "@qco/web-validators";
import { useQuery } from "@tanstack/react-query";
import Image from "next/image";
import Link from "next/link";
import { useTRPC } from "@/trpc/react";

function BrandsSkeleton() {
  // 12 skeletons для desktop, 9 для mobile
  return (
    <>
      {/* Desktop Grid Skeleton */}
      <div className="hidden md:grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-x-8 gap-y-12 items-center justify-items-center">
        {Array.from({ length: 12 }, (_, i) => (
          <div key={`desktop-skeleton-${i}`} className="w-full animate-pulse">
            <div className="relative w-full h-20 flex items-center justify-center p-4 rounded-lg bg-gray-100">
              <div className="bg-gray-200 rounded h-10 w-32" />
            </div>
          </div>
        ))}
      </div>
      {/* Mobile Grid Skeleton */}
      <div className="md:hidden">
        <div className="flex gap-6 overflow-x-auto pb-4 scrollbar-hide -mx-4 px-4">
          {Array.from({ length: 9 }, (_, i) => (
            <div key={`mobile-skeleton-${i}`} className="flex-shrink-0 w-36 animate-pulse">
              <div className="relative h-20 flex items-center justify-center p-3 rounded-lg bg-gray-100">
                <div className="bg-gray-200 rounded h-8 w-24" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

export default function BrandsSection() {
  const trpc = useTRPC();

  // Создаем опции запроса для получения избранных брендов
  const featuredBrandsQueryOptions = trpc.brands.getFeatured.queryOptions({
    limit: 12,
  });

  // Используем опции с хуком useQuery
  const {
    data: brands,
    isPending,
    error,
  } = useQuery(featuredBrandsQueryOptions);

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="font-playfair text-3xl md:text-4xl font-bold mb-4">
            Наши бренды
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto">
            Мы гордимся сотрудничеством с ведущими мировыми домами моды,
            предлагая вам только лучшее.
          </p>
        </div>
        {isPending ? (
          <BrandsSkeleton />
        ) : error ? (
          <div className="flex justify-center">
            <div className="text-red-500">Ошибка загрузки брендов</div>
          </div>
        ) : !brands || brands.length === 0 ? (
          <div className="flex justify-center">
            <div className="text-muted-foreground">
              Избранные бренды пока не добавлены
            </div>
          </div>
        ) : (
          <>
            {/* Desktop Grid */}
            <div className="hidden md:grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-x-8 gap-y-12 items-center justify-items-center">
              {brands.map((brand: FeaturedBrand) => (
                <Link
                  key={brand.id}
                  href={`/brands/${brand.slug}`}
                  className="group block w-full"
                  aria-label={`Перейти к бренду ${brand.name}`}
                >
                  <div className="relative w-full h-20 flex items-center justify-center p-4 rounded-lg transition-all duration-300 ease-in-out hover:shadow-lg hover:bg-gray-50">
                    <Image
                      src={brand.logo || "/placeholder.svg?width=130&height=50"}
                      alt={`${brand.name} logo`}
                      width={130}
                      height={50}
                      className="object-contain max-h-10 w-auto group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                </Link>
              ))}
            </div>
            {/* Mobile Grid - Horizontal Scroll */}
            <div className="md:hidden">
              <div className="flex gap-6 overflow-x-auto pb-4 scrollbar-hide -mx-4 px-4">
                {brands.slice(0, 9).map((brand: FeaturedBrand) => (
                  <Link
                    key={`mobile-${brand.id}`}
                    href={`/brands/${brand.slug}`}
                    className="group block flex-shrink-0 w-36"
                    aria-label={`Перейти к бренду ${brand.name}`}
                  >
                    <div className="relative h-20 flex items-center justify-center p-3 rounded-lg transition-all duration-300 ease-in-out group-hover:shadow-md">
                      <Image
                        src={
                          brand.logo || "/placeholder.svg?width=100&height=40"
                        }
                        alt={`${brand.name} logo`}
                        width={100}
                        height={40}
                        className="object-contain max-h-8 w-auto group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </>
        )}
      </div>
    </section>
  );
}
