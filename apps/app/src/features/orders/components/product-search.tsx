"use client";

import { Badge } from "@qco/ui/components/badge";
import { Button } from "@qco/ui/components/button";
import { Card, CardContent } from "@qco/ui/components/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@qco/ui/components/dialog";
import { Input } from "@qco/ui/components/input";
import type { OrderItemInput } from "@qco/validators";
import type { ProductVariant } from "@qco/validators";
import { useQuery } from "@tanstack/react-query";
import { ChevronDown, Package, Plus, Search } from "lucide-react";
import { useState } from "react";
import { useTRPC } from "~/trpc/react";

// TODO: Использовать тип из схемы пропсов поиска продуктов, если появится в @qco/validators
interface ProductSearchProps {
  onSelectProduct: (item: OrderItemInput) => void;
}

export function ProductSearch({ onSelectProduct }: ProductSearchProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(
    null,
  );
  const trpc = useTRPC();

  // Поиск товаров
  const { data: productsData, isLoading } = useQuery({
    ...trpc.products.list.queryOptions({
      search: searchQuery,
      limit: 10,
    }),
    enabled: searchQuery.length > 2 && isOpen,
  });

  // Получение вариантов товара
  const { data: variantsData, isLoading: variantsLoading } = useQuery({
    ...trpc.productVariants.getVariants.queryOptions({
      productId: selectedProduct?.id || "",
    }),
    enabled: !!selectedProduct?.id,
  });

  const products = productsData?.items || [];
  const variants = variantsData || [];

  const handleSelectProduct = (product: any) => {
    setSelectedProduct(product);
    setSelectedVariant(null);
  };

  const handleSelectVariant = (variant: ProductVariant) => {
    setSelectedVariant(variant);
  };

  const handleAddToOrder = () => {
    if (!selectedProduct || !selectedVariant) return;

    const item: OrderItemInput = {
      name: selectedProduct.name,
      sku: selectedVariant.sku || null,
      price: selectedVariant.price?.toString() || "0.00",
      quantity: 1,
      totalPrice: selectedVariant.price?.toString() || "0.00",
      discountedPrice: selectedVariant.compareAtPrice?.toString() || null,
      productId: selectedProduct.id,
      variantId: selectedVariant.id,
      attributes: selectedVariant.attributes.reduce(
        (acc, attr) => {
          acc[attr.option] = attr.value;
          return acc;
        },
        {} as Record<string, string>,
      ),
      metadata: {},
    };

    onSelectProduct(item);
    setIsOpen(false);
    setSearchQuery("");
    setSelectedProduct(null);
    setSelectedVariant(null);
  };

  const handleBackToProducts = () => {
    setSelectedProduct(null);
    setSelectedVariant(null);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          type="button"
          variant="outline"
          className="flex items-center gap-2"
        >
          <Package className="h-4 w-4" />
          Выбрать из каталога
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>
            {selectedProduct
              ? `Варианты товара: ${selectedProduct.name}`
              : "Поиск товаров"}
          </DialogTitle>
        </DialogHeader>

        {!selectedProduct ? (
          // Список товаров
          <div className="space-y-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Введите название товара или SKU..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>

            {isLoading && (
              <div className="text-center py-8">
                <p className="text-muted-foreground">Поиск товаров...</p>
              </div>
            )}

            {!isLoading && products && products.length > 0 && (
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {products.map((product) => (
                  <Card
                    key={product.id}
                    className="cursor-pointer hover:bg-muted/50 transition-colors"
                  >
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <h4 className="font-medium">{product.name}</h4>
                          <p className="text-sm text-muted-foreground">
                            SKU: {product.sku || "N/A"} • Цена:{" "}
                            {product.price || 0} ₽
                          </p>
                        </div>
                        <Button
                          type="button"
                          size="sm"
                          onClick={() => handleSelectProduct(product)}
                          className="flex items-center gap-1"
                        >
                          <ChevronDown className="h-4 w-4" />
                          Выбрать
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}

            {!isLoading &&
              searchQuery.length > 2 &&
              products &&
              products.length === 0 && (
                <div className="text-center py-8">
                  <p className="text-muted-foreground">Товары не найдены</p>
                  <p className="text-sm text-muted-foreground">
                    Попробуйте изменить поисковый запрос
                  </p>
                </div>
              )}

            {searchQuery.length <= 2 && (
              <div className="text-center py-8">
                <p className="text-muted-foreground">
                  Введите минимум 3 символа для поиска
                </p>
              </div>
            )}
          </div>
        ) : (
          // Список вариантов товара
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={handleBackToProducts}
                className="flex items-center gap-1"
              >
                ← Назад к товарам
              </Button>
            </div>

            {variantsLoading && (
              <div className="text-center py-8">
                <p className="text-muted-foreground">Загрузка вариантов...</p>
              </div>
            )}

            {!variantsLoading && variants && variants.length > 0 && (
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {variants.map((variant) => (
                  <Card
                    key={variant.id}
                    className={`cursor-pointer transition-colors ${selectedVariant?.id === variant.id
                      ? "ring-2 ring-primary bg-primary/5"
                      : "hover:bg-muted/50"
                      }`}
                    onClick={() => handleSelectVariant(variant)}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <h4 className="font-medium">
                            {variant.name || `Вариант ${variant.id}`}
                          </h4>
                          <p className="text-sm text-muted-foreground">
                            SKU: {variant.sku || "N/A"} • Цена:{" "}
                            {variant.price || 0} ₽
                            {variant.compareAtPrice &&
                              variant.price &&
                              Number.parseFloat(variant.compareAtPrice) >
                              Number.parseFloat(variant.price) && (
                                <span className="line-through ml-2">
                                  {variant.compareAtPrice} ₽
                                </span>
                              )}
                          </p>
                          {variant.attributes &&
                            variant.attributes.length > 0 && (
                              <div className="flex flex-wrap gap-1 mt-2">
                                {variant.attributes.map((attr, index) => (
                                  <Badge
                                    key={index}
                                    variant="outline"
                                    className="text-xs"
                                  >
                                    {attr.option}: {attr.value}
                                  </Badge>
                                ))}
                              </div>
                            )}
                          <p className="text-xs text-muted-foreground mt-1">
                            Остаток: {variant.stock || 0} шт.
                          </p>
                        </div>
                        {variant.isDefault && (
                          <Badge variant="default" className="text-xs">
                            По умолчанию
                          </Badge>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}

            {!variantsLoading && variants && variants.length === 0 && (
              <div className="text-center py-8">
                <p className="text-muted-foreground">Варианты не найдены</p>
                <p className="text-sm text-muted-foreground">
                  У этого товара нет вариантов
                </p>
              </div>
            )}

            {selectedVariant && (
              <div className="flex justify-end pt-4 border-t">
                <Button
                  type="button"
                  onClick={handleAddToOrder}
                  className="flex items-center gap-1"
                >
                  <Plus className="h-4 w-4" />
                  Добавить в заказ
                </Button>
              </div>
            )}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
