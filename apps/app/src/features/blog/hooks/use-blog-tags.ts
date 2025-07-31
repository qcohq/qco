import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useTRPC } from "~/trpc/react";

export function useBlogTags(filters?: {
  search?: string;
  isActive?: boolean;
  page?: number;
  limit?: number;
  sortBy?: "name" | "createdAt" | "updatedAt";
  sortOrder?: "asc" | "desc";
}) {
  const trpc = useTRPC();

  const queryOptions = trpc.blog.getTags.queryOptions(filters || {});

  const { data, isPending, error, refetch } = useQuery(queryOptions);

  return {
    tags: data?.tags || [],
    totalCount: data?.totalCount || 0,
    isLoading: isPending,
    error,
    refetch,
  };
}

export function useBlogTag(id: string) {
  const trpc = useTRPC();

  const queryOptions = trpc.blog.getTagById.queryOptions({ id });

  const { data, isPending, error, refetch } = useQuery(queryOptions);

  return {
    tag: data?.tag,
    isLoading: isPending,
    error,
    refetch,
  };
}

export function useCreateBlogTag() {
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  const mutationOptions = trpc.blog.createTag.mutationOptions({
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: trpc.blog.getTags.queryKey(),
      });
    },
  });

  return useMutation(mutationOptions);
}

export function useUpdateBlogTag() {
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  const mutationOptions = trpc.blog.updateTag.mutationOptions({
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: trpc.blog.getTags.queryKey(),
      });
      queryClient.invalidateQueries({
        queryKey: trpc.blog.getTagById.queryKey({ id: data.id }),
      });
    },
  });

  return useMutation(mutationOptions);
}

export function useDeleteBlogTag() {
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  const mutationOptions = trpc.blog.deleteTag.mutationOptions({
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: trpc.blog.getTags.queryKey(),
      });
    },
  });

  return useMutation(mutationOptions);
}
