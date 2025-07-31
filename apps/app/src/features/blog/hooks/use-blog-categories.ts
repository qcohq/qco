import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useTRPC } from "~/trpc/react";

export function useBlogCategories(filters?: {
  search?: string;
  isActive?: boolean;
  parentId?: string;
  page?: number;
  limit?: number;
  sortBy?: "name" | "sortOrder" | "createdAt" | "updatedAt";
  sortOrder?: "asc" | "desc";
}) {
  const trpc = useTRPC();

  const queryOptions = trpc.blog.getCategories.queryOptions(filters || {});

  const { data, isPending, error, refetch } = useQuery(queryOptions);

  return {
    categories: data?.categories || [],
    totalCount: data?.totalCount || 0,
    isLoading: isPending,
    error,
    refetch,
  };
}

export function useBlogCategory(id: string) {
  const trpc = useTRPC();

  const queryOptions = trpc.blog.getCategoryById.queryOptions({ id });

  const { data, isPending, error, refetch } = useQuery(queryOptions);

  return {
    category: data?.category,
    isLoading: isPending,
    error,
    refetch,
  };
}

export function useCreateBlogCategory() {
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  const mutationOptions = trpc.blog.createCategory.mutationOptions({
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: trpc.blog.getCategories.queryKey(),
      });
    },
  });

  return useMutation(mutationOptions);
}

export function useUpdateBlogCategory() {
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  const mutationOptions = trpc.blog.updateCategory.mutationOptions({
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: trpc.blog.getCategories.queryKey(),
      });
      queryClient.invalidateQueries({
        queryKey: trpc.blog.getCategoryById.queryKey({ id: data.id }),
      });
    },
  });

  return useMutation(mutationOptions);
}

export function useDeleteBlogCategory() {
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  const mutationOptions = trpc.blog.deleteCategory.mutationOptions({
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: trpc.blog.getCategories.queryKey(),
      });
    },
  });

  return useMutation(mutationOptions);
}
