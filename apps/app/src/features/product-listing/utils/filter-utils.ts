import type { ProductItem } from "@qco/validators";
import type { ProductFilterState, SortOption } from "../types";

// Используем тип из валидаторов
type Product = ProductItem;

export function filterProducts(
  products: Product[],
  filters: ProductFilterState,
): Product[] {
  return products.filter((product) => {
    // Фильтр по поиску
    if (filters.search) {
      const searchTerm = filters.search.toLowerCase();
      const matchesSearch =
        product.name.toLowerCase().includes(searchTerm) ||
        product.sku?.toLowerCase().includes(searchTerm) ||
        product.description?.toLowerCase().includes(searchTerm);
      if (!matchesSearch) return false;
    }

    // Фильтр по категориям
    if (filters.categories && filters.categories.length > 0) {
      const productCategoryIds = product.categories?.map((cat) => cat.id) || [];
      const hasMatchingCategory = filters.categories.some((categoryId) =>
        productCategoryIds.includes(categoryId),
      );
      if (!hasMatchingCategory) return false;
    }

    // Фильтр по наличию
    if (filters.inStock) {
      if (!product.stock || product.stock <= 0) return false;
    }

    // Фильтр по ценовому диапазону
    if (filters.priceRange) {
      const [minPrice, maxPrice] = filters.priceRange;
      const productPrice = product.price || 0;
      if (productPrice < minPrice || productPrice > maxPrice) return false;
    }

    return true;
  });
}

export function sortProducts(
  products: Product[],
  sortOption: SortOption,
): Product[] {
  return [...products].sort((a, b) => {
    const { value, direction } = sortOption;
    const multiplier = direction === "asc" ? 1 : -1;

    switch (value) {
      case "name":
        return multiplier * (a.name.localeCompare(b.name));
      case "price":
        return multiplier * ((a.price || 0) - (b.price || 0));
      case "stock":
        return multiplier * ((a.stock || 0) - (b.stock || 0));
      case "createdAt":
        return multiplier * (new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
      default:
        return 0;
    }
  });
}
