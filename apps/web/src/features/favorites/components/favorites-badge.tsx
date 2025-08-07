"use client";

import { Badge } from "@qco/ui/components/badge";
import { useFavoritesCount } from "../hooks/use-favorites-count";

interface FavoritesBadgeProps {
    className?: string;
}

export function FavoritesBadge({ className }: FavoritesBadgeProps) {
    const { favoritesCount, isLoading } = useFavoritesCount();

    // Не показываем бейдж, если товаров нет или идет загрузка
    if (isLoading || favoritesCount === 0) {
        return null;
    }

    return (
        <Badge
            variant="destructive"
            className={`absolute -top-2 -right-2 h-5 w-5 rounded-full p-0 text-xs font-medium flex items-center justify-center ${className}`}
        >
            {favoritesCount > 99 ? "99+" : favoritesCount}
        </Badge>
    );
} 