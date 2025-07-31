"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import type { RouterOutputs } from "@qco/api";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@qco/ui/components/alert-dialog";
import { Form } from "@qco/ui/components/form";
import { toast } from "@qco/ui/hooks/use-toast";
import type { ProductUpdateInput } from "@qco/validators";
import { productUpdateSchema } from "@qco/validators";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { TRPCClientError } from "@trpc/client";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { useForm } from "react-hook-form";

import {
  VariantOptionsSection,
  VariantsListSection,
} from "~/features/product-variants/components";
import { useTRPC } from "~/trpc/react";
import { useLoadingStates } from "../hooks/use-loading-states";
import { ProductEditFormBasicInfo } from "./product-edit-form-basic-info";
import { ProductEditFormCategories } from "./product-edit-form-categories";
import { ProductEditFormHeader } from "./product-edit-form-header";
import { ProductEditFormImages } from "./product-edit-form-images";
import { ProductEditFormPreviewSidebar } from "./product-edit-form-preview-sidebar";
import { ProductEditFormPricing } from "./product-edit-form-pricing";
import { ProductEditFormProductTypeAttributes } from "./product-edit-form-product-type-attributes";
import { ProductEditFormSeo } from "./product-edit-form-seo";
import { ProductEditFormSettings } from "./product-edit-form-settings";

interface BrandForSelect {
  id: string;
  name: string;
  slug?: string;
  [key: string]: any;
}

// TODO: Использовать тип из схемы пропсов формы обновления продукта, если появится в @qco/validators
interface ProductUpdateFormProps {
  productId: string;
  initialProductData: RouterOutputs["products"]["getById"];
  initialCategories: Array<{
    id: string;
    name: string;
    children?: Array<{
      id: string;
      name: string;
      children?: Array<{
        id: string;
        name: string;
        children?: unknown[];
      }>;
    }>;
  }>;
  brands: BrandForSelect[];
}

export function ProductUpdateForm({
  productId,
  initialProductData,
  initialCategories,
  brands,
}: ProductUpdateFormProps) {
  const trpc = useTRPC();
  const queryClient = useQueryClient();
  const router = useRouter();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const loadingStates = useLoadingStates();
  const form = useForm({
    resolver: zodResolver(productUpdateSchema),
    mode: "onChange",
    defaultValues: {
      id: initialProductData?.id ?? "",
      name: initialProductData?.name ?? "",
      slug: initialProductData?.slug ?? "",
      description: initialProductData?.description ?? "",
      isActive: initialProductData?.isActive ?? true,
      isFeatured: initialProductData?.isFeatured ?? false,
      isNew: initialProductData?.isNew ?? false,
      basePrice: initialProductData?.basePrice
        ? Number(initialProductData.basePrice)
        : undefined,
      salePrice: initialProductData?.salePrice
        ? Number(initialProductData.salePrice)
        : undefined,
      discountPercent: initialProductData?.discountPercent ?? undefined,
      categories: initialProductData?.categories ?? [],

      brandId: initialProductData?.brandId ?? null,

      sku: initialProductData?.sku ?? null,
      productTypeId: initialProductData?.productTypeId ?? "",
    },
  });

  const {
    handleSubmit,
    formState: { isDirty },
    watch,
  } = form;

  const _watchedCategories = watch("categories");

  // Мутация обновления товара
  const updateProductMutationOptions = trpc.products.update.mutationOptions({
    onSuccess: (data) => {
      toast({
        title: "Товар обновлен",
        description: `Товар "${data.name}" успешно обновлен`,
      });
      void queryClient.invalidateQueries({
        queryKey: trpc.products.list.queryKey(),
      });
      void queryClient.invalidateQueries({
        queryKey: trpc.products.getById.queryKey({ id: data.id }),
      });
    },
    onError: (error) => {
      let message = "Не удалось обновить товар";
      if (error instanceof TRPCClientError) {
        message = error.message;
      } else if (error instanceof Error) {
        message = error.message;
      }
      toast({
        title: "Ошибка",
        description: message,
        variant: "destructive",
      });
    },
    onSettled: () => {
      loadingStates.actions.stopSaving();
    },
  });
  const { mutate: updateProduct } = useMutation(updateProductMutationOptions);

  // Мутация удаления товара
  const deleteProductMutationOptions = trpc.products.delete.mutationOptions({
    onSuccess: () => {
      toast({
        title: "Товар удален",
        description: "Товар успешно удален",
      });
      setDeleteDialogOpen(false);
      void queryClient.invalidateQueries({
        queryKey: trpc.products.list.queryKey(),
      });

      void router.push("/products");
    },
    onError: (error) => {
      toast({
        title: "Ошибка",
        description: error.message || "Не удалось удалить товар",
        variant: "destructive",
      });
    },
    onSettled: () => {
      loadingStates.actions.stopDeleting();
    },
  });
  const { mutate: deleteProduct } = useMutation(deleteProductMutationOptions);

  // Преобразование категорий для UI
  interface CategoryData {
    id: string;
    name: string;
    children?: CategoryData[];
  }

  const mapToCategoryItems = React.useCallback(
    (categories: CategoryData[]): CategoryData[] => {
      return categories.map((category) => ({
        id: category.id,
        name: category.name,
        children: category.children
          ? mapToCategoryItems(category.children)
          : [],
      }));
    },
    [],
  );


  // Обработчик отправки формы
  const onSubmit = handleSubmit((values: ProductUpdateInput) => {
    loadingStates.actions.startSaving();
    updateProduct(values);
  });

  // Обработчик удаления товара
  const handleDelete = () => {
    if (!productId) return;
    loadingStates.actions.startDeleting();
    deleteProduct({ id: productId });
  };

  const formData = watch();

  return (
    <Form {...form}>
      <div className="flex min-h-screen flex-col bg-gray-50/50">
        <ProductEditFormHeader
          isNewProduct={false}
          formData={{
            ...formData,
            isActive: formData.isActive ?? true,
            isFeatured: formData.isFeatured ?? false,
            isNew: formData.isNew ?? false,
          }}
          pageTitle="Редактирование товара"
          isSaving={loadingStates.isSaving}
          isDirty={isDirty}
          handleSave={onSubmit}
        />

        <div className="flex-1">
          <div className="container mx-auto max-w-7xl px-4 py-6">
            <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
              {/* Основной контент */}
              <div className="lg:col-span-2 space-y-8">
                <ProductEditFormBasicInfo brands={brands} />
                <ProductEditFormPricing />
                <ProductEditFormCategories categories={initialCategories} />
                <ProductEditFormImages
                  productId={productId}
                  initialImages={initialProductData?.files ?? []}
                />

                {/* Секция вариантов */}
                <div className="space-y-6">
                  <div className="flex items-center gap-3">
                    <div className="h-6 w-1 bg-primary rounded-full" />
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">
                        Варианты товара
                      </h3>
                      <p className="text-sm text-gray-500">
                        Настройте опции и варианты товара для отображения в
                        каталоге
                      </p>
                    </div>
                  </div>
                  <VariantOptionsSection productId={productId} />
                  <VariantsListSection productId={productId} />
                </div>

                <ProductEditFormProductTypeAttributes
                  productId={productId}
                  disabled={loadingStates.isSaving}
                />
                <ProductEditFormSeo />
                <ProductEditFormSettings
                  isNewProduct={false}
                  onDelete={() => setDeleteDialogOpen(true)}
                  isDeleting={loadingStates.isDeleting}
                  productId={productId}
                />
              </div>

              {/* Боковая панель */}
              <div className="lg:col-span-1">
                <div className="sticky top-6">
                  <ProductEditFormPreviewSidebar
                    formData={{
                      ...formData,
                      isActive: formData.isActive ?? true,
                      isFeatured: formData.isFeatured ?? false,
                      isNew: formData.isNew ?? false,
                      isTaxable: formData.isTaxable ?? true,
                    }}
                    isNewProduct={false}
                    isDeleting={loadingStates.isDeleting}
                    setDeleteDialogOpen={setDeleteDialogOpen}
                    files={initialProductData?.files}
                    productId={productId}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Диалоговое окно подтверждения удаления */}
        <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Удаление товара</AlertDialogTitle>
              <AlertDialogDescription>
                Вы уверены, что хотите удалить товар "{formData.name}"? Это
                действие нельзя отменить.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel disabled={loadingStates.isDeleting}>
                Отмена
              </AlertDialogCancel>
              <AlertDialogAction
                onClick={handleDelete}
                disabled={loadingStates.isDeleting}
                className="bg-red-600 hover:bg-red-700 focus:ring-red-600"
              >
                {loadingStates.isDeleting ? "Удаление..." : "Удалить"}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </Form>
  );
}
