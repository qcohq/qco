"use client";

import { Button } from "@qco/ui/components/button";
import { FolderPlus } from "lucide-react";
import { useRouter } from "next/navigation";

import { paths } from "~/routes/paths";

// TODO: Использовать тип из схемы пропсов пустого состояния категорий, если появится в @qco/validators
export function EmptyCategories({
  message = "Категории не найдены",
}: {
  message?: string;
}) {
  const router = useRouter();

  return (
    <div className="flex flex-col items-center justify-center rounded-lg border border-dashed p-8">
      <FolderPlus className="text-muted-foreground mb-4 h-12 w-12" />
      <h3 className="mb-2 text-lg font-medium">{message}</h3>
      <p className="text-muted-foreground mb-4 text-sm">
        Создайте свою первую категорию, чтобы начать организовывать товары
      </p>
      <Button onClick={() => router.push(paths.categories.new)}>
        Создать категорию
      </Button>
    </div>
  );
}
