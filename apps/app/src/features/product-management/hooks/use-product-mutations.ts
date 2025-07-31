"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "@qco/ui/hooks/use-toast";
import { useTRPC } from "~/trpc/react";
import type { ProductCreateInput, ProductUpdateInput } from "@qco/validators";

export function useProductMutations() {
    const trpc = useTRPC();
    const queryClient = useQueryClient();

    // Мутация создания продукта
    const createProductMutationOptions = trpc.products.create.mutationOptions({
        onSuccess: (data) => {
            // Инвалидируем кэш списка товаров
            void queryClient.invalidateQueries({
                queryKey: trpc.products.list.queryKey(),
            });

            toast({
                title: "Успех",
                description: `Товар "${data.name}" успешно создан`,
            });
        },
        onError: (error) => {
            toast({
                title: "Ошибка",
                description: error.message || "Не удалось создать товар",
                variant: "destructive",
            });
        },
    });

    // Мутация обновления продукта
    const updateProductMutationOptions = trpc.products.update.mutationOptions({
        onSuccess: (data) => {
            // Инвалидируем кэш списка товаров и конкретного товара
            void queryClient.invalidateQueries({
                queryKey: trpc.products.list.queryKey(),
            });
            void queryClient.invalidateQueries({
                queryKey: trpc.products.getById.queryKey({ id: data.id }),
            });

            toast({
                title: "Успех",
                description: `Товар "${data.name}" успешно обновлен`,
            });
        },
        onError: (error) => {
            toast({
                title: "Ошибка",
                description: error.message || "Не удалось обновить товар",
                variant: "destructive",
            });
        },
    });

    // Мутация удаления продукта
    const deleteProductMutationOptions = trpc.products.delete.mutationOptions({
        onSuccess: (data) => {
            // Инвалидируем кэш списка товаров
            void queryClient.invalidateQueries({
                queryKey: trpc.products.list.queryKey(),
            });

            toast({
                title: "Успех",
                description: `Товар "${data.name}" успешно удален`,
            });
        },
        onError: (error) => {
            toast({
                title: "Ошибка",
                description: error.message || "Не удалось удалить товар",
                variant: "destructive",
            });
        },
    });

    // Мутация дублирования продукта
    const duplicateProductMutationOptions = trpc.products.duplicate.mutationOptions({
        onSuccess: (data) => {
            // Инвалидируем кэш списка товаров
            void queryClient.invalidateQueries({
                queryKey: trpc.products.list.queryKey(),
            });

            toast({
                title: "Успех",
                description: `Товар "${data.name}" успешно продублирован`,
            });
        },
        onError: (error) => {
            toast({
                title: "Ошибка",
                description: error.message || "Не удалось продублировать товар",
                variant: "destructive",
            });
        },
    });

    // Используем мутации с хуками
    const createProduct = useMutation(createProductMutationOptions);
    const updateProduct = useMutation(updateProductMutationOptions);
    const deleteProduct = useMutation(deleteProductMutationOptions);
    const duplicateProduct = useMutation(duplicateProductMutationOptions);

    return {
        createProduct,
        updateProduct,
        deleteProduct,
        duplicateProduct,
    };
}
