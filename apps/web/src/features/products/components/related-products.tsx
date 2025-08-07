"use client";

import { Badge } from "@qco/ui/components/badge";
import Image from "next/image";
import Link from "next/link";

interface RelatedProduct {
  id: string;
  name: string;
  slug: string;
  image: string | null;
  basePrice: number | null;
  salePrice: number | null;
}

interface RelatedProductsProps {
  products: RelatedProduct[];
  className?: string;
}

export default function RelatedProducts({
  products,
  className,
}: RelatedProductsProps) {
  if (!products || products.length === 0) {
    return null;
  }

  return (
    <div className={`space-y-4 sm:space-y-6 ${className}`}>
      <h2 className="text-xl sm:text-2xl font-bold">Похожие товары</h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 sm:gap-4">
        {products.map((product) => {
          const currentPrice = product.salePrice || product.basePrice || 0;
          const discountPercentage =
            product.salePrice && product.basePrice
              ? Math.round(
                  ((product.basePrice - product.salePrice) /
                    product.basePrice) *
                    100,
                )
              : 0;

          return (
            <Link
              key={product.id}
              href={`/products/${product.slug}`}
              className="group block space-y-2 sm:space-y-3"
            >
              <div className="aspect-square relative overflow-hidden rounded-lg bg-gray-100">
                {product.image ? (
                  <Image
                    src={product.image}
                    alt={product.name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                ) : (
                  <div className="flex items-center justify-center h-full text-gray-400 text-xs sm:text-sm">
                    Нет фото
                  </div>
                )}
                {discountPercentage > 0 && (
                  <Badge
                    variant="destructive"
                    className="absolute top-1 sm:top-2 left-1 sm:left-2 text-xs"
                  >
                    -{discountPercentage}%
                  </Badge>
                )}
              </div>
              <div className="space-y-1">
                <h3 className="font-medium text-xs sm:text-sm group-hover:text-blue-600 transition-colors leading-tight">
                  {product.name}
                </h3>
                <div className="flex items-center gap-1 sm:gap-2">
                  <span className="font-bold text-xs sm:text-sm">
                    {currentPrice.toLocaleString("ru-RU")} ₽
                  </span>
                  {product.salePrice && product.basePrice && (
                    <span className="text-xs text-muted-foreground line-through">
                      {product.basePrice.toLocaleString("ru-RU")} ₽
                    </span>
                  )}
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
