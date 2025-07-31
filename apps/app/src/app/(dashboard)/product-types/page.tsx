import { Suspense } from "react";
import { ProductTypeSkeleton } from "@/features/product-types/components/product-type-skeleton";
import { ProductTypesPage } from "@/features/product-types/pages/product-types-page";

export default function ProductTypesPageServer() {
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">Типы продуктов</h1>
      <div className="bg-white rounded-lg shadow p-6">
        <Suspense fallback={<ProductTypeSkeleton />}>
          <ProductTypesPage />
        </Suspense>
      </div>
    </div>
  );
}
