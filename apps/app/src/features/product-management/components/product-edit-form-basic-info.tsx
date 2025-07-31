"use client";

import { Button } from "@qco/ui/components/button";
import CKEditorField from "@qco/ui/components/client-side-ckeditor";
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@qco/ui/components/form";
import { Input } from "@qco/ui/components/input";
import { toast } from "@qco/ui/hooks/use-toast";
import type { ProductUpdateInput } from "@qco/validators";
import slugify from "@sindresorhus/slugify";
import { useMutation } from "@tanstack/react-query";
import { CheckCircle, Loader2, Wand2, XCircle } from "lucide-react";
import { useEffect, useState } from "react";
import { useFormContext } from "react-hook-form";
import { useTRPC } from "~/trpc/react";
import { useProductTypesOptimized } from "../hooks/use-product-types-optimized";
import { useSlugValidation } from "../hooks/use-slug-validation";
import { ProductTypeSelect } from "./product-type-select";

interface BrandForSelect {
  id: string;
  name: string;
  slug?: string;
  [key: string]: any;
}

import { BrandComboboxForm } from "./brand-combobox-form";

export function ProductEditFormBasicInfo({ brands }: { brands: BrandForSelect[] }) {
  const { control, watch, setValue } = useFormContext<ProductUpdateInput>();
  const formData = watch();
  const trpc = useTRPC();
  const [isGeneratingUnique, setIsGeneratingUnique] = useState(false);

  // Следим за изменением названия товара для автоматической генерации слага
  const nameValue = watch("name");
  const slugValue = watch("slug");
  const productId = watch("id");

  // Валидация уникальности слага (исключаем текущий товар при редактировании)
  const slugValidation = useSlugValidation({
    slug: slugValue || "",
    excludeId: productId,
    enabled: !!slugValue && slugValue.length >= 2,
  });

  // Мутация для генерации уникального слага
  const generateUniqueSlugMutationOptions =
    trpc.products.generateUniqueSlug.mutationOptions({
      onSuccess: (data) => {
        if (data.slug) {
          setValue("slug", data.slug, {
            shouldDirty: true,
            shouldValidate: true,
          });
          toast({
            title: "Уникальный слаг сгенерирован",
            description: `URL "${data.slug}" создан автоматически`,
          });
        }
      },
      onError: (error) => {
        toast({
          title: "Ошибка",
          description:
            error.message || "Не удалось сгенерировать уникальный URL",
          variant: "destructive",
        });
      },
      onSettled: () => {
        setIsGeneratingUnique(false);
      },
    });

  const { mutate: generateUniqueSlug } = useMutation(
    generateUniqueSlugMutationOptions,
  );

  const { productTypes, isLoading: isProductTypesLoading } =
    useProductTypesOptimized();

  useEffect(() => {
    // Автоматически генерируем слаг только если:
    // 1. Есть название товара (минимум 2 символа)
    // 2. Слаг пустой или не заполнен (для новых товаров)
    if (
      nameValue &&
      nameValue.length >= 2 &&
      (!slugValue || slugValue.trim() === "")
    ) {
      const generatedSlug = slugify(nameValue, {
        lowercase: true,
      });
      setValue("slug", generatedSlug, {
        shouldDirty: true,
        shouldValidate: true,
      });
    }
  }, [nameValue, slugValue, setValue]);

  // Функция для ручной генерации слага
  const generateSlug = () => {
    const currentName = watch("name");
    if (currentName && currentName.length >= 2) {
      const slug = slugify(currentName, {
        lowercase: true,
      });
      setValue("slug", slug, {
        shouldDirty: true,
        shouldValidate: true,
      });
      toast({
        title: "Слаг сгенерирован",
        description: `Слаг "${slug}" создан из названия товара`,
      });
    } else {
      toast({
        title: "Ошибка",
        description: "Сначала введите название товара (минимум 2 символа)",
        variant: "destructive",
      });
    }
  };

  // Функция для генерации уникального слага
  const handleGenerateUniqueSlug = () => {
    if (slugValue && slugValue.length >= 2) {
      setIsGeneratingUnique(true);
      generateUniqueSlug({ baseSlug: slugValue, excludeId: productId });
    }
  };

  return (
    <section id="basic-info" className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="h-6 w-1 bg-primary rounded-full" />
        <div>
          <h2 className="text-lg font-semibold text-gray-900">
            Основная информация
          </h2>
          <p className="text-sm text-gray-500">
            Основные данные о товаре, которые будут отображаться в каталоге
          </p>
        </div>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 p-6 space-y-6">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <FormField
            control={control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-medium text-gray-700">
                  Название товара
                </FormLabel>
                <FormControl>
                  <Input
                    placeholder="Введите название товара"
                    {...field}
                    value={field.value ?? ""}
                    className="h-10"
                  />
                </FormControl>
                <FormDescription className="text-xs text-gray-500">
                  Название товара, которое будет отображаться в каталоге
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={control}
            name="slug"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-medium text-gray-700">
                  URL-адрес (слаг)
                </FormLabel>
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <FormControl>
                      <Input
                        placeholder="url-tovara"
                        {...field}
                        value={field.value ?? ""}
                        className={`h-10 pr-10 ${slugValidation.isAvailable === false ? "border-destructive" : slugValidation.isAvailable === true ? "border-green-500" : ""}`}
                      />
                    </FormControl>
                    {/* Индикатор статуса валидации */}
                    {slugValue && slugValue.length >= 2 && (
                      <div className="absolute right-3 top-1/2 -translate-y-1/2">
                        {slugValidation.isChecking ? (
                          <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                        ) : slugValidation.isAvailable === true ? (
                          <CheckCircle className="h-4 w-4 text-green-500" />
                        ) : slugValidation.isAvailable === false ? (
                          <XCircle className="h-4 w-4 text-destructive" />
                        ) : null}
                      </div>
                    )}
                  </div>
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    onClick={generateSlug}
                    disabled={!formData.name}
                    className="h-10 w-10"
                  >
                    <Wand2 className="h-4 w-4" />
                  </Button>
                </div>
                <FormDescription className="text-xs text-gray-500">
                  Уникальный URL-адрес для страницы товара. Генерируется
                  автоматически из названия только для новых товаров или нажмите
                  кнопку для ручной генерации.
                </FormDescription>
                {/* Показываем ошибку дублирования слага */}
                {slugValidation.isAvailable === false &&
                  slugValidation.existingProduct && (
                    <div className="space-y-2">
                      <p className="text-sm text-destructive">
                        URL уже используется товаром "
                        {slugValidation.existingProduct.name}"
                      </p>
                      <button
                        type="button"
                        onClick={handleGenerateUniqueSlug}
                        disabled={isGeneratingUnique}
                        className="text-sm text-blue-600 hover:text-blue-800 underline disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {isGeneratingUnique ? (
                          <>
                            <Loader2 className="inline h-3 w-3 animate-spin mr-1" />
                            Генерируем уникальный URL...
                          </>
                        ) : (
                          "Сгенерировать уникальный URL"
                        )}
                      </button>
                    </div>
                  )}
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={control}
            name="productTypeId"
            render={({ field }) => (
              <ProductTypeSelect
                value={field.value}
                onValueChange={field.onChange}
                disabled={isProductTypesLoading}
              />
            )}
          />
        </div>

        <FormField
          control={control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-sm font-medium text-gray-700">
                Описание
              </FormLabel>
              <FormControl>
                <CKEditorField
                  value={typeof field.value === "string" ? field.value : ""}
                  onChange={field.onChange}
                  placeholder="Введите описание товара"
                  className="min-h-32"
                />
              </FormControl>
              <FormDescription className="text-xs text-gray-500">
                Полное описание товара, которое будет отображаться на странице
                товара
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <FormField
            control={control}
            name="sku"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-medium text-gray-700">
                  Артикул
                </FormLabel>
                <FormControl>
                  <Input
                    placeholder="Введите артикул товара"
                    {...field}
                    value={field.value ?? ""}
                    className="h-10"
                  />
                </FormControl>
                <FormDescription className="text-xs text-gray-500">
                  Уникальный идентификатор товара в вашем каталоге
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

      </div>
    </section>
  );
}
