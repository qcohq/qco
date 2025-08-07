"use client";

import { Badge } from "@qco/ui/components/badge";
import { Button } from "@qco/ui/components/button";
import { Heart } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import type { SearchResult } from "@qco/web-validators";
import { useFavorites } from "@/features/favorites/hooks/use-favorites";

interface SearchProductCardProps {
    product: SearchResult;
    onAddToFavorites?: (productId: string) => void;
    onAddToCart?: (productId: string) => void;
}

export function SearchProductCard({
    product,
    onAddToFavorites,
    onAddToCart,
}: SearchProductCardProps) {
    const {
        toggleFavorite,
        isFavorite,
        isAddingToFavorites,
        isRemovingFromFavorites,
    } = useFavorites();

    const isInFavorites = isFavorite(product.id);
    const isLoading = isAddingToFavorites || isRemovingFromFavorites;

    const handleToggleFavorite = () => {
        if (!isLoading) {
            toggleFavorite(product.id);
            onAddToFavorites?.(product.id);
        }
    };

    const discountPercentage = product.discount || 0;
    const productImage = product.image || "/placeholder.svg";
    const currentPrice = product.price;

    return (
        <div className="group relative">
            <div className="relative aspect-[3/4] overflow-hidden rounded-lg bg-gray-100">
                <Link href={`/products/${product.slug}`}>
                    <Image
                        src={productImage}
                        alt={product.name}
                        fill
                        className="object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                </Link>

                {/* Badges */}
                <div className="absolute top-2 left-2 sm:top-3 sm:left-3 flex flex-col gap-1 sm:gap-2">
                    {product.isNew && (
                        <Badge className="bg-black text-white text-xs sm:text-sm">
                            Новинка
                        </Badge>
                    )}
                    {product.isSale && discountPercentage > 0 && (
                        <Badge variant="destructive" className="text-xs sm:text-sm">
                            -{discountPercentage}%
                        </Badge>
                    )}
                </div>

                {/* Actions */}
                <div className="absolute top-2 right-2 sm:top-3 sm:right-3 flex flex-col gap-1 sm:gap-2">
                    <Button
                        size="icon"
                        variant="secondary"
                        className={`h-7 w-7 sm:h-8 sm:w-8 ${isInFavorites ? "bg-red-100 text-red-600" : ""} ${isLoading ? "opacity-50" : ""}`}
                        onClick={handleToggleFavorite}
                        disabled={isLoading}
                    >
                        <Heart
                            className={`h-3 w-3 sm:h-4 sm:w-4 ${isInFavorites ? "fill-current" : ""}`}
                        />
                    </Button>
                </div>
            </div>

            <div className="mt-3 sm:mt-4 space-y-1 sm:space-y-2">
                <div className="text-xs sm:text-sm text-muted-foreground">
                    {product.brand.name}
                </div>
                <Link href={`/products/${product.slug}`}>
                    <h3 className="font-medium text-sm sm:text-base leading-tight hover:underline line-clamp-2">
                        {product.name}
                    </h3>
                </Link>

                <div className="flex items-center gap-2">
                    <span className="font-semibold text-sm sm:text-base">
                        {currentPrice ? currentPrice.toLocaleString("ru-RU") : "0"} ₽
                    </span>
                    {product.originalPrice && product.originalPrice > currentPrice && (
                        <span className="text-xs sm:text-sm text-muted-foreground line-through">
                            {product.originalPrice.toLocaleString("ru-RU")} ₽
                        </span>
                    )}
                </div>
            </div>
        </div>
    );
} 