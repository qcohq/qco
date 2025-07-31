"use client";

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
import { Button } from "@qco/ui/components/button";
import type { BrandFormValues } from "@qco/validators";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

import { BrandForm } from "@/features/brands/components/form/brand-form";
import { paths } from "~/routes/paths";
import { useTRPC } from "~/trpc/react";

// TODO: Использовать тип из схемы пропсов страницы редактирования бренда, если появится в @qco/validators
interface EditBrandPageProps {
  brandId: string;
}

export function EditBrandPage({ brandId }: EditBrandPageProps) {
  const router = useRouter();
  const trpc = useTRPC();
  const queryClient = useQueryClient();
  const [isSaving, setIsSaving] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  // Получаем данные бренда
  const brandQueryOptions = trpc.brands.getById.queryOptions({ id: brandId });
  const {
    data: brandData,
    isLoading: isBrandLoading,
    error: brandError,
  } = useQuery(brandQueryOptions);

  // Получаем список категорий для выбора
  const categoriesQueryOptions = trpc.categories.list.queryOptions({
    limit: 100,
  });
  const { isLoading: isCategoriesLoading, error: categoriesError } = useQuery(
    categoriesQueryOptions,
  );

  // Мутация для обновления бренда
  const updateBrandMutationOptions = trpc.brands.update.mutationOptions({
    onSuccess: (data) => {
      toast.success("Бренд обновлен", {
        description: `Бренд "${data.name}" успешно обновлен`,
      });

      // Инвалидируем кэш
      void queryClient.invalidateQueries({
        queryKey: trpc.brands.getAll.queryKey(),
      });
      void queryClient.invalidateQueries({
        queryKey: trpc.brands.getById.queryKey({ id: brandId }),
      });
      void queryClient.invalidateQueries({
        queryKey: trpc.brands.getFeatured.queryKey(),
      });

      router.push(paths.brands.root);
    },
    onError: (error) => {
      let message = "Произошла ошибка при обновлении бренда.";

      if (
        error.message.includes(
          "duplicate key value violates unique constraint",
        ) &&
        error.message.includes("brands_slug_unique")
      ) {
        message =
          "Бренд с таким слагом уже существует. Пожалуйста, выберите другой.";
      } else {
        message = error.message;
      }

      toast.error("Ошибка", {
        description: message,
      });
    },
    onSettled: () => {
      setIsSaving(false);
    },
  });

  const { mutate: updateBrand } = useMutation(updateBrandMutationOptions);

  // Мутация для удаления бренда
  const deleteBrandMutationOptions = trpc.brands.delete.mutationOptions({
    onSuccess: () => {
      toast.success("Бренд удален", {
        description: "Бренд успешно удален",
      });

      // Инвалидируем кэш
      void queryClient.invalidateQueries({
        queryKey: trpc.brands.getAll.queryKey(),
      });
      void queryClient.invalidateQueries({
        queryKey: trpc.brands.getFeatured.queryKey(),
      });

      router.push(paths.brands.root);
    },
    onError: (error) => {
      toast.error("Ошибка", {
        description: error.message || "Произошла ошибка при удалении бренда",
      });
    },
  });

  // Используем хук useMutation для удаления бренда
  const { mutate: deleteBrand, isPending: isDeleting } = useMutation(
    deleteBrandMutationOptions,
  );

  // Обработчик удаления бренда
  const handleDelete = () => {
    setShowDeleteDialog(true);
  };

  // Обработчик подтверждения удаления
  const handleDeleteConfirm = () => {
    deleteBrand({ id: brandId });
    setShowDeleteDialog(false);
  };

  // Обработчик отправки формы
  const handleSubmit = (data: BrandFormValues) => {
    setIsSaving(true);

    // Подготавливаем файлы для API
    const files = [];

    if (data.logoKey) {
      files.push({
        fileId: data.logoKey,
        type: "logo",
        order: 0,
      });
    }

    if (data.bannerKey) {
      files.push({
        fileId: data.bannerKey,
        type: "banner",
        order: 1,
      });
    }

    // Вызываем мутацию для обновления бренда
    updateBrand({
      id: brandId,
      name: data.name,
      slug: data.slug,
      description: data.description,
      shortDescription: data.shortDescription,
      website: data.website,
      email: data.email,
      phone: data.phone,
      isActive: data.isActive,
      isFeatured: data.isFeatured,
      foundedYear: data.foundedYear,
      countryOfOrigin: data.countryOfOrigin,
      brandColor: data.brandColor,
      metaTitle: data.metaTitle,
      metaDescription: data.metaDescription,
      metaKeywords: data.metaKeywords,
      categoryIds: data.categoryIds ?? [],
      files,
    });
  };

  // Преобразуем данные из API в формат для формы
  const formValues = brandData
    ? {
      name: brandData.name,
      slug: brandData.slug,
      description: brandData.description ?? "",
      shortDescription: brandData.shortDescription ?? "",
      website: brandData.website ?? "",
      email: brandData.email ?? "",
      phone: brandData.phone ?? "",
      isActive: brandData.isActive,
      isFeatured: brandData.isFeatured,
      foundedYear: brandData.foundedYear ?? "",
      countryOfOrigin: brandData.countryOfOrigin ?? "",
      brandColor: brandData.brandColor ?? "#000000",
      metaTitle: brandData.metaTitle ?? "",
      metaDescription: brandData.metaDescription ?? "",
      metaKeywords: brandData.metaKeywords ?? [],
      // Добавляем категории
      categoryIds: brandData.categoryIds ?? [],
      // Используем правильные поля для логотипа и баннера согласно схеме
      logoKey:
        brandData.files?.find((file) => file.type === "logo")?.fileId ?? null,
      bannerKey:
        brandData.files?.find((file) => file.type === "banner")?.fileId ??
        null,
      // Добавляем метаданные для логотипа и баннера
      logoMeta: brandData.files?.find((file) => file.type === "logo")
        ? {
          name:
            brandData.files.find((file) => file.type === "logo")?.name ??
            "",
          mimeType:
            brandData.files.find((file) => file.type === "logo")
              ?.mimeType ?? "",
          size:
            brandData.files.find((file) => file.type === "logo")?.size ?? 0,
          url:
            brandData.files.find((file) => file.type === "logo")?.url ?? "",
        }
        : undefined,
      bannerMeta: brandData.files?.find((file) => file.type === "banner")
        ? {
          name:
            brandData.files.find((file) => file.type === "banner")?.name ??
            "",
          mimeType:
            brandData.files.find((file) => file.type === "banner")
              ?.mimeType ?? "",
          size:
            brandData.files.find((file) => file.type === "banner")?.size ??
            0,
          url:
            brandData.files.find((file) => file.type === "banner")?.url ??
            "",
        }
        : undefined,
    }
    : null;

  // Проверяем загрузку и ошибки
  const isLoading = isBrandLoading || isCategoriesLoading;
  const hasError = !!brandError || !!categoriesError;

  if (isLoading) {
    return (
      <div className="flex min-h-screen flex-col bg-gray-50/50">
        {/* Header */}
        <header className="bg-background sticky top-0 z-10 flex h-14 shrink-0 items-center border-b px-4">
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              disabled
              className="gap-1 text-muted-foreground"
            >
              <ArrowLeft className="h-4 w-4" />
              Бренды
            </Button>
            <div className="text-muted-foreground flex items-center gap-1 text-sm">
              <span>/</span>
              <div className="h-4 w-32 animate-pulse rounded bg-gray-200" />
              <span>/</span>
              <div className="h-4 w-24 animate-pulse rounded bg-gray-200" />
            </div>
          </div>
        </header>

        {/* Main content */}
        <main className="flex-1">
          <div className="container mx-auto max-w-4xl px-4 py-6">
            <div className="space-y-6">
              <div className="h-4 w-48 animate-pulse rounded bg-gray-200" />
              <div className="h-10 w-full animate-pulse rounded bg-gray-200" />
              <div className="h-32 w-full animate-pulse rounded bg-gray-200" />
              <div className="h-10 w-full animate-pulse rounded bg-gray-200" />
              <div className="flex gap-4">
                <div className="h-10 w-32 animate-pulse rounded bg-gray-200" />
                <div className="h-10 w-32 animate-pulse rounded bg-gray-200" />
              </div>
            </div>
          </div>
        </main>
      </div>
    );
  }

  if (hasError) {
    return (
      <div className="flex min-h-screen flex-col bg-gray-50/50">
        {/* Header */}
        <header className="bg-background sticky top-0 z-10 flex h-14 shrink-0 items-center border-b px-4">
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => router.push("/brands")}
              className="gap-1 text-muted-foreground hover:text-foreground"
            >
              <ArrowLeft className="h-4 w-4" />
              Бренды
            </Button>
          </div>
        </header>

        {/* Main content */}
        <main className="flex-1">
          <div className="container mx-auto max-w-4xl px-4 py-6">
            <div className="rounded-lg border border-destructive/50 bg-destructive/10 p-4 text-sm font-medium text-destructive">
              {brandError
                ? "Ошибка загрузки бренда"
                : "Ошибка загрузки категорий"}
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col bg-gray-50/50">
      {/* Header */}
      <header className="bg-background sticky top-0 z-10 flex h-14 shrink-0 items-center border-b px-4">
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => router.push("/brands")}
            className="gap-1 text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4" />
            Бренды
          </Button>
          <div className="text-muted-foreground flex items-center gap-1 text-sm">
            <span>/</span>
            <span className="max-w-[200px] truncate">{brandData?.name}</span>
            <span>/</span>
            <span className="text-foreground font-medium">Редактирование</span>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="flex-1">
        <div className="container mx-auto max-w-4xl px-4 py-6">
          {formValues && (
            <BrandForm
              initialValues={formValues}
              onSubmit={handleSubmit}
              onDelete={handleDelete}
              isSaving={isSaving}
              isDeleting={isDeleting}
              submitText="Сохранить изменения"
              showDeleteButton={true}
              brandId={brandId}
            />
          )}
        </div>
      </main>

      {/* Диалог подтверждения удаления */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Удалить бренд?</AlertDialogTitle>
            <AlertDialogDescription>
              Это действие нельзя отменить. Бренд будет безвозвратно удален
              вместе со всеми связанными данными.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Отмена</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteConfirm}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Удалить
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
