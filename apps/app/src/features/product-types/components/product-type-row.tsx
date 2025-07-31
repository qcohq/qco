"use client";

import { Button } from "@qco/ui/components/button";
import { TableCell, TableRow } from "@qco/ui/components/table";
import { useRouter } from "next/navigation";
import type { ProductType } from "../types";

interface ProductTypeRowProps {
  productType: ProductType;
  onDelete: (id: string) => void;
  isDeleting?: boolean;
}

export function ProductTypeRow({
  productType,
  onDelete,
  isDeleting,
}: ProductTypeRowProps) {
  const router = useRouter();

  const handleEdit = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    router.push(`/product-types/${productType.id}/edit`);
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    onDelete(productType.id);
  };

  return (
    <TableRow
      className="hover:bg-muted/50 cursor-pointer transition-colors"
      onClick={handleEdit}
    >
      <TableCell className="font-medium">
        <span className="hover:text-primary hover:underline transition-colors">
          {productType.name}
        </span>
      </TableCell>
      <TableCell className="text-muted-foreground">
        {productType.slug}
      </TableCell>
      <TableCell className="text-muted-foreground">
        {productType.description || "-"}
      </TableCell>
      <TableCell className="text-right">
        <div className="flex justify-end gap-2">
          <Button variant="outline" size="sm" onClick={(e) => handleEdit(e)}>
            Редактировать
          </Button>
          <Button
            variant="destructive"
            size="sm"
            onClick={handleDelete}
            disabled={isDeleting}
          >
            {isDeleting ? "Удаление..." : "Удалить"}
          </Button>
        </div>
      </TableCell>
    </TableRow>
  );
}
