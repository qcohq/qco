"use client";

import { Button } from "@qco/ui/components/button";
import { Checkbox } from "@qco/ui/components/checkbox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@qco/ui/components/dialog";
import { Input } from "@qco/ui/components/input";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@qco/ui/components/pagination";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@qco/ui/components/select";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@qco/ui/components/tabs";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  ArrowDown,
  ArrowUp,
  ArrowUpDown,
  Plus,
  Search,
  Trash2,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { useTRPC } from "~/trpc/react";

import { BrandListItem } from "./brand-list-item";
import { BrandsTableSkeleton } from "./brands-table-skeleton";
import { EmptyBrandsState } from "./empty-brands-state";

export function BrandsList() {
  const router = useRouter();
  const trpc = useTRPC();
  const queryClient = useQueryClient();
  const [searchQuery, setSearchQuery] = useState("");
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [brandToDelete, setBrandToDelete] = useState<string | null>(null);
  const [brandNameToDelete, setBrandNameToDelete] = useState<string | null>(
    null,
  );
  const [isBulkDeleteDialogOpen, setIsBulkDeleteDialogOpen] = useState(false);
  const [selectedBrands, setSelectedBrands] = useState<Set<string>>(new Set());

  const [activeTab, setActiveTab] = useState("all");

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(12);

  // Sorting state
  const [sortBy, setSortBy] = useState<
    "name" | "createdAt" | "updatedAt" | "isActive" | "isFeatured"
  >("name");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");

  // Создаем опции запроса с помощью queryOptions
  const brandsQueryOptions = trpc.brands.getAll.queryOptions({
    page: currentPage,
    limit: itemsPerPage,
    sortBy,
    sortOrder,
  });

  // Используем опции с хуком useQuery
  const { data, isPending } = useQuery(brandsQueryOptions);

  const brandsData = data?.items ?? [];
  const totalItems = data?.meta.total ?? 0;
  const totalPages = data?.meta.pageCount ?? 1;

  // Создаем опции мутации с помощью mutationOptions для удаления бренда
  const deleteBrandMutationOptions = trpc.brands.delete.mutationOptions({
    onSuccess: () => {
      setIsDeleteDialogOpen(false);
      setBrandToDelete(null);
      setBrandNameToDelete(null);

      // Инвалидируем кэш запроса брендов
      void queryClient.invalidateQueries({
        queryKey: trpc.brands.getAll.queryKey(),
      });

      toast("Бренд удален", {
        description: "Бренд был успешно удален из системы",
      });
    },
    onError: (error: { message?: string }) => {
      toast("Ошибка", {
        description: error.message ?? "Не удалось удалить бренд",
        className: "bg-destructive text-destructive-foreground",
      });
    },
  });

  // Используем опции с хуком useMutation
  const deleteBrandMutation = useMutation(deleteBrandMutationOptions);

  // Создаем опции мутации с помощью mutationOptions для массового удаления брендов
  const bulkDeleteBrandsMutationOptions =
    trpc.brands.bulkDelete.mutationOptions({
      onSuccess: (data) => {
        setIsBulkDeleteDialogOpen(false);
        setSelectedBrands(new Set());

        // Инвалидируем кэш запроса брендов
        void queryClient.invalidateQueries({
          queryKey: trpc.brands.getAll.queryKey(),
        });

        toast("Бренды удалены", {
          description: data.message,
        });
      },
      onError: (error: { message?: string }) => {
        toast("Ошибка", {
          description: error.message ?? "Не удалось удалить бренды",
          className: "bg-destructive text-destructive-foreground",
        });
      },
    });

  // Используем опции с хуком useMutation
  const bulkDeleteBrandsMutation = useMutation(bulkDeleteBrandsMutationOptions);

  // Создаем опции мутации с помощью mutationOptions для переключения избранного
  const toggleFavoriteMutationOptions = trpc.brands.update.mutationOptions({
    onSuccess: () => {
      // Инвалидируем кэш запроса брендов
      void queryClient.invalidateQueries({
        queryKey: trpc.brands.getAll.queryKey(),
      });
    },
    onError: (error: { message?: string }) => {
      toast("Ошибка", {
        description: error.message ?? "Не удалось обновить статус избранного",
        className: "bg-destructive text-destructive-foreground",
      });
    },
  });

  // Используем опции с хуком useMutation
  const toggleFavoriteMutation = useMutation(toggleFavoriteMutationOptions);

  // Filter brands based on search query and active tab
  const getFilteredBrands = () => {
    if (!brandsData || !Array.isArray(brandsData)) return [];

    let filtered = brandsData.filter(
      (brand) =>
        brand.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (brand.description ?? "")
          .toLowerCase()
          .includes(searchQuery.toLowerCase()),
    );

    // Apply tab filters
    switch (activeTab) {
      case "favorites":
        filtered = filtered.filter((brand) => brand.isFeatured ?? false);
        break;
      case "active":
        filtered = filtered.filter((brand) => brand.isActive ?? false);
        break;
      case "inactive":
        filtered = filtered.filter((brand) => !(brand.isActive ?? false));
        break;
      // "all" tab shows everything
    }

    return filtered;
  };

  const filteredBrands = getFilteredBrands();

  // Используем отфильтрованные бренды напрямую, так как пагинация происходит на бэкенде
  const currentBrands = filteredBrands;

  // Pagination logic
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    setSelectedBrands(new Set()); // Очищаем выбор при смене страницы
    // Scroll to top when changing pages
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleItemsPerPageChange = (value: string) => {
    setItemsPerPage(Number(value));
    setCurrentPage(1); // Reset to first page when changing items per page
    setSelectedBrands(new Set()); // Очищаем выбор при изменении количества элементов
  };

  const handleDeleteBrand = (brandId: string) => {
    deleteBrandMutation.mutate({ id: brandId });
  };

  const openDeleteDialog = (brandId: string, brandName: string) => {
    setBrandToDelete(brandId);
    setBrandNameToDelete(brandName);
    setIsDeleteDialogOpen(true);
  };

  const handleToggleFavorite = (brandId: string) => {
    const brand = brandsData.find((b) => b.id === brandId);
    if (brand) {
      toggleFavoriteMutation.mutate({
        id: brandId,
        isFeatured: !brand.isFeatured,
      });

      toast(
        brand.isFeatured ? "Удалено из избранного" : "Добавлено в избранное",
        {
          description: `Бренд "${brand.name}" ${brand.isFeatured ? "удален из избранного" : "добавлен в избранное"}`,
        },
      );
    }
  };

  const handleEditBrand = (brandId: string) => {
    router.push(`/brands/edit/${brandId}`);
  };

  // Функции для массового удаления
  const handleSelectBrand = (brandId: string, checked: boolean) => {
    const newSelected = new Set(selectedBrands);
    if (checked) {
      newSelected.add(brandId);
    } else {
      newSelected.delete(brandId);
    }
    setSelectedBrands(newSelected);
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedBrands(new Set(currentBrands.map((brand) => brand.id)));
    } else {
      setSelectedBrands(new Set());
    }
  };

  const handleBulkDelete = () => {
    if (selectedBrands.size === 0) return;
    bulkDeleteBrandsMutation.mutate({ ids: Array.from(selectedBrands) });
  };

  const isAllSelected =
    currentBrands.length > 0 && selectedBrands.size === currentBrands.length;
  const _isIndeterminate =
    selectedBrands.size > 0 && selectedBrands.size < currentBrands.length;

  // Функция для обработки сортировки
  const handleSort = (field: typeof sortBy) => {
    if (sortBy === field) {
      // Если уже сортируем по этому полю, меняем порядок
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      // Если новое поле, устанавливаем его с порядком по возрастанию
      setSortBy(field);
      setSortOrder("asc");
    }
    setSelectedBrands(new Set()); // Очищаем выбор при изменении сортировки
  };

  // Компонент для отображения иконки сортировки
  const SortIcon = ({ field }: { field: typeof sortBy }) => {
    if (sortBy !== field) {
      return <ArrowUpDown className="ml-2 h-3.5 w-3.5 text-muted-foreground" />;
    }
    return sortOrder === "asc" ? (
      <ArrowUp className="ml-2 h-3.5 w-3.5 text-primary" />
    ) : (
      <ArrowDown className="ml-2 h-3.5 w-3.5 text-primary" />
    );
  };

  // Generate pagination items
  const generatePaginationItems = () => {
    const items = [];
    const maxVisiblePages = 5; // Show 5 pages by default

    // Always show first page
    items.push(
      <PaginationItem key="first">
        <PaginationLink
          onClick={() => handlePageChange(1)}
          isActive={currentPage === 1}
        >
          1
        </PaginationLink>
      </PaginationItem>,
    );

    // Calculate range of pages to show
    const startPage = Math.max(
      2,
      currentPage - Math.floor(maxVisiblePages / 2),
    );
    const endPage = Math.min(totalPages - 1, startPage + maxVisiblePages - 3);

    // Adjust if we're near the beginning
    if (startPage > 2) {
      items.push(
        <PaginationItem key="ellipsis-start">
          <PaginationEllipsis />
        </PaginationItem>,
      );
    }

    // Add middle pages
    for (let i = startPage; i <= endPage; i++) {
      items.push(
        <PaginationItem key={i}>
          <PaginationLink
            onClick={() => handlePageChange(i)}
            isActive={currentPage === i}
          >
            {i}
          </PaginationLink>
        </PaginationItem>,
      );
    }

    // Add ellipsis if needed
    if (endPage < totalPages - 1) {
      items.push(
        <PaginationItem key="ellipsis-end">
          <PaginationEllipsis />
        </PaginationItem>,
      );
    }

    // Always show last page if there's more than one page
    if (totalPages > 1) {
      items.push(
        <PaginationItem key="last">
          <PaginationLink
            onClick={() => handlePageChange(totalPages)}
            isActive={currentPage === totalPages}
          >
            {totalPages}
          </PaginationLink>
        </PaginationItem>,
      );
    }

    return items;
  };

  // Handle window resize

  // Determine if we're on a small screen

  return (
    <div className="w-full">
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <div className="mb-4 flex flex-col gap-4">
          <div className="flex flex-wrap items-center gap-2">
            <TabsList className="h-9">
              <TabsTrigger value="all" className="px-3 text-xs">
                Все
              </TabsTrigger>
              <TabsTrigger value="favorites" className="px-3 text-xs">
                Избранные
              </TabsTrigger>
              <TabsTrigger value="active" className="px-3 text-xs">
                Активные
              </TabsTrigger>
              <TabsTrigger value="inactive" className="px-3 text-xs">
                Неактивные
              </TabsTrigger>
              <TabsTrigger value="pending" className="px-3 text-xs">
                Ожидающие
              </TabsTrigger>
            </TabsList>
          </div>

          <div className="flex flex-col items-start gap-3 sm:ml-auto sm:flex-row sm:items-center sm:justify-end">
            <div className="relative w-full sm:w-auto">
              <Search className="text-muted-foreground absolute top-2.5 left-2.5 h-4 w-4" />
              <Input
                type="search"
                placeholder="Поиск брендов..."
                className="w-full pl-8 sm:w-[260px]"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Button
              onClick={() => router.push("/brands/add")}
              className="w-full sm:w-auto"
            >
              <Plus className="mr-2 h-4 w-4" />
              Добавить бренд
            </Button>
          </div>
        </div>

        {/* Bulk Actions Panel */}
        {selectedBrands.size > 0 && (
          <div className="flex items-center justify-between rounded-lg border bg-muted/50 p-3">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium">
                Выбрано {selectedBrands.size} брендов
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setSelectedBrands(new Set())}
              >
                Отменить выбор
              </Button>
              <Button
                variant="destructive"
                size="sm"
                onClick={() => setIsBulkDeleteDialogOpen(true)}
                disabled={bulkDeleteBrandsMutation.isPending}
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Удалить выбранные
              </Button>
            </div>
          </div>
        )}

        <TabsContent value={activeTab} className="mt-0 space-y-4">
          {isPending ? (
            <BrandsTableSkeleton rows={itemsPerPage} />
          ) : currentBrands.length === 0 ? (
            <EmptyBrandsState />
          ) : (
            <>
              {/* Table View */}
              <div className="overflow-hidden rounded-md border">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-muted/50">
                      <tr>
                        <th className="w-[50px] px-4 py-3 text-left text-xs font-medium">
                          <Checkbox
                            checked={isAllSelected}
                            onCheckedChange={handleSelectAll}
                            aria-label="Выбрать все"
                          />
                        </th>
                        <th className="w-[60px] px-4 py-3 text-left text-xs font-medium">
                          Логотип
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium">
                          <button
                            type="button"
                            onClick={() => handleSort("name")}
                            className="flex items-center hover:text-primary transition-colors"
                          >
                            Название
                            <SortIcon field="name" />
                          </button>
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium">
                          Категории
                        </th>
                        <th className="hidden px-4 py-3 text-left text-xs font-medium md:table-cell">
                          Описание
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium">
                          <button
                            type="button"
                            onClick={() => handleSort("createdAt")}
                            className="flex items-center hover:text-primary transition-colors"
                          >
                            Дата создания
                            <SortIcon field="createdAt" />
                          </button>
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium">
                          Год основания
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium">
                          Страна
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium">
                          <button
                            type="button"
                            onClick={() => handleSort("isActive")}
                            className="flex items-center hover:text-primary transition-colors"
                          >
                            Статус
                            <SortIcon field="isActive" />
                          </button>
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium">
                          <button
                            type="button"
                            onClick={() => handleSort("isFeatured")}
                            className="flex items-center hover:text-primary transition-colors"
                          >
                            Избранное
                            <SortIcon field="isFeatured" />
                          </button>
                        </th>
                        <th className="px-4 py-3 text-right text-xs font-medium">
                          Действия
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y">
                      {currentBrands.map((brand) => (
                        <BrandListItem
                          key={brand.id}
                          brand={brand}
                          isSelected={selectedBrands.has(brand.id)}
                          onSelect={handleSelectBrand}
                          onEdit={handleEditBrand}
                          onDelete={openDeleteDialog}
                          onToggleFavorite={handleToggleFavorite}
                        />
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          )}

          {/* Pagination - only show if we have data */}
          {!isPending && currentBrands.length > 0 && (
            <div className="flex flex-col items-center justify-between gap-4 pt-4 sm:flex-row">
              <div className="text-muted-foreground order-2 flex w-full flex-col items-center gap-2 text-sm sm:order-1 sm:w-auto sm:flex-row">
                <div className="text-center sm:text-left">
                  {totalItems > 0 ? (
                    <>
                      Показано{" "}
                      {Math.min(
                        (currentPage - 1) * itemsPerPage + 1,
                        totalItems,
                      )}
                      -{Math.min(currentPage * itemsPerPage, totalItems)} из{" "}
                      {totalItems}
                    </>
                  ) : (
                    "Нет данных"
                  )}
                </div>
                <div className="flex items-center gap-1">
                  <span className="text-xs">Показывать:</span>
                  <Select
                    value={itemsPerPage.toString()}
                    onValueChange={handleItemsPerPageChange}
                  >
                    <SelectTrigger className="h-8 w-[70px]">
                      <SelectValue placeholder={itemsPerPage.toString()} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="12">12</SelectItem>
                      <SelectItem value="24">24</SelectItem>
                      <SelectItem value="36">36</SelectItem>
                      <SelectItem value="48">48</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <Pagination className="order-1 w-full sm:order-2 sm:w-auto">
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious
                      onClick={() =>
                        handlePageChange(Math.max(1, currentPage - 1))
                      }
                      aria-disabled={currentPage === 1}
                      className={
                        currentPage === 1
                          ? "pointer-events-none opacity-50"
                          : ""
                      }
                    />
                  </PaginationItem>

                  {generatePaginationItems()}

                  <PaginationItem>
                    <PaginationNext
                      onClick={() =>
                        handlePageChange(Math.min(totalPages, currentPage + 1))
                      }
                      aria-disabled={currentPage === totalPages}
                      className={
                        currentPage === totalPages
                          ? "pointer-events-none opacity-50"
                          : ""
                      }
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Удалить бренд</DialogTitle>
            <DialogDescription>
              Вы уверены, что хотите удалить бренд "{brandNameToDelete}"? Это
              действие нельзя отменить.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
            <Button
              variant="outline"
              onClick={() => setIsDeleteDialogOpen(false)}
              className="w-full sm:w-auto"
            >
              Отмена
            </Button>
            <Button
              variant="destructive"
              onClick={() => brandToDelete && handleDeleteBrand(brandToDelete)}
              className="w-full sm:w-auto"
            >
              Удалить
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Bulk Delete Confirmation Dialog */}
      <Dialog
        open={isBulkDeleteDialogOpen}
        onOpenChange={setIsBulkDeleteDialogOpen}
      >
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Массовое удаление брендов</DialogTitle>
            <DialogDescription>
              Вы уверены, что хотите удалить {selectedBrands.size} выбранных
              брендов? Это действие нельзя отменить.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
            <Button
              variant="outline"
              onClick={() => setIsBulkDeleteDialogOpen(false)}
              className="w-full sm:w-auto"
            >
              Отмена
            </Button>
            <Button
              variant="destructive"
              onClick={handleBulkDelete}
              disabled={bulkDeleteBrandsMutation.isPending}
              className="w-full sm:w-auto"
            >
              {bulkDeleteBrandsMutation.isPending ? "Удаление..." : "Удалить"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
