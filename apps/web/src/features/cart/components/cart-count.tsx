"use client";

import { Badge } from "@qco/ui/components/badge";
import { ShoppingBag } from "lucide-react";
import { useCartCount } from "@/features/cart/hooks/use-cart-count";
import { cn } from "@/lib/utils";

interface CartCountProps {
  className?: string;
  showBadge?: boolean;
}

export function CartCount({ className, showBadge = true }: CartCountProps) {
  const { itemCount, isLoading } = useCartCount();

  return (
    <div className={cn("relative", className)}>
      <ShoppingBag className="h-5 w-5" />
      {showBadge && itemCount > 0 && (
        <Badge
          variant="destructive"
          className="absolute -top-2 -right-2 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs"
        >
          {isLoading ? "..." : itemCount}
        </Badge>
      )}
    </div>
  );
}
