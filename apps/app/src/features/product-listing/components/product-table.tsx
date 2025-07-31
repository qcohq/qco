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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@qco/ui/components/table";
import type { ProductItem, ProductTableSortConfig } from "@qco/validators";
import { Copy, Edit, MoreHorizontal } from "lucide-react";
import Link from "next/link";
import { OptimizedImage } from "@/features/shared/components/optimized-image";

import { DeleteProductDialog } from "./delete-product-dialog";

interface ProductTableProps {
  products: ProductItem[];
  selectedProducts: string[];
  onSelectProduct: (id: string, selected: boolean) => void;
  sortConfig: ProductTableSortConfig;
  onSortChange: (field: string) => void;
  isLoading?: boolean;
  onProductDeleted: (productId: string) => void;
}

export function ProductTable({
  products,
  selectedProducts,
  onSelectProduct,
  sortConfig,
  onSortChange,
  onProductDeleted,
}: ProductTableProps) {
  const toggleSelectAll = () => {
    if (selectedProducts.length === products.length) {
      // Снять выделение со всех
      products.forEach((product) => onSelectProduct(product.id, false));
    } else {
      // Выделить все
      products.forEach((product) => onSelectProduct(product.id, true));
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("ru-RU", {
      style: "currency",
      currency: "RUB",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  const formatDiscount = (discount: number) => {
    if (discount <= 0) return null;
    return `-${discount}%`;
  };

  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-10">
              <Checkbox
                checked={
                  selectedProducts.length > 0 &&
                  selectedProducts.length === products.length
                }
                onCheckedChange={toggleSelectAll}
                className="h-4 w-4"
              />
            </TableHead>
            <TableHead className="w-10" />
            <TableHead>
              <Button
                variant="ghost"
                size="sm"
                className="p-0 font-medium"
                onClick={() => onSortChange("name")}
              >
                Название
                {sortConfig.sortBy === "name" && (
                  <span className="ml-1">
                    {sortConfig.sortOrder === "asc" ? "↑" : "↓"}
                  </span>
                )}
              </Button>
            </TableHead>
            <TableHead className="w-28">Артикул</TableHead>
            <TableHead className="w-28">Бренд</TableHead>
            <TableHead className="w-28">Категория</TableHead>
            <TableHead className="w-24 text-right">
              <Button
                variant="ghost"
                size="sm"
                className="p-0 font-medium"
                onClick={() => onSortChange("price")}
              >
                Базовая цена
                {sortConfig.sortBy === "price" && (
                  <span className="ml-1">
                    {sortConfig.sortOrder === "asc" ? "↑" : "↓"}
                  </span>
                )}
              </Button>
            </TableHead>
            <TableHead className="w-24 text-right">Цена со скидкой</TableHead>
            <TableHead className="w-20 text-center">Скидка</TableHead>
            <TableHead className="w-24 text-center">Статус</TableHead>
            <TableHead className="w-[100px]">Действия</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {products.map((product) => (
            <TableRow key={product.id} className="h-14">
              <TableCell className="py-2">
                <Checkbox
                  checked={selectedProducts.includes(product.id)}
                  onCheckedChange={(checked) =>
                    onSelectProduct(product.id, !!checked)
                  }
                  className="h-4 w-4"
                />
              </TableCell>
              <TableCell className="py-2">
                <div className="h-8 w-8 overflow-hidden rounded-md border">
                  <OptimizedImage
                    src={
                      product.mainImage?.url ||
                      `/placeholder.svg?height=32&width=32&query=${encodeURIComponent(`${product.name} product`)}`
                    }
                    alt={product.name}
                    width={32}
                    height={32}
                    objectFit="cover"
                  />
                </div>
              </TableCell>
              <TableCell className="max-w-[200px] py-2 font-medium">
                <div className="truncate">
                  <Link
                    href={`/products/${product.id}/edit`}
                    className="hover:text-primary transition-colors hover:underline"
                  >
                    {product.name}
                  </Link>
                </div>
              </TableCell>
              <TableCell className="py-2 text-sm">{product.sku}</TableCell>
              <TableCell className="py-2 text-sm">
                {product.brand ? (
                  <Link
                    href={`/brands/${product.brand.slug || product.brand.id}`}
                    className="hover:text-primary transition-colors hover:underline"
                  >
                    {product.brand.name}
                  </Link>
                ) : (
                  <span className="text-muted-foreground">—</span>
                )}
              </TableCell>
              <TableCell className="py-2 text-sm">
                {product.categories && product.categories.length > 0 ? (
                  product.categories.map((category, idx) => (
                    <span key={category.id}>
                      {category.name}
                      {idx < (product.categories?.length || 0) - 1 && ", "}
                    </span>
                  ))
                ) : (
                  <span className="text-muted-foreground">—</span>
                )}
              </TableCell>
              <TableCell className="py-2 text-right font-medium">
                {product.price > 0 ? (
                  <span className="text-gray-900">
                    {formatPrice(product.price)}
                  </span>
                ) : (
                  <span className="text-muted-foreground">—</span>
                )}
              </TableCell>
              <TableCell className="py-2 text-right">
                {product.discount > 0 ? (
                  <span className="font-medium text-green-600">
                    {formatPrice(product.price * (1 - product.discount / 100))}
                  </span>
                ) : (
                  <span className="text-muted-foreground">—</span>
                )}
              </TableCell>
              <TableCell className="py-2 text-center">
                {product.discount > 0 ? (
                  <Badge
                    variant="secondary"
                    className="bg-red-50 text-red-700 hover:bg-red-50 hover:text-red-700"
                  >
                    {formatDiscount(product.discount)}
                  </Badge>
                ) : (
                  <span className="text-muted-foreground">—</span>
                )}
              </TableCell>
              <TableCell className="py-2 text-center">
                {product.isActive ? (
                  <Badge
                    variant="outline"
                    className="bg-green-50 px-1.5 py-0 text-xs text-green-700 hover:bg-green-50 hover:text-green-700"
                  >
                    Активен
                  </Badge>
                ) : (
                  <Badge
                    variant="outline"
                    className="bg-slate-100 px-1.5 py-0 text-xs text-slate-700 hover:bg-slate-100 hover:text-slate-700"
                  >
                    Черновик
                  </Badge>
                )}
              </TableCell>
              <TableCell className="py-2">
                <div className="flex items-center gap-0.5">
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
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
