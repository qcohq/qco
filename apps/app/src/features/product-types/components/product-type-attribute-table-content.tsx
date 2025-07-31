"use client";

import { Plus } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useProductTypeAttributes } from "../hooks/use-product-type-attributes";
import { ProductTypeAttributeTableError } from "./product-type-attribute-table-error";
import { ProductTypeAttributeTableHeader } from "./product-type-attribute-table-header";
import { ProductTypeAttributeTableRow } from "./product-type-attribute-table-row";

interface ProductTypeAttributeTableContentProps {
  productTypeId: string;
}

export function ProductTypeAttributeTableContent({
  productTypeId,
}: ProductTypeAttributeTableContentProps) {
  const { attributes, isLoading, error } =
    useProductTypeAttributes(productTypeId);

  if (error) {
    return <ProductTypeAttributeTableError error={error} />;
  }

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Attributes</h2>
        <Button asChild>
          <Link href={`/product-types/${productTypeId}/attributes/new`}>
            <Plus className="mr-2 h-4 w-4" />
            Add Attribute
          </Link>
        </Button>
      </div>

      {attributes.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-muted-foreground">No attributes found</p>
          <Button asChild className="mt-2">
            <Link href={`/product-types/${productTypeId}/attributes/new`}>
              <Plus className="mr-2 h-4 w-4" />
              Add First Attribute
            </Link>
          </Button>
        </div>
      ) : (
        <div className="border rounded-lg">
          <ProductTypeAttributeTableHeader />
          <div className="divide-y">
            {attributes.map((attribute) => (
              <ProductTypeAttributeTableRow
                key={attribute.id}
                attribute={attribute}
                productTypeId={productTypeId}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
