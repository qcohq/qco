import type { CustomerOrdersInput } from "@qco/validators";
import { useQuery } from "@tanstack/react-query";
import { useTRPC } from "~/trpc/react";

export function useCustomerOrders(
  customerId: string,
  filters?: Omit<CustomerOrdersInput, "customerId">,
) {
  const trpc = useTRPC();

  const queryOptions = trpc.orders.getByCustomer.queryOptions(
    {
      customerId,
      ...filters,
    },
    {
      staleTime: 5 * 60 * 1000, // 5 минут
      gcTime: 10 * 60 * 1000, // 10 минут
    },
  );

  const { data, isPending, error, refetch } = useQuery(queryOptions);

  return {
    orders: data?.orders ?? [],
    total: data?.total ?? 0,
    hasMore: data?.hasMore ?? false,
    isLoading: isPending,
    error,
    refetch,
  };
}
