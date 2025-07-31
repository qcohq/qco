import { Suspense } from "react";
import { AttributesSkeleton } from "~/features/product-attributes/components/attributes-skeleton";
import { AttributesPage } from "~/features/product-attributes/pages/attributes-page";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function AttributesPageServer({ params }: PageProps) {
  const { id } = await params;
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Управление атрибутами</h1>
      <p className="text-muted-foreground">
        Создавайте и управляйте атрибутами для типа продукта
      </p>
      <Suspense fallback={<AttributesSkeleton />}>
        <AttributesPage productTypeId={id} />
      </Suspense>
    </div>
  );
}
