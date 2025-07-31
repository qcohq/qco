"use client";

import { Button } from "@qco/ui/components/button";
import { cn } from "@qco/ui/lib/utils";
import { Star } from "lucide-react";

// TODO: Использовать тип из схемы пропсов кнопки избранного, если появится в @qco/validators

export function FavoriteButton({
  isFavorited,
  onToggleFavorite,
  size = "md",
  className,
}: {
  isFavorited: boolean;
  onToggleFavorite: () => void;
  size?: "sm" | "md" | "lg";
  className?: string;
}) {
  const sizeClasses = {
    sm: "h-7 w-7",
    md: "h-8 w-8",
    lg: "h-9 w-9",
  };

  const iconSizeClasses = {
    sm: "h-3.5 w-3.5",
    md: "h-4 w-4",
    lg: "h-5 w-5",
  };

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        onToggleFavorite();
      }}
      className={cn(
        sizeClasses[size],
        isFavorited
          ? "text-yellow-500 hover:text-yellow-600"
          : "text-muted-foreground hover:text-foreground",
        className,
      )}
      aria-label={
        isFavorited ? "Удалить из избранного" : "Добавить в избранное"
      }
    >
      <Star
        className={cn(iconSizeClasses[size], isFavorited ? "fill-current" : "")}
      />
    </Button>
  );
}
