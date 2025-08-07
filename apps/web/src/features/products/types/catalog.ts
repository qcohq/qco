export interface Product {
  id: string;
  name: string;
  brand: string;
  price: number;
  originalPrice?: number;
  images: string[];
  category: string;
  subcategory: string;
  subsubcategory?: string;
  sizes: string[];
  colors?: string[];
  description: string;
  rating?: number;
  isNew?: boolean;
  isOnSale?: boolean;
  inStock?: boolean;
  tags?: string[];
}

export interface CatalogFilters {
  brands: string[];
  priceRange: [number, number];
  sizes: string[];
  colors: string[];
  categories: string[];
  inStock: boolean;
  onSale: boolean;
  // Добавляем поддержку динамических атрибутов
  attributes: Record<string, string[]>;
}

export interface SortOption {
  value: string;
  label: string;
}

export interface CategoryTree {
  id: string;
  name: string;
  slug: string;
  children?: CategoryTree[];
  productCount?: number;
}

export type ViewMode = "grid";
