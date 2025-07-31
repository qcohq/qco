"use client";

import { Button } from "@qco/ui/components/button";
import { Card } from "@qco/ui/components/card";
import { toast } from "@qco/ui/hooks/use-toast";
import type { ProductItem, ProductTableSortConfig } from "@qco/validators";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Download, Plus, Upload } from "lucide-react";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { BulkActions } from "@/features/product-listing/components/bulk-actions";
import { EmptyProductsState } from "@/features/product-listing/components/empty-products-state";
import { ProductFilters } from "@/features/product-listing/components/product-filters";
import { ProductTable } from "@/features/product-listing/components/product-table";
import { ProductsPageSkeleton } from "@/features/product-listing/components/products-page-skeleton";
import {
  Pagination,
  PaginationInfo,
  PaginationSizeSelector,
} from "@/features/shared/components/pagination";
import { useTRPC } from "~/trpc/react";
import { useCategories } from "../hooks/use-categories";
import { useProductsList } from "../hooks/use-products-list";
import type { FilterState } from "../types";

export function ProductsPageContent() {
  const queryClient = useQueryClient();
  const trpc = useTRPC();
  // Оставляем только режим таблицы
  // const [viewMode, setViewMode] = useState<"table" | "tile" | "compact">("table");
  const [selectedProducts, setSelectedProducts] = useState<string[]>([]);
  const [filters, setFilters] = useState<FilterState>({
    search: "",
    category: "all",
    categories: [],
    status: "all",
    inStock: false,
    onSale: false,
    brands: [],
    priceRange: [0, 100000],
    minPrice: 0,
    maxPrice: 100000,
  });
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const [sortConfig, setSortConfig] = useState<ProductTableSortConfig>({
    sortBy: "createdAt",
    sortOrder: "desc",
  });

  const { data, error, isLoading } = useProductsList(
    filters,
    page,
    pageSize,
    sortConfig,
  );
  const { data: categoriesData } = useCategories();
  const products: ProductItem[] = data?.items ?? [];
  const _paginatedProducts = products;

  // Преобразуем категории в нужный формат для CategoryCombobox
  const mapToCategoryItems = (categories: any[] | undefined): any[] => {
    if (!categories) return [];
    return categories.map((category) => ({
      id: category.id,
      name: category.name,
      children: category.children ? mapToCategoryItems(category.children) : [],
    }));
  };

  const categories = mapToCategoryItems(categoriesData);

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    setPage(1);
  }, [filters.search]);

  useEffect(() => {
    if (error instanceof Error) {
      console.error("Failed to load products:", error.message);
      // Здесь можно добавить отображение ошибки пользователю
    }
  }, [error]);

  const toggleProductSelection = useCallback(
    (productId: string, selected: boolean) => {
      setSelectedProducts((prev) =>
        selected ? [...prev, productId] : prev.filter((id) => id !== productId),
      );
    },
    [],
  );

  const toggleSelectAll = useCallback(() => {
    setSelectedProducts((prev) =>
      prev.length === products.length
        ? []
        : products.map((p: ProductItem) => p.id),
    );
  }, [products]);

  const handleFilterChange = useCallback(
    (key: keyof FilterState, value: unknown) => {
      setFilters((prev) => ({ ...prev, [key]: value }));
    },
    [],
  );

  const handleSortChange = useCallback((field: string) => {
    setSortConfig((prev) => ({
      sortBy: field as ProductTableSortConfig["sortBy"],
      sortOrder: prev.sortOrder === "asc" ? "desc" : "asc",
    }));
  }, []);

  const handlePageChange = setPage;
  const handlePageSizeChange = setPageSize;

  const handleProductsDeleted = useCallback(
    (productIds: string[]) => {
      toast({
        title: "Товары удалены",
        description: `${productIds.length} товаров было успешно удалено`,
      });
      void queryClient.invalidateQueries({
        queryKey: ["products"],
      });
    },
    [queryClient],
  );

  const handleProductDeleted = useCallback(
    (productId: string) => {
      handleProductsDeleted([productId]);
    },
    [handleProductsDeleted],
  );

  const handleExportClick = useCallback(() => {
    toast({
      title: "Экспорт товаров",
      description: "Экспорт товаров в выбранном формате",
    });
  }, []);

  const handleImportClick = useCallback(() => {
    toast({
      title: "Импорт товаров",
      description: "Импорт товаров из выбранного файла",
    });
  }, []);

  const handleBulkAction = async (
    actionType: string,
    selectedIds: string[],
  ) => {
    try {
      if (actionType === "delete") {
        // Используем bulkDelete для массового удаления
        const bulkDeleteMutation = useMutation(
          trpc.products.bulkDelete.mutationOptions({
            onSuccess: () => {
              void queryClient.invalidateQueries({
                queryKey: trpc.products.list.queryKey(),
              });
              toast({
                title: "Товары удалены",
                description: `${selectedIds.length} товаров было успешно удалено`,
              });
              // Очищаем выбор
              setSelectedProducts([]);
            },
            onError: (error) => {
              console.error("Ошибка при массовом удалении товаров:", error);
              toast({
                title: "Ошибка",
                description: "Произошла ошибка при удалении товаров",
                variant: "destructive",
              });
            },
          }),
        );

        bulkDeleteMutation.mutate({ ids: selectedIds });
      } else {
        console.warn(`Неизвестное действие: ${actionType}`);
      }
    } catch (error) {
      console.error("Ошибка при выполнении массового действия:", error);
      toast({
        title: "Ошибка",
        description: "Произошла ошибка при выполнении действия",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="w-full max-w-none px-0 sm:px-2 md:px-6 xl:px-12 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
        <h1 className="text-2xl font-bold">Товары</h1>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            className="gap-1"
            onClick={handleImportClick}
            disabled={isLoading}
          >
            <Upload className="h-4 w-4" />
            <span className="hidden sm:inline">Импорт</span>
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="gap-1"
            onClick={handleExportClick}
            disabled={isLoading}
          >
            <Download className="h-4 w-4" />
            <span className="hidden sm:inline">Экспорт</span>
          </Button>
          <Button size="sm" className="gap-1" asChild>
            <Link href="/products/new">
              <Plus className="h-4 w-4" />
              <span className="hidden sm:inline">Добавить товар</span>
            </Link>
          </Button>
        </div>
      </div>
      <Card className="p-4 mb-4">
        <div className="flex flex-wrap items-center gap-4">
          <ProductFilters
            categories={categories}
            filters={filters}
            onFilterChange={handleFilterChange}
            onSortChange={(field) => handleSortChange(field as any)}
            sortConfig={{
              field: sortConfig.sortBy || "createdAt",
              order: sortConfig.sortOrder || "desc",
            }}
          />
          <div className="flex-1" />
        </div>
      </Card>
      <div className="flex flex-col gap-4">
        {/* Удаляем Tabs и все, что связано с viewMode */}
        {selectedProducts.length > 0 && (
          <BulkActions
            selectedProducts={selectedProducts}
            onSelectAll={toggleSelectAll}
            onBulkAction={(actionType: string, selectedIds: string[]) =>
              handleBulkAction(actionType, selectedIds)
            }
            allProducts={products}
          />
        )}
        {error && <div className="text-destructive">{error.message}</div>}
        {isLoading ? (
          <ProductsPageSkeleton />
        ) : products.length === 0 ? (
          <EmptyProductsState type="empty" />
        ) : (
          <div className="border rounded-xl bg-card p-0 shadow-sm overflow-x-auto mb-4">
            <ProductTable
              products={products}
              selectedProducts={selectedProducts}
              onSelectProduct={toggleProductSelection}
              sortConfig={sortConfig}
              onSortChange={handleSortChange}
              onProductDeleted={handleProductDeleted}
            />
          </div>
        )}
        <div className="flex items-center justify-between">
          <PaginationInfo
            currentPage={data?.meta.currentPage ?? page}
            pageSize={data?.meta.pageSize ?? pageSize}
            totalItems={data?.meta.totalItems ?? products.length}
          />
          <div className="flex items-center gap-4">
            <PaginationSizeSelector
              pageSize={pageSize}
              onPageSizeChange={handlePageSizeChange}
              options={[10, 20, 50, 100]}
            />
            <Pagination
              currentPage={data?.meta.currentPage ?? page}
              totalPages={
                data?.meta.pageCount ?? Math.ceil(products.length / pageSize)
              }
              onPageChange={handlePageChange}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
