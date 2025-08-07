"use client";

import { Button } from "@qco/ui/components/button";
import { Minus, Plus, ShoppingCart } from "lucide-react";
import { useState } from "react";
import { useCart } from "@/features/cart/hooks/use-cart";
import { cn } from "@/lib/utils";

interface AddToCartButtonProps {
  productId: string;
  variantId?: string;

  className?: string;
  size?: "sm" | "default" | "lg";
  variant?:
  | "default"
  | "destructive"
  | "outline"
  | "secondary"
  | "ghost"
  | "link";
}

export function AddToCartButton({
  productId,
  variantId,
  attributes,
  className,
  size = "default",
  variant = "default",
}: AddToCartButtonProps) {
  const [quantity, setQuantity] = useState(1);
  const { addToCart, isAddingItem } = useCart();

  const handleAddToCart = () => {
    addToCart(productId, quantity, variantId, attributes);
  };

  const handleQuantityChange = (newQuantity: number) => {
    if (newQuantity >= 1) {
      setQuantity(newQuantity);
    }
  };

  return (
    <div className={cn("flex items-center gap-2", className)}>
      <div className="flex items-center border rounded-lg">
        <Button
          size="icon"
          variant="ghost"
          className="h-8 w-8"
          onClick={() => handleQuantityChange(quantity - 1)}
          disabled={quantity <= 1}
        >
          <Minus className="h-3 w-3" />
        </Button>
        <span className="px-3 py-1 text-sm min-w-[2rem] text-center">
          {quantity}
        </span>
        <Button
          size="icon"
          variant="ghost"
          className="h-8 w-8"
          onClick={() => handleQuantityChange(quantity + 1)}
        >
          <Plus className="h-3 w-3" />
        </Button>
      </div>

      <Button
        onClick={handleAddToCart}
        disabled={isAddingItem}
        size={size}
        variant={variant}
        className="flex-1"
      >
        {isAddingItem ? (
          <>
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
            Добавление...
          </>
        ) : (
          <>
            <ShoppingCart className="h-4 w-4 mr-2" />
            Добавить в корзину
          </>
        )}
      </Button>
    </div>
  );
}
