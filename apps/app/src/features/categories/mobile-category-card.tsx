"use client";

import { Button } from "@qco/ui/components/button";
import { Pencil, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import type { CategoryListItem } from "./types";

// TODO: Использовать тип из схемы пропсов мобильной карточки категории, если появится в @qco/validators

export function MobileCategoryCard({
  category,
  onDelete,
}: {
  category: CategoryListItem;
  onDelete: (category: CategoryListItem) => void;
}) {
  const router = useRouter();
  return (
    <div className="mb-2 flex items-center gap-4 rounded-lg border p-4">
      <div className="bg-muted text-muted-foreground flex h-12 w-12 items-center justify-center rounded-md border text-xl font-bold">
        {category.name.charAt(0)}
      </div>
      <div className="flex-1">
        <div className="font-semibold">{category.name}</div>
        <div className="text-muted-foreground mb-2 text-sm">
          {category.description}
        </div>
        <div className="flex gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => router.push(`/categories/edit/${category.id}`)}
          >
            <Pencil className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onDelete(category)}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
