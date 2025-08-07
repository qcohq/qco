import { useQuery } from "@tanstack/react-query";
import { useTRPC } from "@/trpc/react";
import type { Product } from "../types/product";

export function useProductBySlug(slug?: string) {
  const trpc = useTRPC();

  // Используем useQuery только если slug определен
  const { data, isPending, error, refetch } = useQuery({
    ...trpc.products.getBySlug.queryOptions({ slug: slug || "" }),
    enabled: !!slug, // Запрос выполняется только если slug не пустой
  });

  // Преобразуем данные в формат, ожидаемый фронтендом
  const product: Product | undefined = data
    ? {
      id: (data as any).id,
      name: (data as any).name,
      slug: (data as any).slug,
      description: (data as any).description || null,
      basePrice: (data as any).basePrice || 0,
      salePrice: (data as any).salePrice || null,
      onSale: Boolean(
        (data as any).salePrice !== null &&
        (data as any).salePrice !== undefined &&
        (data as any).salePrice < ((data as any).basePrice || 0)
      ),
      image: (data as any).image || null,
      images: (data as any).images || [],
      category: (data as any).category || null,
      brand: (data as any).brand || null,
      brandSlug: (data as any).brandSlug || null,
      inStock: (data as any).inStock || false,
      isNew: (data as any).isNew || false,
      isBestseller: (data as any).isBestseller || false,
      isFeatured: (data as any).isFeatured || false,
      isActive: (data as any).isActive || false,
      sku: (data as any).sku || null,
      stock: (data as any).stock || null,
      discountPercent: (data as any).discountPercent || null,
      createdAt: (data as any).createdAt || new Date(),
      updatedAt: (data as any).updatedAt || new Date(),
      rating: 0,
      details: (data as any).features || [],
      // Преобразуем размеры из строк в объекты
      sizes: Array.isArray((data as any).sizes)
        ? (data as any).sizes.map(
          (
            size:
              | string
              | { name: string; value: string; inStock?: boolean },
          ) => {
            if (typeof size === "string") {
              return { name: size, value: size, inStock: true };
            }
            return {
              name: size.name,
              value: size.value,
              inStock: size.inStock ?? true,
            };
          },
        )
        : [],
      // Преобразуем цвета из строк в объекты
      colors: Array.isArray((data as any).colors)
        ? (data as any).colors.map(
          (
            color: string | { name: string; value: string; hex?: string },
          ) => {
            if (typeof color === "string") {
              return { name: color, value: color, hex: "#000000" };
            }
            return {
              name: color.name,
              value: color.value,
              hex: color.hex || "#000000",
            };
          },
        )
        : [],
      variants: (data as any).variants || [],
      tags: (data as any).tags || [],
      features: (data as any).features || [],
      attributes: (data as any).attributes || {},
      relatedProducts: (data as any).relatedProducts || [],
    }
    : undefined;

  return {
    product,
    isLoading: isPending,
    error,
    refetch,
  };
}
