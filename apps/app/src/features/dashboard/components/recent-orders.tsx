import { Badge } from "@qco/ui/components/badge";
import { Button } from "@qco/ui/components/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@qco/ui/components/card";
import { Skeleton } from "@qco/ui/components/skeleton";
import { ArrowRight, Package } from "lucide-react";


const statusConfig = {
  pending: { label: "Ожидает", variant: "secondary" as const },
  processing: { label: "Обрабатывается", variant: "default" as const },
  payment_pending: { label: "Ожидает оплаты", variant: "outline" as const },
  paid: { label: "Оплачен", variant: "default" as const },
  completed: { label: "Завершен", variant: "default" as const },
  shipped: { label: "Отправлен", variant: "default" as const },
  delivered: { label: "Доставлен", variant: "default" as const },
  cancelled: { label: "Отменен", variant: "destructive" as const },
  refunded: { label: "Возвращен", variant: "secondary" as const },
  on_hold: { label: "На удержании", variant: "outline" as const },
  partially_refunded: {
    label: "Частичный возврат",
    variant: "secondary" as const,
  },
  failed: { label: "Ошибка", variant: "destructive" as const },
};

export function RecentOrders({ orders, isLoading = false }: RecentOrdersProps) {
  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Package className="h-5 w-5" />
            Последние заказы
          </CardTitle>
          <CardDescription>
            Последние 5 заказов из вашего магазина
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {Array.from({ length: 5 }).map((_, index) => (
              <div
                key={`recent-orders-skeleton-${Date.now()}-${index}`}
                className="flex items-center justify-between p-3 border rounded-lg"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <Skeleton className="h-4 w-16" />
                    <Skeleton className="h-5 w-20" />
                  </div>
                  <Skeleton className="h-3 w-24 mb-1" />
                  <Skeleton className="h-3 w-16" />
                </div>
                <div className="text-right">
                  <Skeleton className="h-4 w-16" />
                </div>
              </div>
            ))}
          </div>
          <Button variant="outline" className="w-full mt-4" disabled>
            Посмотреть все заказы
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Package className="h-5 w-5" />
          Последние заказы
        </CardTitle>
        <CardDescription>
          Последние 5 заказов из вашего магазина
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {orders.map((order) => (
            <div
              key={order.id}
              className="flex items-center justify-between p-3 border rounded-lg"
            >
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="font-medium">#{order.orderNumber}</span>
                  <Badge
                    variant={statusConfig[order.status]?.variant || "secondary"}
                  >
                    {statusConfig[order.status]?.label || order.status}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground">
                  {order.customerName}
                </p>
                <p className="text-xs text-muted-foreground">{order.date}</p>
              </div>
              <div className="text-right">
                <p className="font-semibold">
                  {order.amount.toLocaleString()} ₽
                </p>
              </div>
            </div>
          ))}
        </div>
        <Button variant="outline" className="w-full mt-4">
          Посмотреть все заказы
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </CardContent>
    </Card>
  );
}
