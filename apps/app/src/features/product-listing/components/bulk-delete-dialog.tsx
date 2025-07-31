"use client";

import type { AppRouter } from "@qco/api";
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
import { Button } from "@qco/ui/components/button";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { TRPCClientErrorLike } from "@trpc/client";
import { AlertCircle, Trash2 } from "lucide-react";
import type React from "react";
import { useState } from "react";
import { toast } from "sonner";

import { useTRPC } from "~/trpc/react";

interface BulkDeleteDialogProps {
  productIds: string[];
  onDeleted: (productIds: string[]) => void;
  trigger?: React.ReactNode;
}

export function BulkDeleteDialog({
  productIds,
  onDeleted,
  trigger,
}: BulkDeleteDialogProps) {
  const [open, setOpen] = useState(false);
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  // Создаем опции мутации для массового удаления товаров
  const bulkDeleteMutationOptions = trpc.products.bulkDelete.mutationOptions({
    onSuccess: () => {
      // Инвалидируем кэш запроса списка продуктов
      void queryClient.invalidateQueries({
        queryKey: trpc.products.list.queryKey(),
      });

      // Показываем уведомление об успешном удалении
      toast("Товары удалены", {
        description: `${productIds.length} ${
          productIds.length === 1 ? "товар был" : "товаров были"
        } успешно удалены`,
      });

      // Вызываем колбэк для обновления UI
      onDeleted(productIds);
      setOpen(false);
    },
    onError: (error: TRPCClientErrorLike<AppRouter>) => {
      console.error("Ошибка при массовом удалении товаров:", error);

      toast("Ошибка при удалении", {
        description:
          error.message ||
          "Не удалось удалить товары. Пожалуйста, попробуйте снова.",
        className: "bg-destructive text-destructive-foreground",
      });
    },
  });

  // Используем опции с хуком useMutation
  const { mutate, isPending } = useMutation(bulkDeleteMutationOptions);

  const handleDelete = () => {
    mutate({ ids: productIds });
  };

  const defaultTrigger = (
    <Button
      variant="outline"
      className="text-red-600 hover:bg-red-50 hover:text-red-700"
    >
      <Trash2 className="mr-2 h-4 w-4" />
      <span>Удалить выбранные</span>
    </Button>
  );

  return (
    <>
      <Button variant="ghost" className="p-0" onClick={() => setOpen(true)}>
        {trigger || defaultTrigger}
      </Button>

      <AlertDialog open={open} onOpenChange={setOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2 text-red-600">
              <AlertCircle className="h-5 w-5" />
              Удаление товаров
            </AlertDialogTitle>
            <AlertDialogDescription>
              Вы уверены, что хотите удалить {productIds.length}{" "}
              {productIds.length === 1
                ? "выбранный товар"
                : "выбранных товаров"}
              ?
            </AlertDialogDescription>
            <div className="mt-2 rounded-md bg-amber-50 p-3 text-sm text-amber-800">
              Это действие нельзя отменить. Выбранные товары будут безвозвратно
              удалены из системы.
            </div>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isPending}>Отмена</AlertDialogCancel>
            <AlertDialogAction
              onClick={(e) => {
                e.preventDefault();
                handleDelete();
              }}
              disabled={isPending}
              className="bg-red-600 hover:bg-red-700 focus:ring-red-600"
            >
              {isPending ? (
                <>
                  <span className="mr-2 animate-spin">&#9696;</span>
                  Удаление...
                </>
              ) : (
                "Удалить"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
