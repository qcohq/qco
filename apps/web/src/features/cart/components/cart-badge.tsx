"use client";

import { Badge } from "@qco/ui/components/badge";
import { useCartCountSafe } from "../hooks";

interface CartBadgeProps {
  className?: string;
}

export function CartBadge({ className }: CartBadgeProps) {
  const { itemCount, isLoading } = useCartCountSafe();

  // Не показываем бейдж, если товаров нет или идет загрузка
  if (isLoading || itemCount === 0) {
    return null;
  }

  return (
    <Badge
      variant="destructive"
      className={`absolute -top-2 -right-2 h-5 w-5 rounded-full p-0 text-xs font-medium flex items-center justify-center ${className}`}
    >
      {itemCount > 99 ? "99+" : itemCount}
    </Badge>
  );
}
