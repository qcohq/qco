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

// TODO: Использовать тип из схемы пропсов диалога удаления бренда, если появится в @qco/validators

export function DeleteBrandDialog({
  isOpen,
  onClose,
  onConfirm,
  brandName,
  isDeleting,
}: DeleteBrandDialogProps) {
  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Удалить бренд</AlertDialogTitle>
          <AlertDialogDescription>
            Вы уверены, что хотите удалить бренд "{brandName}"? Это действие
            нельзя отменить. Все связанные файлы также будут удалены.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isDeleting}>Отмена</AlertDialogCancel>
          <AlertDialogAction
            onClick={onConfirm}
            disabled={isDeleting}
            className="bg-destructive text-white hover:bg-destructive/90"
          >
            {isDeleting ? "Удаление..." : "Удалить"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
