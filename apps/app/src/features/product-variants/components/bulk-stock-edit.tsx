"use client";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@qco/ui/components/alert-dialog";
import { Input } from "@qco/ui/components/input";
import { toast } from "@qco/ui/hooks/use-toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";

import { useTRPC } from "~/trpc/react";

interface BulkStockEditProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  productId: string;
}

export function BulkStockEdit({
  isOpen,
  onOpenChange,
  productId,
}: BulkStockEditProps) {
  const trpc = useTRPC();
  const queryClient = useQueryClient();
  const [stockValue, setStockValue] = useState<string>("");

  const bulkUpdateStockMutation = useMutation(
    trpc.productVariants.updateStock.mutationOptions({
      onSuccess: () => {
        onOpenChange(false);
        setStockValue("");
        toast({
          title: "Успех",
          description: "Наличие успешно обновлено",
        });

        queryClient.invalidateQueries({
          queryKey: trpc.productVariants.getVariants.queryKey({ productId }),
        });
      },
      onError: (error) => {
        toast({
          title: "Ошибка",
          description: `${error.message || "Не удалось обновить наличие"}`,
          variant: "destructive",
        });
      },
    }),
  );

  const handleSubmit = () => {
    const value = Number.parseInt(stockValue, 10);
    if (Number.isNaN(value) || value < 0) {
      toast({
        title: "Ошибка",
        description:
          "Пожалуйста, введите корректное числовое значение (0 или больше)",
        variant: "destructive",
      });
      return;
    }

    bulkUpdateStockMutation.mutate({
      productId,
      stock: value,
    });
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Массовое редактирование наличия</AlertDialogTitle>
          <AlertDialogDescription>
            Установите новое количество товара для всех вариантов
          </AlertDialogDescription>
        </AlertDialogHeader>
        <div className="py-4 space-y-4">
          <div className="flex items-center gap-2">
            <Input
              type="number"
              value={stockValue}
              onChange={(e) => setStockValue(e.target.value)}
              placeholder="Количество товара"
              step="1"
              min="0"
            />
            <span className="text-sm text-muted-foreground">шт.</span>
          </div>
        </div>
        <AlertDialogFooter>
          <AlertDialogCancel>Отмена</AlertDialogCancel>
          <AlertDialogAction onClick={handleSubmit}>
            Применить
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
