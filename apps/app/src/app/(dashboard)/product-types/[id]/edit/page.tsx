import { Suspense } from "react";
import { ProductTypeFormSkeleton } from "@/features/product-types/components/product-type-form-skeleton";
import { ProductTypeEditPage } from "@/features/product-types/pages/product-type-edit-page";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function ProductTypeEditPageServer({ params }: PageProps) {
  const { id } = await params;
  return (
    <Suspense fallback={<ProductTypeFormSkeleton />}>
      <ProductTypeEditPage id={id} />
    </Suspense>
  );
}
