"use client";

import { ProductTile } from "./product-tile";
import type { Product } from "@qco/validators";

interface ProductGridProps {
  products: Product[];
  selectedProducts: string[];
  onSelectProduct: (id: string, selected: boolean) => void;
  tileSize?: "sm" | "md" | "lg";
  isLoading?: boolean;
  onProductDeleted: (productId: string) => void;
}

export function ProductGrid({
  products,
  selectedProducts,
  onSelectProduct,
  tileSize = "md",
  onProductDeleted,
}: ProductGridProps) {
  // Определяем количество колонок в зависимости от размера плитки
  const gridCols = {
    sm: "grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6",
    md: "grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5",
    lg: "grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5",
  };

  return (
    <div className={`grid min-w-0 ${gridCols[tileSize]} gap-4`}>
      {products.map((product) => (
        <ProductTile
          key={product.id}
          product={product}
          isSelected={selectedProducts.includes(product.id)}
          onSelect={onSelectProduct}
          size={tileSize}
          onProductDeleted={onProductDeleted}
        />
      ))}
    </div>
  );
}
