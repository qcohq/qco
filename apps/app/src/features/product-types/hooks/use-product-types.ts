"use client";

import type { ProductType } from "@qco/validators";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useTRPC } from "@/trpc/react";

export function useProductTypes() {
  const trpc = useTRPC();

  const productTypesQueryOptions = trpc.productTypes.list.queryOptions();
  const { data, isPending, error } = useQuery(productTypesQueryOptions);

  return {
    productTypes: (data?.items as ProductType[]) || [],
    meta: data?.meta,
    isLoading: isPending,
    error,
  };
}

export function useProductType(id: string) {
  const trpc = useTRPC();

  const productTypeQueryOptions = trpc.productTypes.getById.queryOptions({
    id,
  });
  const { data, isPending, error } = useQuery(productTypeQueryOptions);

  return {
    productType: data as ProductType | undefined,
    isLoading: isPending,
    error,
  };
}

export function useCreateProductType() {
  const trpc = useTRPC();
  const queryClient = useQueryClient();
  const router = useRouter();

  const createMutationOptions = trpc.productTypes.create.mutationOptions({
    onSuccess: async () => {
      toast.success("Тип продукта создан успешно");
      await queryClient.invalidateQueries({
        queryKey: trpc.productTypes.list.queryKey(),
      });
      router.push("/product-types");
    },
    onError: (error: any) => {
      toast.error("Не удалось создать тип продукта", {
        description: error.message,
      });
    },
  });

  return useMutation(createMutationOptions);
}

export function useUpdateProductType() {
  const trpc = useTRPC();
  const queryClient = useQueryClient();
  const router = useRouter();

  const updateMutationOptions = trpc.productTypes.update.mutationOptions({
    onSuccess: async () => {
      toast.success("Тип продукта обновлен успешно");
      await queryClient.invalidateQueries({
        queryKey: trpc.productTypes.list.queryKey(),
      });
      router.push("/product-types");
    },
    onError: (error: any) => {
      toast.error("Не удалось обновить тип продукта", {
        description: error.message,
      });
    },
  });

  return useMutation(updateMutationOptions);
}

export function useDeleteProductType() {
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  const deleteMutationOptions = trpc.productTypes.delete.mutationOptions({
    onSuccess: async () => {
      toast.success("Тип продукта удален успешно");
      await queryClient.invalidateQueries({
        queryKey: trpc.productTypes.list.queryKey(),
      });
    },
    onError: (error: any) => {
      toast.error("Не удалось удалить тип продукта", {
        description: error.message,
      });
    },
  });

  return useMutation(deleteMutationOptions);
}
