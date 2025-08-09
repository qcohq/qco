import {
  categoryIdInputV2,
  categoryListInputV2,
  categorySlugInputV2,
} from "@qco/web-validators";
import { useQuery } from "@tanstack/react-query";
import { z } from "zod";
import { useTRPC } from "@/trpc/react";

export function useCategories(options?: {
  limit?: number;
  offset?: number;
  parentId?: string;
  includeChildren?: boolean;
}) {
  const trpc = useTRPC();
  const queryOptions = trpc.category.list.queryOptions(
    categoryListInputV2.parse({
      parentId: options?.parentId,
    }),
    {
      staleTime: 10 * 60 * 1000, // 10 minutes - увеличил с 5 до 10 минут
      gcTime: 15 * 60 * 1000, // 15 minutes - добавил gcTime
      refetchOnWindowFocus: false, // Отключаем refetch при фокусе окна
      refetchOnMount: false, // Отключаем refetch при монтировании, если данные уже есть
    },
  );

  return useQuery(queryOptions);
}

export function useCategoryById(id: string) {
  const trpc = useTRPC();
  const queryOptions = trpc.category.getById.queryOptions(
    categoryIdInputV2.parse({ id }),
    {
      staleTime: 5 * 60 * 1000, // 5 minutes
    },
  );

  return useQuery(queryOptions);
}

export function useCategoryBySlug(slug: string) {
  const trpc = useTRPC();
  const queryOptions = trpc.category.getBySlug.queryOptions(
    categorySlugInputV2.parse({ slug }),
    {
      staleTime: 5 * 60 * 1000, // 5 minutes
    },
  );

  return useQuery(queryOptions);
}

export function useCategoryMenu() {
  const trpc = useTRPC();
  const queryOptions = trpc.category.getMenu.queryOptions(undefined, {
    staleTime: 10 * 60 * 1000, // 10 minutes
  });

  return useQuery(queryOptions);
}

export function useSubcategories(parentId: string) {
  const trpc = useTRPC();

  const queryOptions = trpc.category.list.queryOptions(
    categoryListInputV2.parse({
      parentId,
    }),
    {
      staleTime: 10 * 60 * 1000, // 10 minutes - увеличил с 5 до 10 минут
      gcTime: 15 * 60 * 1000, // 15 minutes - добавил gcTime
      refetchOnWindowFocus: false, // Отключаем refetch при фокусе окна
      refetchOnMount: false, // Отключаем refetch при монтировании, если данные уже есть
      enabled: !!parentId, // Запрос выполняется только если parentId не пустой
    },
  );

  return useQuery(queryOptions);
}

export function useCategoryIds(slugs: string[]) {
  const trpc = useTRPC();
  const queryOptions = trpc.category.getCategoryIds.queryOptions(
    z.object({ slugs: z.array(z.string()) }).parse({ slugs }),
    {
      staleTime: 10 * 60 * 1000, // 10 minutes
    },
  );

  return useQuery(queryOptions);
}

export function useChildrenByParentSlug(parentSlug: string) {
  const trpc = useTRPC();
  const queryOptions = trpc.category.getChildrenByParentSlug.queryOptions(
    z.object({ parentSlug: z.string() }).parse({ parentSlug }),
    {
      staleTime: 5 * 60 * 1000, // 5 minutes
    },
  );

  return useQuery(queryOptions);
}
