"use client";

import { Alert, AlertDescription } from "@qco/ui/components/alert";
import { Button } from "@qco/ui/components/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@qco/ui/components/dialog";
import {
    DropdownMenuItem,
} from "@qco/ui/components/dropdown-menu";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AlertTriangle, Trash2 } from "lucide-react";
import { useState } from "react";
import { useTRPC } from "~/trpc/react";
import { toast } from "@qco/ui/hooks/use-toast";

interface DeleteOrderDropdownItemProps {
    orderId: string;
    orderNumber?: string;
    disabled?: boolean;
}

export function DeleteOrderDropdownItem({
    orderId,
    orderNumber,
    disabled = false,
}: DeleteOrderDropdownItemProps) {
    const [isOpen, setIsOpen] = useState(false);
    const trpc = useTRPC();
    const queryClient = useQueryClient();

    const deleteMutation = useMutation(
        trpc.orders.removeOrder.mutationOptions({
            async onSuccess() {
                await queryClient.invalidateQueries(trpc.orders.list.queryFilter());
                await queryClient.invalidateQueries(trpc.orders.stats.queryFilter());
                setIsOpen(false);
                toast({
                    title: "Заказ удалён",
                    description: "Заказ успешно удалён",
                });
            },
            onError: (error) => {
                toast({
                    title: "Ошибка",
                    description: error.message || "Не удалось удалить заказ",
                    variant: "destructive",
                });
            },
        }),
    );

    const handleDelete = async () => {
        try {
            await deleteMutation.mutateAsync({ id: orderId });
        } catch (error) {
            console.error("Ошибка при удалении заказа:", error);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                <DropdownMenuItem
                    disabled={disabled}
                    className="flex items-center text-destructive focus:text-destructive"
                >
                    <Trash2 className="mr-2 h-4 w-4" />
                    Удалить заказ
                </DropdownMenuItem>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <AlertTriangle className="h-5 w-5 text-destructive" />
                        Удаление заказа
                    </DialogTitle>
                    <DialogDescription>
                        Вы собираетесь удалить заказ {orderNumber || orderId}. Это действие
                        нельзя отменить.
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-4">
                    <Alert variant="destructive">
                        <AlertTriangle className="h-4 w-4" />
                        <AlertDescription>
                            Внимание! Удаление заказа приведет к потере всех данных о заказе,
                            включая историю, товары и информацию о клиенте. Это действие
                            необратимо.
                        </AlertDescription>
                    </Alert>
                </div>

                <DialogFooter>
                    <Button
                        variant="outline"
                        onClick={() => setIsOpen(false)}
                        disabled={deleteMutation.isPending}
                    >
                        Отмена
                    </Button>
                    <Button
                        variant="destructive"
                        onClick={handleDelete}
                        disabled={deleteMutation.isPending}
                    >
                        {deleteMutation.isPending ? "Удаление..." : "Удалить заказ"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
} 