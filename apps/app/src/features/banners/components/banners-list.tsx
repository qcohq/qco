"use client";

import { Button } from "@qco/ui/components/button";
import { Checkbox } from "@qco/ui/components/checkbox";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@qco/ui/components/table";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

import { useTRPC } from "~/trpc/react";
import { BannerFilters } from "./banner-filters";
import { BannersError } from "./banners-error";
import { BannersHeader } from "./banners-header";
import { BannersPagination } from "./banners-pagination";
import { BulkDeleteBannersDialog } from "./bulk-delete-banners-dialog";
import { DeleteBannerDialog } from "./delete-banner-dialog";
import type { BannerListFromAPI } from "../types";

const PAGE_SIZE = 20;

export function BannersList() {
  const trpc = useTRPC();
  const queryClient = useQueryClient();
  const router = useRouter();
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [position, setPosition] = useState<string>("");
  const [pageFilter, setPageFilter] = useState<string>("");
  const [isActive, setIsActive] = useState<boolean | undefined>(undefined);
  const [selectedBanners, setSelectedBanners] = useState<string[]>([]);
  const [bannerToDelete, setBannerToDelete] = useState<string | null>(null);
  const [showBulkDeleteDialog, setShowBulkDeleteDialog] = useState(false);

  // Получаем данные баннеров
  const bannersQueryOptions = trpc.banners.getAll.queryOptions({
    page,
    limit: PAGE_SIZE,
    search: search || undefined,
    position: position && position !== "all" ? position : undefined,
    pageFilter: pageFilter && pageFilter !== "all" ? pageFilter : undefined,
    isActive: isActive,
  });

  const { data, isLoading, error } = useQuery(bannersQueryOptions);

  // Создаем опции мутации для удаления баннера
  const deleteBannerMutationOptions = trpc.banners.delete.mutationOptions({
    onSuccess: (_, variables) => {
      toast.success("Баннер успешно удален");
      // Инвалидируем кеш запросов баннеров
      queryClient.invalidateQueries({
        queryKey: trpc.banners.getAll.queryKey(),
      });
      setBannerToDelete(null);
      setSelectedBanners((prev) => prev.filter((id) => id !== variables.id));
    },
    onError: (error: unknown) => {
      const message =
        error instanceof Error ? error.message : "Ошибка при удалении баннера";
      toast.error("Ошибка при удалении баннера", {
        description: message,
      });
    },
  });

  // Создаем опции мутации для массового удаления баннеров
  const bulkDeleteBannersMutationOptions =
    trpc.banners.bulkDelete.mutationOptions({
      onSuccess: (data) => {
        toast.success(data.message);
        // Инвалидируем кеш запросов баннеров
        queryClient.invalidateQueries({
          queryKey: trpc.banners.getAll.queryKey(),
        });
        setShowBulkDeleteDialog(false);
        setSelectedBanners([]);
      },
      onError: (error: unknown) => {
        const message =
          error instanceof Error
            ? error.message
            : "Ошибка при массовом удалении баннеров";
        toast.error("Ошибка при массовом удалении баннеров", {
          description: message,
        });
      },
    });

  // Используем опции с хуками useMutation
  const { mutate: deleteBanner, isPending: isDeleting } = useMutation(
    deleteBannerMutationOptions,
  );
  const { mutate: bulkDeleteBanners, isPending: isBulkDeleting } = useMutation(
    bulkDeleteBannersMutationOptions,
  );

  const banners = data?.items || [];
  const totalPages = data?.pagination?.totalPages || 0;
  const totalBanners = data?.pagination?.total || 0;

  // Обработчики
  const handleSelectBanner = (bannerId: string, selected: boolean) => {
    if (selected) {
      setSelectedBanners((prev) => [...prev, bannerId]);
    } else {
      setSelectedBanners((prev) => prev.filter((id) => id !== bannerId));
    }
  };

  const handleSelectAll = () => {
    if (selectedBanners.length === banners.length) {
      setSelectedBanners([]);
    } else {
      setSelectedBanners(banners.map((banner: BannerListFromAPI) => banner.id));
    }
  };

  const _handleDeleteBanner = (bannerId: string) => {
    setBannerToDelete(bannerId);
  };

  const handleDeleteConfirm = () => {
    if (bannerToDelete) {
      deleteBanner({ id: bannerToDelete });
    }
  };

  const _handleBulkAction = async (action: string) => {
    if (selectedBanners.length === 0) {
      toast.error(
        "Необходимо выбрать хотя бы один баннер для выполнения действия",
      );
      return;
    }

    try {
      switch (action) {
        case "delete":
          setShowBulkDeleteDialog(true);
          break;
        case "activate":
          // Массовая активация - пока отключено, так как нет прямого API
          toast.info("Массовая активация пока не реализована");
          break;
        case "deactivate":
          // Массовая деактивация - пока отключено, так как нет прямого API
          toast.info("Массовая деактивация пока не реализована");
          break;
        case "feature":
          // Массовое добавление в избранное - пока отключено, так как нет прямого API
          toast.info("Массовое добавление в избранное пока не реализовано");
          break;
        case "unfeature":
          // Массовое удаление из избранного - пока отключено, так как нет прямого API
          toast.info("Массовое удаление из избранного пока не реализовано");
          break;
        case "duplicate":
          // Массовое дублирование - пока отключено, так как нет прямого API
          toast.info("Массовое дублирование пока не реализовано");
          break;
        case "export": {
          // Массовый экспорт
          const exportData = banners.filter((banner) =>
            selectedBanners.includes(banner.id),
          );
          const csvContent =
            "data:text/csv;charset=utf-8," +
            "ID,Название,Позиция,Раздел,Статус,Создан\n" +
            exportData
              .map(
                (banner) =>
                  `${banner.id},${banner.title},${banner.position},${banner.page || '-'},${banner.isActive ? "Активен" : "Неактивен"},${banner.createdAt ? new Date(banner.createdAt).toLocaleDateString('ru-RU') : '-'}`,
              )
              .join("\n");
          const encodedUri = encodeURI(csvContent);
          const link = document.createElement("a");
          link.setAttribute("href", encodedUri);
          link.setAttribute("download", "banners_export.csv");
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          toast.success(
            `${selectedBanners.length} баннеров экспортировано в CSV`,
          );
          break;
        }
        default:
          console.warn(`Неизвестное действие: ${action}`);
          return;
      }

      // Обновляем данные
      await queryClient.invalidateQueries({
        queryKey: ["banners"],
      });

      // Очищаем выбор
      setSelectedBanners([]);
    } catch (error) {
      console.error("Ошибка при выполнении массового действия:", error);
      toast.error("Произошла ошибка при выполнении действия");
    }
  };

  const handleBulkDeleteConfirm = () => {
    if (selectedBanners.length === 0) {
      toast.error("Необходимо выбрать хотя бы один баннер для удаления");
      return;
    }

    console.log("Массовое удаление баннеров:", selectedBanners);
    bulkDeleteBanners({ ids: selectedBanners });
  };

  const handleEditBanner = (bannerId: string) => {
    router.push(`/banners/${bannerId}/edit`);
  };

  if (error) {
    return <BannersError message={error.message} />;
  }

  return (
    <div className="space-y-6">
      {/* Заголовок и кнопки */}
      <BannersHeader />
      {/* Фильтры */}
      <BannerFilters
        search={search}
        position={position}
        page={pageFilter}
        isActive={isActive}
        onSearchChange={setSearch}
        onPositionChange={setPosition}
        onPageChange={setPageFilter}
        onIsActiveChange={setIsActive}
      />
      {/* Массовые действия */}
      {selectedBanners.length > 0 && (
        <div className="flex items-center gap-2 mb-2">
          <Button
            variant="destructive"
            onClick={() => setShowBulkDeleteDialog(true)}
            size="sm"
          >
            Удалить выбранные ({selectedBanners.length})
          </Button>
          <Button
            variant="outline"
            onClick={() => setSelectedBanners([])}
            size="sm"
          >
            Снять выделение
          </Button>
        </div>
      )}
      {/* Таблица баннеров */}
      <div className="border border-muted rounded-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-12">
                <Checkbox
                  checked={
                    banners.length > 0 &&
                    selectedBanners.length === banners.length
                  }
                  onCheckedChange={handleSelectAll}
                  aria-label="Выбрать все баннеры"
                />
              </TableHead>
              <TableHead className="w-16">Фото</TableHead>
              <TableHead>Название</TableHead>
              <TableHead>Позиция</TableHead>
              <TableHead>Раздел</TableHead>
              <TableHead>Категория</TableHead>
              <TableHead>Статус</TableHead>
              <TableHead>Создан</TableHead>
              <TableHead>Обновлен</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              Array.from({ length: 5 }).map((_, index) => (
                <TableRow
                  key={`banner-skeleton-${Date.now()}-${index}`}
                  className="animate-pulse"
                >
                  <TableCell>
                    <div className="h-4 w-4 rounded-sm bg-muted" />
                  </TableCell>
                  <TableCell>
                    <div className="h-10 w-10 rounded-md bg-muted" />
                  </TableCell>
                  <TableCell>
                    <div className="h-4 w-32 rounded-md bg-muted" />
                  </TableCell>
                  <TableCell>
                    <div className="h-4 w-20 rounded-md bg-muted" />
                  </TableCell>
                  <TableCell>
                    <div className="h-4 w-24 rounded-md bg-muted" />
                  </TableCell>
                  <TableCell>
                    <div className="h-4 w-24 rounded-md bg-muted" />
                  </TableCell>
                  <TableCell>
                    <div className="h-4 w-16 rounded-md bg-muted" />
                  </TableCell>
                  <TableCell>
                    <div className="h-4 w-12 rounded-md bg-muted" />
                  </TableCell>
                  <TableCell>
                    <div className="h-4 w-12 rounded-md bg-muted" />
                  </TableCell>
                </TableRow>
              ))
            ) : banners.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={9}
                  className="py-8 text-center text-muted-foreground"
                >
                  Баннеры не найдены
                </TableCell>
              </TableRow>
            ) : (
              banners.map((banner) => (
                <TableRow key={banner.id}>
                  <TableCell>
                    <Checkbox
                      checked={selectedBanners.includes(banner.id)}
                      onCheckedChange={() =>
                        handleSelectBanner(
                          banner.id,
                          !selectedBanners.includes(banner.id),
                        )
                      }
                      aria-label={`Выбрать баннер ${banner.title}`}
                    />
                  </TableCell>
                  <TableCell>
                    {banner.files?.[0]?.url ? (
                      <Image
                        src={banner.files[0].url}
                        alt={banner.files[0].altText || banner.title}
                        width={40}
                        height={40}
                        className="w-10 h-10 object-cover rounded-md border"
                      />
                    ) : (
                      <div className="w-10 h-10 bg-muted flex items-center justify-center rounded-md border text-xs text-muted-foreground">
                        Нет фото
                      </div>
                    )}
                  </TableCell>
                  <TableCell>
                    <button
                      type="button"
                      onClick={() => handleEditBanner(banner.id)}
                      className="text-left hover:text-primary hover:underline cursor-pointer transition-colors"
                    >
                      {banner.title}
                    </button>
                  </TableCell>
                  <TableCell>{banner.position}</TableCell>
                  <TableCell>{banner.page || "-"}</TableCell>
                  <TableCell>{banner.category?.name || "-"}</TableCell>
                  <TableCell>
                    {banner.isActive ? "Активен" : "Неактивен"}
                  </TableCell>
                  <TableCell>{banner.createdAt ? new Date(banner.createdAt).toLocaleDateString('ru-RU') : '-'}</TableCell>
                  <TableCell>{banner.updatedAt ? new Date(banner.updatedAt).toLocaleDateString('ru-RU') : '-'}</TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
      {/* Пагинация */}
      {totalPages > 1 && (
        <BannersPagination
          page={page}
          totalPages={totalPages}
          totalBanners={totalBanners}
          onPageChange={setPage}
        />
      )}
      {/* Диалог удаления одного баннера */}
      <DeleteBannerDialog
        isOpen={!!bannerToDelete}
        onClose={() => setBannerToDelete(null)}
        onConfirm={handleDeleteConfirm}
        bannerId={bannerToDelete}
        isDeleting={isDeleting}
      />
      {/* Диалог массового удаления баннеров */}
      <BulkDeleteBannersDialog
        isOpen={showBulkDeleteDialog}
        onClose={() => setShowBulkDeleteDialog(false)}
        onConfirm={handleBulkDeleteConfirm}
        selectedCount={selectedBanners.length}
        isDeleting={isBulkDeleting}
      />
    </div>
  );
}
