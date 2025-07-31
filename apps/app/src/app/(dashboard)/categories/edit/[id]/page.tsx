import { CategoryEditClient } from "@/features/categories/category-edit-client";

export default async function CategoryEditPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <CategoryEditClient id={id} />;
}
