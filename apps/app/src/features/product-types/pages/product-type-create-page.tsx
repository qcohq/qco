"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useTRPC } from "@/trpc/react";
import { ProductTypeForm } from "../components/product-type-form";

export function ProductTypeCreatePage() {
  const trpc = useTRPC();
  const router = useRouter();
  const queryClient = useQueryClient();

  const createMutationOptions = trpc.productTypes.create.mutationOptions({
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: trpc.productTypes.list.queryKey(),
      });
      router.push("/product-types");
    },
  });
  const { mutate, isPending } = useMutation(createMutationOptions);

  return (
    <div className="max-w-2xl mx-auto py-8">
      <h1 className="text-2xl font-bold mb-6">Создать тип продукта</h1>
      <ProductTypeForm
        onSubmit={(values) => mutate(values)}
        isEdit={false}
        isPending={isPending}
      />
    </div>
  );
}
