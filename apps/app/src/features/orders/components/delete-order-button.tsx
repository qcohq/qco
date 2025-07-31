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
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AlertTriangle, Trash2 } from "lucide-react";
import { useState } from "react";

import { useTRPC } from "~/trpc/react";

interface DeleteOrderButtonProps {
  orderId: string;
  orderNumber?: string;
  disabled?: boolean;
  variant?: "ghost" | "destructive" | "outline";
  size?: "sm" | "default";
  className?: string;
}

export function DeleteOrderButton({
  orderId,
  orderNumber,
  disabled = false,
  variant = "ghost",
  size = "sm",
  className,
}: DeleteOrderButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  const deleteMutation = useMutation(
    trpc.orders.removeOrder.mutationOptions({
      async onSuccess() {
        await queryClient.invalidateQueries(trpc.orders.list.queryFilter());
        await queryClient.invalidateQueries(trpc.orders.stats.queryFilter());
        setIsOpen(false);
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
        <Button
          variant={variant}
          size={size}
          disabled={disabled}
          className={className}
        >
          <Trash2 className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
          <span className="sr-only">Удалить заказ</span>
        </Button>
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
