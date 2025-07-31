"use client";

import { useCallback, useEffect, useState } from "react";

import { useDebounce } from "./use-debounce";

interface ApiResponse {
  data: any[];
  pagination: {
    page: number;
    limit: number;
    totalCount: number;
    totalPages: number;
    hasMore: boolean;
  };
}

interface UseSearchableDataOptions {
  apiEndpoint: string;
  limit?: number;
  search?: string;
}

export function useSearchableData({
  apiEndpoint,
  limit = 20,
  search = "",
}: UseSearchableDataOptions) {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);

  const debouncedSearch = useDebounce(search, 300);

  // Reset when search changes
  useEffect(() => {
    setData([]);
    setPage(1);
    setHasMore(true);
    setError(null);
  }, [debouncedSearch]);

  const fetchData = useCallback(
    async (pageNum: number, searchQuery: string, reset = false) => {
      // Save active element to restore focus later if needed
      const activeElement = document.activeElement;

      if (pageNum === 1) {
        setInitialLoading(true);
      } else {
        setLoading(true);
      }
      setError(null);

      try {
        const response = await fetch(
          apiEndpoint +
            `&page=${pageNum}&limit=${limit}&search=${encodeURIComponent(searchQuery)}`,
        );

        if (!response.ok) {
          throw new Error("Failed to fetch data");
        }

        const result: ApiResponse = await response.json();

        setData((prev) => (reset ? result.data : [...prev, ...result.data]));
        setHasMore(result.pagination.hasMore);
        setPage(pageNum);

        // Restore focus to the previously active element if it was an input
        if (activeElement instanceof HTMLInputElement) {
          setTimeout(() => {
            (activeElement as HTMLInputElement).focus();
          }, 0);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setLoading(false);
        setInitialLoading(false);
      }
    },
    [apiEndpoint, limit],
  );

  // Initial load and search changes
  useEffect(() => {
    fetchData(1, debouncedSearch, true);
  }, [fetchData, debouncedSearch]);

  const loadMore = useCallback(() => {
    if (!loading && hasMore) {
      fetchData(page + 1, debouncedSearch, false);
    }
  }, [fetchData, loading, hasMore, page, debouncedSearch]);

  const refresh = useCallback(() => {
    setData([]);
    setPage(1);
    setHasMore(true);
    setError(null);
    fetchData(1, debouncedSearch, true);
  }, [fetchData, debouncedSearch]);

  return {
    data,
    loading,
    initialLoading,
    error,
    hasMore,
    loadMore,
    refresh,
  };
}
