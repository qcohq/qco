import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useTRPC } from "~/trpc/react";

export function useCreateBlogPost() {
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  const mutationOptions = trpc.blog.create.mutationOptions({
    onSuccess: () => {
      // Инвалидируем кэш запроса списка постов
      queryClient.invalidateQueries({
        queryKey: trpc.blog.getAll.queryKey(),
      });
    },
  });

  return useMutation(mutationOptions);
}

export function useUpdateBlogPost() {
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  const mutationOptions = trpc.blog.update.mutationOptions({
    onSuccess: (data) => {
      // Инвалидируем кэш запросов
      queryClient.invalidateQueries({
        queryKey: trpc.blog.getAll.queryKey(),
      });
      queryClient.invalidateQueries({
        queryKey: trpc.blog.getById.queryKey({ id: data.id }),
      });
      queryClient.invalidateQueries({
        queryKey: trpc.blog.getBySlug.queryKey({ slug: data.slug }),
      });
    },
  });

  return useMutation(mutationOptions);
}

export function useDeleteBlogPost() {
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  const mutationOptions = trpc.blog.delete.mutationOptions({
    onSuccess: () => {
      // Инвалидируем кэш запроса списка постов
      queryClient.invalidateQueries({
        queryKey: trpc.blog.getAll.queryKey(),
      });
    },
  });

  return useMutation(mutationOptions);
}
