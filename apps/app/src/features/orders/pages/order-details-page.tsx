"use client";

import { Button } from "@qco/ui/components/button";
import { toast } from "@qco/ui/hooks/use-toast";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft } from "lucide-react";
import { useTRPC } from "~/trpc/react";
import { DeliveryStatusManager } from "../components/delivery-status-manager";
import { OrderHeader } from "../components/order-header";
import { OrderHistory } from "../components/order-history";
import { OrderItems } from "../components/order-items";
import { OrderOverview } from "../components/order-overview";
import { PaymentStatusManager } from "../components/payment-status-manager";

// TODO: Использовать тип из схемы пропсов страницы деталей заказа, если появится в @qco/validators
interface OrderDetailsPageProps {
  orderId: string;
}

export function OrderDetailsPage({ orderId }: OrderDetailsPageProps) {
  const trpc = useTRPC();

  // Создаем опции запроса с помощью queryOptions
  const orderQueryOptions = trpc.orders.byId.queryOptions({ id: orderId });

  // Используем опции с хуком useQuery
  const { data, isPending, error } = useQuery(orderQueryOptions);
  const order = data?.order;
  // Обработка ошибки
  if (error) {
    toast({
      title: "Ошибка загрузки заказа",
      description: error.message,
      variant: "destructive",
    });
    return null;
  }

  // Отображение загрузки
  if (isPending || !order) {
    return (
      <div className="flex min-h-screen flex-col bg-gray-50/50">
        {/* Header */}
        <header className="bg-background sticky top-0 z-10 flex h-14 shrink-0 items-center border-b px-4">
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              disabled
              className="gap-1 text-muted-foreground"
            >
              <ArrowLeft className="h-4 w-4" />
              Заказы
            </Button>
            <div className="text-muted-foreground flex items-center gap-1 text-sm">
              <span>/</span>
              <div className="h-4 w-32 animate-pulse rounded bg-gray-200" />
            </div>
          </div>
        </header>

        {/* Main content */}
        <main className="flex-1">
          <div className="container mx-auto max-w-4xl px-4 py-6">
            <div className="space-y-6">
              <div className="h-8 w-full animate-pulse rounded-md bg-gray-200" />
              <div className="grid gap-4 md:grid-cols-2">
                <div className="h-64 animate-pulse rounded-xl bg-gray-200" />
                <div className="h-64 animate-pulse rounded-xl bg-gray-200" />
              </div>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col bg-gray-50/50">
      {/* Header */}
      <header className="bg-background sticky top-0 z-10 flex h-14 shrink-0 items-center border-b px-4">
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => window.history.back()}
            className="gap-1 text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4" />
            Заказы
          </Button>
          <div className="text-muted-foreground flex items-center gap-1 text-sm">
            <span>/</span>
            <span className="text-foreground font-medium">
              Заказ №{order.orderNumber}
            </span>
          </div>
        </div>
        <div className="ml-auto">
          <OrderHeader order={order} />
        </div>
      </header>

      {/* Main content */}
      <main className="flex-1">
        <div className="container mx-auto max-w-4xl px-4 py-6">
          <div className="space-y-6">
            {/* Обзор заказа */}
            <OrderOverview order={order} />

            {/* Статусы заказа на всю ширину */}
            <div className="grid gap-4 md:grid-cols-2">
              <PaymentStatusManager order={order} />
              <DeliveryStatusManager order={order} />
            </div>

            {/* Товары в заказе на всю ширину */}
            <OrderItems order={order} />

            {/* История заказа и действия */}
            <div className="grid gap-6">
              <OrderHistory order={order} />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default OrderDetailsPage;
