"use client";

import { NewProductsGrid } from "@/features/new-products/components/new-products-grid";
import { NewProductsHeader } from "@/features/new-products/components/new-products-header";
import { NewProductsLoading } from "@/features/new-products/components/new-products-loading";
import { useNewProductsData } from "@/features/new-products/hooks/use-new-products-data";

export default function KidsNewPage() {
  const { products, isLoading } = useNewProductsData("kids");

  if (isLoading) {
    return <NewProductsLoading />;
  }

  return (
    <div className="min-h-screen">
      <main className="container mx-auto px-4 py-8">
        <NewProductsHeader category="kids" />
        <NewProductsGrid products={products || []} />
      </main></div>
  );
}
