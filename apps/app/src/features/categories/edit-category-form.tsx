"use client";

import type { RouterOutputs } from "@qco/api";
import { Button } from "@qco/ui/components/button";
import { Skeleton } from "@qco/ui/components/skeleton";
import type { CategoryFormValues } from "@qco/validators";
import { ArrowLeft } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { CategoryForm } from "@/features/categories/category-form";

// TODO: Использовать тип из схемы пропсов формы редактирования категории, если появится в @qco/validators
type CategoryType = RouterOutputs["categories"]["getById"];
type CategoryListItemType =
  RouterOutputs["categories"]["list"]["items"][number];

function EditCategoryForm({
  loading,
  category,
  categories,
  onSubmit,
  onDelete,
  isDeleting = false,
  error,
}: {
  loading: boolean;
  category: CategoryType | null | undefined;
  categories: CategoryListItemType[];
  onSubmit: (data: CategoryFormValues) => void;
  onDelete?: () => void;
  isDeleting?: boolean;
  error?: string;
}) {
  const router = useRouter();

  if (loading) {
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
              Категории
            </Button>
            <div className="text-muted-foreground flex items-center gap-1 text-sm">
              <span>/</span>
              <Skeleton className="h-4 w-32" />
              <span>/</span>
              <Skeleton className="h-4 w-24" />
            </div>
          </div>
        </header>

        {/* Main content */}
        <main className="flex-1">
          <div className="container mx-auto max-w-4xl px-4 py-6">
            <div className="space-y-6">
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-32 w-full" />
              <Skeleton className="h-10 w-full" />
              <div className="flex gap-4">
                <Skeleton className="h-10 w-32" />
                <Skeleton className="h-10 w-32" />
              </div>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <>
      {/* Header */}
      <header className="bg-background sticky top-0 z-10 flex h-14 shrink-0 items-center border-b px-4">
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => router.push("/categories")}
            className="gap-1 text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4" />
            Категории
          </Button>
          <div className="text-muted-foreground flex items-center gap-1 text-sm">
            <span>/</span>
            <span className="max-w-[200px] truncate">{category?.name}</span>
            <span>/</span>
            <span className="text-foreground font-medium">Редактирование</span>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="flex-1">
        <div className="container mx-auto max-w-4xl px-4 py-6">
          {error && (
            <div className="text-destructive mb-6 rounded-lg border border-destructive/50 bg-destructive/10 p-4 text-sm font-medium">
              {error}
            </div>
          )}

          {category?.image?.url && (
            <div className="mb-6 flex justify-center">
              <Image
                src={category.image.url}
                alt={category.name || "Фото категории"}
                className="max-h-48 rounded-lg border object-contain"
                style={{ maxWidth: 320 }}
                width={320}
                height={192}
                unoptimized
              />
            </div>
          )}

          <CategoryForm
            initialData={
              category
                ? {
                  ...category,
                  order: category.order ?? 0,
                  description: category.description ?? "",
                  metaTitle: category.metaTitle ?? "",
                  metaDescription: category.metaDescription ?? "",
                }
                : undefined
            }
            categories={categories}
            onSubmit={onSubmit}
            isEditing={true}
            onDelete={onDelete}
            isDeleting={isDeleting}
          />
        </div>
      </main>
    </>
  );
}

export { EditCategoryForm };
