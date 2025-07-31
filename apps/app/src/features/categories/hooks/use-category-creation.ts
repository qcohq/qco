"use client";

import type { AppRouter, RouterOutputs } from "@qco/api";
import type { CategoryFormValues } from "@qco/validators";
import slugify from "@sindresorhus/slugify";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { TRPCClientErrorLike } from "@trpc/client";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { paths } from "~/routes/paths";
import { useTRPC } from "~/trpc/react";

export function useCategoryCreation() {
    const router = useRouter();
    const trpc = useTRPC();
    const queryClient = useQueryClient();

    // Получаем дерево категорий для выбора родительской
    const categoriesQueryOptions = trpc.categories.tree.queryOptions();
    const {
        data: categoriesData,
        isLoading: isCategoriesLoading,
        error: categoriesError,
    } = useQuery(categoriesQueryOptions);

    // Мутация для создания категории
    type CreateCategoryResult = RouterOutputs["categories"]["create"];
    type CreateCategoryError = TRPCClientErrorLike<AppRouter>;

    const createCategoryMutationOptions = trpc.categories.create.mutationOptions({
        onSuccess: (data: CreateCategoryResult) => {
            // Инвалидируем кэш списка категорий
            void queryClient.invalidateQueries({
                queryKey: trpc.categories.list.queryKey(),
            });
            // Инвалидируем кэш дерева категорий
            void queryClient.invalidateQueries({
                queryKey: trpc.categories.tree.queryKey(),
            });
            toast("Категория создана", {
                description: `Категория "${data.name}" успешно добавлена`,
            });
            router.push(paths.categories.root);
        },
        onError: (error: CreateCategoryError) => {
            // Определяем тип ошибки и показываем соответствующее сообщение
            if (error.data?.code === "CONFLICT") {
                toast("Конфликт данных", {
                    description:
                        error.message || "Категория с такими данными уже существует",
                });
            } else {
                toast("Ошибка", {
                    description: error?.message || "Не удалось создать категорию",
                });
            }
        },
    });

    const { mutate: createCategory, isPending: isCreating } = useMutation(
        createCategoryMutationOptions,
    );

    // Обработчик отправки формы
    const handleSubmit = (data: CategoryFormValues) => {
        // Если slug не указан, генерируем его из названия
        if (!data.slug) {
            data.slug = slugify(data.name);
        }

        // Преобразуем данные формы в формат, ожидаемый API
        const formattedData = {
            name: data.name,
            slug: data.slug,
            description: data.description || null,
            isActive: data.isActive,
            isFeatured: data.isFeatured,
            parentId: data.parentId || null,
            xmlId: data.xmlId || undefined,
            sortOrder: data.sortOrder,
            metaTitle: data.metaTitle || undefined,
            metaDescription: data.metaDescription || undefined,
            metaKeywords: data.metaKeywords || undefined,
            image: data.image || null,
            // Убедимся, что productTypeIds всегда является массивом
            productTypeIds: Array.isArray(data.productTypeIds) ? data.productTypeIds : [],
        };

        createCategory(formattedData);
    };

    return {
        categories: categoriesData ?? [],
        isCategoriesLoading,
        categoriesError,
        handleSubmit,
        isCreating,
    };
} 