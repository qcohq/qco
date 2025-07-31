import type { ProductDetailsProps } from "../types";

export function calculateDiscountPercent(basePrice: number, salePrice: number): number {
    if (basePrice <= 0 || salePrice >= basePrice) return 0;
    return Math.round(((basePrice - salePrice) / basePrice) * 100);
}

export function isProductOnSale(product: ProductDetailsProps["product"]): boolean {
    return !!(product.salePrice && product.basePrice && product.salePrice < product.basePrice);
}

export function getCurrentPrice(product: ProductDetailsProps["product"]): number | null {
    if (isProductOnSale(product) && product.salePrice) {
        return product.salePrice;
    }
    return product.basePrice;
}

export function getOriginalPrice(product: ProductDetailsProps["product"]): number | null {
    if (isProductOnSale(product) && product.basePrice) {
        return product.basePrice;
    }
    return null;
} 