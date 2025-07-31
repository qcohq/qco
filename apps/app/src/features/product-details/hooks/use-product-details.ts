"use client";

import { useTRPC } from "@/trpc/react";
import { useQuery } from "@tanstack/react-query";
import type { ProductDetailsProps } from "../types";

export function useProductDetails(productId: string) {
    const trpc = useTRPC();

    const productQueryOptions = trpc.products.getById.queryOptions({ id: productId });
    const { data, isPending, error } = useQuery(productQueryOptions);

    return {
        product: data as ProductDetailsProps["product"] | undefined,
        isLoading: isPending,
        error,
    };
} 