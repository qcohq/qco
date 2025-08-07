"use client";

import { Badge } from "@qco/ui/components/badge";

interface CartItemOptionsProps {
  options?: { name: string; value: string }[];
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

export function CartItemOptions({
  options,
  variant,
}: CartItemOptionsProps) {
  // Если нет варианта, не показываем опции
  if (!variant) {
    return null;
  }

  // Если есть опции, показываем их
  if (options && options.length > 0) {
    // Фильтруем пустые опции и маппим названия
    const validOptions = options
      .filter((option) => option.value && option.value.trim() !== "")
      .map((option) => ({
        ...option,
        name:
          option.name === "size"
            ? "Размер"
            : option.name === "color"
              ? "Цвет"
              : option.name,
      }));

    if (validOptions.length === 0) {
      return null;
    }

    return (
      <div className="flex flex-wrap gap-2 text-sm">
        {validOptions.map((option, index) => (
          <Badge key={`option-${option.name}-${index}`} variant="outline" className="text-xs">
            {option.name}: {option.value}
          </Badge>
        ))}
      </div>
    );
  }
  // Если есть вариант, но нет опций, показываем название варианта
  if (variant && (!options || options.length === 0)) {
    return (
      <div className="flex gap-2 text-sm text-muted-foreground">
        <Badge variant="secondary" className="text-xs">
          {variant.name || "Вариант"}
        </Badge>
      </div>
    );
  }

  return null;
}
