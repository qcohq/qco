"use client";

import { Badge } from "@qco/ui/components/badge";

interface CartItemVariantInfoProps {
  variant?: {
    id: string;
    name: string;
    sku: string;
    price: number | string;
    compareAtPrice: number | string | null;
    stock: number;
    isDefault: boolean;
  } | null;
}

export function CartItemVariantInfo({ variant }: CartItemVariantInfoProps) {
  if (!variant) {
    return null;
  }

  return (
    <div className="flex items-center gap-2 text-sm text-muted-foreground">
      {variant.name && (
        <Badge variant="secondary" className="text-xs">
          {variant.name}
        </Badge>
      )}
    </div>
  );
}
