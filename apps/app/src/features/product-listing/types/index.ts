import type { ProductItem, ProductTableSortConfig } from "@qco/validators";

// Используем типы из валидаторов вместо RouterOutputs
export type Product = ProductItem;

// TODO: Использовать тип из схемы пропсов листинга продуктов, если появится в @qco/validators
export interface ProductListingProps {
  products: Product[];
  totalCount: number;
  currentPage: number;
  pageSize: number;
  onPageChange: (page: number) => void;
}

export interface ProductFilterState {
  categories?: string[];
  priceRange?: [number, number];
  inStock?: boolean;
  search?: string;
}

export interface SortOption {
  label: string;
  value: string;
  direction: "asc" | "desc";
}

// Экспортируем типы из валидаторов
export type { ProductItem, ProductTableSortConfig };
