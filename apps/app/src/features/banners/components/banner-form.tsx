"use client";

import { Button } from "@qco/ui/components/button";
import { Save } from "lucide-react";
import { useRouter } from "next/navigation";
import { FormProvider } from "react-hook-form";
import { useBannerForm } from "../hooks/use-banner-form";
import { useCategories } from "../hooks/use-categories";
import { BannerBasicInfo } from "./banner-form-sections/banner-basic-info";
import { BannerLinkSettings } from "./banner-form-sections/banner-link-settings";
import { BannerFormSkeleton } from "./banner-form-skeleton";
import { BannerVisuals } from "./banner-visuals";

// TODO: Использовать тип из схемы пропсов формы баннера, если появится в @qco/validators
interface BannerFormProps {
  bannerId?: string;
}

export function BannerForm({ bannerId }: BannerFormProps) {
  const router = useRouter();
  const { form, isUploading, isSubmitting, isPending, onSubmit } =
    useBannerForm();

  // Получаем категории
  const { isLoading: categoriesLoading } = useCategories();

  // Если баннер редактируется, но данные еще не загружены
  if (bannerId && categoriesLoading) {
    return <BannerFormSkeleton />;
  }

  return (
    <FormProvider {...form}>
      <form onSubmit={onSubmit} className="space-y-8">
        {/* Основная информация */}
        <section className="space-y-6">
          <div className="flex items-center gap-3">
            <div className="h-6 w-1 bg-primary rounded-full" />
            <div>
              <h2 className="text-lg font-semibold text-gray-900">
                Основная информация
              </h2>
              <p className="text-sm text-gray-500">
                Заполните основные данные баннера
              </p>
            </div>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <BannerBasicInfo form={form} />
          </div>
        </section>

        {/* Настройки ссылки */}
        <section className="space-y-6">
          <div className="flex items-center gap-3">
            <div className="h-6 w-1 bg-primary rounded-full" />
            <div>
              <h2 className="text-lg font-semibold text-gray-900">
                Настройки ссылки
              </h2>
              <p className="text-sm text-gray-500">
                Укажите URL и текст для кнопки
              </p>
            </div>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <BannerLinkSettings form={form} />
          </div>
        </section>

        {/* Изображения */}
        <section className="space-y-6">
          <div className="flex items-center gap-3">
            <div className="h-6 w-1 bg-primary rounded-full" />
            <div>
              <h2 className="text-lg font-semibold text-gray-900">
                Изображения
              </h2>
              <p className="text-sm text-gray-500">
                Загрузите изображения для разных устройств
              </p>
            </div>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <BannerVisuals />
          </div>
        </section>

        {/* Кнопки действий */}
        <div className="flex justify-end gap-4 pt-6">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.push("/banners")}
          >
            Отмена
          </Button>
          <Button
            type="submit"
            disabled={isSubmitting || isPending || isUploading}
            className="flex items-center gap-2"
          >
            <Save className="h-4 w-4" />
            {isUploading
              ? "Загрузка файлов..."
              : isSubmitting || isPending
                ? "Создание..."
                : "Создать баннер"}
          </Button>
        </div>
      </form>
    </FormProvider>
  );
}
