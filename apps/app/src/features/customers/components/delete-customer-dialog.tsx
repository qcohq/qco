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
import { Button } from "@qco/ui/components/button";
import { AlertTriangle, Loader2 } from "lucide-react";

// TODO: Использовать тип из схемы пропсов диалога удаления клиента, если появится в @qco/validators
type DeleteCustomerDialogProps = {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  customerId: string;
  customerName: string;
  isDeleting: boolean;
};

export function DeleteCustomerDialog({
  isOpen,
  onClose,
  onConfirm,
  customerName,
  isDeleting,
}: DeleteCustomerDialogProps) {
  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <div className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-destructive" />
            <AlertDialogTitle>Удаление клиента</AlertDialogTitle>
          </div>
          <AlertDialogDescription>
            Вы действительно хотите <b>безвозвратно удалить</b> клиента{" "}
            <span className="font-semibold text-destructive">
              {customerName}
            </span>
            ?<br />
            Все связанные данные будут удалены. Это действие{" "}
            <b>нельзя отменить</b>.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel asChild>
            <Button variant="outline" disabled={isDeleting}>
              Отмена
            </Button>
          </AlertDialogCancel>
          <AlertDialogAction asChild>
            <Button
              variant="destructive"
              onClick={onConfirm}
              disabled={isDeleting}
            >
              {isDeleting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Удаление...
                </>
              ) : (
                "Удалить клиента"
              )}
            </Button>
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
