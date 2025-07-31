"use client";

import { ProductTypeError } from "../components/product-type-error";
import { ProductTypeSkeleton } from "../components/product-type-skeleton";
import { ProductTypeTable } from "../components/product-type-table";
import {
  useDeleteProductType,
  useProductTypes,
} from "../hooks/use-product-types";

export function ProductTypesPage() {
  const { productTypes, isLoading, error } = useProductTypes();
  const { mutate: deleteProductType, isPending: isDeleting } =
    useDeleteProductType();

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this Product Type?")) {
      deleteProductType({ id });
    }
  };

  if (isLoading) {
    return <ProductTypeSkeleton />;
  }

  if (error) {
    // Преобразуем ошибку tRPC в стандартную ошибку Error
    const standardError = new Error(error.message);
    return <ProductTypeError error={standardError} />;
  }

  return (
    <div className="space-y-6">
      <ProductTypeTable
        productTypes={productTypes}
        onDelete={handleDelete}
        isDeleting={isDeleting}
      />
    </div>
  );
}
