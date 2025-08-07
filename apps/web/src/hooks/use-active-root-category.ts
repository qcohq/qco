import { useProductCategoryHierarchy } from "@/features/products/hooks/use-product-category-hierarchy";

export function useActiveRootCategory(
  productSlug?: string,
): "women" | "men" | "kids" | null {
  // Всегда вызываем хук, даже если productSlug не передан
  const { categoryHierarchy } = useProductCategoryHierarchy(productSlug);

  // Условная логика после вызова хука
  if (!productSlug || !categoryHierarchy || categoryHierarchy.length === 0) {
    return null;
  }

  const root = categoryHierarchy[0].slug.toLowerCase();

  // Проверяем различные варианты slug'ов для женщин
  if (root === "zhenschinam") return "women";
  // Проверяем различные варианты slug'ов для мужчин
  if (root === "muzhchinam") return "men";
  // Проверяем различные варианты slug'ов для детей
  if (root === "detyam") return "kids";

  return null;
}
