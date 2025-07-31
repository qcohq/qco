"use client";

import { Button } from "@qco/ui/components/button";
import { Skeleton } from "@qco/ui/components/skeleton";
import { useQuery } from "@tanstack/react-query";
import { TRPCClientError } from "@trpc/client";

import { useTRPC } from "~/trpc/react";
import { BannerEditForm } from "./banner-edit-form";

interface BannerEditContainerProps {
  bannerId: string;
}

export function BannerEditContainer({ bannerId }: BannerEditContainerProps) {
  const trpc = useTRPC();

  // Получаем данные баннера
  const bannerQueryOptions = trpc.banners.getById.queryOptions({
    id: bannerId,
  });
  const { data: banner, isLoading, error } = useQuery(bannerQueryOptions);

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-10 w-32" />
        </div>
        <div className="grid gap-6 md:grid-cols-2">
          <Skeleton className="h-64" />
          <Skeleton className="h-64" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center space-y-4 py-12">
        <div className="text-center">
          <h2 className="text-lg font-semibold">Ошибка загрузки баннера</h2>
          <p className="text-muted-foreground">
            {error instanceof TRPCClientError &&
            error.data?.code === "NOT_FOUND"
              ? "Баннер не найден"
              : "Не удалось загрузить данные баннера"}
          </p>
        </div>
        <Button onClick={() => window.history.back()}>Вернуться назад</Button>
      </div>
    );
  }

  if (!banner) {
    return (
      <div className="flex flex-col items-center justify-center space-y-4 py-12">
        <div className="text-center">
          <h2 className="text-lg font-semibold">Баннер не найден</h2>
          <p className="text-muted-foreground">
            Запрашиваемый баннер не существует
          </p>
        </div>
        <Button onClick={() => window.history.back()}>Вернуться назад</Button>
      </div>
    );
  }

  return <BannerEditForm banner={banner} />;
}
