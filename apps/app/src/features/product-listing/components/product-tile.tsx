"use client";

import { Badge } from "@qco/ui/components/badge";
import { Button } from "@qco/ui/components/button";
import { Card, CardContent, CardFooter } from "@qco/ui/components/card";
import { Checkbox } from "@qco/ui/components/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@qco/ui/components/dropdown-menu";
import { Copy, Edit, MoreHorizontal } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { OptimizedImage } from "@/features/shared/components/optimized-image";

import { DeleteProductDialog } from "./delete-product-dialog";
import type { Product } from "@qco/validators";

interface ProductTileProps {
  product: Product;
  isSelected: boolean;
  onSelect: (id: string, selected: boolean) => void;
  size?: "sm" | "md" | "lg";
  onProductDeleted: (productId: string) => void;
}

export function ProductTile({
  product,
  isSelected,
  onSelect,
  size = "md",
  onProductDeleted,
}: ProductTileProps) {
  const [isHovered, setIsHovered] = useState(false);

  // Определяем размеры в зависимости от параметра size
  const tileClasses = {
    sm: "w-[220px] h-[320px]",
    md: "w-[260px] h-[380px]",
    lg: "w-[300px] h-[420px]",
  };

  const imageClasses = {
    sm: "h-[220px] w-full object-cover rounded-t-lg",
    md: "h-[260px] w-full object-cover rounded-t-lg",
    lg: "h-[300px] w-full object-cover rounded-t-lg",
  };

  const contentClasses = {
    sm: "p-2 text-xs absolute bottom-0 left-0 right-0 bg-white/90 backdrop-blur-sm",
    md: "p-3 text-sm absolute bottom-0 left-0 right-0 bg-white/90 backdrop-blur-sm",
    lg: "p-3 text-sm absolute bottom-0 left-0 right-0 bg-white/90 backdrop-blur-sm",
  };

  return (
    <Card
      className={`relative overflow-hidden border transition-all ${tileClasses[size]} ${isSelected ? "ring-primary ring-2" : ""
        } ${isHovered ? "shadow-md" : "shadow-sm"}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="absolute top-2 left-2 z-10">
        <Checkbox
          checked={isSelected}
          onCheckedChange={(checked) => onSelect(product.id, !!checked)}
          className="h-4 w-4 bg-white/90"
          onClick={(e) => e.stopPropagation()}
        />
      </div>

      <div className="absolute top-2 right-2 z-10">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7 bg-white/90 hover:bg-white"
            >
              <MoreHorizontal className="h-4 w-4" />
              <span className="sr-only">Действия</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem asChild>
              <Link href={`/products/${product.id}/edit`}>
                <Edit className="mr-2 h-4 w-4" />
                <span>Редактировать</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Copy className="mr-2 h-4 w-4" />
              <span>Дублировать</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-red-600" asChild>
              <DeleteProductDialog
                productId={product.id}
                productName={product.name}
                onDeleted={onProductDeleted}
                isMenuItem={true}
              />
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <Link
        href={`/products/${product.id}/edit`}
        className="relative block h-full"
      >
        <div className={`${imageClasses[size]} h-full`}>
          <OptimizedImage
            src={
              // Используем поле mainImage для отображения главного изображения
              product.mainImage?.url ||
              product.images?.[0]?.url ||
              `/placeholder.svg?height=400&width=300&query=${encodeURIComponent(`${product.name} product`)}`
            }
            alt={product.name}
            width={260}
            height={160}
            objectFit="cover"
            className="h-full w-full transition-transform duration-300 hover:scale-105"
          />
        </div>

        <CardContent className={`${contentClasses[size]}`}>
          <div className="space-y-2">
            {/* Статусы товара */}
            <div className="flex flex-wrap items-center gap-1">
              <Badge
                variant="outline"
                className={
                  product.status === "Активен"
                    ? "bg-green-50 text-xs text-green-700 hover:bg-green-50 hover:text-green-700"
                    : "bg-slate-100 text-xs text-slate-700 hover:bg-slate-100 hover:text-slate-700"
                }
              >
                {product.status}
              </Badge>

              {/* Дополнительные статусы */}
              {product.inStock && (
                <Badge
                  variant="outline"
                  className="bg-blue-50 text-xs text-blue-700"
                >
                  В наличии
                </Badge>
              )}

              {product.isPopular && (
                <Badge
                  variant="outline"
                  className="bg-orange-50 text-xs text-orange-700"
                >
                  Популярный
                </Badge>
              )}

              {product.isDiscounted && (
                <Badge
                  variant="outline"
                  className="bg-red-50 text-xs text-red-700"
                >
                  Скидка
                </Badge>
              )}
            </div>

            {/* Артикул */}
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground overflow-hidden text-xs text-ellipsis whitespace-nowrap">
                Арт: {product.sku}
              </span>
              {product.stockCount !== undefined && (
                <span className="text-xs font-medium">
                  Остаток: {product.stockCount} шт.
                </span>
              )}
            </div>

            {/* Название товара */}
            <h3 className="line-clamp-2 font-medium">{product.name}</h3>

            {/* Бренд */}
            <div className="flex items-center gap-1">
              <Badge
                variant="outline"
                className="bg-blue-50 text-xs text-blue-700 hover:bg-blue-50 hover:text-blue-700"
              >
                {product.brand?.name || "Без бренда"}
              </Badge>
              {product.isNew && (
                <Badge
                  variant="outline"
                  className="bg-purple-50 text-xs text-purple-700 hover:bg-purple-50 hover:text-purple-700"
                >
                  Новинка
                </Badge>
              )}
            </div>

            {/* Категории */}
            <div className="mt-1 flex flex-wrap gap-1">
              {product.categories && product.categories.length > 0 ? (
                product.categories
                  .slice(0, 2)
                  .map((cat: { id: string; name: string }) => (
                    <Badge key={cat.id} variant="outline" className="text-xs">
                      {cat.name}
                    </Badge>
                  ))
              ) : (
                <span className="text-muted-foreground text-xs">
                  Без категории
                </span>
              )}
              {product.categories && product.categories.length > 2 && (
                <Badge variant="outline" className="text-xs">
                  +{product.categories.length - 2}
                </Badge>
              )}
            </div>
          </div>
        </CardContent>
      </Link>

      <CardFooter className="absolute right-0 bottom-0 left-0 hidden border-t bg-white p-2">
        <div className="flex w-full items-center justify-between">
          <Button variant="outline" size="sm" asChild>
            <Link href={`/products/${product.id}/edit`}>
              <Edit className="mr-1 h-3 w-3" />
              Редактировать
            </Link>
          </Button>
          <DeleteProductDialog
            productId={product.id}
            productName={product.name}
            onDeleted={onProductDeleted}
            trigger={
              <Button
                variant="outline"
                size="sm"
                className="text-red-600 hover:bg-red-50 hover:text-red-700"
              >
                <span>Удалить</span>
              </Button>
            }
          />
        </div>
      </CardFooter>
    </Card>
  );
}
