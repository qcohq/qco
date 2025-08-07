import { useQuery } from "@tanstack/react-query";
import { useTRPC } from "@/trpc/react";

export function useProductAttributes(slug?: string) {
    const trpc = useTRPC();

    // Используем useQuery только если slug определен
    const { data, isPending, error, refetch } = useQuery({
        ...trpc.products.getAttributes.queryOptions({ slug: slug || "" }),
        enabled: !!slug, // Запрос выполняется только если slug не пустой
    });

    return {
        attributes: data || [],
        isLoading: isPending,
        error,
        refetch,
    };
} 