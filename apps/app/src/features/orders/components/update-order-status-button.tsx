"use client";


import {
    DropdownMenuItem,
} from "@qco/ui/components/dropdown-menu";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { CheckSquare, Package, Truck, CheckCircle, XSquare, RotateCcw } from "lucide-react";
import { useTRPC } from "~/trpc/react";
import { toast } from "@qco/ui/hooks/use-toast";

interface UpdateOrderStatusButtonProps {
    orderId: string;
    currentStatus: string;
    newStatus: string;
    children: React.ReactNode;
    icon: React.ComponentType<{ className?: string }>;
    disabled?: boolean;
}

export function UpdateOrderStatusButton({
    orderId,
    currentStatus,
    newStatus,
    children,
    icon: Icon,
    disabled = false,
}: UpdateOrderStatusButtonProps) {
    const trpc = useTRPC();
    const queryClient = useQueryClient();

    const updateStatusMutation = useMutation(
        trpc.orders.updateStatus.mutationOptions({
            async onSuccess() {
                await queryClient.invalidateQueries(trpc.orders.list.queryFilter());
                await queryClient.invalidateQueries(trpc.orders.stats.queryFilter());
            },
        }),
    );

    const handleUpdateStatus = async () => {
        try {
            await updateStatusMutation.mutateAsync({
                id: orderId,
                status: newStatus
            });
            toast({
                title: "Статус обновлён",
                description: `Статус заказа изменён на "${newStatus}"`,
            });
        } catch (error) {
            console.error("Ошибка при обновлении статуса заказа:", error);
            toast({
                title: "Ошибка",
                description: "Не удалось обновить статус заказа",
                variant: "destructive",
            });
        }
    };

    const isDisabled = disabled || currentStatus === newStatus || updateStatusMutation.isPending;

    return (
        <DropdownMenuItem
            onClick={handleUpdateStatus}
            disabled={isDisabled}
            className="flex items-center"
        >
            <Icon className="mr-2 h-4 w-4" />
            {updateStatusMutation.isPending ? "Обновление..." : children}
        </DropdownMenuItem>
    );
}

// Предопределенные кнопки для разных статусов
export function ConfirmOrderButton({ orderId, currentStatus }: { orderId: string; currentStatus: string }) {
    return (
        <UpdateOrderStatusButton
            orderId={orderId}
            currentStatus={currentStatus}
            newStatus="confirmed"
            icon={CheckSquare}
        >
            Подтвердить заказ
        </UpdateOrderStatusButton>
    );
}

export function ProcessOrderButton({ orderId, currentStatus }: { orderId: string; currentStatus: string }) {
    return (
        <UpdateOrderStatusButton
            orderId={orderId}
            currentStatus={currentStatus}
            newStatus="processing"
            icon={Package}
        >
            В обработку
        </UpdateOrderStatusButton>
    );
}

export function ShipOrderButton({ orderId, currentStatus }: { orderId: string; currentStatus: string }) {
    return (
        <UpdateOrderStatusButton
            orderId={orderId}
            currentStatus={currentStatus}
            newStatus="shipped"
            icon={Truck}
        >
            Отправить
        </UpdateOrderStatusButton>
    );
}

export function DeliverOrderButton({ orderId, currentStatus }: { orderId: string; currentStatus: string }) {
    return (
        <UpdateOrderStatusButton
            orderId={orderId}
            currentStatus={currentStatus}
            newStatus="delivered"
            icon={CheckCircle}
        >
            Доставлен
        </UpdateOrderStatusButton>
    );
}

export function CancelOrderButton({ orderId, currentStatus }: { orderId: string; currentStatus: string }) {
    return (
        <UpdateOrderStatusButton
            orderId={orderId}
            currentStatus={currentStatus}
            newStatus="cancelled"
            icon={XSquare}
        >
            Отменить заказ
        </UpdateOrderStatusButton>
    );
}

export function RefundOrderButton({ orderId, currentStatus }: { orderId: string; currentStatus: string }) {
    return (
        <UpdateOrderStatusButton
            orderId={orderId}
            currentStatus={currentStatus}
            newStatus="refunded"
            icon={RotateCcw}
        >
            Возврат
        </UpdateOrderStatusButton>
    );
} 