import { useQuery } from "@tanstack/react-query";
import { useTRPC } from "~/trpc/react";
import type { BlogFilters } from "../types";

export function useBlogPosts(filters: BlogFilters = {}) {
  const trpc = useTRPC();

  const queryOptions = trpc.blog.getAll.queryOptions({
    page: filters.page || 1,
    limit: filters.limit || 20,
    search: filters.search,
    status: filters.status,
    type: filters.type,
    authorId: filters.authorId,
    categoryId: filters.categoryId,
    tagId: filters.tagId,
    sortBy: filters.sortBy || "createdAt",
    sortOrder: filters.sortOrder || "desc",
  });

  const { data, isPending, error, refetch } = useQuery(queryOptions);

  return {
    posts: data?.posts || [],
    totalCount: data?.totalCount || 0,
    totalPages: data?.totalPages || 0,
    currentPage: data?.page || 1,
    isLoading: isPending,
    error,
    refetch,
  };
}

export function useBlogPost(id: string) {
  const trpc = useTRPC();

  const queryOptions = trpc.blog.getById.queryOptions({ id });

  const { data, isLoading, error, refetch } = useQuery(queryOptions);

  return {
    post: data,
    isLoading,
    error,
    refetch,
  };
}

export function useBlogPostBySlug(slug: string) {
  const trpc = useTRPC();

  const queryOptions = trpc.blog.getBySlug.queryOptions({ slug });

  const { data, isLoading, error, refetch } = useQuery(queryOptions);

  return {
    post: data,
    isLoading,
    error,
    refetch,
  };
}
