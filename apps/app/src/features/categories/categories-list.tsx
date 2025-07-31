"use client";

import { Button } from "@qco/ui/components/button";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@qco/ui/components/tabs";
import { useToast } from "@qco/ui/hooks/use-toast";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useMediaQuery } from "~/hooks/use-media-query";
import { paths } from "~/routes/paths";
import { useTRPC } from "~/trpc/react";
import { CategoriesStats } from "./categories-stats";
import { CategoryFilters } from "./category-filters";
import { CategoryPagination } from "./category-pagination";
import { CategoryTable } from "./category-table";
import type { CategoryTreeItem } from "./category-tree-dnd";
import { CategoryTreeDnd } from "./category-tree-dnd";
import { CategoryFolderView } from "./components/category-folder-view";
import type { CategoryWithSubcategories } from "./delete-category-dialog";
import { DeleteCategoryDialog } from "./delete-category-dialog";
import { EmptyCategories } from "./empty-categories";
import { MobileCategoryCard } from "./mobile-category-card";
import type { CategoryListItem } from "./types";

export function CategoriesList() {
  const router = useRouter();
  const isMobile = useMediaQuery("(max-width: 768px)");
  const { toast } = useToast();
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<
    "all" | "active" | "inactive"
  >("all");
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [categoryToDelete, setCategoryToDelete] =
    useState<CategoryWithSubcategories | null>(null);
  const [activeTab, setActiveTab] = useState<"all" | "tree" | "folders">(
    "folders",
  );

  const trpc = useTRPC();
  const queryClient = useQueryClient();

  // Мутация для удаления категории
  const deleteCategoryMutation = useMutation(
    trpc.categories.delete.mutationOptions({
      onSuccess: async () => {
        await queryClient.invalidateQueries({
          queryKey: trpc.categories.list.queryKey(),
        });
        await queryClient.invalidateQueries({
          queryKey: trpc.categories.tree.queryKey(),
        });
        await queryClient.invalidateQueries({
          queryKey: trpc.categories.getChildren.queryKey(),
        });

        toast({
          title: "Категория удалена",
          description: "Категория успешно удалена",
          variant: "success",
        });
      },
      onError: (error) => {
        toast({
          title: "Ошибка удаления",
          description: error.message || "Не удалось удалить категорию",
          variant: "destructive",
        });
      },
    }),
  );
  const categoriesQueryOptions = trpc.categories.list.queryOptions({
    page,
    limit,
    search: search || undefined,
    // Можно добавить фильтрацию по статусу на бэкенде, если поддерживается
  });
  const {
    data: categoriesData,
    isLoading,
    error,
  } = useQuery(categoriesQueryOptions);

  // Запрос на получение дерева категорий
  const categoryTreeQueryOptions = trpc.categories.tree.queryOptions();
  const {
    data: categoryTree,
    isLoading: isTreeLoading,
    error: treeError,
  } = useQuery(categoryTreeQueryOptions);

  // Преобразование данных с сервера к типу CategoryListItem
  const categories: CategoryListItem[] = (categoriesData?.items ?? []).map(
    (item) => ({
      id: item.id,
      name: item.name,
      slug: item.slug,
      description: item.description,
      isActive: item.isActive,
      sortOrder: item.sortOrder,
      parentId: item.parentId,
      imageId: item.imageId,
      metaTitle: item.metaTitle,
      metaDescription: item.metaDescription,
      metaKeywords: item.metaKeywords,
      xmlId: item.xmlId,
      createdAt: item.createdAt,
      updatedAt: item.updatedAt,
    }),
  );

  const pageCount = categoriesData?.meta?.pageCount ?? 1;

  // Фильтрация по статусу на клиенте (если не реализовано на сервере)
  const filteredCategories =
    statusFilter === "all"
      ? categories
      : categories.filter((category) =>
          statusFilter === "active" ? category.isActive : !category.isActive,
        );

  // Примечание: корневые категории могут понадобиться позже для реализации древовидного представления

  const handleDeleteCategory = (category: CategoryListItem) => {
    // Преобразуем Category в CategoryWithSubcategories
    const categoryWithSubcategories: CategoryWithSubcategories = {
      id: category.id,
      name: category.name,
      // Пустой массив объектов вместо массива строк
      subcategories: [],
    };
    setCategoryToDelete(categoryWithSubcategories);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async (option: "delete-all" | "move-up") => {
    if (!categoryToDelete) return;

    try {
      if (option === "delete-all") {
        // Удаляем категорию и все её подкатегории
        deleteCategoryMutation.mutate({ id: categoryToDelete.id });
      } else {
        // Перемещаем подкатегории на уровень выше (пока просто удаляем)
        // TODO: Реализовать перемещение подкатегорий в отдельном роуте
        deleteCategoryMutation.mutate({ id: categoryToDelete.id });
      }

      setDeleteDialogOpen(false);
      setCategoryToDelete(null);
    } catch (error) {
      console.error("Ошибка при удалении категории:", error);
      // Можно добавить toast уведомление об ошибке
    }
  };

  return (
    <div className="w-full max-w-none px-0 sm:px-2 md:px-6 xl:px-12 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
        <h1 className="text-2xl font-bold">Категории</h1>
        <Button onClick={() => router.push(paths.categories.new)}>
          <Plus className="mr-2 h-4 w-4" /> Добавить категорию
        </Button>
      </div>
      <CategoriesStats categories={categories} />
      <Tabs
        value={activeTab}
        onValueChange={(value) =>
          setActiveTab(value as "all" | "tree" | "folders")
        }
      >
        <TabsList className="mb-4">
          <TabsTrigger value="folders">Папки</TabsTrigger>
          <TabsTrigger value="all">Все категории</TabsTrigger>
          <TabsTrigger value="tree">Дерево категорий</TabsTrigger>
        </TabsList>
        <TabsContent value="all">
          <CategoryFilters
            searchQuery={search}
            setSearchQuery={setSearch}
            statusFilter={statusFilter}
            setStatusFilter={setStatusFilter}
          />
          {isLoading ? (
            <div className="flex h-40 items-center justify-center">
              <div className="border-primary h-8 w-8 animate-spin rounded-full border-b-2" />
            </div>
          ) : error ? (
            <div className="text-destructive py-8 text-center">
              Ошибка загрузки категорий
            </div>
          ) : filteredCategories.length === 0 ? (
            <EmptyCategories message="Категории не найдены" />
          ) : isMobile ? (
            <div className="space-y-2">
              {filteredCategories.map((category) => (
                <MobileCategoryCard
                  key={category.id}
                  category={category}
                  onDelete={handleDeleteCategory}
                />
              ))}
            </div>
          ) : (
            <div className="border rounded-xl bg-card p-0 shadow-sm overflow-x-auto mb-4">
              <CategoryTable
                categories={filteredCategories}
                allCategories={categories}
                onDelete={handleDeleteCategory}
              />
            </div>
          )}
          <div className="mt-4 flex justify-center">
            <CategoryPagination
              currentPage={page}
              totalPages={pageCount}
              onPageChange={setPage}
            />
          </div>
        </TabsContent>

        <TabsContent value="tree">
          {isTreeLoading ? (
            <div className="flex h-40 items-center justify-center">
              <div className="border-primary h-8 w-8 animate-spin rounded-full border-b-2" />
            </div>
          ) : treeError ? (
            <div className="text-destructive py-8 text-center">
              Ошибка загрузки дерева категорий
            </div>
          ) : !categoryTree || categoryTree.length === 0 ? (
            <EmptyCategories message="Категории не найдены" />
          ) : (
            <div className="rounded-lg border p-4">
              <div className="mb-4">
                <p className="text-muted-foreground text-sm">
                  Перетащите категории, чтобы изменить их порядок
                </p>
              </div>
              <CategoryTreeDnd
                categories={categoryTree as unknown as CategoryTreeItem[]}
                onCategorySelect={(category) => {
                  router.push(paths.categories.edit(category.id));
                }}
              />
            </div>
          )}
        </TabsContent>

        <TabsContent value="folders">
          <CategoryFolderView
            isLoading={isTreeLoading}
            onDelete={(category) => {
              // Преобразуем CategoryFolderItem в CategoryListItem
              const listCategory: CategoryListItem = {
                id: category.id,
                name: category.name,
                slug: category.slug,
                description: category.description,
                isActive: category.isActive,
                sortOrder: category.sortOrder,
                parentId: category.parentCategoryId,
                imageId: null,
                metaTitle: null,
                metaDescription: null,
                metaKeywords: null,
                xmlId: null,
                createdAt: new Date(),
                updatedAt: new Date(),
              };
              handleDeleteCategory(listCategory);
            }}
            onDataUpdate={() => {
              // Инвалидируем кэш для обновления данных
              queryClient.invalidateQueries({
                queryKey: trpc.categories.tree.queryKey(),
              });
              queryClient.invalidateQueries({
                queryKey: trpc.categories.list.queryKey(),
              });
              queryClient.invalidateQueries({
                queryKey: trpc.categories.getChildren.queryKey(),
              });
              queryClient.invalidateQueries({
                queryKey: trpc.categories.getFolderView.queryKey(),
              });
            }}
          />
        </TabsContent>
      </Tabs>

      {categoryToDelete && (
        <DeleteCategoryDialog
          category={categoryToDelete}
          onDelete={confirmDelete}
          open={deleteDialogOpen}
          onOpenChange={setDeleteDialogOpen}
        />
      )}
    </div>
  );
}
