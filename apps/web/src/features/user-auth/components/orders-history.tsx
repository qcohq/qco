"use client";

import { Alert, AlertDescription } from "@qco/ui/components/alert";
import { Badge } from "@qco/ui/components/badge";
import { Button } from "@qco/ui/components/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@qco/ui/components/card";
import { Skeleton } from "@qco/ui/components/skeleton";

import { CheckCircle, Clock, Eye, Package, Truck } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import { useOrders } from "../hooks/use-orders";

const getStatusIcon = (status: string) => {
  switch (status) {
    case "pending":
      return <Clock className="h-4 w-4" />;
    case "processing":
      return <Clock className="h-4 w-4" />;
    case "shipped":
      return <Truck className="h-4 w-4" />;
    case "delivered":
      return <CheckCircle className="h-4 w-4" />;
    case "cancelled":
      return <Package className="h-4 w-4" />;
    default:
      return <Package className="h-4 w-4" />;
  }
};

const getStatusColor = (status: string) => {
  switch (status) {
    case "pending":
      return "bg-orange-100 text-orange-800";
    case "processing":
      return "bg-yellow-100 text-yellow-800";
    case "shipped":
      return "bg-blue-100 text-blue-800";
    case "delivered":
      return "bg-green-100 text-green-800";
    case "cancelled":
      return "bg-red-100 text-red-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

const getStatusText = (status: string) => {
  switch (status) {
    case "pending":
      return "Ожидает оплаты";
    case "processing":
      return "Обрабатывается";
    case "shipped":
      return "В пути";
    case "delivered":
      return "Доставлен";
    case "cancelled":
      return "Отменен";
    default:
      return status;
  }
};

const formatDate = (date: Date | string | null | undefined) => {
  if (!date) {
    return "Дата не указана";
  }

  try {
    const dateObj = typeof date === 'string' ? new Date(date) : date;

    // Проверяем, что дата валидна
    if (isNaN(dateObj.getTime())) {
      return "Некорректная дата";
    }

    return new Intl.DateTimeFormat("ru-RU", {
      day: "numeric",
      month: "long",
      year: "numeric",
    }).format(dateObj);
  } catch (error) {
    console.error("Error formatting date:", error);
    return "Ошибка форматирования даты";
  }
};

export default function OrdersHistory() {
  // Используем хук для получения заказов - показываем все заказы
  const { data, isLoading, error } = useOrders({
    status: "all",
    limit: 20,
    offset: 0,
  });
  console.log(error);
  const orders = data?.orders || [];



  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">История заказов</h2>
        <p className="text-muted-foreground">
          Отслеживайте статус ваших заказов
        </p>

      </div>

      <div className="space-y-4 mt-6">
        {isLoading ? (
          // Skeleton loading state
          ["a", "b", "c"].map((skeletonKey) => (
            <Card key={`skeleton-${skeletonKey}`}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="space-y-2">
                    <Skeleton className="h-6 w-32" />
                    <Skeleton className="h-4 w-24" />
                  </div>
                  <div className="text-right space-y-2">
                    <Skeleton className="h-6 w-20" />
                    <Skeleton className="h-5 w-16" />
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center gap-4">
                    <Skeleton className="w-16 h-16 rounded-md" />
                    <div className="flex-1 space-y-2">
                      <Skeleton className="h-4 w-3/4" />
                      <Skeleton className="h-3 w-1/2" />
                      <Skeleton className="h-3 w-1/3" />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        ) : error ? (
          <Alert variant="destructive">
            <AlertDescription>
              Ошибка при загрузке заказов. Пожалуйста, попробуйте позже.
            </AlertDescription>
          </Alert>
        ) : orders.length === 0 ? (
          <Card>
            <CardContent className="text-center py-12">
              <Package className="h-12 w-12 mx-auto text-gray-400 mb-4" />
              <p className="text-gray-500">Заказы не найдены</p>
            </CardContent>
          </Card>
        ) : (
          orders.map((order: any) => (
            <Card key={order.id}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-lg">
                      {order.orderNumber}
                    </CardTitle>
                    <p className="text-sm text-muted-foreground">
                      {formatDate(order.createdAt)}
                    </p>
                  </div>
                  <div className="text-right">
                    <Badge className={getStatusColor(order.status)}>
                      {getStatusIcon(order.status)}
                      <span className="ml-1">
                        {getStatusText(order.status)}
                      </span>
                    </Badge>
                    <p className="text-lg font-semibold mt-1">
                      {order.totalAmount.toLocaleString("ru-RU")} ₽
                    </p>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {/* Order Items */}
                  <div className="space-y-3">
                    {order.items?.map((item: any) => (
                      <div key={item.id} className="flex items-center gap-4">
                        <div className="relative w-16 h-16 bg-gray-100 rounded-md overflow-hidden">
                          <Image
                            src={item.image || "/placeholder.svg"}
                            alt={item.name || item.productName || "Товар"}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <div className="flex-1">
                          {item.slug ? (
                            <Link
                              href={`/products/${item.slug}`}
                              className="font-medium hover:underline"

                            >
                              {item.name || item.productName}
                            </Link>
                          ) : (
                            <span className="font-medium">
                              {item.name || item.productName}
                            </span>
                          )}
                          {item.sku && (
                            <div className="text-xs text-muted-foreground">
                              SKU: {item.sku}
                            </div>
                          )}
                          <p className="text-sm">
                            {item.price.toLocaleString("ru-RU")} ₽ ×{" "}
                            {item.quantity}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Order Details */}
                  {order.trackingNumber && (
                    <div className="flex items-center justify-between pt-4 border-t">
                      <div>
                        <p className="text-sm font-medium">
                          Номер отслеживания
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {order.trackingNumber}
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" asChild>
                          <Link href={`/profile/orders/${order.id}`}>
                            <Eye className="h-4 w-4 mr-2" />
                            Детали
                          </Link>
                        </Button>
                        {order.status === "shipped" && (
                          <Button size="sm">
                            <Truck className="h-4 w-4 mr-2" />
                            Отследить
                          </Button>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
