"use client";

import { Button } from "@qco/ui/components/button";
import type { BrandFormValues } from "@qco/validators";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";

import { BrandPreview } from "@/features/brands/components/brand-preview";
import {
  BrandForm,
  type BrandFormRef,
} from "@/features/brands/components/form/brand-form";
import { useCreateBrand } from "@/features/brands/hooks/use-brands";
import { prepareBrandFiles } from "@/features/brands/utils/brand-file-utils";
import { paths } from "~/routes/paths";

export default function AddBrandPage() {
  const router = useRouter();
  const [previewMode, setPreviewMode] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const formRef = useRef<BrandFormRef | null>(null);

  const { mutate: createBrand, isPending: isSaving } = useCreateBrand();

  const handleCreateBrand = (values: BrandFormValues) => {
    setFormError(null);

    // Формируем массив файлов для API с помощью утилитарной функции
    const files = prepareBrandFiles(values);

    // Вызываем мутацию для создания бренда
    createBrand({
      name: values.name,
      slug: values.slug,
      description: values.description,
      shortDescription: values.shortDescription ?? undefined,
      website: values.website ?? undefined,
      email: values.email ?? undefined,
      phone: values.phone ?? undefined,
      isActive: values.isActive,
      isFeatured: values.isFeatured,
      foundedYear: values.foundedYear ?? undefined,
      countryOfOrigin: values.countryOfOrigin ?? undefined,
      brandColor: values.brandColor ?? undefined,
      metaTitle: values.metaTitle ?? undefined,
      metaDescription: values.metaDescription ?? undefined,
      metaKeywords: values.metaKeywords ?? undefined,
      categoryIds: values.categoryIds ?? [],
      files: files.length > 0 ? files : undefined,
    });
  };

  return (
    <div className="flex min-h-screen flex-col bg-gray-50/50">
      {/* Header */}
      <header className="bg-background sticky top-0 z-10 flex h-14 shrink-0 items-center border-b px-4">
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => router.push(paths.brands.root)}
            className="gap-1 text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4" />
            Бренды
          </Button>
          <div className="text-muted-foreground flex items-center gap-1 text-sm">
            <span>/</span>
            <span className="text-foreground font-medium">Создание бренда</span>
          </div>
        </div>
        <div className="ml-auto flex items-center gap-2">
          <Button
            variant="outline"
            onClick={() => setPreviewMode(!previewMode)}
          >
            {previewMode ? "Редактировать" : "Предпросмотр"}
          </Button>
          <Button
            onClick={() => {
              formRef.current?.submitForm();
            }}
            disabled={isSaving}
            className="px-6"
          >
            {isSaving ? "Создание..." : "Создать бренд"}
          </Button>
        </div>
      </header>

      {/* Main content */}
      <main className="flex-1">
        {previewMode ? (
          <div className="container mx-auto max-w-4xl px-4 py-6">
            <BrandPreview
              brand={{
                name: "",
                logo: "",
                bannerImage: "",
                description: "",
                shortDescription: "",
                website: "",
                isActive: false,
                isFeatured: false,
                foundedYear: "",
                countryOfOrigin: "",
                brandColor: "",
              }}
              onEdit={() => setPreviewMode(false)}
            />
          </div>
        ) : (
          <div className="container mx-auto max-w-4xl px-4 py-6">
            {formError && (
              <div className="mb-6 rounded-lg border border-destructive/50 bg-destructive/10 p-4 text-sm font-medium text-destructive">
                <span className="font-medium">Ошибка:</span> {formError}
              </div>
            )}
            <BrandForm
              ref={formRef}
              onSubmit={handleCreateBrand}
              isSaving={isSaving}
              submitText="Создать бренд"
              hideSubmitButton={true}
            />
          </div>
        )}
      </main>
    </div>
  );
}
