import { Suspense } from "react";
import { ProductTypeAttributeTableContent } from "./product-type-attribute-table-content";
import { ProductTypeAttributeTableSkeleton } from "./product-type-attribute-table-skeleton";

interface ProductTypeAttributeTableProps {
  productTypeId: string;
}

export function ProductTypeAttributeTable({
  productTypeId,
}: ProductTypeAttributeTableProps) {
  return (
    <Suspense fallback={<ProductTypeAttributeTableSkeleton />}>
      <ProductTypeAttributeTableContent productTypeId={productTypeId} />
    </Suspense>
  );
}
