"use client";

import { Input } from "@qco/ui/components/input";
import { Label } from "@qco/ui/components/label";
import { Textarea } from "@qco/ui/components/textarea";
import type { ProductUpdateInput } from "@qco/validators";
import { useFormContext } from "react-hook-form";

export function ProductEditFormSeo() {
  const { watch, setValue } = useFormContext<ProductUpdateInput>();
  const formData = watch();

  const handleChange = <T extends keyof ProductUpdateInput>(
    field: T,
    value: ProductUpdateInput[T],
  ) => {
    setValue(field, value, { shouldDirty: true, shouldValidate: true });
  };
  return (
    <section id="seo" className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="h-6 w-1 bg-primary rounded-full" />
        <div>
          <h2 className="text-lg font-semibold text-gray-900">SEO настройки</h2>
          <p className="text-sm text-gray-500">
            Настройте метаданные для поисковых систем
          </p>
        </div>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 p-6 space-y-6">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <div className="space-y-2">
            <Label
              htmlFor="seo-title"
              className="text-sm font-medium text-gray-700"
            >
              SEO заголовок
            </Label>
            <Input
              id="seo-title"
              value={formData.seoTitle ?? formData.name ?? ""}
              onChange={(e) => handleChange("seoTitle", e.target.value)}
              className="h-10"
              placeholder="Введите SEO заголовок"
            />
            <p className="text-xs text-gray-500">
              Рекомендуемая длина: до 70 символов
            </p>
          </div>

          <div className="space-y-2">
            <Label
              htmlFor="seo-url"
              className="text-sm font-medium text-gray-700"
            >
              URL-адрес
            </Label>
            <div className="flex">
              <span className="border border-gray-300 bg-gray-50 text-gray-500 inline-flex items-center rounded-l-md border-r-0 px-3 text-sm">
                example.com/products/
              </span>
              <Input
                id="seo-url"
                className="rounded-l-none h-10"
                value={formData.seoUrl ?? formData.sku?.toLowerCase() ?? ""}
                onChange={(e) => handleChange("seoUrl", e.target.value)}
                placeholder="url-tovara"
              />
            </div>
            <p className="text-xs text-gray-500">
              Используйте только строчные буквы, цифры и дефисы
            </p>
          </div>
        </div>

        <div className="space-y-2">
          <Label
            htmlFor="seo-description"
            className="text-sm font-medium text-gray-700"
          >
            SEO описание
          </Label>
          <Textarea
            id="seo-description"
            className="min-h-20 resize-none"
            value={formData.seoDescription ?? formData.description ?? ""}
            onChange={(e) => handleChange("seoDescription", e.target.value)}
            placeholder="Введите описание для поисковых систем"
          />
          <p className="text-xs text-gray-500">
            Рекомендуемая длина: до 160 символов
          </p>
        </div>

        <div className="space-y-2">
          <Label
            htmlFor="seo-keywords"
            className="text-sm font-medium text-gray-700"
          >
            Ключевые слова
          </Label>
          <Input
            id="seo-keywords"
            placeholder="Введите ключевые слова через запятую"
            value={formData.seoKeywords ?? ""}
            onChange={(e) => handleChange("seoKeywords", e.target.value)}
            className="h-10"
          />
          <p className="text-xs text-gray-500">
            Ключевые слова для улучшения поисковой оптимизации
          </p>
        </div>
      </div>
    </section>
  );
}
