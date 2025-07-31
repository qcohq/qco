"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { bannerFormSchema } from "@qco/validators";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import type { z } from "zod";
import { useTRPC } from "~/trpc/react";

export type BannerFormData = z.infer<typeof bannerFormSchema>;

/**
 * Хук для работы с формой создания баннера
 */
export function useBannerForm() {
  const router = useRouter();
  const trpc = useTRPC();
  const queryClient = useQueryClient();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Инициализация формы с валидацией через Zod
  const form = useForm({
    resolver: zodResolver(bannerFormSchema),
    defaultValues: {
      title: "",
      description: "",
      link: "",
      linkText: "",
      isActive: true,
      isFeatured: false,
      position: "",
      page: "",
      sortOrder: 0,
      categoryId: "",
      files: [],
      isUploading: false,
    },
  });

  // Отслеживаем состояние загрузки файлов
  const isUploading = form.watch("isUploading");

  // Создаем опции мутации для создания баннера
  const createBannerMutationOptions = trpc.banners.create.mutationOptions({
    onSuccess: () => {
      toast.success("Баннер успешно создан");
      // Инвалидируем кеш запросов баннеров
      void queryClient.invalidateQueries({
        queryKey: trpc.banners.getAll.queryKey(),
      });
      router.push("/banners");
    },
    onError: (error) => {
      toast.error("Ошибка при создании баннера", {
        description: error.message,
      });
    },
    onSettled: () => {
      setIsSubmitting(false);
    },
  });

  // Используем опции с хуком useMutation
  const { mutate: createBanner, isPending } = useMutation(
    createBannerMutationOptions,
  );

  // Обработчик отправки формы
  const onSubmit = (data: BannerFormData) => {
    setIsSubmitting(true);
    try {
      // Формируем массив файлов для API - всегда передаем массив
      const files = data.files || [];
      console.log("Данные формы для создания:", data);
      console.log("Файлы для создания:", files);

      // Вызываем мутацию для создания баннера
      createBanner({
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

  return {
    form,
    isUploading,
    isSubmitting,
    isPending,
    onSubmit: form.handleSubmit(onSubmit),
  };
}
