"use client";

import type { AppRouter } from "@qco/api";
import { Alert, AlertDescription, AlertTitle } from "@qco/ui/components/alert";
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
import { Label } from "@qco/ui/components/label";
import { RadioGroup, RadioGroupItem } from "@qco/ui/components/radio-group";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { TRPCClientErrorLike } from "@trpc/client";
import { AlertCircle, Loader2, Trash2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { useTRPC } from "~/trpc/react";

// TODO: Использовать тип из схемы пропсов диалога удаления категории, если появится в @qco/validators
interface DeleteCategoryDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onDelete: (option: "delete-all" | "move-up") => void;
  category: CategoryWithSubcategories;
}

// TODO: Использовать тип из схемы данных категории с подкатегориями, если появится в @qco/validators
export interface CategoryWithSubcategories {
  id: string;
  name: string;
  subcategories?: CategoryWithSubcategories[];
}

export function DeleteCategoryDialog({
  category,
  onDelete,
  open,
  onOpenChange,
}: DeleteCategoryDialogProps) {
  const [deleteOption, setDeleteOption] = useState<"delete-all" | "move-up">(
    "delete-all",
  );

  const trpc = useTRPC();
  const queryClient = useQueryClient();

  // Создаем опции мутации с помощью mutationOptions
  const deleteCategoryMutationOptions = trpc.categories.delete.mutationOptions({
    onSuccess: () => {
      // Инвалидируем кэш запроса списка категорий
      void queryClient.invalidateQueries({
        queryKey: trpc.categories.list.queryKey(),
      });
      onOpenChange(false);
      toast.success("Категория удалена", {
        description: "Категория успешно удалена из списка",
      });
      onDelete(deleteOption);
    },
    onError: (error: TRPCClientErrorLike<AppRouter>) => {
      toast.error("Ошибка при удалении", {
        description: error.message || "Не удалось удалить категорию",
      });
    },
  });

  // Используем опции с хуком useMutation
  const { mutate, isPending } = useMutation(deleteCategoryMutationOptions);

  const handleDelete = () => {
    mutate({ id: category.id });
  };

  const hasSubcategories = !!(
    category.subcategories?.length && category.subcategories.length > 0
  );

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        {/* Кнопка подтверждения удаления */}
        <AlertDialogHeader>
          <AlertDialogTitle>
            Удалить категорию {category.name}?
          </AlertDialogTitle>
          <AlertDialogDescription>
            Вы уверены, что хотите удалить категорию "{category.name}"?
            {hasSubcategories && " Эта категория содержит подкатегории."}
          </AlertDialogDescription>
        </AlertDialogHeader>

        {hasSubcategories && (
          <div className="py-2">
            <Alert variant="destructive" className="mb-4">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Внимание</AlertTitle>
              <AlertDescription>
                Категория содержит {category.subcategories?.length ?? 0}{" "}
                подкатегорий. Выберите действие для подкатегорий:
              </AlertDescription>
            </Alert>

            <Label htmlFor="delete-option">Что сделать с подкатегориями?</Label>
            <RadioGroup
              id="delete-option"
              value={deleteOption}
              onValueChange={(value: string) =>
                setDeleteOption(value as "delete-all" | "move-up")
              }
            >
              <RadioGroupItem value="delete-all">
                Удалить все подкатегории
              </RadioGroupItem>
              <RadioGroupItem value="move-up">
                Переместить подкатегории на уровень выше
              </RadioGroupItem>
            </RadioGroup>
          </div>
        )}
        <AlertDialogFooter>
          <AlertDialogCancel>Отмена</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDelete}
            className="bg-destructive hover:bg-destructive/90 text-white"
            disabled={isPending}
          >
            {isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Удаление...
              </>
            ) : (
              <>
                <Trash2 className="mr-2 h-4 w-4" />
                Удалить
              </>
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
