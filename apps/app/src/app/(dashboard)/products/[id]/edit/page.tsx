import { ProductEditFormContainer } from "~/features/product-management/components";

export default async function EditProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const productId = await params;
  return <ProductEditFormContainer productId={productId.id} />;
}
