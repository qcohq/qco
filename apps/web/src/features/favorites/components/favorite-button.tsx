"use client";

import { Button } from "@qco/ui/components/button";
import { Heart } from "lucide-react";
import { useFavorites } from "@/features/favorites/hooks/use-favorites";
import { cn } from "@/lib/utils";

interface FavoriteButtonProps {
  productId: string;
  productName?: string;
  productPrice?: number;
  productImage?: string;
  variant?: "ghost" | "outline" | "default";
  size?: "icon" | "default" | "sm" | "lg";
  className?: string;
  showText?: boolean;
}

export function FavoriteButton({
  productId,
  productName,
  productPrice,
  productImage,
  variant = "ghost",
  size = "icon",
  className,
  showText = false,
}: FavoriteButtonProps) {
  const {
    isFavorite,
    toggleFavorite,
    isAddingToFavorites,
    isRemovingFromFavorites,
    isLocal,
  } = useFavorites();

  const isProductFavorite = isFavorite(productId);
  const isLoading = isAddingToFavorites || isRemovingFromFavorites;

  const handleToggleFavorite = () => {
    if (!isLoading) {
      toggleFavorite(productId);
    }
  };

  return (
    <Button
      variant={variant}
      size={size}
      className={cn(
        "transition-all duration-200",
        isProductFavorite && "text-red-500 fill-red-500",
        isLoading && "opacity-50 cursor-not-allowed",
        className,
      )}
      onClick={handleToggleFavorite}
      disabled={isLoading}
    >
      <Heart className={cn("h-4 w-4", isProductFavorite && "fill-current")} />
      {showText && (
        <span className="ml-2">
          {isProductFavorite ? "В избранном" : "В избранное"}
        </span>
      )}
    </Button>
  );
}
