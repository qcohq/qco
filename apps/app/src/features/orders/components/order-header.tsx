"use client";

import type { AppRouter } from "@qco/api";
import { OrderStatus } from "@qco/db/schema";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@qco/ui/components/alert-dialog";
import { Button } from "@qco/ui/components/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@qco/ui/components/dropdown-menu";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@qco/ui/components/tooltip";
import { toast } from "@qco/ui/hooks/use-toast";
import type { OrderOutput } from "@qco/validators";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { TRPCClientErrorLike } from "@trpc/client";
import { Loader2, Printer, Settings, XCircle } from "lucide-react";
import { useTRPC } from "~/trpc/react";

// TODO: Использовать тип из схемы пропсов заголовка заказа, если появится в @qco/validators
interface OrderHeaderProps {
  order: OrderOutput;
}

export function OrderHeader({ order }: OrderHeaderProps) {
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  // --- Печать ---
  // TODO: Использовать тип из схемы данных для печати заказа, если появится в @qco/validators
  type PrintOrderData = {
    orderNumber: string;
    createdAt: string;
    status: string;
    paymentMethod: string | null;
    shippingMethod: string | null;
    items: Array<{
      name: string;
      quantity: number;
      price: string;
      totalPrice: string;
    }>;
    currency: string;
    subtotalAmount: string;
    shippingAmount: string;
    taxAmount: string;
    totalAmount: string;
  };
  const printMutationOptions = trpc.orders.print.mutationOptions({
    onSuccess: (payload) => {
      const data: PrintOrderData = {
        orderNumber: payload.order.orderNumber,
        createdAt: payload.order.createdAt,
        status: payload.order.status,
        paymentMethod: payload.order.paymentMethod ?? null,
        shippingMethod: payload.order.shippingMethod ?? null,
        items: (payload.order.items || []).map((i) => ({
          name: i.productName,
          quantity: i.quantity,
          price: i.unitPrice,
          totalPrice: i.totalPrice,
        })),
        currency: "RUB",
        subtotalAmount: payload.order.subtotalAmount,
        shippingAmount: payload.order.shippingAmount,
        taxAmount: payload.order.taxAmount,
        totalAmount: payload.order.totalAmount,
      };
      const printWindow = window.open("", "_blank");
      if (printWindow) {
        printWindow.document.write(`
          <html>
            <head>
              <title>Заказ ${data.orderNumber}</title>
              <style>
                body { font-family: Arial, sans-serif; margin: 20px; }
                .header { text-align: center; margin-bottom: 30px; }
                .order-info { margin-bottom: 20px; }
                .items { margin-bottom: 20px; }
                table { width: 100%; border-collapse: collapse; }
                th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
                th { background-color: #f2f2f2; }
                .total { font-weight: bold; margin-top: 20px; }
              </style>
            </head>
            <body>
              <div class="header">
                <h1>Заказ ${data.orderNumber}</h1>
                <p>Дата: ${new Date(data.createdAt).toLocaleDateString("ru-RU")}</p>
              </div>
              <div class="order-info">
                <p><strong>Статус:</strong> ${data.status}</p>
                <p><strong>Способ оплаты:</strong> ${data.paymentMethod}</p>
                <p><strong>Способ доставки:</strong> ${data.shippingMethod}</p>
              </div>
              <div class="items">
                <h3>Товары:</h3>
                <table>
                  <thead>
                    <tr>
                      <th>Название</th>
                      <th>Количество</th>
                      <th>Цена</th>
                      <th>Итого</th>
                    </tr>
                  </thead>
                  <tbody>
                    ${data.items
            .map(
              (item) => `
                      <tr>
                        <td>${item.name}</td>
                        <td>${item.quantity}</td>
                        <td>${item.price} ${data.currency}</td>
                        <td>${item.totalPrice} ${data.currency}</td>
                      </tr>
                    `,
            )
            .join("")}
                  </tbody>
                </table>
              </div>
              <div class="total">
                <p><strong>Подытог:</strong> ${data.subtotalAmount} ${data.currency}</p>
                <p><strong>Доставка:</strong> ${data.shippingAmount} ${data.currency}</p>
                <p><strong>Налог:</strong> ${data.taxAmount} ${data.currency}</p>
                <p><strong>Итого:</strong> ${data.totalAmount} ${data.currency}</p>
              </div>
            </body>
          </html>
        `);
        printWindow.document.close();
        printWindow.print();
      }
      toast({ title: "Печать", description: "Открыто окно печати" });
    },
    onError: (error: TRPCClientErrorLike<AppRouter>) => {
      toast({
        title: "Ошибка печати",
        description: error.message,
        variant: "destructive",
      });
    },
  });
  const printMutation = useMutation(printMutationOptions);
  const handlePrint = () => {
    printMutation.mutate({ id: order.id });
  };

  // --- Получение заказа для статусов и отмены ---
  // Для получения order нужен проп order, а не только orderId. Поэтому компонент должен принимать order: OrderOutput
  // Для совместимости с OrderDetailsPage, где есть order, меняем пропсы:
  // interface OrderHeaderProps { order: OrderOutput; }
  // и далее используем order

  // --- Статусы заказа ---
  const STATUS_GROUPS = [
    {
      label: "Основные статусы",
      items: [
        { value: OrderStatus.PENDING, label: "В ожидании", icon: Settings },
        { value: OrderStatus.CONFIRMED, label: "Подтверждён", icon: Settings },
        { value: OrderStatus.PROCESSING, label: "В обработке", icon: Settings },
        { value: OrderStatus.SHIPPED, label: "Отправлен", icon: Settings },
        { value: OrderStatus.DELIVERED, label: "Доставлен", icon: Settings },
      ],
    },
    {
      label: "Прочие",
      items: [
        { value: OrderStatus.CANCELLED, label: "Отменён", icon: XCircle },
        { value: OrderStatus.REFUNDED, label: "Возврат", icon: Settings },
      ],
    },
  ];

  const updateStatusMutationOptions = trpc.orders.updateStatus.mutationOptions({
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: trpc.orders.byId.queryKey({ id: order.id }),
      });
      toast({
        title: "Статус обновлён",
        description: "Статус заказа успешно изменён",
      });
    },
    onError: (error: TRPCClientErrorLike<AppRouter>) => {
      toast({
        title: "Ошибка",
        description: error.message,
        variant: "destructive",
      });
    },
  });
  const updateStatusMutation = useMutation(updateStatusMutationOptions);
  const handleStatusUpdate = (newStatus: string) => {
    updateStatusMutation.mutate({ id: order.id, status: newStatus });
  };

  const cancelMutationOptions = trpc.orders.cancel.mutationOptions({
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: trpc.orders.byId.queryKey({ id: order.id }),
      });
      queryClient.invalidateQueries(trpc.orders.list.queryFilter());
      toast({ title: "Заказ отменён", description: "Заказ успешно отменён" });
    },
    onError: (error: TRPCClientErrorLike<AppRouter>) => {
      toast({
        title: "Ошибка отмены",
        description: error.message,
        variant: "destructive",
      });
    },
  });
  const cancelMutation = useMutation(cancelMutationOptions);
  const handleCancelOrder = () => {
    cancelMutation.mutate({ id: order.id });
  };

  // Для отображения статуса и отмены нужен order, а не только orderId
  return (
    <div className="flex gap-2 items-center">
      <Button
        variant="outline"
        size="sm"
        onClick={handlePrint}
        disabled={printMutation.isPending}
        className="flex items-center gap-2"
      >
        <Printer className="h-4 w-4" />
        {printMutation.isPending ? "Печать..." : "Печать"}
      </Button>
      {/* Кнопка изменения статуса */}
      <TooltipProvider>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              className="flex items-center gap-2"
              disabled={updateStatusMutation.isPending}
            >
              {updateStatusMutation.isPending ? (
                <Loader2 className="h-4 w-4 animate-spin flex-shrink-0" />
              ) : (
                <Settings className="h-4 w-4 flex-shrink-0" />
              )}
              <span>Изменить статус</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            {STATUS_GROUPS.map((group, index) => (
              <div key={group.label}>
                {index > 0 && <DropdownMenuSeparator />}
                <DropdownMenuLabel>{group.label}</DropdownMenuLabel>
                <DropdownMenuGroup>
                  {group.items.map((status) => (
                    <Tooltip key={status.value}>
                      <TooltipTrigger asChild>
                        <DropdownMenuItem
                          onClick={() => handleStatusUpdate(status.value)}
                          disabled={updateStatusMutation.isPending}
                        >
                          <status.icon className="h-4 w-4 mr-2" />
                          {status.label}
                        </DropdownMenuItem>
                      </TooltipTrigger>
                      <TooltipContent side="right">
                        <p>Изменить статус на "{status.label}"</p>
                      </TooltipContent>
                    </Tooltip>
                  ))}
                </DropdownMenuGroup>
              </div>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </TooltipProvider>
      {/* Кнопка отмены заказа */}
      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button
            variant="destructive"
            size="sm"
            className="flex items-center gap-2"
            disabled={cancelMutation.isPending}
          >
            {cancelMutation.isPending ? (
              <Loader2 className="h-4 w-4 animate-spin flex-shrink-0" />
            ) : (
              <XCircle className="h-4 w-4 flex-shrink-0" />
            )}
            Отменить
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Отменить заказ?</AlertDialogTitle>
            <AlertDialogDescription>
              Вы уверены, что хотите отменить заказ?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Отмена</AlertDialogCancel>
            <AlertDialogAction onClick={handleCancelOrder}>
              Да, отменить
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
