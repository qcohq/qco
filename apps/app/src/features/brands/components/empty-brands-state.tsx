"use client";

import { Button } from "@qco/ui/components/button";
import { Plus } from "lucide-react";
import { useRouter } from "next/navigation";

// TODO: Использовать тип из схемы пропсов пустого состояния брендов, если появится в @qco/validators

export function EmptyBrandsState({
  title = "Бренды не найдены",
  description = "Бренды не найдены. Попробуйте изменить параметры поиска или добавьте новый бренд.",
  showAddButton = true,
}: EmptyBrandsStateProps) {
  const router = useRouter();

  return (
    <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
      <div className="bg-muted/30 flex h-20 w-20 items-center justify-center rounded-full">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="32"
          height="32"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="text-muted-foreground"
        >
          <rect width="18" height="18" x="3" y="3" rx="2" />
          <path d="M3 9h18" />
          <path d="M9 21V9" />
        </svg>
      </div>
      <h3 className="mt-4 text-lg font-medium">{title}</h3>
      <p className="text-muted-foreground mt-2 max-w-md">{description}</p>
      {showAddButton && (
        <Button onClick={() => router.push("/brands/add")} className="mt-6">
          <Plus className="mr-2 h-4 w-4" />
          Добавить бренд
        </Button>
      )}
    </div>
  );
}
