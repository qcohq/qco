import type { ProductItem } from "@qco/web-validators";

export interface SaleProductsDataState {
    products: ProductItem[] | null;
    isLoading: boolean;
}

export type CategoryType = "men" | "women" | "kids"; 