"use client";

import type { ProductTypeAttribute } from "@/features/product-attributes/types/attribute";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useTRPC } from "@/trpc/react";

export function useProductTypeAttributes(productTypeId: string) {
  const trpc = useTRPC();

  const attributesQueryOptions = trpc.productTypeAttributes.getAll.queryOptions(
    { productTypeId },
  );
  const { data, isPending, error } = useQuery(attributesQueryOptions);

  return {
    attributes: (data as ProductTypeAttribute[]) || [],
    isLoading: isPending,
    error,
  };
}

export function useProductTypeAttribute(id: string) {
  const trpc = useTRPC();

  const attributeQueryOptions = trpc.productTypeAttributes.getById.queryOptions(
    { id },
  );
  const { data, isPending, error } = useQuery(attributeQueryOptions);

  return {
    attribute: data as ProductTypeAttribute | undefined,
    isLoading: isPending,
    error,
  };
}

export function useCreateProductTypeAttribute() {
  const trpc = useTRPC();
  const queryClient = useQueryClient();
  const router = useRouter();

  const createMutationOptions =
    trpc.productTypeAttributes.create.mutationOptions({
      onSuccess: async (data) => {
        toast.success("Атрибут создан успешно");
        // Инвалидируем запросы для конкретного типа продукта
        await queryClient.invalidateQueries({
          queryKey: trpc.productTypeAttributes.getAll.queryKey({
            productTypeId: data?.productTypeId,
          }),
        });
        await queryClient.invalidateQueries({
          queryKey: trpc.productTypeAttributes.getByProductType.queryKey({
            productTypeId: data?.productTypeId,
          }),
        });
        // Также инвалидируем общий список атрибутов
        await queryClient.invalidateQueries({
          queryKey: trpc.productTypeAttributes.getAll.queryKey(),
        });
        router.back();
      },
      onError: (error: unknown) => {
        toast.error("Не удалось создать атрибут", {
          description:
            error instanceof Error ? error.message : "Неизвестная ошибка",
        });
      },
    });

  return useMutation(createMutationOptions);
}

export function useUpdateProductTypeAttribute() {
  const trpc = useTRPC();
  const queryClient = useQueryClient();
  const router = useRouter();

  const updateMutationOptions =
    trpc.productTypeAttributes.update.mutationOptions({
      onSuccess: async (data) => {
        toast.success("Атрибут обновлен успешно");
        // Инвалидируем запросы для конкретного типа продукта
        await queryClient.invalidateQueries({
          queryKey: trpc.productTypeAttributes.getAll.queryKey({
            productTypeId: data?.productTypeId,
          }),
        });
        await queryClient.invalidateQueries({
          queryKey: trpc.productTypeAttributes.getByProductType.queryKey({
            productTypeId: data?.productTypeId,
          }),
        });
        // Также инвалидируем общий список атрибутов
        await queryClient.invalidateQueries({
          queryKey: trpc.productTypeAttributes.getAll.queryKey(),
        });
        router.back();
      },
      onError: (error: unknown) => {
        toast.error("Не удалось обновить атрибут", {
          description:
            error instanceof Error ? error.message : "Неизвестная ошибка",
        });
      },
    });

  return useMutation(updateMutationOptions);
}

export function useDeleteProductTypeAttribute() {
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  const deleteMutationOptions =
    trpc.productTypeAttributes.delete.mutationOptions({
      onSuccess: (_, _variables) => {
        toast.success("Атрибут удален успешно");
        // Инвалидируем все запросы атрибутов, так как мы не знаем productTypeId
        queryClient.invalidateQueries({
          queryKey: trpc.productTypeAttributes.getAll.queryKey(),
        });
        queryClient.invalidateQueries({
          queryKey: trpc.productTypeAttributes.getByProductType.queryKey(),
        });
      },
      onError: (error: unknown) => {
        toast.error("Не удалось удалить атрибут", {
          description:
            error instanceof Error ? error.message : "Неизвестная ошибка",
        });
      },
    });

  return useMutation(deleteMutationOptions);
}
