"use client";

import type { createProductTypeAttributeSchema } from "@qco/validators";
import { useRouter } from "next/navigation";
import type { z } from "zod";
import { ProductTypeAttributeForm } from "../components/product-type-attribute-form";
import { useCreateProductTypeAttribute } from "../hooks/use-product-type-attributes";

interface NewProductTypeAttributePageProps {
  id: string;
}

export function NewProductTypeAttributePage({
  id,
}: NewProductTypeAttributePageProps) {
  const router = useRouter();
  const { mutate: createAttribute, isPending: isCreating } =
    useCreateProductTypeAttribute();

  const handleSubmit = (
    data: z.infer<typeof createProductTypeAttributeSchema>,
  ) => {
    // Обеспечиваем, что для типов атрибутов, которые не используют опции, поле options всегда пустой массив
    const processedData = {
      ...data,
      productTypeId: id,
      options:
        data.type === "select" || data.type === "multiselect"
          ? data.options || []
          : [],
    };

    createAttribute(processedData, {
      onSuccess: () => {
        router.push(`/product-types/${id}/attributes`);
      },
    });
  };

  return (
    <div className="container mx-auto py-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Создать атрибут</h1>
        <p className="text-muted-foreground">
          Добавьте новый атрибут к этому типу продукта
        </p>
      </div>

      {id && (
        <ProductTypeAttributeForm
          onSubmit={handleSubmit}
          isPending={isCreating}
          productTypeId={id}
        />
      )}
    </div>
  );
}
