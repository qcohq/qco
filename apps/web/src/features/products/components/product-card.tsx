"use client";

import { Badge } from "@qco/ui/components/badge";
import { Button } from "@qco/ui/components/button";
import type { ProductItem } from "@qco/web-validators";
import { Heart } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useFavorites } from "@/features/favorites/hooks/use-favorites";

interface ProductCardProps {
  product: ProductItem;
}

export default function ProductCard({
  product,
}: ProductCardProps) {
  const {
    toggleFavorite,
    isFavorite,
    isAddingToFavorites,
    isRemovingFromFavorites,
  } = useFavorites();
  const isInFavorites = isFavorite(product.id);
  const isLoading = isAddingToFavorites || isRemovingFromFavorites;

  // Вычисляем процент скидки
  const discountPercentage = product.discountPercent ||
    (product.salePrice && product.basePrice
      ? Math.round(
        ((product.basePrice - product.salePrice) / product.basePrice) * 100,
      )
      : 0);

  const productImage =
    product.image || product.images?.[0] || "/placeholder.svg";
  const currentPrice = product.salePrice || product.basePrice;
  const hasDiscount = product.salePrice && product.basePrice && product.salePrice < product.basePrice;

  // Функция для форматирования цены
  const formatPrice = (price: number | null) => {
    if (!price) return "0 ₽";
    return new Intl.NumberFormat("ru-RU", {
      style: "currency",
      currency: "RUB",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  const handleToggleFavorite = () => {
    if (!isLoading) {
      toggleFavorite(product.id);
    }
  };

  return (
    <div className="group cursor-pointer p-0.5 sm:p-2">
      {/* Image Container */}
      <div className="relative mb-2 sm:mb-3">
        <Link href={`/products/${product.slug}`}>
          <div className="aspect-[3/4] relative overflow-hidden rounded-2xl bg-gray-50">
            <Image
              src={productImage || "/placeholder.svg"}
              alt={product.name}
              fill
              className="object-cover transition-all duration-300 group-hover:scale-110"
            />
          </div>
        </Link>

        {/* Badges */}
        <div className="absolute top-2 left-2 sm:top-3 sm:left-3 flex flex-col gap-1 z-10">
          {product.isNew && (
            <Badge className="bg-black/90 text-white text-[10px] sm:text-xs font-medium px-1.5 py-0.5 sm:px-2 sm:py-1 backdrop-blur-sm">
              Новинка
            </Badge>
          )}
          {hasDiscount && discountPercentage > 0 && (
            <Badge className="bg-red-600 text-white text-xs sm:text-sm font-bold px-2 py-1 sm:px-3 sm:py-1.5 shadow-lg border-2 border-white/20">
              -{discountPercentage}%
            </Badge>
          )}
        </div>

        {/* Favorite Button */}
        <Button
          size="icon"
          variant="secondary"
          className="absolute top-2 right-2 sm:top-3 sm:right-3 opacity-0 group-hover:opacity-100 transition-all duration-200 bg-white/90 hover:bg-white shadow-lg backdrop-blur-sm border-0 h-8 w-8 sm:h-9 sm:w-9 z-10"
          onClick={handleToggleFavorite}
          disabled={isLoading}
        >
          <Heart
            className={`h-4 w-4 transition-colors ${isInFavorites ? "fill-red-500 text-red-500" : "text-gray-600"
              }`}
          />
        </Button>
      </div>

      {/* Product Info */}
      <div className="space-y-1 sm:space-y-2">
        {/* Brand */}
        <div className="text-[10px] sm:text-xs font-medium text-gray-500 uppercase tracking-wider">
          {product.brand}
        </div>

        {/* Product Name */}
        <Link href={`/products/${product.slug}`}>
          <h3 className="font-semibold text-[13px] sm:text-base text-gray-900 leading-tight line-clamp-2 group-hover:text-gray-700 transition-colors">
            {product.name}
          </h3>
        </Link>

        {/* Price */}
        <div className="flex items-center gap-1 sm:gap-2 pt-0.5 sm:pt-1">
          <span className="text-base sm:text-lg font-bold text-gray-900">
            {formatPrice(currentPrice)}
          </span>
          {hasDiscount && (
            <span className="text-xs sm:text-sm text-gray-400 line-through">
              {formatPrice(product.basePrice)}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}