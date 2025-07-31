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
import {
  Loader2,
  type LucideIcon,
  RefreshCw,
  Settings,
  XCircle,
} from "lucide-react";
import { useTRPC } from "~/trpc/react";

// TODO: Использовать тип из схемы данных элемента статуса, если появится в @qco/validators
type StatusItem = {
  value: string;
  label: string;
  icon: LucideIcon;
};

// TODO: Использовать тип из схемы данных группы статусов, если появится в @qco/validators
type StatusGroup = {
  label: string;
  items: StatusItem[];
};

const STATUS_GROUPS: StatusGroup[] = [
  {
    label: "Основные статусы",
    items: [
      { value: OrderStatus.PENDING, label: "В ожидании", icon: Settings },
      { value: OrderStatus.PROCESSING, label: "В обработке", icon: Settings },
      { value: OrderStatus.COMPLETED, label: "Завершён", icon: Settings },
    ],
  },
  {
    label: "Проблемные статусы",
    items: [
      { value: OrderStatus.CANCELLED, label: "Отменён", icon: XCircle },
      { value: OrderStatus.REFUNDED, label: "Возврат", icon: RefreshCw },
      { value: OrderStatus.ON_HOLD, label: "На удержании", icon: Settings },
      {
        value: OrderStatus.PARTIALLY_REFUNDED,
        label: "Частичный возврат",
        icon: RefreshCw,
      },
      { value: OrderStatus.FAILED, label: "Ошибка", icon: Settings },
    ],
  },
];

export function OrderActions({ order }: { order: OrderOutput }) {
  const trpc = useTRPC();
  const queryClient = useQueryClient();

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

  const updateStatusMutation = useMutation(updateStatusMutationOptions);
  const cancelMutation = useMutation(cancelMutationOptions);

  const handleStatusUpdate = (newStatus: string) => {
    updateStatusMutation.mutate({ id: order.id, status: newStatus });
  };

  const handleCancelOrder = () => {
    cancelMutation.mutate({ id: order.id });
  };

  const currentStatus = STATUS_GROUPS.flatMap((group) => group.items).find(
    (item) => item.value === order.status,
  );

  const canCancel =
    order.status !== OrderStatus.CANCELLED &&
    order.status !== OrderStatus.DELIVERED &&
    order.status !== OrderStatus.REFUNDED;

  return (
    <Card className="bg-white border-gray-200 shadow-sm h-full">
      <CardHeader className="pb-4">
        <div className="flex items-center gap-3">
          <div className="h-6 w-1 bg-primary rounded-full flex-shrink-0" />
          <div className="min-w-0 flex-1">
            <CardTitle className="text-lg font-semibold text-gray-900 truncate">
              Действия с заказом
            </CardTitle>
            <CardDescription className="text-sm text-gray-500">
              Управление общим статусом и отмена заказа
            </CardDescription>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        <TooltipProvider>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                className="w-full justify-between h-auto min-h-[40px] px-3 py-2"
                disabled={updateStatusMutation.isPending}
              >
                <div className="flex items-center gap-2 min-w-0 flex-1">
                  {updateStatusMutation.isPending ? (
                    <Loader2 className="h-4 w-4 animate-spin flex-shrink-0" />
                  ) : (
                    <Settings className="h-4 w-4 flex-shrink-0" />
                  )}
                  <span className="truncate">Изменить статус</span>
                </div>
                <Badge
                  variant="outline"
                  className="ml-2 flex-shrink-0 max-w-[120px] truncate text-xs"
                >
                  {currentStatus?.label || order.status}
                </Badge>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              className="w-72 max-w-[calc(100vw-2rem)] max-h-[60vh] overflow-y-auto"
              align="start"
              sideOffset={4}
            >
              {STATUS_GROUPS.map((group, index) => (
                <div key={group.label}>
                  {index > 0 && <DropdownMenuSeparator />}
                  <DropdownMenuLabel className="text-xs font-medium text-gray-500 px-2 py-1.5">
                    {group.label}
                  </DropdownMenuLabel>
                  <DropdownMenuGroup>
                    {group.items.map((status) => (
                      <Tooltip key={status.value}>
                        <TooltipTrigger asChild>
                          <DropdownMenuItem
                            onClick={() => handleStatusUpdate(status.value)}
                            disabled={
                              updateStatusMutation.isPending ||
                              order.status === status.value
                            }
                            className="flex items-center gap-3 px-3 py-2.5 min-h-[44px] cursor-pointer"
                          >
                            <status.icon className="h-4 w-4 flex-shrink-0 text-gray-500" />
                            <span className="text-sm leading-relaxed break-words">
                              {status.label}
                            </span>
                          </DropdownMenuItem>
                        </TooltipTrigger>
                        <TooltipContent side="right" className="max-w-[200px]">
                          <p className="text-sm">
                            Изменить статус на "{status.label}"
                          </p>
                        </TooltipContent>
                      </Tooltip>
                    ))}
                  </DropdownMenuGroup>
                </div>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </TooltipProvider>

        {canCancel && (
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button
                variant="destructive"
                className="w-full h-auto min-h-[40px] px-3 py-2"
                disabled={cancelMutation.isPending}
              >
                {cancelMutation.isPending ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin flex-shrink-0" />
                ) : (
                  <XCircle className="mr-2 h-4 w-4 flex-shrink-0" />
                )}
                <span className="truncate">Отменить заказ</span>
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent className="max-w-[90vw] sm:max-w-md">
              <AlertDialogHeader>
                <AlertDialogTitle className="text-lg">
                  Отменить заказ?
                </AlertDialogTitle>
                <AlertDialogDescription className="text-sm leading-relaxed">
                  Вы уверены, что хотите отменить заказ №{order.orderNumber}?
                  Это действие нельзя будет отменить.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter className="flex-col sm:flex-row gap-2">
                <AlertDialogCancel className="w-full sm:w-auto">
                  Отмена
                </AlertDialogCancel>
                <AlertDialogAction
                  onClick={handleCancelOrder}
                  className="w-full sm:w-auto bg-destructive text-white hover:bg-destructive/90"
                >
                  Да, отменить заказ
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        )}

        {/* Информационная панель */}
        <div className="p-3 rounded-lg border bg-gray-50/50">
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-500">Номер заказа:</span>
              <span className="font-medium text-gray-900">
                #{order.orderNumber}
              </span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-500">Дата создания:</span>
              <span className="font-medium text-gray-900">
                {new Date(order.createdAt).toLocaleDateString("ru-RU")}
              </span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-500">Общая сумма:</span>
              <span className="font-medium text-gray-900">
                {Number.parseFloat(order.totalAmount).toLocaleString("ru-RU")} ₽
              </span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
