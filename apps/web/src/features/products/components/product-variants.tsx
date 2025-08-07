"use client";

import { Badge } from "@qco/ui/components/badge";
import { useState } from "react";

interface ProductVariant {
  id: string;
  name: string;
  sku: string;
  price: number;
  compareAtPrice: number | null;
  stock: number;
  isDefault: boolean;
}

interface ProductVariantsProps {
  variants: ProductVariant[];
  onVariantSelect?: (variant: ProductVariant) => void;
  selectedVariantId?: string;
}

export default function ProductVariants({
  variants,
  onVariantSelect,
  selectedVariantId,
}: ProductVariantsProps) {
  const [selectedVariant, setSelectedVariant] = useState<string>(
    selectedVariantId ||
      variants.find((v) => v.isDefault)?.id ||
      variants[0]?.id ||
      "",
  );

  const handleVariantSelect = (variant: ProductVariant) => {
    setSelectedVariant(variant.id);
    onVariantSelect?.(variant);
  };

  if (variants.length === 0) return null;

  return (
    <div className="space-y-3">
      <h3 className="font-medium">Вариант</h3>
      <div className="flex flex-wrap gap-2">
        {variants.map((variant) => {
          const isSelected = selectedVariant === variant.id;
          const isOutOfStock = variant.stock <= 0;
          const discount =
            variant.compareAtPrice && variant.price < variant.compareAtPrice
              ? Math.round(
                  ((variant.compareAtPrice - variant.price) /
                    variant.compareAtPrice) *
                    100,
                )
              : 0;

          return (
            <button
              key={variant.id}
              onClick={() => !isOutOfStock && handleVariantSelect(variant)}
              disabled={isOutOfStock}
              className={`relative p-3 border rounded-lg text-left transition-colors ${
                isSelected
                  ? "border-black bg-black text-white"
                  : isOutOfStock
                    ? "border-gray-200 bg-gray-100 text-gray-400 cursor-not-allowed"
                    : "border-gray-300 hover:border-gray-400"
              }`}
            >
              <div className="space-y-1">
                <div className="font-medium text-sm">
                  {variant.name || `Вариант ${variant.sku}`}
                </div>
                <div className="text-xs">
                  {variant.price.toLocaleString("ru-RU")} ₽
                  {discount > 0 && (
                    <span className="ml-2 text-red-500 line-through">
                      {variant.compareAtPrice?.toLocaleString("ru-RU")} ₽
                    </span>
                  )}
                </div>
                {discount > 0 && (
                  <Badge variant="destructive" className="text-xs">
                    -{discount}%
                  </Badge>
                )}
                {isOutOfStock && (
                  <Badge variant="secondary" className="text-xs">
                    Нет в наличии
                  </Badge>
                )}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
