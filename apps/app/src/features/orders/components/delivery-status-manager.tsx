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
import { Input } from "@qco/ui/components/input";
import { Label } from "@qco/ui/components/label";
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
  Loader2,
  type LucideIcon,
  MapPin,
  Package,
  Truck,
} from "lucide-react";
import { useState } from "react";
import { useTRPC } from "~/trpc/react";

// TODO: Использовать тип из схемы данных элемента статуса доставки, если появится в @qco/validators
type DeliveryStatusItem = {
  value: string;
  label: string;
  icon: LucideIcon;
  description: string;
  color: string;
  bgColor: string;
  borderColor: string;
  step: number;
};

// TODO: Использовать тип из схемы пропсов менеджера статуса доставки, если появится в @qco/validators
interface DeliveryStatusManagerProps {
  order: OrderOutput;
}

const DELIVERY_STATUSES: DeliveryStatusItem[] = [
  {
    value: OrderStatus.PENDING,
    label: "Ожидает обработки",
    icon: Clock,
    description: "Заказ создан, ожидает обработки",
    color: "text-gray-700",
    bgColor: "bg-gray-100",
    borderColor: "border-gray-300",
    step: 1,
  },
  {
    value: OrderStatus.PROCESSING,
    label: "В обработке",
    icon: Package,
    description: "Заказ обрабатывается и готовится к отправке",
    color: "text-blue-700",
    bgColor: "bg-blue-100",
    borderColor: "border-blue-300",
    step: 2,
  },
  {
    value: OrderStatus.SHIPPED,
    label: "Отправлен",
    icon: Truck,
    description: "Заказ отправлен и находится в пути",
    color: "text-purple-700",
    bgColor: "bg-purple-100",
    borderColor: "border-purple-300",
    step: 3,
  },
  {
    value: OrderStatus.DELIVERED,
    label: "Доставлен",
    icon: CheckCircle2,
    description: "Заказ успешно доставлен клиенту",
    color: "text-green-700",
    bgColor: "bg-green-100",
    borderColor: "border-green-300",
    step: 4,
  },
];

export function DeliveryStatusManager({ order }: DeliveryStatusManagerProps) {
  const trpc = useTRPC();
  const queryClient = useQueryClient();
  const [trackingNumber, setTrackingNumber] = useState(
    order.trackingNumber || "",
  );
  const [trackingUrl, setTrackingUrl] = useState(order.trackingUrl || "");

  const updateDeliveryStatusMutationOptions =
    trpc.orders.updateDeliveryStatus.mutationOptions({
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: trpc.orders.byId.queryKey({ id: order.id }),
        });
        toast({
          title: "Статус доставки обновлён",
          description: "Статус доставки успешно изменён",
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

  const updateTrackingMutationOptions =
    trpc.orders.updateTracking.mutationOptions({
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: trpc.orders.byId.queryKey({ id: order.id }),
        });
        toast({
          title: "Информация обновлена",
          description: "Данные для отслеживания обновлены",
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

  const deliveryStatusMutation = useMutation(
    updateDeliveryStatusMutationOptions,
  );
  const trackingMutation = useMutation(updateTrackingMutationOptions);

  const handleStatusUpdate = (newStatus: string) => {
    deliveryStatusMutation.mutate({ id: order.id, status: newStatus });
  };

  const handleTrackingUpdate = () => {
    trackingMutation.mutate({
      id: order.id,
      trackingNumber,
      trackingUrl,
    });
  };

  const currentStatus =
    DELIVERY_STATUSES.find((status) => status.value === order.status) ||
    DELIVERY_STATUSES[0];

  const currentStep = currentStatus.step;
  const totalSteps = DELIVERY_STATUSES.length;
  const progressPercentage = (currentStep / totalSteps) * 100;

  const canUpdateStatus =
    order.status !== "cancelled" && order.status !== "refunded";
  const canUpdateTracking =
    order.status === "shipped" || order.status === "delivered";

  return (
    <Card className="bg-white border-gray-200 shadow-sm h-full">
      <CardHeader className="pb-4">
        <div className="flex items-center gap-3">
          <div className="h-6 w-1 bg-green-500 rounded-full flex-shrink-0" />
          <div className="min-w-0 flex-1">
            <CardTitle className="text-lg font-semibold text-gray-900 truncate">
              Статус доставки
            </CardTitle>
            <CardDescription className="text-sm text-gray-500 truncate">
              Управление процессом доставки
            </CardDescription>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Прогресс доставки */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-700">
              Прогресс доставки
            </span>
            <span className="text-sm text-gray-500">
              {Math.round(progressPercentage)}%
            </span>
          </div>

          {/* Прогресс-бар */}
          <div className="relative">
            <div className="bg-gray-200 relative h-2 overflow-hidden rounded-full w-full">
              <div
                className="bg-green-500 h-full transition-all duration-500 ease-out"
                style={{ width: `${progressPercentage}%` }}
              />
            </div>
          </div>

          {/* Статусы */}
          <div className="flex items-center justify-between">
            {DELIVERY_STATUSES.map((status) => {
              const isActive = status.value === order.status;
              const isCompleted = status.step < currentStep;
              const _isCurrent = status.step === currentStep;

              return (
                <div
                  key={status.value}
                  className="flex flex-col items-center text-center"
                >
                  <div
                    className={`mx-auto flex h-10 w-10 items-center justify-center rounded-full text-sm transition-colors
                    ${isActive ? "bg-green-500 text-white" : isCompleted ? "bg-green-100 text-green-600" : "bg-gray-100 text-gray-400"}`}
                  >
                    <status.icon className="h-5 w-5" />
                  </div>
                  <div
                    className={`mt-2 text-xs max-w-[80px] ${isActive ? "font-medium text-gray-900" : "text-gray-500"}`}
                  >
                    {status.label}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

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

        {/* Информация о доставке */}
        <div className="grid grid-cols-2 gap-4 p-3 rounded-lg border bg-gray-50/50">
          <div>
            <p className="text-xs text-gray-500 mb-1">Способ доставки</p>
            <p className="text-sm font-medium text-gray-900">
              {order.shippingMethod === "standard" && "Стандартная доставка"}
              {order.shippingMethod === "express" && "Экспресс доставка"}
              {order.shippingMethod === "pickup" && "Самовывоз"}
              {order.shippingMethod === "courier" && "Курьерская доставка"}
              {!order.shippingMethod && "Не указан"}
            </p>
          </div>
          <div>
            <p className="text-xs text-gray-500 mb-1">Стоимость доставки</p>
            <p className="text-sm font-medium text-gray-900">
              {Number.parseFloat(order.shippingAmount).toLocaleString("ru-RU")}{" "}
              ₽
            </p>
          </div>
        </div>

        {/* Отслеживание */}
        {canUpdateTracking && (
          <div className="space-y-3 p-3 rounded-lg border bg-blue-50/50">
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-blue-600" />
              <span className="text-sm font-medium text-gray-900">
                Информация для отслеживания
              </span>
            </div>

            <div className="space-y-3">
              <div>
                <Label
                  htmlFor="tracking-number"
                  className="text-xs text-gray-600"
                >
                  Номер отслеживания
                </Label>
                <Input
                  id="tracking-number"
                  value={trackingNumber}
                  onChange={(e) => setTrackingNumber(e.target.value)}
                  placeholder="Введите номер отслеживания"
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="tracking-url" className="text-xs text-gray-600">
                  Ссылка для отслеживания
                </Label>
                <Input
                  id="tracking-url"
                  value={trackingUrl}
                  onChange={(e) => setTrackingUrl(e.target.value)}
                  placeholder="https://tracking.example.com/..."
                  className="mt-1"
                />
              </div>

              <Button
                onClick={handleTrackingUpdate}
                disabled={trackingMutation.isPending}
                size="sm"
                className="w-full"
              >
                {trackingMutation.isPending ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <MapPin className="mr-2 h-4 w-4" />
                )}
                Обновить информацию
              </Button>
            </div>
          </div>
        )}

        {/* Кнопка изменения статуса */}
        {canUpdateStatus && (
          <TooltipProvider>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  className="w-full justify-between h-auto min-h-[44px] px-4 py-3"
                  disabled={deliveryStatusMutation.isPending}
                >
                  <div className="flex items-center gap-3 min-w-0 flex-1">
                    {deliveryStatusMutation.isPending ? (
                      <Loader2 className="h-4 w-4 animate-spin flex-shrink-0" />
                    ) : (
                      <Truck className="h-4 w-4 flex-shrink-0" />
                    )}
                    <span className="truncate">Изменить статус доставки</span>
                  </div>
                </Button>
              </DropdownMenuTrigger>

              <DropdownMenuContent
                className="w-80 max-w-[calc(100vw-2rem)] max-h-[60vh] overflow-y-auto"
                align="start"
                sideOffset={4}
              >
                {DELIVERY_STATUSES.map((status) => (
                  <Tooltip key={status.value}>
                    <TooltipTrigger asChild>
                      <DropdownMenuItem
                        onClick={() => handleStatusUpdate(status.value)}
                        disabled={
                          deliveryStatusMutation.isPending ||
                          order.status === status.value
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
                            {order.status === status.value && (
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
                        Изменить статус доставки на "{status.label}"
                      </p>
                    </TooltipContent>
                  </Tooltip>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </TooltipProvider>
        )}

        {/* Дополнительные действия */}
        {order.status === OrderStatus.SHIPPED && (
          <div className="flex gap-2">
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="outline" size="sm" className="flex-1">
                  <CheckCircle2 className="mr-2 h-4 w-4" />
                  Отметить как доставленный
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent className="max-w-[90vw] sm:max-w-md">
                <AlertDialogHeader>
                  <AlertDialogTitle className="text-lg">
                    Подтвердить доставку
                  </AlertDialogTitle>
                  <AlertDialogDescription className="text-sm leading-relaxed">
                    Вы уверены, что заказ №{order.orderNumber} был успешно
                    доставлен клиенту?
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter className="flex-col sm:flex-row gap-2">
                  <AlertDialogCancel className="w-full sm:w-auto">
                    Отмена
                  </AlertDialogCancel>
                  <AlertDialogAction
                    onClick={() => handleStatusUpdate(OrderStatus.DELIVERED)}
                    className="w-full sm:w-auto bg-green-600 text-white hover:bg-green-700"
                  >
                    Подтвердить доставку
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
