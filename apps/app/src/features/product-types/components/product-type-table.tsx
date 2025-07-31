"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@qco/ui/components/table";
import type { ProductTypeTableProps } from "../types";
import { ProductTypeHeader } from "./product-type-header";
import { ProductTypeRow } from "./product-type-row";

export function ProductTypeTable({
  productTypes,
  onDelete,
  isDeleting,
}: ProductTypeTableProps) {
  return (
    <div className="space-y-4">
      <ProductTypeHeader />
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Название</TableHead>
              <TableHead>Slug</TableHead>
              <TableHead>Описание</TableHead>
              <TableHead className="text-right">Действия</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {productTypes.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={4}
                  className="text-center py-8 text-muted-foreground"
                >
                  Типы продуктов не найдены.
                </TableCell>
              </TableRow>
            ) : (
              productTypes.map((productType) => (
                <ProductTypeRow
                  key={productType.id}
                  productType={productType}
                  onDelete={onDelete}
                  isDeleting={isDeleting}
                />
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
