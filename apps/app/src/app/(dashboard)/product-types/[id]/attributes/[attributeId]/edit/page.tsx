import { Suspense } from "react";
import { ProductTypeAttributeFormSkeleton } from "~/features/product-types/components/product-type-attribute-form-skeleton";
import { EditProductTypeAttributePage } from "~/features/product-types/pages/edit-product-type-attribute-page";

interface PageProps {
  params: Promise<{ id: string; attributeId: string }>;
}

export default async function EditProductTypeAttributePageServer({
  params,
}: PageProps) {
  const { id, attributeId } = await params;
  return (
    <Suspense fallback={<ProductTypeAttributeFormSkeleton />}>
      <EditProductTypeAttributePage id={id} attributeId={attributeId} />
    </Suspense>
  );
}
