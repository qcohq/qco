"use client";

import {
  CatalogBanners,
  CatalogBrands,
  CatalogCategories,
  CatalogHeader,
  CatalogLoading,
  CatalogNewProducts,
  CatalogProducts,
} from "@/features/catalog/components";
import { useCatalogData } from "@/features/catalog/hooks/use-catalog-data";

export default function CatalogPage() {
  const { brands, banners, isLoading } = useCatalogData();

  if (isLoading) {
    return <CatalogLoading />;
  }

  return (
    <div className="min-h-screen">
      <main className="container mx-auto px-4 py-8">
        <CatalogHeader />

        <CatalogBanners banners={banners || []} />
        <CatalogCategories />
        <CatalogBrands brands={brands || []} />
        <CatalogNewProducts />
        <CatalogProducts />
      </main></div>
  );
}
