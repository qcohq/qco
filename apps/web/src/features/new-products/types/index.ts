import type { ProductItem } from "@qco/web-validators";

export interface NewProductsDataState {
  products: ProductItem[] | null;
  isLoading: boolean;
}

export type CategoryType = "men" | "women" | "kids";
