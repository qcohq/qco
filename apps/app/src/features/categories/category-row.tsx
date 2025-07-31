"use client";

import { Badge } from "@qco/ui/components/badge";
import { Button } from "@qco/ui/components/button";
import { cn } from "@qco/ui/lib/utils";
import { CheckCircle, Pencil, Trash2, XCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { paths } from "~/routes/paths";
import type { CategoryListItem } from "./types";

// TODO: Использовать тип из схемы пропсов строки категории, если появится в @qco/validators

export function CategoryRow({
  category,
  level = 0,
  onDelete,
}: {
  category: CategoryListItem;
  level?: number;
  onDelete: (category: CategoryListItem) => void;
}) {
  const router = useRouter();
  return (
    <tr className="hover:bg-muted/20 border-b transition-colors">
      <td className="px-4 py-3">
        <div className="flex items-center gap-3">
          <div className="bg-muted text-muted-foreground flex h-10 w-10 items-center justify-center rounded border text-lg font-bold">
            {category.name.charAt(0)}
          </div>
          <button
            type="button"
            className={cn(
              "text-primary cursor-pointer border-0 bg-transparent p-0 text-left font-medium underline hover:opacity-80",
              { "ml-4": level > 0 },
            )}
            onClick={() => router.push(paths.categories.edit(category.id))}
          >
            {category.name}
          </button>
        </div>
      </td>
      <td className="px-4 py-3 font-mono text-xs text-muted-foreground">
        {category.slug}
      </td>
      <td className="px-4 py-3">{category.description}</td>
      <td className="px-4 py-3">
        {category.isActive ? (
          <Badge
            variant="outline"
            className="flex items-center gap-1 border-green-200 bg-green-50 text-green-700"
          >
            <CheckCircle className="h-3 w-3" />
            <span>Активна</span>
          </Badge>
        ) : (
          <Badge
            variant="outline"
            className="flex items-center gap-1 border-red-200 bg-red-50 text-red-700"
          >
            <XCircle className="h-3 w-3" />
            <span>Неактивна</span>
          </Badge>
        )}
      </td>
      <td className="px-4 py-3">
        <span className="text-muted-foreground text-sm">Нет</span>
      </td>
      <td className="px-4 py-3">{category.productsCount ?? 0}</td>
      <td className="px-4 py-3">{category.sortOrder ?? 0}</td>
      <td className="px-4 py-3 text-right">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => router.push(paths.categories.edit(category.id))}
        >
          <Pencil className="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="icon" onClick={() => onDelete(category)}>
          <Trash2 className="h-4 w-4" />
        </Button>
      </td>
    </tr>
  );
}
