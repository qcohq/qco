"use client";

import type { ProductItem } from "@qco/web-validators";
import ProductCard from "@/features/products/components/product-card";
import { useCatalogProducts } from "../hooks/use-catalog-products";
import { CatalogSkeleton } from "./catalog-skeleton";

export function CatalogProducts() {
  const { data, isLoading, error } = useCatalogProducts({
    limit: 20,
    sort: "newest",
  });

  if (isLoading) {
    return <CatalogSkeleton count={8} showTitle={true} />;
  }

  if (error) {
    return (
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Все товары</h2>
        <div className="text-center py-8">
          <p className="text-muted-foreground">Ошибка загрузки товаров</p>
        </div>
      </div>
    );
  }

  if (!data || data.products.length === 0) {
    return (
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Все товары</h2>
        <div className="text-center py-8">
          <p className="text-muted-foreground">Товары не найдены</p>
        </div>
      </div>
    );
  }

  // Преобразуем данные из API в формат ProductItem
  const products: ProductItem[] = data.products.map((product) => ({
    id: product.id,
    name: product.name,
    slug: product.slug,
    description: product.description || undefined,
    basePrice: product.basePrice || 0,
    salePrice: product.salePrice || undefined,
    onSale: Boolean(product.salePrice
      ? product.salePrice < (product.basePrice || 0)
      : false),
    image: product.image || undefined,
    images: product.image ? [product.image] : undefined,
    brand: product.brand || "",
    inStock: product.stock ? product.stock > 0 : true,
    category: product.category || undefined,
    isNew: product.isNew || undefined,
    rating: 4.5, // Мок рейтинг, так как его нет в API
  }));

  return (
    <div className="mb-8">
      <h2 className="text-xl font-semibold mb-4">Все товары</h2>
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-8">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
}
