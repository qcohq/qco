"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@qco/ui/components/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@qco/ui/components/form";
import { Input } from "@qco/ui/components/input";
import { Switch } from "@qco/ui/components/switch";
import { Textarea } from "@qco/ui/components/textarea";
import type { CategoryFormValues } from "@qco/validators";
import { categoryFormSchema } from "@qco/validators";
import slugify from "@sindresorhus/slugify";
import { useMutation } from "@tanstack/react-query";
import { CheckCircle, Loader2, Wand2, XCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { FileUpload } from "@/components/file-upload";
import { CategoryCombobox } from "~/components/category-combobox";
import { ProductTypeMultiCombobox } from "~/components/product-type-multi-combobox";
import { useTRPC } from "~/trpc/react";
import { useSlugValidation } from "./hooks/use-slug-validation";

interface CategoryItem {
  id: string;
  name: string;
  children?: CategoryItem[];
}

// TODO: Использовать тип из схемы пропсов формы категории, если появится в @qco/validators
interface CategoryFormProps {
  initialData?: CategoryFormValues;
  categories: CategoryItem[];
  onSubmit: (data: CategoryFormValues) => void;
  isEditing?: boolean;
  onDelete?: () => void;
  isDeleting?: boolean;
}

// Вспомогательная функция для преобразования значения к строке (id)
function toCategoryId(
  value: string | { id: string } | null | undefined,
): string {
  if (!value) return "";
  if (typeof value === "string") return value;
  if (typeof value === "object" && "id" in value) return value.id;
  return "";
}

export function CategoryForm({
  initialData,
  categories,
  onSubmit,
  isEditing = false,
  onDelete,
  isDeleting = false,
}: CategoryFormProps) {
  const router = useRouter();
  const trpc = useTRPC();
  const [isGeneratingUnique, setIsGeneratingUnique] = useState(false);

  // Инициализация формы с react-hook-form и zod валидацией
  const form = useForm({
    resolver: zodResolver(categoryFormSchema),
    defaultValues: {
      name: initialData?.name ?? "",
      description: initialData?.description ?? "",
      parentId: initialData?.parentId ?? "",
      productTypeIds: initialData?.productTypeIds ?? [],
      isActive: initialData?.isActive ?? true,
      isFeatured: initialData?.isFeatured ?? false,
      metaTitle: initialData?.metaTitle ?? initialData?.name ?? "",
      metaDescription:
        initialData?.metaDescription ?? initialData?.description ?? "",
      slug: initialData?.slug ?? "",
      sortOrder: initialData?.sortOrder ?? 0,
      id: initialData?.id,
      image: initialData?.image ?? undefined,
    },
  });

  // Следим за изменением названия и слага
  const nameValue = form.watch("name");
  const slugValue = form.watch("slug");
  const categoryId = form.watch("id");

  // Валидация уникальности слага (исключаем текущую категорию при редактировании)
  const slugValidation = useSlugValidation({
    slug: slugValue || "",
    excludeId: categoryId,
    enabled: !!slugValue && slugValue.length >= 2,
  });

  // Мутация для генерации уникального слага
  const generateUniqueSlugMutationOptions =
    trpc.categories.generateUniqueSlug.mutationOptions({
      onSuccess: (data) => {
        if (data.slug) {
          form.setValue("slug", data.slug, {
            shouldDirty: true,
            shouldValidate: true,
          });
          toast.success("Уникальный слаг сгенерирован", {
            description: `URL "${data.slug}" создан автоматически`,
          });
        }
      },
      onError: (error) => {
        console.error("Error generating unique slug:", error);
        toast.error("Ошибка", {
          description: "Не удалось сгенерировать уникальный URL",
        });
      },
      onSettled: () => {
        setIsGeneratingUnique(false);
      },
    });

  const { mutate: generateUniqueSlug } = useMutation(
    generateUniqueSlugMutationOptions,
  );

  // Генерация слага при потере фокуса поля названия
  const handleNameBlur = () => {
    if (
      nameValue &&
      nameValue.length >= 2 &&
      (!slugValue || slugValue.trim() === "")
    ) {
      const generatedSlug = slugify(nameValue, {
        lowercase: true,
      });
      form.setValue("slug", generatedSlug, {
        shouldDirty: true,
        shouldValidate: true,
      });
    }
  };

  // Функция для ручной генерации слага
  const generateSlug = () => {
    const currentName = form.getValues("name");
    if (currentName && currentName.length >= 2) {
      const slug = slugify(currentName, {
        lowercase: true,
      });
      form.setValue("slug", slug, {
        shouldDirty: true,
        shouldValidate: true,
      });
      toast.success("Слаг сгенерирован", {
        description: `Слаг "${slug}" создан из названия категории`,
      });
    } else {
      toast.error("Ошибка", {
        description: "Сначала введите название категории (минимум 2 символа)",
      });
    }
  };

  // Функция для генерации уникального слага
  const handleGenerateUniqueSlug = () => {
    if (slugValue && slugValue.length >= 2) {
      setIsGeneratingUnique(true);
      generateUniqueSlug({ baseSlug: slugValue, excludeId: categoryId });
    }
  };

  // Функция для получения доступных родительских категорий (исключаем текущую при редактировании)
  const getAvailableParentCategories = () => {
    if (!isEditing) {
      return categories;
    }
    // Для редактирования - исключаем текущую категорию и её потомков
    return categories.filter((category) => category.id !== initialData?.id);
  };

  const handleFormSubmit = (data: CategoryFormValues) => {
    try {
      const formData = {
        ...data,
        id: data.id ?? `cat-${data.slug ?? ""}`,
      };

      onSubmit(formData);
    } catch (error) {
      console.error("Ошибка при сохранении категории:", error);
      toast("Ошибка", {
        description: "Произошла ошибка при сохранении категории",
        className: "bg-destructive text-destructive-foreground",
      });
    }
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit((data) => handleFormSubmit(data))}
        className="space-y-8"
      >
        {/* Основная информация */}
        <section className="space-y-6">
          <div className="flex items-center gap-3">
            <div className="h-6 w-1 bg-primary rounded-full" />
            <div>
              <h2 className="text-lg font-semibold text-gray-900">
                Основная информация
              </h2>
              <p className="text-sm text-gray-500">
                Основные данные о категории, которые будут отображаться в
                каталоге
              </p>
            </div>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-6 space-y-6">
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium text-gray-700">
                      Название категории
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Например: Женская обувь"
                        {...field}
                        onBlur={(_e) => {
                          field.onBlur();
                          handleNameBlur();
                        }}
                        className="h-10"
                      />
                    </FormControl>
                    <FormDescription className="text-xs text-gray-500">
                      Название категории, которое будет отображаться в каталоге
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="sortOrder"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium text-gray-700">
                      Сортировка
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min={0}
                        step={1}
                        value={field.value ?? 0}
                        onChange={e => field.onChange(Number(e.target.value))}
                        className="h-10"
                      />
                    </FormControl>
                    <FormDescription className="text-xs text-gray-500">
                      Категории с меньшим значением будут отображаться первыми
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="parentId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium text-gray-700">
                      Родительская категория
                    </FormLabel>
                    <FormControl>
                      <CategoryCombobox
                        value={field.value || ""}
                        onChange={field.onChange}
                        categories={getAvailableParentCategories()}
                        placeholder="Выберите родительскую категорию..."
                      />
                    </FormControl>
                    <FormDescription className="text-xs text-gray-500">
                      Выберите родительскую категорию или оставьте пустым для
                      корневой категории
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="productTypeIds"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel className="text-sm font-medium text-gray-700">
                      Типы продуктов
                    </FormLabel>
                    <FormControl>
                      <ProductTypeMultiCombobox
                        values={field.value ?? []}
                        onChange={field.onChange}
                        placeholder="Выберите типы продуктов..."
                      />
                    </FormControl>
                    <FormDescription className="text-xs text-gray-500">
                      Выберите типы продуктов для категории
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="slug"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium text-gray-700">
                      URL-адрес (слаг)
                    </FormLabel>
                    <FormControl>
                      <div className="flex gap-2">
                        <div className="relative flex-1">
                          <Input
                            placeholder="url-kategorii"
                            {...field}
                            value={field.value ?? ""}
                            className={`h-10 pr-10 ${slugValidation.isAvailable === false ? "border-destructive" : slugValidation.isAvailable === true ? "border-green-500" : ""}`}
                          />
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
                          disabled={!nameValue}
                          className="h-10 w-10"
                        >
                          <Wand2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </FormControl>
                    <FormDescription className="text-xs text-gray-500">
                      Уникальный URL-адрес для страницы категории. Генерируется
                      автоматически при потере фокуса поля названия или нажмите
                      кнопку для ручной генерации.
                    </FormDescription>
                    {/* Показываем ошибку дублирования слага */}
                    {slugValidation.isAvailable === false &&
                      slugValidation.existingCategory && (
                        <div className="space-y-2">
                          <p className="text-sm text-destructive">
                            URL уже используется категорией "
                            {slugValidation.existingCategory.name}"
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
            </div>

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium text-gray-700">
                    Описание
                  </FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Краткое описание категории"
                      rows={3}
                      {...field}
                      className="resize-none"
                    />
                  </FormControl>
                  <FormDescription className="text-xs text-gray-500">
                    Описание категории, которое будет отображаться на странице
                    категории
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="parentId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium text-gray-700">
                    Родительская категория
                  </FormLabel>
                  <FormControl>
                    <CategoryCombobox
                      categories={getAvailableParentCategories()}
                      value={toCategoryId(field.value)}
                      onChange={(value) => {
                        // Если выбрано пустое значение, устанавливаем null
                        field.onChange(value === "" ? null : value);
                      }}
                      multiple={false}
                      showBadges={true}
                      placeholder="Выберите родительскую категорию"
                      clearable={true}
                    />
                  </FormControl>
                  <FormDescription className="text-xs text-gray-500">
                    Выберите родительскую категорию или оставьте пустым для
                    создания корневой категории
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </section>

        {/* Изображение категории */}
        <section className="space-y-6">
          <div className="flex items-center gap-3">
            <div className="h-6 w-1 bg-primary rounded-full" />
            <div>
              <h2 className="text-lg font-semibold text-gray-900">
                Изображение категории
              </h2>
              <p className="text-sm text-gray-500">
                Загрузите и настройте изображение для категории
              </p>
            </div>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <FileUpload
              value={
                // Для редактирования: если есть image, показать текущее изображение
                form.getValues("image")?.fileId
                  ? {
                    key: form.getValues("image")?.fileId || "",
                    url: form.getValues("image")?.url || "",
                    name: form.getValues("image")?.meta?.name || "",
                    mimeType: form.getValues("image")?.meta?.mimeType || "",
                    size: form.getValues("image")?.meta?.size || 0,
                  }
                  : null
              }
              onChange={(fileData) => {
                if (fileData) {
                  form.setValue("image", {
                    fileId: fileData.key,
                    meta: {
                      name: fileData.name || "",
                      mimeType: fileData.mimeType || "",
                      size: fileData.size || 0,
                    },
                  });
                } else {
                  form.setValue("image", null);
                }
              }}
              label="Загрузить изображение"
              accept={{ "image/*": [] }}
              recommended="Рекомендуется PNG, JPG, WEBP, до 2MB"
            />
          </div>
        </section>

        {/* Дополнительные настройки */}
        <section className="space-y-6">
          <div className="flex items-center gap-3">
            <div className="h-6 w-1 bg-primary rounded-full" />
            <div>
              <h2 className="text-lg font-semibold text-gray-900">
                Дополнительные настройки
              </h2>
              <p className="text-sm text-gray-500">
                Настройте видимость и дополнительные параметры категории
              </p>
            </div>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-6 space-y-6">
            <FormField
              control={form.control}
              name="isActive"
              render={({ field }) => (
                <FormItem className="flex items-center justify-between space-y-0">
                  <div className="space-y-0.5">
                    <FormLabel className="text-sm font-medium text-gray-700">
                      Активная категория
                    </FormLabel>
                    <FormDescription className="text-xs text-gray-500">
                      Категория будет видна на сайте
                    </FormDescription>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="isFeatured"
              render={({ field }) => (
                <FormItem className="flex items-center justify-between space-y-0">
                  <div className="space-y-0.5">
                    <FormLabel className="text-sm font-medium text-gray-700">
                      Рекомендуемая категория
                    </FormLabel>
                    <FormDescription className="text-xs text-gray-500">
                      Отображать на главной странице
                    </FormDescription>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
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
                Настройте метаданные для поисковых систем
              </p>
            </div>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-6 space-y-6">
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <FormField
                control={form.control}
                name="metaTitle"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium text-gray-700">
                      Meta заголовок
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="SEO заголовок для категории"
                        {...field}
                        className="h-10"
                      />
                    </FormControl>
                    <FormDescription className="text-xs text-gray-500">
                      Рекомендуемая длина: до 70 символов
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="metaDescription"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium text-gray-700">
                      Meta описание
                    </FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="SEO описание для категории"
                        rows={2}
                        {...field}
                        className="resize-none"
                      />
                    </FormControl>
                    <FormDescription className="text-xs text-gray-500">
                      Рекомендуемая длина: до 160 символов
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>
        </section>

        <div className="flex justify-between gap-4 pt-6">
          {isEditing && onDelete && (
            <Button
              type="button"
              variant="destructive"
              onClick={onDelete}
              disabled={isDeleting}
              className="gap-2"
            >
              {isDeleting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Удаление...
                </>
              ) : (
                <>
                  <XCircle className="h-4 w-4" />
                  Удалить категорию
                </>
              )}
            </Button>
          )}
          <div className="flex gap-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.push("/categories")}
            >
              Отмена
            </Button>
            <Button type="submit" className="px-8">
              {isEditing ? "Сохранить изменения" : "Создать категорию"}
            </Button>
          </div>
        </div>
      </form>
    </Form>
  );
}
