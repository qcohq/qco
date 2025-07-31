import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { paths } from "~/routes/paths";
import { useTRPC } from "~/trpc/react";

// Хук для получения списка брендов
export function useBrandsList(page = 1, limit = 12) {
  const trpc = useTRPC();

  const brandsQueryOptions = trpc.brands.getAll.queryOptions({
    page,
    limit,
  });

  return useQuery(brandsQueryOptions);
}

// Хук для получения бренда по ID
export function useBrandById(id: string) {
  const trpc = useTRPC();

  const brandQueryOptions = trpc.brands.getById.queryOptions({ id });

  return useQuery(brandQueryOptions);
}

// Хук для получения бренда по slug
export function useBrandBySlug(slug: string) {
  const trpc = useTRPC();

  const brandQueryOptions = trpc.brands.getBySlug.queryOptions({ slug });

  return useQuery(brandQueryOptions);
}

// Хук для получения брендов для селекта
export function useBrandsForSelect() {
  const trpc = useTRPC();

  const brandsQueryOptions = trpc.brands.getBrandsForSelect.queryOptions({
    limit: 1000,
  });

  return useQuery(brandsQueryOptions);
}

// Хук для создания бренда
export function useCreateBrand() {
  const router = useRouter();
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  const createBrandMutationOptions = trpc.brands.create.mutationOptions({
    onSuccess: async (data) => {
      toast.success("Бренд создан", {
        description: `Бренд "${data.name}" успешно создан`,
      });

      router.push(paths.brands.root);

      await queryClient.invalidateQueries({
        queryKey: trpc.brands.getAll.queryKey(),
      });
      await queryClient.invalidateQueries({
        queryKey: trpc.brands.getBrandsForSelect.queryKey(),
      });
    },
    onError: (error) => {
      let message = "Произошла ошибка при создании бренда.";

      if (
        error.message.includes(
          "duplicate key value violates unique constraint",
        ) &&
        error.message.includes("brands_slug_unique")
      ) {
        message =
          "Бренд с таким слагом уже существует. Пожалуйста, выберите другой.";
      } else {
        message = error.message;
      }

      toast.error("Ошибка", {
        description: message,
      });
    },
  });

  return useMutation(createBrandMutationOptions);
}

// Хук для обновления бренда
export function useUpdateBrand() {
  const router = useRouter();
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  const updateBrandMutationOptions = trpc.brands.update.mutationOptions({
    onSuccess: (data) => {
      toast.success("Бренд обновлен", {
        description: `Бренд "${data.name}" успешно обновлен`,
      });

      router.push(paths.brands.root);

      queryClient.invalidateQueries({
        queryKey: trpc.brands.getAll.queryKey(),
      });
    },
    onError: (error) => {
      toast.error("Ошибка", {
        description: error.message || "Не удалось обновить бренд",
      });
    },
  });

  return useMutation(updateBrandMutationOptions);
}

// Хук для удаления бренда
export function useDeleteBrand() {
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  const deleteBrandMutationOptions = trpc.brands.delete.mutationOptions({
    onSuccess: () => {
      toast.success("Бренд удален", {
        description: "Бренд был успешно удален из системы",
      });

      queryClient.invalidateQueries({
        queryKey: trpc.brands.getAll.queryKey(),
      });
    },
    onError: (error) => {
      toast.error("Ошибка", {
        description: error.message || "Не удалось удалить бренд",
      });
    },
  });

  return useMutation(deleteBrandMutationOptions);
}
