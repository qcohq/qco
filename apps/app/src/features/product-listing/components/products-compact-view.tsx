"use client";

import { Card } from "@qco/ui/components/card";
import type { ProductTableItem } from "@qco/validators";
import { CompactProductList } from "@/features/product-listing/components/compact-product-list";
import { ProductsPagination } from "@/features/product-listing/components/products-pagination";

interface ProductsCompactViewProps {
  products: ProductTableItem[];
  selectedProducts: string[];
  totalProducts: number;
  currentPage: number;
  totalPages: number;
  pageSize: number;
  onSelectProduct: (productId: string, selected: boolean) => void;
  onPageChange: (page: number) => void;
  onPageSizeChange: (size: number) => void;
  onProductDeleted: (productId: string) => void;
}

export function ProductsCompactView({
  products,
  selectedProducts,
  totalProducts,
  currentPage,
  totalPages,
  pageSize,
  onSelectProduct,
  onPageChange,
  onPageSizeChange,
  onProductDeleted,
}: ProductsCompactViewProps) {
  return (
    <Card className="overflow-hidden border-0 shadow-sm">
      <CompactProductList
        products={products}
        selectedProducts={selectedProducts}
        onSelectProduct={onSelectProduct}
        onProductDeleted={onProductDeleted}
      />

      <ProductsPagination
        currentPage={currentPage}
        pageSize={pageSize}
        totalItems={totalProducts}
        totalPages={totalPages}
        onPageChange={onPageChange}
        onPageSizeChange={onPageSizeChange}
      />
    </Card>
  );
}
