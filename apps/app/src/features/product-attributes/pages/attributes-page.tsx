"use client";

import { notFound } from "next/navigation";
import { AttributesList } from "../components/attributes-list";
import { AttributesSkeleton } from "../components/attributes-skeleton";
import { useProductType } from "../hooks/use-product-type";

interface AttributesPageProps {
  productTypeId: string;
}

export function AttributesPage({ productTypeId }: AttributesPageProps) {
  const { productType, isLoading, error } = useProductType(productTypeId);

  // Если произошла ошибка или тип продукта не найден (и загрузка завершена), перенаправляем на страницу 404
  if (error || (!isLoading && !productType)) {
    notFound();
  }

  if (isLoading) {
    return <AttributesSkeleton />;
  }

  // После проверок выше, мы уверены, что productType не undefined
  // Используем деструктуризацию с дефолтными значениями вместо non-null assertion
  const { name = "", description = "" } = productType ?? {};

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <h2 className="text-lg font-medium mb-2">Тип продукта: {name}</h2>
        {description && <p className="text-muted-foreground">{description}</p>}
      </div>

      <AttributesList productTypeId={productTypeId} />
    </div>
  );
}
