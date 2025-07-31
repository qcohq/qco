import { Suspense } from "react";
import { ProductTypeAttributeFormSkeleton } from "~/features/product-types/components/product-type-attribute-form-skeleton";
import { NewProductTypeAttributePage } from "~/features/product-types/pages/new-product-type-attribute-page";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function NewProductTypeAttributePageServer({
  params,
}: PageProps) {
  const { id } = await params;
  return (
    <Suspense fallback={<ProductTypeAttributeFormSkeleton />}>
      <NewProductTypeAttributePage id={id} />
    </Suspense>
  );
}
