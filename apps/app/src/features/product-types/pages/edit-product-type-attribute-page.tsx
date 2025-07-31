"use client";

import type { createProductTypeAttributeSchema } from "@qco/validators";
import { useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import type { z } from "zod";
import { useTRPC } from "~/trpc/react";
import { ProductTypeAttributeForm } from "../components/product-type-attribute-form";
import {
  useProductTypeAttribute,
  useUpdateProductTypeAttribute,
} from "../hooks/use-product-type-attributes";

interface EditProductTypeAttributePageProps {
  id: string;
  attributeId: string;
}

export function EditProductTypeAttributePage({
  id,
  attributeId,
}: EditProductTypeAttributePageProps) {
  const trpc = useTRPC();
  const queryClient = useQueryClient();
  const router = useRouter();
  const { attribute, isLoading, error } = useProductTypeAttribute(attributeId);
  const { mutate: updateAttribute, isPending: isUpdating } =
    useUpdateProductTypeAttribute();

  const handleSubmit = (
    data: z.infer<typeof createProductTypeAttributeSchema>,
  ) => {
    updateAttribute(
      {
        ...data,
        id: attributeId,
      },
      {
        onSuccess: async () => {
          await queryClient.invalidateQueries({
            queryKey: trpc.productTypeAttributes.getByProductType.queryKey({
              productTypeId: id,
            }),
          });
          router.push(`/product-types/${id}/attributes`);
        },
      },
    );
  };

  if (isLoading) {
    return (
      <div className="container mx-auto py-6">
        <div className="text-center">Загрузка атрибута...</div>
      </div>
    );
  }

  if (error || !attribute) {
    return (
      <div className="container mx-auto py-6">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-destructive">Ошибка</h1>
          <p className="text-muted-foreground">
            {error?.message || "Атрибут не найден"}
          </p>
        </div>
      </div>
    );
  }

  // Преобразуем данные атрибута для формы
  const initialValues = {
    name: attribute.name,
    slug: attribute.slug,
    type: attribute.type as
      | "text"
      | "number"
      | "boolean"
      | "select"
      | "multiselect",
    options: Array.isArray(attribute.options) ? attribute.options : [],
    isFilterable: attribute.isFilterable,
    isRequired: attribute.isRequired,
    sortOrder: attribute.sortOrder || 0,
    productTypeId: id,
    description: attribute.description || undefined,
    defaultValue: attribute.defaultValue || undefined,
    minValue: attribute.minValue || undefined,
    maxValue: attribute.maxValue || undefined,
    isSearchable: attribute.isSearchable,
    isActive: attribute.isActive,
  };

  return (
    <div className="container mx-auto py-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Редактировать атрибут</h1>
        <p className="text-muted-foreground">Обновите детали атрибута</p>
      </div>

      <ProductTypeAttributeForm
        initialValues={initialValues}
        onSubmit={handleSubmit}
        isEdit={true}
        isPending={isUpdating}
        productTypeId={id}
      />
    </div>
  );
}
