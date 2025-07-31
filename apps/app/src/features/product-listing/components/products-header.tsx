"use client";

import { Button } from "@qco/ui/components/button";
import { Download, Plus, Upload } from "lucide-react";
import Link from "next/link";

interface ProductsHeaderProps {
  onImportClick: () => void;
  onExportClick: () => void;
}

export function ProductsHeader({
  onImportClick,
  onExportClick,
}: ProductsHeaderProps) {
  return (
    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
      <div className="flex items-center gap-2">
        <h1 className="text-2xl font-semibold">Товары</h1>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <Button variant="outline" size="sm" onClick={onImportClick}>
          <Upload className="mr-2 h-4 w-4" />
          Импорт
        </Button>
        <Button variant="outline" size="sm" onClick={onExportClick}>
          <Download className="mr-2 h-4 w-4" />
          Экспорт
        </Button>
        <Button asChild size="sm">
          <Link href="/products/new">
            <Plus className="mr-2 h-4 w-4" />
            Добавить товар
          </Link>
        </Button>
      </div>
    </div>
  );
}
