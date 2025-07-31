import type { AppRouter } from "@qco/api";
import { OrderStatus, ORDER_STATUS_LABELS } from "@qco/db/schema";
import { Badge } from "@qco/ui/components/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@qco/ui/components/select";
import { toast } from "@qco/ui/hooks/use-toast";
import type { OrderOutput } from "@qco/validators";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { TRPCClientErrorLike } from "@trpc/client";
import { Loader2 } from "lucide-react";
import { useState } from "react";
import { useTRPC } from "~/trpc/react";

// Используем все возможные статусы из базы данных
const STATUS_OPTIONS = [
  { value: OrderStatus.PENDING, label: ORDER_STATUS_LABELS[OrderStatus.PENDING] },
  { value: OrderStatus.CONFIRMED, label: ORDER_STATUS_LABELS[OrderStatus.CONFIRMED] },
  { value: OrderStatus.PROCESSING, label: ORDER_STATUS_LABELS[OrderStatus.PROCESSING] },
  { value: OrderStatus.SHIPPED, label: ORDER_STATUS_LABELS[OrderStatus.SHIPPED] },
  { value: OrderStatus.DELIVERED, label: ORDER_STATUS_LABELS[OrderStatus.DELIVERED] },
  { value: OrderStatus.CANCELLED, label: ORDER_STATUS_LABELS[OrderStatus.CANCELLED] },
  { value: OrderStatus.REFUNDED, label: ORDER_STATUS_LABELS[OrderStatus.REFUNDED] },
];

// TODO: Использовать тип из схемы пропсов выбора статуса заказа, если появится в @qco/validators
interface OrderStatusSelectProps {
  order: OrderOutput;
}

export function OrderStatusSelect({ order }: OrderStatusSelectProps) {
  const trpc = useTRPC();
  const queryClient = useQueryClient();
  const [value, setValue] = useState(order.status);

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

  const mutation = useMutation(updateStatusMutationOptions);

  const handleChange = (newStatus: string) => {
    setValue(newStatus);
    mutation.mutate({ id: order.id, status: newStatus });
  };

  return (
    <Select
      value={value}
      onValueChange={handleChange}
      disabled={mutation.isPending}
    >
      <SelectTrigger className="w-40 h-8 border-none bg-transparent p-0">
        <SelectValue>
          <Badge
            variant="outline"
            className="text-base px-3 py-1 rounded-full font-medium flex items-center gap-2"
          >
            {mutation.isPending && (
              <Loader2 className="animate-spin w-4 h-4 opacity-60" />
            )}
            {STATUS_OPTIONS.find((s) => s.value === value)?.label || value}
          </Badge>
        </SelectValue>
      </SelectTrigger>
      <SelectContent>
        {STATUS_OPTIONS.map((option) => (
          <SelectItem
            key={option.value}
            value={option.value}
            className="flex items-center gap-2"
          >
            {option.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
