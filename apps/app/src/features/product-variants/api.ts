import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { useTRPC } from "~/trpc/react";
import type { ProductAttribute, ProductVariant } from "./types";

/**
 * Хук для получения вариантов продукта
 */
export function useProductVariants(productId: string) {
  const trpc = useTRPC();

  // Создаем опции запроса с помощью queryOptions
  const variantsQueryOptions = trpc.productVariants.getVariants.queryOptions({
    productId,
  });

  // Используем опции с useQuery
  const result = useQuery(variantsQueryOptions);

  return {
    variants: (result.data as ProductVariant[] | undefined) ?? [],
    isLoading: result.isLoading,
    isError: result.isError,
    error: result.error instanceof Error ? result.error : null,
    refetch: result.refetch,
  };
}

/**
 * Хук для получения опций продукта
 */
export function useProductOptions(productId: string) {
  const trpc = useTRPC();

  // Создаем опции запроса с помощью queryOptions
  const optionsQueryOptions = trpc.productVariants.getOptions.queryOptions({
    productId,
  });

  // Используем опции с useQuery
  const result = useQuery(optionsQueryOptions);

  return {
    options: (result.data as ProductAttribute[] | undefined) ?? [],
    isLoading: result.isLoading,
    isError: result.isError,
    error: result.error instanceof Error ? result.error : null,
    refetch: result.refetch,
  };
}

/**
 * Хук для создания опции продукта
 */
export function useCreateOption() {
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  // Создаем опции мутации с помощью mutationOptions
  const createOptionMutationOptions =
    trpc.productVariants.createOption.mutationOptions({
      onSuccess: () => {
        // Инвалидируем кэш опций
        void queryClient.invalidateQueries({
          queryKey: trpc.productVariants.getOptions.queryKey(),
        });
      },
    });

  // Используем опции с useMutation
  const result = useMutation(createOptionMutationOptions);

  return {
    createOption: result.mutate,
    isLoading: result.isPending,
    isError: result.isError,
    error: result.error instanceof Error ? result.error : null,
    reset: result.reset,
  };
}

/**
 * Хук для обновления опции продукта
 */
export function useUpdateOption() {
  const trpc = useTRPC();

  // Создаем опции мутации с помощью mutationOptions
  const updateOptionMutationOptions =
    trpc.productVariants.updateOption.mutationOptions();

  // Используем опции с useMutation
  const result = useMutation(updateOptionMutationOptions);

  return {
    updateOption: result.mutate,
    isLoading: result.isPending,
    isError: result.isError,
    error: result.error instanceof Error ? result.error : null,
    reset: result.reset,
  };
}

/**
 * Хук для удаления опции продукта
 */
export function useDeleteOption() {
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  // Создаем опции мутации с помощью mutationOptions
  const deleteOptionMutationOptions =
    trpc.productVariants.deleteOption.mutationOptions({
      onSuccess: () => {
        // Инвалидируем кэш опций и вариантов
        void queryClient.invalidateQueries({
          queryKey: trpc.productVariants.getOptions.queryKey(),
        });
        void queryClient.invalidateQueries({
          queryKey: trpc.productVariants.getVariants.queryKey(),
        });
      },
    });

  // Используем опции с useMutation
  const result = useMutation(deleteOptionMutationOptions);

  return {
    deleteOption: result.mutate,
    isLoading: result.isPending,
    isError: result.isError,
    error: result.error instanceof Error ? result.error : null,
    reset: result.reset,
  };
}

/**
 * Хук для добавления значения опции
 */
export function useAddOptionValue() {
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  // Создаем опции мутации с помощью mutationOptions
  const addOptionValueMutationOptions =
    trpc.productVariants.addOptionValue.mutationOptions({
      onSuccess: () => {
        // Инвалидируем кэш опций
        void queryClient.invalidateQueries({
          queryKey: trpc.productVariants.getOptions.queryKey(),
        });
      },
    });

  // Используем опции с useMutation
  const result = useMutation(addOptionValueMutationOptions);

  return {
    addOptionValue: result.mutate,
    isLoading: result.isPending,
    isError: result.isError,
    error: result.error instanceof Error ? result.error : null,
    reset: result.reset,
  };
}

/**
 * Хук для удаления значения опции
 */
export function useDeleteOptionValue() {
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  // Создаем опции мутации с помощью mutationOptions
  const deleteOptionValueMutationOptions =
    trpc.productVariants.deleteOptionValue.mutationOptions({
      onSuccess: () => {
        // Инвалидируем кэш опций и вариантов
        void queryClient.invalidateQueries({
          queryKey: trpc.productVariants.getOptions.queryKey(),
        });
        void queryClient.invalidateQueries({
          queryKey: trpc.productVariants.getVariants.queryKey(),
        });
      },
    });

  // Используем опции с useMutation
  const result = useMutation(deleteOptionValueMutationOptions);

  return {
    deleteOptionValue: result.mutate,
    isLoading: result.isPending,
    isError: result.isError,
    error: result.error instanceof Error ? result.error : null,
    reset: result.reset,
  };
}

/**
 * Хук для создания варианта продукта
 */
export function useCreateVariant() {
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  // Создаем опции мутации с помощью mutationOptions
  const createVariantMutationOptions =
    trpc.productVariants.createVariant.mutationOptions({
      onSuccess: () => {
        // Инвалидируем кэш вариантов
        void queryClient.invalidateQueries({
          queryKey: trpc.productVariants.getVariants.queryKey(),
        });
      },
    });

  // Используем опции с useMutation
  const result = useMutation(createVariantMutationOptions);

  return {
    createVariant: result.mutate,
    isLoading: result.isPending,
    isError: result.isError,
    error: result.error instanceof Error ? result.error : null,
    reset: result.reset,
  };
}

/**
 * Хук для обновления варианта продукта
 */
export function useUpdateVariant() {
  const trpc = useTRPC();

  // Создаем опции мутации с помощью mutationOptions
  const updateVariantMutationOptions =
    trpc.productVariants.updateVariant.mutationOptions();

  // Используем опции с useMutation
  const result = useMutation(updateVariantMutationOptions);

  return {
    updateVariant: result.mutate,
    isLoading: result.isPending,
    isError: result.isError,
    error: result.error instanceof Error ? result.error : null,
    reset: result.reset,
  };
}

/**
 * Хук для удаления варианта продукта
 */
export function useDeleteVariant() {
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  // Создаем опции мутации с помощью mutationOptions
  const deleteVariantMutationOptions =
    trpc.productVariants.deleteVariant.mutationOptions({
      onSuccess: () => {
        // Инвалидируем кэш вариантов
        void queryClient.invalidateQueries({
          queryKey: trpc.productVariants.getVariants.queryKey(),
        });
      },
    });

  // Используем опции с useMutation
  const result = useMutation(deleteVariantMutationOptions);

  return {
    deleteVariant: result.mutate,
    isLoading: result.isPending,
    isError: result.isError,
    error: result.error instanceof Error ? result.error : null,
    reset: result.reset,
  };
}

/**
 * Хук для генерации всех возможных вариантов продукта
 */
export function useGenerateVariants() {
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  // Создаем опции мутации с помощью mutationOptions
  const generateVariantsMutationOptions =
    trpc.productVariants.generateVariants.mutationOptions({
      onSuccess: () => {
        // Инвалидируем кэш вариантов
        void queryClient.invalidateQueries({
          queryKey: trpc.productVariants.getVariants.queryKey(),
        });
      },
    });

  // Используем опции с useMutation
  const result = useMutation(generateVariantsMutationOptions);

  return {
    generateVariants: result.mutate,
    isLoading: result.isPending,
    isError: result.isError,
    error: result.error instanceof Error ? result.error : null,
    reset: result.reset,
  };
}
