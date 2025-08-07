"use client";

import { NewProductsGrid } from "@/features/new-products/components/new-products-grid";
import { NewProductsHeader } from "@/features/new-products/components/new-products-header";
import { NewProductsLoading } from "@/features/new-products/components/new-products-loading";
import { useNewProductsData } from "@/features/new-products/hooks/use-new-products-data";

export default function WomenNewPage() {
  const { products, isLoading } = useNewProductsData("women");

  if (isLoading) {
    return <NewProductsLoading />;
  }

  return (
    <div className="min-h-screen">
      <main className="container mx-auto px-4 py-8">
        <NewProductsHeader category="women" />
        <NewProductsGrid products={products || []} />
      </main></div>
  );
}
