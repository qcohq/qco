"use client";

import { Button } from "@qco/ui/components/button";
import { Checkbox } from "@qco/ui/components/checkbox";
import {
  Archive,
  CheckCircle2,
  Copy,
  Download,
  Tag,
  Trash2,
} from "lucide-react";
import { BulkDeleteDialog } from "@/features/product-listing/components/bulk-delete-dialog";

interface BulkActionsProps {
  selectedProducts: string[];
  allProducts: any[];
  onSelectAll: (selected: boolean) => void;
  onBulkAction: (actionType: string, selectedIds: string[]) => void;
  isLoading?: boolean;
  onProductsDeleted?: (productIds: string[]) => void;
}

export function BulkActions({
  selectedProducts,
  allProducts,
  onSelectAll,
  onBulkAction,
  isLoading = false,
  onProductsDeleted,
}: BulkActionsProps) {
  if (selectedProducts.length === 0) return null;

  const handleProductsDeleted = (productIds: string[]) => {
    if (onProductsDeleted) {
      onProductsDeleted(productIds);
    }
  };

  return (
    <div className="bg-muted/40 flex flex-wrap items-center gap-3 rounded-lg border p-3">
      <div className="flex items-center gap-2">
        <Checkbox
          checked={
            selectedProducts.length === allProducts.length &&
            allProducts.length > 0
          }
          onCheckedChange={onSelectAll}
          className="h-4 w-4"
        />
        <span className="text-sm font-medium">
          Выбрано {selectedProducts.length}{" "}
          {selectedProducts.length === 1 ? "товар" : "товаров"}
        </span>
      </div>

      <div className="ml-auto flex flex-wrap items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          className="gap-1"
          onClick={() => onBulkAction("archive", selectedProducts)}
          disabled={isLoading}
        >
          <Archive className="h-4 w-4" />
          <span className="hidden sm:inline">Архивировать</span>
        </Button>

        <Button
          variant="outline"
          size="sm"
          className="gap-1"
          onClick={() => onBulkAction("duplicate", selectedProducts)}
          disabled={isLoading}
        >
          <Copy className="h-4 w-4" />
          <span className="hidden sm:inline">Дублировать</span>
        </Button>

        <Button
          variant="outline"
          size="sm"
          className="gap-1"
          onClick={() => onBulkAction("export", selectedProducts)}
          disabled={isLoading}
        >
          <Download className="h-4 w-4" />
          <span className="hidden sm:inline">Экспорт</span>
        </Button>

        <Button
          variant="outline"
          size="sm"
          className="gap-1"
          onClick={() => onBulkAction("tag", selectedProducts)}
          disabled={isLoading}
        >
          <Tag className="h-4 w-4" />
          <span className="hidden sm:inline">Теги</span>
        </Button>

        <Button
          variant="outline"
          size="sm"
          className="gap-1"
          onClick={() => onBulkAction("activate", selectedProducts)}
          disabled={isLoading}
        >
          <CheckCircle2 className="h-4 w-4" />
          <span className="hidden sm:inline">Активировать</span>
        </Button>

        <BulkDeleteDialog
          productIds={selectedProducts}
          onDeleted={handleProductsDeleted}
          trigger={
            <span className="flex items-center gap-1 text-red-600 hover:text-red-700">
              <Trash2 className="h-4 w-4" />
              <span className="hidden sm:inline">Удалить</span>
            </span>
          }
        />
      </div>
    </div>
  );
}
