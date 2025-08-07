"use client";

import { Button } from "@qco/ui/components/button";
import type { BrandListItem } from "@qco/web-validators";
import Image from "next/image";
import Link from "next/link";
import { useFeaturedBrands } from "../hooks/use-featured-brands";
import { BrandsGrid } from "./brands-grid";
import { BrandsHeader } from "./brands-header";

interface FeaturedBrandsProps {
  limit?: number;
  showViewAll?: boolean;
  className?: string;
}

export function FeaturedBrands({
  limit = 6,
  showViewAll = true,
  className = "",
}: FeaturedBrandsProps) {
  const { brands, isLoading, error } = useFeaturedBrands({ limit });

  if (error || (!isLoading && (!brands || brands.length === 0))) {
    return null;
  }

  // Преобразуем данные для совместимости с BrandListItem
  const transformedBrands: BrandListItem[] = brands.map((brand) => ({
    id: brand.id,
    name: brand.name,
    slug: brand.slug,
    logo: brand.logo,
    country: brand.country,
    isFeatured: brand.isFeatured,
  }));

  return (
    <section className={`py-16 bg-gray-50 ${className}`}>
      <div className="container mx-auto px-4">
        <BrandsHeader
          title="Избранные бренды"
          description="Откройте для себя мир роскошных брендов и эксклюзивных коллекций"
          isLoading={isLoading}
        />

        <BrandsGrid
          brands={transformedBrands}
          isLoading={isLoading}
          error={error}
          className="grid-cols-2 sm:grid-cols-3 md:grid-cols-6"
        />

        {showViewAll && !isLoading && brands.length > 0 && (
          <div className="text-center mt-12">
            <Button asChild variant="outline">
              <Link href="/brands">Смотреть все бренды</Link>
            </Button>
          </div>
        )}
      </div>
    </section>
  );
}
