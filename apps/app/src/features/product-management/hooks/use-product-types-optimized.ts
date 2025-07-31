import { useQuery } from "@tanstack/react-query";
import { useMemo } from "react";
import { useTRPC } from "~/trpc/react";
import type { ProductType } from "@qco/validators";

export function useProductTypesOptimized() {
  const trpc = useTRPC();

  const productTypesQuery = useQuery({
    ...trpc.productTypes.list.queryOptions(),
    staleTime: 5 * 60 * 1000, // 5 минут
    refetchOnWindowFocus: false,
    retry: 2,
  });

  const memoizedProductTypes = useMemo(() => {
    if (!productTypesQuery.data) return [];
    return Array.isArray(productTypesQuery.data.items)
      ? productTypesQuery.data.items
      : [];
  }, [productTypesQuery.data]);

  const productTypesMap = useMemo(() => {
    return memoizedProductTypes.reduce(
      (acc, type) => {
        acc[type.id] = type;
        return acc;
      },
      {} as Record<string, ProductType>,
    );
  }, [memoizedProductTypes]);

  const getProductTypeName = (id: string) => {
    return productTypesMap[id]?.name || "Неизвестный тип";
  };

  const getSelectOptions = () => {
    return memoizedProductTypes.map((type) => ({
      value: type.id,
      label: type.name,
    }));
  };

  return {
    productTypes: memoizedProductTypes,
    productTypesMap,
    getProductTypeName,
    getSelectOptions,
    isLoading: productTypesQuery.isLoading,
    isError: productTypesQuery.isError,
    error: productTypesQuery.error,
    refetch: productTypesQuery.refetch,
  };
}
