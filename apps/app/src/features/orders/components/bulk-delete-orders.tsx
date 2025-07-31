"use client";

import { Alert, AlertDescription } from "@qco/ui/components/alert";
import { Button } from "@qco/ui/components/button";
import { Checkbox } from "@qco/ui/components/checkbox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@qco/ui/components/dialog";
import { Label } from "@qco/ui/components/label";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AlertTriangle, Trash2 } from "lucide-react";
import { useState } from "react";

import { useTRPC } from "~/trpc/react";

// TODO: Использовать тип из схемы пропсов массового удаления заказов, если появится в @qco/validators
interface BulkDeleteOrdersProps {
  selectedOrders: string[];
  onSelectionChange: (orderIds: string[]) => void;
  disabled?: boolean;
}

export function BulkDeleteOrders({
  selectedOrders,
  onSelectionChange,
  disabled = false,
}: BulkDeleteOrdersProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [confirmText, setConfirmText] = useState("");
  const [isConfirmed, setIsConfirmed] = useState(false);
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  const deleteMutation = useMutation(
    trpc.orders.removeOrder.mutationOptions({
      async onSuccess() {
        await queryClient.invalidateQueries(trpc.orders.list.queryFilter());
        await queryClient.invalidateQueries(trpc.orders.stats.queryFilter());
        onSelectionChange([]);
        setIsOpen(false);
        setConfirmText("");
        setIsConfirmed(false);
      },
    }),
  );

  const handleBulkDelete = async () => {
    if (!isConfirmed || selectedOrders.length === 0) return;

    try {
      // Удаляем заказы по одному
      for (const orderId of selectedOrders) {
        await deleteMutation.mutateAsync({ id: orderId });
      }
    } catch (error) {
      console.error("Ошибка при массовом удалении заказов:", error);
    }
  };

  const handleConfirmTextChange = (value: string) => {
    setConfirmText(value);
    setIsConfirmed(value === "УДАЛИТЬ");
  };

  const isDeleteDisabled =
    !isConfirmed || selectedOrders.length === 0 || deleteMutation.isPending;

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          variant="destructive"
          size="sm"
          disabled={disabled || selectedOrders.length === 0}
          className="h-7 text-xs sm:h-8"
        >
          <Trash2 className="mr-1 h-3 w-3 sm:h-3.5 sm:w-3.5" />
          Удалить ({selectedOrders.length})
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-destructive" />
            Массовое удаление заказов
          </DialogTitle>
          <DialogDescription>
            Вы собираетесь удалить {selectedOrders.length} заказ(ов). Это
            действие нельзя отменить.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              Внимание! Удаление заказов приведет к потере всех данных о
              заказах, включая историю, товары и информацию о клиентах. Это
              действие необратимо.
            </AlertDescription>
          </Alert>

          <div className="space-y-2">
            <Label htmlFor="confirm-text">
              Для подтверждения введите "УДАЛИТЬ":
            </Label>
            <input
              id="confirm-text"
              type="text"
              value={confirmText}
              onChange={(e) => handleConfirmTextChange(e.target.value)}
              placeholder="УДАЛИТЬ"
              className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
            />
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="confirm-checkbox"
              checked={isConfirmed}
              onCheckedChange={(checked) => {
                setIsConfirmed(checked as boolean);
                if (!checked) setConfirmText("");
              }}
            />
            <Label htmlFor="confirm-checkbox" className="text-sm">
              Я понимаю, что это действие необратимо
            </Label>
          </div>
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
            onClick={handleBulkDelete}
            disabled={isDeleteDisabled}
          >
            {deleteMutation.isPending ? "Удаление..." : "Удалить заказы"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
