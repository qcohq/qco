import { Suspense } from "react";
import { ProductTypeFormSkeleton } from "@/features/product-types/components/product-type-form-skeleton";
import { ProductTypeCreatePage } from "@/features/product-types/pages/product-type-create-page";

export default function ProductTypeCreatePageServer() {
  return (
    <Suspense fallback={<ProductTypeFormSkeleton />}>
      <ProductTypeCreatePage />
    </Suspense>
  );
}
