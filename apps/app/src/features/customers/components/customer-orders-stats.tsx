"use client";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@qco/ui/components/card";
import type { OrderOutput } from "@qco/validators";
import { Calendar, CreditCard, Package, TrendingUp } from "lucide-react";

// TODO: Использовать тип из схемы пропсов статистики заказов клиента, если появится в @qco/validators
type CustomerOrdersStatsProps = {
  orders: OrderOutput[];
  isLoading?: boolean;
};

export function CustomerOrdersStats({
  orders,
  isLoading,
}: CustomerOrdersStatsProps) {
  if (isLoading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Card key={`customer-orders-stats-skeleton-${Date.now()}-${i}`}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                <div className="h-4 w-20 bg-muted animate-pulse rounded" />
              </CardTitle>
              <div className="h-4 w-4 bg-muted animate-pulse rounded" />
            </CardHeader>
            <CardContent>
              <div className="h-8 w-16 bg-muted animate-pulse rounded" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  const totalOrders = orders.length;
  const totalSpent = orders.reduce(
    (sum, order) => sum + Number.parseFloat(order.totalAmount),
    0,
  );
  const averageOrderValue = totalOrders > 0 ? totalSpent / totalOrders : 0;
  const lastOrder = orders.length > 0 ? orders[0] : null;

  const stats = [
    {
      title: "Всего заказов",
      value: totalOrders,
      icon: Package,
    },
    {
      title: "Общая сумма",
      value: new Intl.NumberFormat("ru-RU", {
        style: "currency",
        currency: "RUB",
      }).format(totalSpent),
      icon: CreditCard,
    },
    {
      title: "Средний чек",
      value: new Intl.NumberFormat("ru-RU", {
        style: "currency",
        currency: "RUB",
      }).format(averageOrderValue),
      icon: TrendingUp,
    },
    {
      title: "Последний заказ",
      value: lastOrder
        ? new Date(lastOrder.createdAt).toLocaleDateString("ru-RU")
        : "Нет заказов",
      icon: Calendar,
    },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat, index) => (
        <Card key={`customer-orders-stats-${stat.title}-${index}`}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              {stat.title}
            </CardTitle>
            <stat.icon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stat.value}</div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
