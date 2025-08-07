"use client";

import { Badge } from "@qco/ui/components/badge";
import { Heart } from "lucide-react";
import { useFavoritesCount } from "@/features/favorites/hooks/use-favorites-count";

interface FavoritesCountProps {
  className?: string;
  showBadge?: boolean;
}

export function FavoritesCount({
  className,
  showBadge = true,
}: FavoritesCountProps) {
  const { favoritesCount, isLoading } = useFavoritesCount();

  return (
    <div className={`relative ${className}`}>
      <Heart className="h-5 w-5" />
      {showBadge && favoritesCount > 0 && (
        <Badge
          variant="destructive"
          className="absolute -top-2 -right-2 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs"
        >
          {isLoading ? "..." : favoritesCount}
        </Badge>
      )}
    </div>
  );
}
