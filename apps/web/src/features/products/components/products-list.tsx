"use client";

import type { ProductItem } from "@qco/web-validators";
import ProductCard from "./product-card";

interface ProductsListProps {
  products: ProductItem[];
  className?: string;
}

export default function ProductsList({
  products,
  className = "",
}: ProductsListProps) {
  if (!products || products.length === 0) {
    return (
      <div className="text-center py-16">
        <p className="text-muted-foreground mb-4">Товары временно недоступны</p>
      </div>
    );
  }

  return (
    <div
      className={`grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-8 ${className}`}
    >
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
