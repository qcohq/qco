"use client";

import { Card, CardContent } from "@qco/ui/components/card";
import { Skeleton } from "@qco/ui/components/skeleton";
import Image from "next/image";
import Link from "next/link";
import { useRootCategories } from "../hooks/use-root-categories";

export function CatalogCategories() {
  const { data: categories, isLoading } = useRootCategories();

  if (isLoading) {
    return (
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Основные категории</h2>
        <div className="grid md:grid-cols-4 gap-4">
          {Array.from({ length: Math.min(categories?.length || 4, 4) }, (_, i) => (
            <Card
              key={`category-skeleton-${i}`}
              className="hover:shadow-lg transition-shadow cursor-pointer"
            >
              <CardContent className="p-4">
                <Skeleton className="relative aspect-square bg-gray-100 rounded-lg mb-3" />
                <Skeleton className="h-5 w-3/4 mb-2" />
                <Skeleton className="h-4 w-1/2" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (!categories || categories.length === 0) {
    return null;
  }

  return (
    <div className="mb-8">
      <h2 className="text-xl font-semibold mb-4">Основные категории</h2>
      <div className="grid md:grid-cols-4 gap-4">
        {categories.map((category) => (
          <Link key={category.id} href={`/catalog/${category.slug}`}>
            <Card className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardContent className="p-4">
                <div className="relative aspect-square bg-gray-100 rounded-lg overflow-hidden mb-3">
                  {category.image?.url && (
                    <Image
                      src={category.image.url}
                      alt={category.name}
                      fill
                      className="object-cover"
                    />
                  )}
                </div>
                <h3 className="font-semibold">{category.name}</h3>
                <p className="text-sm text-muted-foreground">
                  {category.productsCount || 0} товаров
                </p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
