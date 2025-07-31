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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@qco/ui/components/select";
import { Switch } from "@qco/ui/components/switch";
import { Textarea } from "@qco/ui/components/textarea";
import { type BannerEditFormData, bannerEditFormSchema } from "@qco/validators";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Save } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { useTRPC } from "~/trpc/react";

import { BannerVisuals } from "./banner-visuals";
import { BannerCategory } from "./form/banner-category";
import type { BannerFromAPI } from "../types";

// TODO: Использовать тип из схемы пропсов формы редактирования баннера, если появится в @qco/validators
type BannerEditFormProps = {
  banner: BannerFromAPI;
};

export function BannerEditForm({ banner }: BannerEditFormProps) {
  const router = useRouter();
  const trpc = useTRPC();
  const queryClient = useQueryClient();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<BannerEditFormData>({
    resolver: zodResolver(bannerEditFormSchema),
    defaultValues: {
      title: banner.title,
      description: banner.description || "",
      link: banner.link || "",
      linkText: banner.buttonText || "",
      isActive: banner.isActive,
      isFeatured: banner.isFeatured,
      position: banner.position || "",
      page: banner.page || "",
      sortOrder: banner.sortOrder ?? 0,
      categoryId: banner.categoryId || "",
      files:
        banner.files?.map((file) => ({
          fileId: file.fileId,
          type: file.type,
          order: file.order ?? 0,
          meta: {
            name: file.file?.name,
            mimeType: file.file?.mimeType,
            size: file.file?.size,
          },
        })) ||
        ([] as {
          fileId: string;
          type: string;
          order: number;
          meta?: { name?: string; mimeType?: string; size?: number };
        }[]),
    },
    mode: "onBlur", // Изменяем режим валидации
  });

  // Проверяем валидность формы при загрузке
  useEffect(() => {
    console.log("Banner data:", banner);
    console.log("Form default values:", form.getValues());

    // Проверяем валидность формы
    const isValid = form.formState.isValid;
    console.log("Form is valid on mount:", isValid);

    if (!isValid) {
      console.log("Form errors on mount:", form.formState.errors);
    }
  }, [banner, form]);

  // Создаем опции мутации для обновления баннера
  const updateBannerMutationOptions = trpc.banners.update.mutationOptions({
    onSuccess: () => {
      toast.success("Баннер успешно обновлен");
      // Инвалидируем кеш запросов баннеров
      queryClient.invalidateQueries({
        queryKey: trpc.banners.getAll.queryKey(),
      });
      queryClient.invalidateQueries({
        queryKey: trpc.banners.getById.queryKey({ id: banner.id }),
      });
      router.push("/banners");
    },
    onError: (error) => {
      toast.error("Ошибка при обновлении баннера", {
        description: error.message,
      });
    },
    onSettled: () => {
      setIsSubmitting(false);
    },
  });

  // Используем опции с хуком useMutation
  const { mutate: updateBanner, isPending } = useMutation(
    updateBannerMutationOptions,
  );

  const onSubmit = (data: BannerEditFormData) => {
    console.log("Отправка формы с данными:", data);
    setIsSubmitting(true);
    try {
      // Формируем массив файлов для API - всегда передаем массив
      const files = data.files || [];
      console.log("Данные формы для обновления:", data);
      console.log("Файлы для обновления:", files);

      // Подготавливаем данные для API
      const apiData = {
        id: banner.id,
        title: data.title,
        description: data.description,
        link: data.link,
        buttonText: data.linkText,
        isActive: data.isActive,
        isFeatured: data.isFeatured,
        position: data.position,
        page: data.page,
        sortOrder: data.sortOrder,
        categoryId: data.categoryId || undefined,
        files,
      };

      console.log("Данные для API:", apiData);

      // Вызываем мутацию для обновления баннера
      updateBanner(apiData);
    } catch (error) {
      console.error("Ошибка при отправке формы:", error);
      toast.error("Произошла ошибка при обновлении баннера");
      setIsSubmitting(false);
    }
  };

  // Функция для получения файла по типу
  const getFileByType = (type: string) => {
    const file = banner.files?.find((f) => f.type === type);
    if (!file || !file.url) return null; // Возвращаем null если файл не найден или нет URL

    return {
      key: file.fileId,
      url: file.url,
      name: file.file?.name,
      mimeType: file.file?.mimeType,
      size: file.file?.size,
    };
  };

  // Проверяем, валидна ли форма
  const isFormValid = form.formState.isValid;
  const hasErrors = Object.keys(form.formState.errors).length > 0;

  // Отладочная информация
  console.log("Form state:", {
    isValid: isFormValid,
    errors: form.formState.errors,
    values: form.getValues(),
    isDirty: form.formState.isDirty,
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        {/* Отладочная информация */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h3 className="text-sm font-medium text-blue-800 mb-2">
            Отладочная информация:
          </h3>
          <div className="text-sm text-blue-700 space-y-1">
            <div>Форма валидна: {isFormValid ? "Да" : "Нет"}</div>
            <div>Количество ошибок: {Object.keys(form.formState.errors).length}</div>
            <div>Форма изменена: {form.formState.isDirty ? "Да" : "Нет"}</div>
            {Object.keys(form.formState.errors).length > 0 && (
              <div>
                Ошибки: {Object.entries(form.formState.errors).map(([field, error]) =>
                  `${field}: ${error?.message}`
                ).join(", ")}
              </div>
            )}
          </div>
        </div>

        {/* Основная информация */}
        <section className="space-y-6">
          <div className="flex items-center gap-3">
            <div className="h-6 w-1 bg-primary rounded-full" />
            <div>
              <h2 className="text-lg font-semibold text-gray-900">
                Основная информация
              </h2>
              <p className="text-sm text-gray-500">Основные данные баннера</p>
            </div>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="space-y-6">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-1">
                      Название баннера
                      <span className="text-red-500">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Введите название баннера"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      Укажите краткое и понятное название баннера
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Описание</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Описание баннера"
                        rows={3}
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      Дополнительная информация о баннере (необязательно)
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="position"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-1">
                        Позиция
                        <span className="text-red-500">*</span>
                      </FormLabel>
                      <FormControl>
                        <Select
                          value={field.value}
                          onValueChange={field.onChange}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Выберите позицию" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="header">Шапка (header)</SelectItem>
                            <SelectItem value="hero">Главный баннер (hero)</SelectItem>
                            <SelectItem value="sidebar">Боковая панель (sidebar)</SelectItem>
                            <SelectItem value="footer">Подвал (footer)</SelectItem>
                            <SelectItem value="content">Контент (content)</SelectItem>
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormDescription>
                        Выберите, где будет отображаться баннер
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="page"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Страница</FormLabel>
                      <FormControl>
                        <Select
                          value={field.value}
                          onValueChange={field.onChange}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Выберите страницу" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="home">Главная (home)</SelectItem>
                            <SelectItem value="category">
                              Категория (category)
                            </SelectItem>
                            <SelectItem value="product">
                              Товар (product)
                            </SelectItem>
                            <SelectItem value="cart">Корзина (cart)</SelectItem>
                            <SelectItem value="checkout">
                              Оформление заказа (checkout)
                            </SelectItem>
                            <SelectItem value="blog">Блог (blog)</SelectItem>
                            <SelectItem value="other">
                              Другое (other)
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormDescription>
                        На какой странице будет отображаться баннер
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="sortOrder"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Порядок сортировки</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="0"
                          {...field}
                          onChange={(e) => field.onChange(Number(e.target.value))}
                        />
                      </FormControl>
                      <FormDescription>
                        Чем меньше число, тем выше баннер в списке
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="flex items-center space-x-6">
                  <FormField
                    control={form.control}
                    name="isActive"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                        <div className="space-y-0.5">
                          <FormLabel className="text-base">Активен</FormLabel>
                          <div className="text-sm text-muted-foreground">
                            Баннер будет отображаться на сайте
                          </div>
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
              </div>

              <div className="flex items-center space-x-6">
                <FormField
                  control={form.control}
                  name="isFeatured"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base">Рекомендуемый</FormLabel>
                        <div className="text-sm text-muted-foreground">
                          Баннер будет выделен как рекомендуемый
                        </div>
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
            </div>
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
            <div className="space-y-6">
              <FormField
                control={form.control}
                name="link"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Ссылка</FormLabel>
                    <FormControl>
                      <Input placeholder="https://example.com/page" {...field} />
                    </FormControl>
                    <FormDescription>
                      URL, на который будет вести баннер (необязательно)
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="linkText"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Текст ссылки</FormLabel>
                    <FormControl>
                      <Input placeholder="Подробнее" {...field} />
                    </FormControl>
                    <FormDescription>
                      Текст кнопки на баннере (необязательно)
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>
        </section>

        {/* Категория */}
        <section className="space-y-6">
          <div className="flex items-center gap-3">
            <div className="h-6 w-1 bg-primary rounded-full" />
            <div>
              <h2 className="text-lg font-semibold text-gray-900">Категория</h2>
              <p className="text-sm text-gray-500">
                Связь с категорией товаров
              </p>
            </div>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <BannerCategory
              name="categoryId"
              label="Категория"
              placeholder="Выберите категорию товаров"
              description="Свяжите баннер с определенной категорией товаров (необязательно)"
            />
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
            <BannerVisuals
              initialDesktop={getFileByType("desktop")}
              initialMobile={getFileByType("mobile")}
              initialTablet={getFileByType("tablet")}
            />
          </div>
        </section>

        {/* Отображение ошибок валидации */}
        {hasErrors && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <h3 className="text-sm font-medium text-red-800 mb-2">
              Пожалуйста, исправьте следующие ошибки:
            </h3>
            <ul className="text-sm text-red-700 space-y-1">
              {Object.entries(form.formState.errors).map(([field, error]) => (
                <li key={field}>
                  • {error?.message || `Ошибка в поле ${field}`}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Кнопки действий */}
        <div className="flex justify-end gap-4 pt-6">
          <Button
            type="button"
            variant="outline"
            onClick={() => {
              console.log("Текущие значения формы:", form.getValues());
              console.log("Ошибки валидации:", form.formState.errors);
              console.log("Форма валидна:", form.formState.isValid);
            }}
          >
            Проверить валидацию
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={() => router.push("/banners")}
          >
            Отмена
          </Button>
          <Button
            type="submit"
            disabled={isSubmitting || isPending}
            className="flex items-center gap-2"
          >
            <Save className="h-4 w-4" />
            {isSubmitting || isPending ? "Обновление..." : "Обновить баннер"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
