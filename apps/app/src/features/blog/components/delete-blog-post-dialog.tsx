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

interface DeleteBlogPostDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  postTitle?: string;
  isDeleting?: boolean;
}

export function DeleteBlogPostDialog({
  isOpen,
  onClose,
  onConfirm,
  postTitle,
  isDeleting = false,
}: DeleteBlogPostDialogProps) {
  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-center gap-2">
            <Trash2 className="h-5 w-5 text-destructive" />
            Удалить запись блога
          </AlertDialogTitle>
          <AlertDialogDescription>
            {postTitle ? (
              <>
                Вы уверены, что хотите удалить запись{" "}
                <strong>"{postTitle}"</strong>? Это действие нельзя отменить.
              </>
            ) : (
              "Вы уверены, что хотите удалить эту запись блога? Это действие нельзя отменить."
            )}
            Все связанные файлы и комментарии также будут удалены.
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
