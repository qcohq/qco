"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@qco/ui/components/button";
import { Form } from "@qco/ui/components/form";
import { type BrandFormValues, brandSchema } from "@qco/validators";
import { Sparkles } from "lucide-react";
import { forwardRef, useImperativeHandle, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { BrandBasicInfo } from "./brand-basic-info";
import { BrandCategories } from "./brand-categories";
import { BrandContactInfo } from "./brand-contact-info";
import { BrandDescription } from "./brand-description";
import { BrandSEO } from "./brand-seo";
import { BrandStatus } from "./brand-status";
import { BrandVisuals } from "./brand-visuals";
import { BrandWebsite } from "./brand-website";

// TODO: Использовать тип из схемы пропсов формы бренда, если появится в @qco/validators
interface BrandFormProps {
  initialValues?: BrandFormValues;
  onSubmit: (values: BrandFormValues) => void | Promise<void>;
  onDelete?: () => void | Promise<void>;
  isSaving?: boolean;
  isDeleting?: boolean;
  submitText?: string;
  showDeleteButton?: boolean;
  brandId?: string; // Для редактирования бренда
  hideSubmitButton?: boolean;
}

export interface BrandFormRef {
  submitForm: () => void;
}

export const BrandForm = forwardRef<BrandFormRef, BrandFormProps>(
  (
    {
      initialValues,
      onSubmit,
      onDelete,
      isSaving = false,
      isDeleting = false,
      submitText = "Сохранить",
      showDeleteButton = false,
      brandId,
      hideSubmitButton = false,
    },
    ref,
  ) => {
    const [isGenerating, setIsGenerating] = useState(false);

    const form = useForm<BrandFormValues>({
      resolver: zodResolver(brandSchema),
      defaultValues: initialValues ?? {
        name: "",
        slug: "",
        description: "",
        shortDescription: "",
        website: "",
        email: "",
        phone: "",
        isActive: true,
        isFeatured: false,
        brandColor: "#000000",
        logoKey: null,
        bannerKey: null,
        countryOfOrigin: "",
        foundedYear: "",
        metaTitle: "",
        metaDescription: "",
        metaKeywords: [],
        categoryIds: [],
      },
    });

    const nameValue = form.watch("name");

    // Функция для генерации данных с помощью ИИ
    const generateWithAI = async () => {
      try {
        setIsGenerating(true);

        // Здесь будет запрос к API для генерации данных
        // Имитация задержки
        await new Promise((resolve) => setTimeout(resolve, 1500));

        // Пример сгенерированных данных
        const generatedData = {
          name: "Эко Стиль",
          slug: "eco-style",
          description:
            "Эко Стиль - это инновационный бренд, специализирующийся на производстве экологически чистой одежды из переработанных материалов. Основанный в 2018 году, бренд быстро завоевал популярность благодаря своему уникальному подходу к устойчивой моде. Каждое изделие создается с учетом минимального воздействия на окружающую среду, при этом не жертвуя стилем и качеством. Бренд активно сотрудничает с экологическими организациями и регулярно проводит образовательные мероприятия о важности устойчивого потребления.",
          shortDescription:
            "Инновационный бренд экологически чистой одежды из переработанных материалов, сочетающий стиль, качество и заботу о планете.",
          website: "https://ecostyle.com",
          email: "contact@ecostyle.com",
          phone: "+7 (495) 123-45-67",
          countryOfOrigin: "Россия",
          foundedYear: "2018",
          brandColor: "#4CAF50",
          metaTitle: "Эко Стиль - Экологичная одежда из переработанных материалов",
          metaDescription: "Инновационный бренд экологически чистой одежды. Устойчивая мода без компромиссов в стиле и качестве.",
          metaKeywords: ["экологичная одежда", "устойчивая мода", "переработанные материалы", "эко стиль", "зеленая мода"],
        };

        // Обновление формы сгенерированными данными
        form.setValue("name", generatedData.name);
        form.setValue("slug", generatedData.slug);
        form.setValue("description", generatedData.description);
        form.setValue("shortDescription", generatedData.shortDescription);
        form.setValue("website", generatedData.website);
        form.setValue("email", generatedData.email);
        form.setValue("phone", generatedData.phone);
        form.setValue("countryOfOrigin", generatedData.countryOfOrigin);
        form.setValue("foundedYear", generatedData.foundedYear);
        form.setValue("brandColor", generatedData.brandColor);
        form.setValue("metaTitle", generatedData.metaTitle);
        form.setValue("metaDescription", generatedData.metaDescription);
        form.setValue("metaKeywords", generatedData.metaKeywords);

        toast.success("Данные успешно сгенерированы!");
      } catch (error) {
        toast.error("Ошибка при генерации данных");
        console.error("Error generating data:", error);
      } finally {
        setIsGenerating(false);
      }
    };

    const handleSubmit = (values: BrandFormValues) => {
      void onSubmit(values);
    };

    // Экспортируем функцию отправки формы через ref
    useImperativeHandle(ref, () => ({
      submitForm: () => {
        form.handleSubmit(handleSubmit)();
      },
    }));

    return (
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-8">
          {/* Кнопка ИИ генерации */}
          <div className="flex justify-end">
            <Button
              type="button"
              variant="outline"
              onClick={generateWithAI}
              disabled={isGenerating || !nameValue}
              className="flex items-center gap-2"
            >
              <Sparkles className="h-4 w-4" />
              {isGenerating ? "Генерация..." : "Заполнить с помощью ИИ"}
            </Button>
          </div>

          {/* Основная информация */}
          <section className="space-y-6">
            <div className="flex items-center gap-3">
              <div className="h-6 w-1 bg-primary rounded-full" />
              <div>
                <h2 className="text-lg font-semibold text-gray-900">
                  Основная информация
                </h2>
                <p className="text-sm text-gray-500">
                  Заполните основные данные о бренде
                </p>
              </div>
            </div>

            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <BrandBasicInfo form={form} brandId={brandId} />
            </div>
          </section>

          {/* Описание */}
          <section className="space-y-6">
            <div className="flex items-center gap-3">
              <div className="h-6 w-1 bg-primary rounded-full" />
              <div>
                <h2 className="text-lg font-semibold text-gray-900">
                  Описание
                </h2>
                <p className="text-sm text-gray-500">
                  Добавьте подробное описание бренда
                </p>
              </div>
            </div>

            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <BrandDescription form={form} />
            </div>
          </section>

          {/* Категории */}
          <section className="space-y-6">
            <div className="flex items-center gap-3">
              <div className="h-6 w-1 bg-primary rounded-full" />
              <div>
                <h2 className="text-lg font-semibold text-gray-900">
                  Категории
                </h2>
                <p className="text-sm text-gray-500">
                  Выберите категории первого уровня для бренда
                </p>
              </div>
            </div>

            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <BrandCategories
                name="categoryIds"
                label="Категории первого уровня"
                placeholder="Выберите категории..."
                description="Выберите категории, к которым относится бренд"
              />
            </div>
          </section>

          {/* Веб-сайт */}
          <section className="space-y-6">
            <div className="flex items-center gap-3">
              <div className="h-6 w-1 bg-primary rounded-full" />
              <div>
                <h2 className="text-lg font-semibold text-gray-900">
                  Веб-сайт
                </h2>
                <p className="text-sm text-gray-500">
                  Укажите официальный сайт бренда
                </p>
              </div>
            </div>

            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <BrandWebsite form={form} />
            </div>
          </section>

          {/* Контактная информация */}
          <section className="space-y-6">
            <div className="flex items-center gap-3">
              <div className="h-6 w-1 bg-primary rounded-full" />
              <div>
                <h2 className="text-lg font-semibold text-gray-900">
                  Контактная информация
                </h2>
                <p className="text-sm text-gray-500">
                  Укажите контактные данные бренда
                </p>
              </div>
            </div>

            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <BrandContactInfo form={form} />
            </div>
          </section>

          {/* SEO настройки */}
          <section className="space-y-6">
            <div className="flex items-center gap-3">
              <div className="h-6 w-1 bg-primary rounded-full" />
              <div>
                <h2 className="text-lg font-semibold text-gray-900">
                  SEO настройки
                </h2>
                <p className="text-sm text-gray-500">
                  Настройте мета-теги для поисковых систем
                </p>
              </div>
            </div>

            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <BrandSEO form={form} />
            </div>
          </section>

          {/* Статус бренда */}
          <section className="space-y-6">
            <div className="flex items-center gap-3">
              <div className="h-6 w-1 bg-primary rounded-full" />
              <div>
                <h2 className="text-lg font-semibold text-gray-900">
                  Статус бренда
                </h2>
                <p className="text-sm text-gray-500">
                  Настройте видимость и приоритет бренда
                </p>
              </div>
            </div>

            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <BrandStatus form={form} />
            </div>
          </section>

          {/* Визуальные материалы */}
          <section className="space-y-6">
            <div className="flex items-center gap-3">
              <div className="h-6 w-1 bg-primary rounded-full" />
              <div>
                <h2 className="text-lg font-semibold text-gray-900">
                  Визуальные материалы
                </h2>
                <p className="text-sm text-gray-500">
                  Загрузите логотип и баннер бренда
                </p>
              </div>
            </div>

            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <BrandVisuals
                form={form}
                initialLogo={
                  initialValues?.logoKey
                    ? {
                      key: initialValues.logoKey,
                      url: initialValues.logoMeta?.url ?? "",
                      name: initialValues.logoMeta?.name ?? "",
                      mimeType: initialValues.logoMeta?.mimeType ?? "",
                      size: initialValues.logoMeta?.size ?? 0,
                    }
                    : null
                }
                initialBanner={
                  initialValues?.bannerKey
                    ? {
                      key: initialValues.bannerKey,
                      url: initialValues.bannerMeta?.url ?? "",
                      name: initialValues.bannerMeta?.name ?? "",
                      mimeType: initialValues.bannerMeta?.mimeType ?? "",
                      size: initialValues.bannerMeta?.size ?? 0,
                    }
                    : null
                }
              />
            </div>
          </section>

          {/* Кнопки действий */}
          {!hideSubmitButton && (
            <div className="flex justify-between gap-4 pt-6">
              {showDeleteButton && onDelete && (
                <Button
                  type="button"
                  variant="destructive"
                  onClick={onDelete}
                  disabled={isDeleting || isSaving}
                >
                  {isDeleting ? "Удаление..." : "Удалить бренд"}
                </Button>
              )}
              <div className="flex gap-4 ml-auto">
                <Button
                  type="submit"
                  disabled={isSaving || isDeleting}
                  className="px-8"
                >
                  {isSaving ? "Сохранение..." : submitText}
                </Button>
              </div>
            </div>
          )}
        </form>
      </Form>
    );
  },
);

BrandForm.displayName = "BrandForm";
