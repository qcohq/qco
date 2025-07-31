"use client";

import { AttributeForm } from "../components/attribute-form";

interface CreateAttributePageProps {
  productTypeId: string;
}

export function CreateAttributePage({
  productTypeId,
}: CreateAttributePageProps) {
  return (
    <div className="max-w-2xl">
      <AttributeForm
        productTypeId={productTypeId}
        onSuccess={() => {
          // Перенаправление будет обработано в компоненте формы
        }}
        onCancel={() => {
          // Перенаправление будет обработано в компоненте формы
        }}
      />
    </div>
  );
}
