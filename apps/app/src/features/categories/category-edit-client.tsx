"use client";

import type { CategoryFormValues } from "@qco/validators";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { EditCategoryForm } from "@/features/categories/edit-category-form";

import { paths } from "~/routes/paths";
import { useTRPC } from "~/trpc/react";

// TODO: Использовать тип из схемы пропсов клиента редактирования категории, если появится в @qco/validators
interface CategoryEditClientProps {
  id: string;
}


export function CategoryEditClient({ id }: CategoryEditClientProps) {
  const router = useRouter();
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  // Получаем данные категории по ID через queryOptions
  const categoryQueryOptions = trpc.categories.getById.queryOptions({ id });
  const {
    data: category,
    isLoading: isCategoryLoading,
    error: categoryError,
  } = useQuery(categoryQueryOptions);

  // Получаем список всех категорий для выбора родительской через queryOptions
  const categoriesQueryOptions = trpc.categories.list.queryOptions({
    limit: 100,
  });
  const {
    data: categoriesData,
    isLoading: isCategoriesLoading,
    error: categoriesError,
  } = useQuery(categoriesQueryOptions);

  // Мутация для обновления категории
  const updateCategoryMutationOptions = trpc.categories.update.mutationOptions({
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: trpc.categories.list.queryKey(),
      });
      await queryClient.invalidateQueries({
        queryKey: trpc.categories.tree.queryKey(),
      });
      void queryClient.invalidateQueries({
        queryKey: trpc.categories.getById.queryKey({ id }),
      });
      toast.success("Категория обновлена", {
        description: "Категория успешно обновлена",
      });
      router.push(paths.categories.root);
    },
    onError: (error) => {
      // Определяем тип ошибки и показываем соответствующее сообщение
      if (error.data?.code === "CONFLICT") {
        toast.error("Конфликт данных", {
          description:
            error.message || "Категория с такими данными уже существует",
        });
      } else {
        toast.error("Ошибка", {
          description: error.message ?? "Не удалось обновить категорию",
        });
      }
    },
  });
  const { mutate, isPending } = useMutation(updateCategoryMutationOptions);

  // Мутация для удаления категории
  const deleteCategoryMutationOptions = trpc.categories.delete.mutationOptions({
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: trpc.categories.list.queryKey(),
      });
      await queryClient.invalidateQueries({
        queryKey: trpc.categories.tree.queryKey(),
      });
      toast.success("Категория удалена", {
        description: "Категория успешно удалена",
      });
      router.push(paths.categories.root);
    },
    onError: (error) => {
      toast.error("Ошибка", {
        description: error.message ?? "Не удалось удалить категорию",
      });
    },
  });
  const { mutate: deleteCategory, isPending: isDeleting } = useMutation(deleteCategoryMutationOptions);

  // Обработчик отправки формы
  const handleSubmit = (data: CategoryFormValues) => {
    // Убедимся, что productTypeIds всегда является массивом
    const formData = {
      ...data,
      productTypeIds: Array.isArray(data.productTypeIds) ? data.productTypeIds : [],
      id
    };
    mutate(formData);
  };

  // Обработчик удаления категории
  const handleDelete = () => {
    if (category) {
      deleteCategory({ id });
    }
  };

  const isLoading = isCategoryLoading || isCategoriesLoading || isPending;
  const hasError = !!categoryError || !!categoriesError;
  const errorMessage = categoryError
    ? "Ошибка загрузки категории"
    : categoriesError
      ? "Ошибка загрузки списка категорий"
      : "Ошибка загрузки данных";

  return (
    <div className="flex min-h-screen flex-col bg-gray-50/50">
      <EditCategoryForm
        loading={isLoading}
        category={category}
        categories={categoriesData?.items ?? []}
        onSubmit={handleSubmit}
        onDelete={handleDelete}
        isDeleting={isDeleting}
        error={hasError ? errorMessage : undefined}
      />
    </div>
  );
}
