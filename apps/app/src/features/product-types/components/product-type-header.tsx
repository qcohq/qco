"use client";

import { Button } from "@qco/ui/components/button";
import { Plus } from "lucide-react";
import { useRouter } from "next/navigation";

export function ProductTypeHeader() {
  const router = useRouter();

  const handleCreate = () => {
    router.push("/product-types/new");
  };

  return (
    <div className="flex items-center justify-between">
      <div>
        <h2 className="text-2xl font-semibold tracking-tight">
          Типы продуктов
        </h2>
        <p className="text-muted-foreground">
          Управление типами продуктов и их атрибутами
        </p>
      </div>
      <Button onClick={handleCreate} className="flex items-center gap-2">
        <Plus className="h-4 w-4" />
        Добавить тип
      </Button>
    </div>
  );
}
