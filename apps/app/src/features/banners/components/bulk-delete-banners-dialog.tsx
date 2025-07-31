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

// TODO: Использовать тип из схемы пропсов диалога массового удаления баннеров, если появится в @qco/validators

export function BulkDeleteBannersDialog({
  isOpen,
  onClose,
  onConfirm,
  selectedCount,
  isDeleting,
}: BulkDeleteBannersDialogProps) {
  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Удалить выбранные баннеры</AlertDialogTitle>
          <AlertDialogDescription>
            Вы уверены, что хотите удалить {selectedCount} баннеров? Это
            действие нельзя отменить. Все связанные файлы также будут удалены.
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
