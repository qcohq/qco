"use client";

import { Badge } from "@qco/ui/components/badge";
import { Button } from "@qco/ui/components/button";
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
import { OptimizedImage } from "@/features/shared/components/optimized-image";

import { DeleteProductDialog } from "./delete-product-dialog";
import type { Product } from "@qco/validators";

interface CompactProductListProps {
  products: Product[];
  selectedProducts: string[];
  onSelectProduct: (id: string, selected: boolean) => void;
  onProductDeleted: (productId: string) => void;
}

export function CompactProductList({
  products,
  selectedProducts,
  onSelectProduct,
  onProductDeleted,
}: CompactProductListProps) {
  return (
    <div className="divide-y">
      {products.map((product) => (
        <div
          key={product.id}
          className={`hover:bg-muted/30 flex items-center px-4 py-3 transition-colors ${selectedProducts.includes(product.id) ? "bg-primary/5" : ""
            }`}
        >
          <div className="flex min-w-0 flex-1 items-center gap-3">
            <Checkbox
              checked={selectedProducts.includes(product.id)}
              onCheckedChange={(checked) =>
                onSelectProduct(product.id, !!checked)
              }
              className="h-4 w-4"
            />

            <div className="h-10 w-10 flex-shrink-0 overflow-hidden rounded-md border">
              <OptimizedImage
                src={
                  // Используем поле mainImage для отображения главного изображения
                  product.mainImage?.url ||
                  product.images?.[0]?.url ||
                  `/placeholder.svg?height=40&width=40&query=${encodeURIComponent(`${product.name} product`)}`
                }
                alt={product.name}
                width={40}
                height={40}
                objectFit="cover"
              />
            </div>

            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <Link
                  href={`/products/${product.id}/edit`}
                  className="hover:text-primary truncate text-sm font-medium transition-colors hover:underline"
                >
                  {product.name}
                </Link>
                <Badge
                  variant="outline"
                  className={
                    product.status === "Активен"
                      ? "bg-green-50 px-1.5 py-0 text-xs text-green-700 hover:bg-green-50 hover:text-green-700"
                      : "bg-slate-100 px-1.5 py-0 text-xs text-slate-700 hover:bg-slate-100 hover:text-slate-700"
                  }
                >
                  {product.status}
                </Badge>
              </div>
              <div className="text-muted-foreground mt-0.5 flex items-center gap-3 text-xs">
                <span>SKU: {product.sku}</span>
                <span>
                  Категории:{" "}
                  {product.categories && product.categories.length > 0 ? (
                    product.categories.map(
                      (cat: { id: string; name: string }) => (
                        <span key={cat.id}>{cat.name}</span>
                      ),
                    )
                  ) : (
                    <span className="text-muted-foreground">—</span>
                  )}
                </span>
              </div>
            </div>
          </div>

          <div className="ml-4 flex items-center gap-6">
            <div className="text-right">
              {product.discount > 0 ? (
                <div>
                  <div className="text-sm font-medium">
                    {(product.price * (1 - product.discount / 100)).toFixed(0)}{" "}
                    ₽
                  </div>
                  <div className="text-muted-foreground text-xs line-through">
                    {product.price} ₽
                  </div>
                </div>
              ) : (
                <div className="text-sm font-medium">{product.price} ₽</div>
              )}
            </div>

            <div className="w-16 text-center">
              <Badge
                variant="outline"
                className={
                  "bg-red-50 px-1.5 py-0 text-xs text-red-700 hover:bg-red-50 hover:text-red-700"
                }
              >
                0
              </Badge>
            </div>

            <div className="flex items-center">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-7 w-7">
                    <MoreHorizontal className="h-3.5 w-3.5" />
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
          </div>
        </div>
      ))}
    </div>
  );
}
