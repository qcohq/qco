import { useQuery } from "@tanstack/react-query";
import { useTRPC } from "~/trpc/react";
import { useCustomerOrders } from "./use-customer-orders";

export function useCustomer(customerId: string) {
  const trpc = useTRPC();

  const customerQuery = trpc.customers.getById.queryOptions({ id: customerId });
  const {
    data: customer,
    isLoading: customerLoading,
    error: customerError,
  } = useQuery(customerQuery);

  // Используем новый хук для заказов
  const {
    orders: customerOrders,
    total: ordersTotal,
    hasMore: ordersHasMore,
    isLoading: ordersLoading,
    error: ordersError,
  } = useCustomerOrders(customerId);

  return {
    customer,
    customerOrders,
    ordersTotal,
    ordersHasMore,
    isLoading: customerLoading || ordersLoading,
    error: customerError || ordersError,
  };
}
