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

interface DeleteProductDialogProps {
  productId: string;
  productName: string;
  onDeleted: (productId: string) => void;
  trigger?: React.ReactNode;
  isMenuItem?: boolean;
}

export function DeleteProductDialog({
  productId,
  productName,
  onDeleted,
  trigger,
  isMenuItem = false,
}: DeleteProductDialogProps) {
  const [open, setOpen] = useState(false);
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  // Создаем опции мутации для удаления товара
  const deleteProductMutationOptions = trpc.products.delete.mutationOptions({
    onSuccess: () => {
      // Инвалидируем кэш запроса списка продуктов
      void queryClient.invalidateQueries({
        queryKey: trpc.products.list.queryKey(),
      });

      toast.success(`Товар "${productName}" был успешно удален`);
      onDeleted(productId);
      setOpen(false);
    },
    onError: (error: TRPCClientErrorLike<AppRouter>) => {
      // Ошибка при удалении товара уже обработана в onError
      toast.error(
        error.message ||
          "Не удалось удалить товар. Пожалуйста, попробуйте снова.",
      );
    },
  });

  // Используем опции с хуком useMutation
  const { mutate, isPending: isDeleting } = useMutation(
    deleteProductMutationOptions,
  );

  const handleDelete = () => {
    mutate({ id: productId });
  };

  const defaultTrigger = (
    <Button
      variant={isMenuItem ? "ghost" : "outline"}
      size={isMenuItem ? "sm" : "default"}
      className={
        isMenuItem
          ? "h-8 w-full justify-start px-2"
          : "text-red-600 hover:bg-red-50 hover:text-red-700"
      }
    >
      <Trash2 className={`${isMenuItem ? "mr-2 h-4 w-4" : "mr-2 h-4 w-4"}`} />
      <span>Удалить</span>
    </Button>
  );

  return (
    <>
      <Button
        variant="ghost"
        onClick={() => setOpen(true)}
        className={isMenuItem ? "h-8 w-full justify-start px-2" : ""}
      >
        {trigger ?? defaultTrigger}
      </Button>

      <AlertDialog open={open} onOpenChange={setOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2 text-red-600">
              <AlertCircle className="h-5 w-5" />
              Удаление товара
            </AlertDialogTitle>
            <AlertDialogDescription>
              Вы уверены, что хотите удалить товар{" "}
              <span className="font-medium">"{productName}"</span>?
              <div className="mt-2 rounded-md bg-amber-50 p-3 text-sm text-amber-800">
                Это действие нельзя отменить. Товар будет безвозвратно удален из
                системы.
              </div>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Отмена</AlertDialogCancel>
            <AlertDialogAction
              onClick={(e) => {
                e.preventDefault();
                handleDelete();
              }}
              disabled={isDeleting}
              className="bg-red-600 hover:bg-red-700 focus:ring-red-600"
            >
              {isDeleting ? (
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
