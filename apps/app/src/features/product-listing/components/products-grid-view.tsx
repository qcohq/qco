"use client";

import type { ProductTableItem } from "@qco/validators";
import { EmptyProductsState } from "@/features/product-listing/components/empty-products-state";
import { ProductGrid } from "@/features/product-listing/components/product-grid";
import { ProductsPagination } from "@/features/product-listing/components/products-pagination";

interface ProductsGridViewProps {
  products: ProductTableItem[];
  selectedProducts: string[];
  totalProducts: number;
  currentPage: number;
  totalPages: number;
  pageSize: number;
  error: string | null;
  filters: {
    search: string;
    category: string;
    status: string;
  };
  onSelectProduct: (productId: string, selected: boolean) => void;
  onPageChange: (page: number) => void;
  onPageSizeChange: (size: number) => void;
  onProductDeleted: (productId: string) => void;
  onRetry?: () => void;
  onResetFilters?: () => void;
}

export function ProductsGridView({
  products,
  selectedProducts,
  totalProducts,
  currentPage,
  totalPages,
  pageSize,
  error,
  filters,
  onSelectProduct,
  onPageChange,
  onPageSizeChange,
  onProductDeleted,
  onRetry,
  onResetFilters,
}: ProductsGridViewProps) {
  if (products.length === 0) {
    return (
      <div className="flex min-h-[400px] w-full items-center justify-center">
        <EmptyProductsState
          type={error ? "error" : filters.search ? "search" : "empty"}
          searchTerm={filters.search}
          errorMessage={error ?? undefined}
          onRetry={onRetry}
          onResetFilters={onResetFilters}
          variant="grid"
        />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <ProductGrid
        products={products}
        selectedProducts={selectedProducts}
        onSelectProduct={onSelectProduct}
        tileSize="sm"
        onProductDeleted={onProductDeleted}
      />

      <ProductsPagination
        currentPage={currentPage}
        pageSize={pageSize}
        totalItems={totalProducts}
        totalPages={totalPages}
        onPageChange={onPageChange}
        onPageSizeChange={onPageSizeChange}
        pageSizeOptions={[12, 24, 48, 96]}
      />
    </div>
  );
}
