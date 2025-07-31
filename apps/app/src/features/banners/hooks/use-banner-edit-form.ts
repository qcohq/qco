"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { bannerEditFormSchema } from "@qco/validators";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import type { z } from "zod";
import { useTRPC } from "~/trpc/react";

export type BannerEditFormData = z.infer<typeof bannerEditFormSchema>;

// TODO: Использовать тип из схемы пропсов хука редактирования баннера, если появится в @qco/validators
interface UseBannerEditFormProps {
  bannerId: string;
}

/**
 * Хук для работы с формой редактирования баннера
 */
export function useBannerEditForm({ bannerId }: UseBannerEditFormProps) {
  const router = useRouter();
  const trpc = useTRPC();
  const queryClient = useQueryClient();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Получаем данные баннера
  const bannerQueryOptions = trpc.banners.getById.queryOptions({
    id: bannerId,
  });
  const { data: banner, isLoading } = useQuery(bannerQueryOptions);

  // Инициализация формы с валидацией через Zod
  const form = useForm({
    resolver: zodResolver(bannerEditFormSchema),
    defaultValues: {
      id: banner?.id || "",
      title: banner?.title || "",
      description: banner?.description || "",
      link: banner?.link || "",
      linkText: banner?.linkText || "",
      isActive: banner?.isActive ?? true,
      isFeatured: banner?.isFeatured ?? false,
      position: banner?.position || "",
      page: banner?.page || "",
      sortOrder: banner?.sortOrder ?? 0,
      categoryId: banner?.categoryId || "",
      files: [],
      isUploading: false,
    },
  });

  // Обновляем значения формы при получении данных баннера
  React.useEffect(() => {
    if (banner) {
      form.reset({
        id: banner.id,
        title: banner.title || "",
        description: banner.description || "",
        link: banner.link || "",
        linkText: banner.buttonText || "",
        isActive: banner.isActive ?? true,
        isFeatured: banner.isFeatured ?? false,
        position: banner.position || "",
        page: banner.page || "",
        sortOrder: banner.sortOrder ?? 0,
        categoryId: banner.categoryId || "",
        files: banner.files?.map((file) => ({
          fileId: file.fileId,
          type: file.type,
          order: file.order || 0,
          meta: {
            name: file.file?.name,
            mimeType: file.file?.mimeType,
            size: file.file?.size,
          },
        })) || [],
        isUploading: false,
      });
    }
  }, [banner, form]);

  // Отслеживаем состояние загрузки файлов
  const isUploading = form.watch("isUploading");

  // Создаем опции мутации для обновления баннера
  const updateBannerMutationOptions = trpc.banners.update.mutationOptions({
    onSuccess: () => {
      toast.success("Баннер успешно обновлен");
      // Инвалидируем кеш запросов баннеров
      queryClient.invalidateQueries({
        queryKey: trpc.banners.getAll.queryKey(),
      });
      queryClient.invalidateQueries({
        queryKey: trpc.banners.getById.queryKey({ id: bannerId }),
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

  // Обработчик отправки формы
  const onSubmit = (data: BannerEditFormData) => {
    setIsSubmitting(true);
    try {
      // Формируем массив файлов для API - всегда передаем массив
      const files = data.files || [];
      console.log("Данные формы для обновления:", data);
      console.log("Файлы для обновления:", files);

      // Вызываем мутацию для обновления баннера
      updateBanner({
        id: bannerId,
        title: data.title,
        description: data.description,
        link: data.link,
        buttonText: data.linkText,
        isActive: data.isActive,
        isFeatured: data.isFeatured,
        position: data.position,
        page: data.page || undefined, // Используем page везде
        sortOrder: data.sortOrder,
        categoryId: data.categoryId || undefined,
        files: files.map((file) => ({
          fileId: file.fileId,
          type: file.type,
          order: file.order || 0,
        })),
      });
    } catch (error) {
      setIsSubmitting(false);
      console.error("Ошибка при отправке формы:", error);
    }
  };

  // Функция для получения файла по типу
  const getFileByType = (type: string) => {
    const file = banner?.files?.find((f) => f.type === type);
    if (!file || !file.url) return null; // Возвращаем null если файл не найден или нет URL

    return {
      key: file.fileId,
      url: file.url,
      name: file.file?.name,
      mimeType: file.file?.mimeType,
      size: file.file?.size,
    };
  };

  return {
    form,
    banner,
    isLoading,
    isUploading,
    isSubmitting,
    isPending,
    onSubmit: form.handleSubmit(onSubmit),
    getFileByType,
  };
}
