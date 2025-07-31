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

import { Trash2 } from "lucide-react";

// TODO: Использовать тип из схемы пропсов диалога удаления баннера, если появится в @qco/validators

export function DeleteBannerDialog({
  isOpen,
  onClose,
  onConfirm,
  isDeleting = false,
}: DeleteBannerDialogProps) {
  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-center gap-2">
            <Trash2 className="h-5 w-5 text-destructive" />
            Удалить баннер
          </AlertDialogTitle>
          <AlertDialogDescription>
            Вы уверены, что хотите удалить этот баннер? Это действие нельзя
            отменить. Все связанные файлы и статистика также будут удалены.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={onClose} disabled={isDeleting}>
            Отмена
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={onConfirm}
            disabled={isDeleting}
            className="bg-red-600 text-white hover:bg-red-700 focus:bg-red-700 disabled:bg-red-400"
          >
            {isDeleting ? "Удаление..." : "Удалить"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
