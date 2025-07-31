import { toast } from "@qco/ui/hooks/use-toast";
import type {
  FilterCustomersInput,
  UpdateCustomerInput,
} from "@qco/validators";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useTRPC } from "~/trpc/react";

export function useCustomerQueries(customerId: string) {
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  const customerQueryOptions = trpc.customers.getById.queryOptions({
    id: customerId,
  });
  const {
    data: customer,
    isPending: isCustomerLoading,
    error,
  } = useQuery(customerQueryOptions);

  const updateCustomerMutationOptions = trpc.customers.update.mutationOptions({
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: trpc.customers.getById.queryKey({ id: customerId }),
      });
      toast({
        title: "Клиент обновлен",
        description: `Данные клиента "${data.customer?.firstName} ${data.customer?.lastName}" успешно обновлены`,
      });
    },
    onError: (error) => {
      toast({
        title: "Ошибка",
        description: error.message || "Не удалось обновить данные клиента",
        variant: "destructive",
      });
    },
  });

  const deleteCustomerMutationOptions = trpc.customers.delete.mutationOptions({
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: trpc.customers.getAll.queryKey(),
      });
      toast({
        title: "Клиент удален",
        description: "Клиент успешно удален из системы",
      });
    },
    onError: (error) => {
      toast({
        title: "Ошибка",
        description: error.message || "Не удалось удалить клиента",
        variant: "destructive",
      });
    },
  });

  const { mutate: updateCustomer, isPending: isUpdating } = useMutation(
    updateCustomerMutationOptions,
  );
  const { mutate: deleteCustomer, isPending: isDeleting } = useMutation(
    deleteCustomerMutationOptions,
  );

  return {
    customer,
    isLoading: isCustomerLoading,
    error,
    updateCustomer: (data: UpdateCustomerInput) =>
      updateCustomer({ ...data, id: customerId }),
    deleteCustomer: () => deleteCustomer({ id: customerId }),
    isUpdating,
    isDeleting,
  };
}

export function useCustomersList(filters: FilterCustomersInput) {
  const trpc = useTRPC();

  const customersQueryOptions = trpc.customers.getAll.queryOptions(filters);
  const { data, isPending, error } = useQuery(customersQueryOptions);

  return {
    customers: data?.items ?? [],
    meta: data?.meta,
    isLoading: isPending,
    error,
  };
}
