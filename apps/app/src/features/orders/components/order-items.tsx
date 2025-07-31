import { Avatar, AvatarFallback, AvatarImage } from "@qco/ui/components/avatar";
import { Badge } from "@qco/ui/components/badge";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@qco/ui/components/card";
import type { OrderOutput } from "@qco/validators";
import { Package } from "lucide-react";
import Link from "next/link";

// TODO: Использовать тип из схемы пропсов элементов заказа, если появится в @qco/validators
interface OrderItemsProps {
  order: OrderOutput;
}

export function OrderItems({ order }: OrderItemsProps) {
  const formatPrice = (price: string) => {
    return Number.parseFloat(price).toLocaleString("ru-RU");
  };

  const getProductInitials = (name: string) => {
    return name
      .split(" ")
      .map((word) => word.charAt(0))
      .join("")
      .toUpperCase()
      .substring(0, 2);
  };



  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
            <Package className="h-4 w-4 text-primary" />
          </div>
          <div>
            <CardTitle>Товары в заказе</CardTitle>
            <CardDescription>
              {order.items?.length || 0} товаров на сумму{" "}
              {formatPrice(order.totalAmount)} ₽
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {order.items?.map((item, index) => (
            <div
              key={item.id || index}
              className="rounded-lg border bg-muted/20 p-4"
            >
              <div className="flex items-start gap-4">
                {/* Аватар товара */}
                {item.productId ? (
                  <Link
                    href={`/products/${item.productId}/edit`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-shrink-0"
                  >
                    <Avatar className="h-16 w-16 bg-white hover:ring-2 hover:ring-primary/20 transition-all cursor-pointer">
                      {item.image ? (
                        <AvatarImage
                          src={item.image}
                          alt={item.productName}
                          className="object-cover"
                        />
                      ) : null}
                      <AvatarFallback className="text-sm font-semibold">
                        {getProductInitials(item.productName)}
                      </AvatarFallback>
                    </Avatar>
                  </Link>
                ) : (
                  <Avatar className="h-16 w-16 flex-shrink-0 bg-white">
                    {item.image ? (
                      <AvatarImage
                        src={item.image}
                        alt={item.productName}
                        className="object-cover"
                      />
                    ) : null}
                    <AvatarFallback className="text-sm font-semibold">
                      {getProductInitials(item.productName)}
                    </AvatarFallback>
                  </Avatar>
                )}

                {/* Информация о товаре */}
                <div className="flex-1 space-y-3">
                  <div>
                    {item.productId ? (
                      <Link
                        href={`/products/${item.productId}/edit`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:underline"
                      >
                        <h3 className="font-semibold text-lg text-primary hover:text-primary/80 transition-colors">
                          {item.productName}
                        </h3>
                      </Link>
                    ) : (
                      <h3 className="font-semibold text-lg">{item.productName}</h3>
                    )}
                    <p className="text-sm text-muted-foreground">
                      Основной SKU:{" "}
                      <code className="rounded bg-muted px-1 py-0.5 font-mono">
                        {item.productSku || "N/A"}
                      </code>
                    </p>
                  </div>

                  {/* Опции варианта товара */}
                  {item.variantOptions && item.variantOptions.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                      {item.variantOptions.map((option, index) => (
                        <Badge
                          key={`${option.slug}-${index}`}
                          variant="outline"
                          className="text-xs"
                        >
                          {option.name}: {option.value}
                        </Badge>
                      ))}
                    </div>
                  ) : (
                    item.attributes &&
                    Object.keys(item.attributes).length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {Object.entries(item.attributes).map(([key, value]) => (
                          <Badge
                            key={key}
                            variant="outline"
                            className="text-xs"
                          >
                            {key}: {String(value)}
                          </Badge>
                        ))}
                      </div>
                    )
                  )}

                  {/* Информация о варианте товара */}
                  {(item.variantName || item.variantId) && (
                    <div className="space-y-2">
                      {item.variantName && (
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium text-muted-foreground">
                            Вариант:
                          </span>
                          <Badge variant="secondary" className="text-xs">
                            {item.variantName}
                          </Badge>
                        </div>
                      )}


                      {/* SKU варианта (если отличается от основного SKU) */}
                      {item.variantSku && item.variantSku !== item.productSku && (
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium text-muted-foreground">
                            SKU варианта:
                          </span>
                          <code className="rounded bg-muted px-1.5 py-0.5 text-xs font-mono">
                            {item.variantSku}
                          </code>
                        </div>
                      )}

                      {/* Штрих-код варианта */}
                      {item.variantBarcode && (
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium text-muted-foreground">
                            Штрих-код:
                          </span>
                          <code className="rounded bg-muted px-1.5 py-0.5 text-xs font-mono">
                            {item.variantBarcode}
                          </code>
                        </div>
                      )}

                      {/* Цена варианта (если отличается от основной цены) */}
                      {item.variantPrice && (
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium text-muted-foreground">
                            Цена варианта:
                          </span>
                          <span className="text-sm font-semibold">
                            {formatPrice(item.variantPrice)} ₽
                          </span>
                          {item.variantSalePrice && (
                            <span className="text-xs text-muted-foreground line-through">
                              {formatPrice(item.variantSalePrice)} ₽
                            </span>
                          )}
                        </div>
                      )}


                      {/* Вес варианта */}
                      {item.variantWeight && (
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium text-muted-foreground">
                            Вес:
                          </span>
                          <span className="text-sm">
                            {item.variantWeight} кг
                          </span>
                        </div>
                      )}

                      {/* Размеры варианта */}
                      {item.variantDimensions && (
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium text-muted-foreground">
                            Размеры:
                          </span>
                          <span className="text-sm">
                            {[
                              item.variantDimensions.width && `${item.variantDimensions.width}см`,
                              item.variantDimensions.height && `${item.variantDimensions.height}см`,
                              item.variantDimensions.depth && `${item.variantDimensions.depth}см`
                            ].filter(Boolean).join(' × ')}
                          </span>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Цена и количество */}
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-lg font-bold">
                          {formatPrice(item.unitPrice)} ₽
                        </span>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span>
                          Количество:{" "}
                          <Badge variant="secondary" className="ml-1">
                            {item.quantity} шт.
                          </Badge>
                        </span>
                        <span>
                          Сумма:{" "}
                          <span className="font-semibold text-foreground">
                            {formatPrice(item.totalPrice)} ₽
                          </span>
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
