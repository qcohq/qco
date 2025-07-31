import { toast } from "@qco/ui/hooks/use-toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { TRPCClientError } from "@trpc/client";
import { useRouter } from "next/navigation";
import { useTRPC } from "~/trpc/react";

export function useDuplicateProduct() {
  const trpc = useTRPC();
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation(
    trpc.products.duplicate.mutationOptions({
      onSuccess: (data) => {
        toast({
          title: "Товар дублирован",
          description: `Товар "${data.name}" успешно создан`,
        });

        // Инвалидируем кеш списка товаров
        void queryClient.invalidateQueries({
          queryKey: trpc.products.list.queryKey(),
        });

        // Перенаправляем на страницу редактирования нового товара
        void router.push(`/products/${data.id}/edit`);
      },
      onError: (error) => {
        let message = "Не удалось дублировать товар";
        if (error instanceof TRPCClientError) {
          message = error.message;
        } else if (error instanceof Error) {
          message = error.message;
        }

        toast({
          title: "Ошибка",
          description: message,
          variant: "destructive",
        });
      },
    }),
  );
}
