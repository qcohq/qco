"use client";

import { Button } from "@qco/ui/components/button";
import { LayoutGrid } from "lucide-react";
import { useDuplicateProduct } from "../hooks/use-duplicate-product";

interface DuplicateProductButtonProps {
  productId: string;
  disabled?: boolean;
}

export function DuplicateProductButton({
  productId,
  disabled = false,
}: DuplicateProductButtonProps) {
  const { mutate: duplicateProduct, isPending } = useDuplicateProduct();

  const handleDuplicate = () => {
    duplicateProduct({ id: productId });
  };

  return (
    <Button
      variant="outline"
      className="justify-start"
      onClick={handleDuplicate}
      disabled={disabled || isPending}
    >
      <LayoutGrid className="mr-2 h-4 w-4" />
      {isPending ? "Дублирование..." : "Дублировать товар"}
    </Button>
  );
}
