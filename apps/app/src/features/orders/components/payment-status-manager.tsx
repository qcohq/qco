"use client";

import type { AppRouter } from "@qco/api";
import { PaymentStatus } from "@qco/db/schema";
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
import { Badge } from "@qco/ui/components/badge";
import { Button } from "@qco/ui/components/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@qco/ui/components/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
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
import {
  CheckCircle2,
  Clock,
  CreditCard,
  Loader2,
  type LucideIcon,
  RefreshCw,
  XCircle,
} from "lucide-react";
import { useTRPC } from "~/trpc/react";

// TODO: Использовать тип из схемы данных элемента статуса оплаты, если появится в @qco/validators
type PaymentStatusItem = {
  value: string;
  label: string;
  icon: LucideIcon;
  description: string;
  color: string;
  bgColor: string;
  borderColor: string;
};

const PAYMENT_STATUSES: PaymentStatusItem[] = [
  {
    value: PaymentStatus.PENDING,
    label: "Ожидает оплаты",
    icon: Clock,
    description: "Заказ создан, ожидает оплаты от клиента",
    color: "text-orange-700",
    bgColor: "bg-orange-50",
    borderColor: "border-orange-200",
  },
  {
    value: PaymentStatus.PROCESSING,
    label: "Обрабатывается",
    icon: CreditCard,
    description: "Платеж обрабатывается платежной системой",
    color: "text-blue-700",
    bgColor: "bg-blue-50",
    borderColor: "border-blue-200",
  },
  {
    value: PaymentStatus.COMPLETED,
    label: "Оплачен",
    icon: CheckCircle2,
    description: "Платеж успешно завершен",
    color: "text-green-700",
    bgColor: "bg-green-50",
    borderColor: "border-green-200",
  },
  {
    value: PaymentStatus.FAILED,
    label: "Ошибка оплаты",
    icon: XCircle,
    description: "Произошла ошибка при обработке платежа",
    color: "text-red-700",
    bgColor: "bg-red-50",
    borderColor: "border-red-200",
  },
  {
    value: PaymentStatus.REFUNDED,
    label: "Возвращен",
    icon: RefreshCw,
    description: "Полный возврат средств",
    color: "text-purple-700",
    bgColor: "bg-purple-50",
    borderColor: "border-purple-200",
  },
  {
    value: PaymentStatus.PARTIALLY_REFUNDED,
    label: "Частичный возврат",
    icon: RefreshCw,
    description: "Частичный возврат средств",
    color: "text-amber-700",
    bgColor: "bg-amber-50",
    borderColor: "border-amber-200",
  },
];

// TODO: Использовать тип из схемы пропсов менеджера статуса оплаты, если появится в @qco/validators
interface PaymentStatusManagerProps {
  order: OrderOutput;
}

export function PaymentStatusManager({ order }: PaymentStatusManagerProps) {
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  const updatePaymentStatusMutationOptions =
    trpc.orders.updatePaymentStatus.mutationOptions({
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: trpc.orders.byId.queryKey({ id: order.id }),
        });
        toast({
          title: "Статус оплаты обновлён",
          description: "Статус оплаты успешно изменён",
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

  const mutation = useMutation(updatePaymentStatusMutationOptions);

  const handleStatusUpdate = (newStatus: PaymentStatus) => {
    mutation.mutate({
      id: order.id,
      paymentStatus: newStatus,
    });
  };

  const currentStatus =
    PAYMENT_STATUSES.find((status) => status.value === order.paymentStatus) ??
    PAYMENT_STATUSES.find((status) => status.value === PaymentStatus.PENDING) ??
    PAYMENT_STATUSES[0];

  if (!currentStatus) {
    return null;
  }

  const canUpdateStatus =
    order.status !== "cancelled" && order.status !== "refunded";

  return (
    <Card className="bg-white border-gray-200 shadow-sm h-full">
      <CardHeader className="pb-4">
        <div className="flex items-center gap-3">
          <div className="h-6 w-1 bg-blue-500 rounded-full flex-shrink-0" />
          <div className="min-w-0 flex-1">
            <CardTitle className="text-lg font-semibold text-gray-900 truncate">
              Статус оплаты
            </CardTitle>
            <CardDescription className="text-sm text-gray-500 truncate">
              Управление статусом платежа
            </CardDescription>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Текущий статус */}
        <div className="flex items-center gap-3 p-3 rounded-lg border bg-gray-50/50">
          <div
            className={`p-2 rounded-full ${currentStatus.bgColor} ${currentStatus.borderColor} border`}
          >
            <currentStatus.icon className={`h-5 w-5 ${currentStatus.color}`} />
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <span className="font-medium text-gray-900">
                {currentStatus.label}
              </span>
              <Badge
                variant="outline"
                className={`${currentStatus.bgColor} ${currentStatus.color} ${currentStatus.borderColor} border`}
              >
                {currentStatus.value}
              </Badge>
            </div>
            <p className="text-sm text-gray-500 mt-1">
              {currentStatus.description}
            </p>
          </div>
        </div>

        {/* Информация о платеже */}
        <div className="grid grid-cols-2 gap-4 p-3 rounded-lg border bg-gray-50/50">
          <div>
            <p className="text-xs text-gray-500 mb-1">Способ оплаты</p>
            <p className="text-sm font-medium text-gray-900">
              {order.paymentMethod === "credit_card" && "Банковская карта"}
              {order.paymentMethod === "bank_transfer" && "Банковский перевод"}
              {order.paymentMethod === "paypal" && "PayPal"}
              {order.paymentMethod === "cash_on_delivery" &&
                "Наличными при получении"}
              {order.paymentMethod === "apple_pay" && "Apple Pay"}
              {order.paymentMethod === "google_pay" && "Google Pay"}
              {order.paymentMethod === "crypto" && "Криптовалюта"}
              {!order.paymentMethod && "Не указан"}
            </p>
          </div>
          <div>
            <p className="text-xs text-gray-500 mb-1">Сумма к оплате</p>
            <p className="text-sm font-medium text-gray-900">
              {Number.parseFloat(order.totalAmount).toLocaleString("ru-RU")} ₽
            </p>
          </div>
        </div>

        {/* Кнопка изменения статуса */}
        {canUpdateStatus && (
          <TooltipProvider>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  className="w-full justify-between h-auto min-h-[44px] px-4 py-3"
                  disabled={mutation.isPending}
                >
                  <div className="flex items-center gap-3 min-w-0 flex-1">
                    {mutation.isPending ? (
                      <Loader2 className="h-4 w-4 animate-spin flex-shrink-0" />
                    ) : (
                      <CreditCard className="h-4 w-4 flex-shrink-0" />
                    )}
                    <span className="truncate">Изменить статус оплаты</span>
                  </div>
                </Button>
              </DropdownMenuTrigger>

              <DropdownMenuContent
                className="w-80 max-w-[calc(100vw-2rem)] max-h-[60vh] overflow-y-auto"
                align="start"
                sideOffset={4}
              >
                {PAYMENT_STATUSES.map((status) => (
                  <Tooltip key={status.value}>
                    <TooltipTrigger asChild>
                      <DropdownMenuItem
                        onClick={() => handleStatusUpdate(status.value)}
                        disabled={
                          mutation.isPending ||
                          order.paymentStatus === status.value
                        }
                        className="flex items-start gap-3 px-4 py-3 min-h-[60px] cursor-pointer"
                      >
                        <div
                          className={`p-2 rounded-full ${status.bgColor} ${status.borderColor} border flex-shrink-0`}
                        >
                          <status.icon className={`h-4 w-4 ${status.color}`} />
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-sm font-medium leading-relaxed break-words">
                              {status.label}
                            </span>
                            {order.paymentStatus === status.value && (
                              <Badge
                                variant="outline"
                                className={`${status.bgColor} ${status.color} ${status.borderColor} border text-xs`}
                              >
                                Текущий
                              </Badge>
                            )}
                          </div>
                          <p className="text-xs text-gray-500 leading-relaxed break-words">
                            {status.description}
                          </p>
                        </div>
                      </DropdownMenuItem>
                    </TooltipTrigger>
                    <TooltipContent side="right" className="max-w-[250px]">
                      <p className="text-sm">
                        Изменить статус оплаты на "{status.label}"
                      </p>
                    </TooltipContent>
                  </Tooltip>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </TooltipProvider>
        )}

        {/* Дополнительные действия */}
        {order.paymentStatus === PaymentStatus.COMPLETED && (
          <div className="flex gap-2">
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="outline" size="sm" className="flex-1">
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Возврат средств
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent className="max-w-[90vw] sm:max-w-md">
                <AlertDialogHeader>
                  <AlertDialogTitle className="text-lg">
                    Возврат средств
                  </AlertDialogTitle>
                  <AlertDialogDescription className="text-sm leading-relaxed">
                    Вы уверены, что хотите оформить возврат средств для заказа №
                    {order.orderNumber}? Сумма возврата:{" "}
                    {Number.parseFloat(order.totalAmount).toLocaleString(
                      "ru-RU",
                    )}{" "}
                    ₽
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter className="flex-col sm:flex-row gap-2">
                  <AlertDialogCancel className="w-full sm:w-auto">
                    Отмена
                  </AlertDialogCancel>
                  <AlertDialogAction
                    onClick={() => handleStatusUpdate(PaymentStatus.REFUNDED)}
                    className="w-full sm:w-auto bg-destructive text-destructive-foreground hover:bg-destructive/90"
                  >
                    Оформить возврат
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
