"use client";

import { Button } from "@qco/ui/components/button";
import { Edit, Trash2 } from "lucide-react";

// TODO: Использовать тип из схемы действий админа, если появится в @qco/validators

export function AdminActions({
  onEdit,
  onDelete,
  isDeleting = false,
}: {
  onEdit: () => void;
  onDelete: () => void;
  isDeleting?: boolean;
}) {
  return (
    <div className="flex items-center justify-end gap-2">
      <Button variant="ghost" size="sm" onClick={onEdit}>
        <Edit className="h-4 w-4" />
      </Button>
      <Button
        variant="ghost"
        size="sm"
        onClick={onDelete}
        disabled={isDeleting}
      >
        <Trash2 className="h-4 w-4" />
      </Button>
    </div>
  );
}
