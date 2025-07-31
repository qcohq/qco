"use client";

import { Button } from "@qco/ui/components/button";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Settings } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useTRPC } from "@/trpc/react";
import { ProductTypeForm } from "../components/product-type-form";

interface ProductTypeEditPageProps {
  id: string;
}

export function ProductTypeEditPage({ id }: ProductTypeEditPageProps) {
  const trpc = useTRPC();
  const router = useRouter();
  const queryClient = useQueryClient();

  const productTypeQueryOptions = trpc.productTypes.getById.queryOptions({
    id,
  });
  const { data: productType, isLoading } = useQuery(productTypeQueryOptions);

  const updateMutationOptions = trpc.productTypes.update.mutationOptions({
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: trpc.productTypes.list.queryKey(),
      });
      router.push("/product-types");
    },
  });
  const { mutate, isPending } = useMutation(updateMutationOptions);

  if (isLoading || !productType) return null;

  return (
    <div className="max-w-2xl mx-auto py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Редактировать тип продукта</h1>
        <Button asChild variant="outline">
          <Link href={`/product-types/${id}/attributes`}>
            <Settings className="mr-2 h-4 w-4" />
            Аттрибуты
          </Link>
        </Button>
      </div>
      <ProductTypeForm
        onSubmit={(values) => mutate({ ...values, id })}
        initialValues={{
          ...productType,
          description: productType.description || undefined,
        }}
        isEdit={true}
        isPending={isPending}
      />
    </div>
  );
}
