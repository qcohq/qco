"use client";

import { BrandsGrid } from "../components/brands-grid";
import { BrandsHeader } from "../components/brands-header";
import { BrandsPagination } from "../components/brands-pagination";
import { useBrands } from "../hooks/use-brands";

interface BrandsListPageProps {
  limit?: number;
  sortBy?: "name" | "createdAt" | "isFeatured";
  sortOrder?: "asc" | "desc";
  search?: string;
  featured?: boolean;
}

export function BrandsListPage({
  limit = 50,
  sortBy = "name",
  sortOrder = "asc",
  search,
  featured,
}: BrandsListPageProps) {
  const {
    brands,
    totalCount,
    totalPages,
    currentPage,
    isLoading,
    error,
  } = useBrands({
    limit,
    sortBy,
    sortOrder,
    search,
    featured,
  });

  return (
    <div className="container mx-auto px-4 py-8">
      <BrandsHeader isLoading={isLoading} />

      <BrandsGrid brands={brands} isLoading={isLoading} error={error} />

      <BrandsPagination
        totalCount={totalCount}
        currentCount={brands.length}
        totalPages={totalPages}
        currentPage={currentPage}
      />
    </div>
  );
}
