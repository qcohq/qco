"use client";

import { useQuery } from "@tanstack/react-query";
import { useTRPC } from "~/trpc/react";
import { ProductEditFormError } from "./product-edit-form-error";
import { ProductEditFormLoading } from "./product-edit-form-loading";
import { ProductUpdateForm } from "./product-update-form";

interface ProductEditFormContainerProps {
  productId: string;
}

export function ProductEditFormContainer({
  productId,
}: ProductEditFormContainerProps) {
  const trpc = useTRPC();

  // Получаем данные товара
  const productQueryOptions = trpc.products.getById.queryOptions(
    { id: productId },
    {
      enabled: !!productId,
    },
  );

  const {
    data: productData,
    isLoading: isProductLoading,
    error: productError,
  } = useQuery(productQueryOptions);

  // Получаем категории
  const categoriesQueryOptions = trpc.categories.tree.queryOptions(
    undefined,
    {},
  );

  const {
    data: categoriesData,
    isLoading: isCategoriesLoading,
    error: categoriesError,
  } = useQuery(categoriesQueryOptions);

  // Получаем бренды для селекта
  const brandsQueryOptions = trpc.brands.getBrandsForSelect.queryOptions({}, {});
  const {
    data: brandsData,
    isLoading: isBrandsLoading,
    error: brandsError,
  } = useQuery(brandsQueryOptions);

  // Загрузка
  if (isProductLoading || isCategoriesLoading || isBrandsLoading) {
    return <ProductEditFormLoading />;
  }

  // Ошибки
  if (productError || categoriesError || brandsError) {
    const errorMessage =
      productError?.message ??
      categoriesError?.message ??
      brandsError?.message ??
      "Произошла ошибка при загрузке данных";
    return <ProductEditFormError error={errorMessage} />;
  }

  // Проверяем, что данные загружены
  if (!productData) {
    return <ProductEditFormError error="Товар не найден" />;
  }

  // Преобразуем категории в нужный формат
  interface CategoryItem {
    id: string;
    name: string;
    children?: CategoryItem[];
  }

  const mapToCategoryItems = (categories: CategoryItem[]): CategoryItem[] =>
    categories.map((category) => ({
      id: category.id,
      name: category.name,
      children: category.children ? mapToCategoryItems(category.children) : [],
    }));

  let categories: CategoryItem[] = [];
  if (Array.isArray(categoriesData)) {
    categories = mapToCategoryItems(categoriesData);
  } else if (
    typeof categoriesData === "object" &&
    categoriesData !== null &&
    "items" in categoriesData
  ) {
    categories = mapToCategoryItems(
      (categoriesData as { items: CategoryItem[] }).items,
    );
  }

  return (
    <ProductUpdateForm
      productId={productId}
      initialProductData={productData}
      initialCategories={categories}
      brands={brandsData?.data ?? []}
    />
  );
}
