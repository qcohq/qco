import { EditBrandPage } from "@/features/brands/components/edit-brand-page";

export default async function BrandEditPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const brandId = (await params)?.id;

  if (!brandId) {
    return (
      <div className="p-4">
        <h1 className="mb-2 text-lg font-semibold">Ошибка</h1>
        <p>Не указан ID бренда</p>
      </div>
    );
  }

  return <EditBrandPage brandId={brandId} />;
}
