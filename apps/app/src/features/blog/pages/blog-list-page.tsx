"use client";

import { Alert, AlertDescription } from "@qco/ui/components/alert";
import { Button } from "@qco/ui/components/button";
import { Skeleton } from "@qco/ui/components/skeleton";
import { AlertCircle, Plus } from "lucide-react";
import Link from "next/link";
import * as React from "react";
import type { BlogFiltersFormData } from "../components/blog-filters";
import { BlogFilters } from "../components/blog-filters";
import { BlogPageHeader } from "../components/blog-page-header";
import { BlogPostCard } from "../components/blog-post-card";
import { DeleteBlogPostDialog } from "../components/delete-blog-post-dialog";
import { useBlogPosts, useDeleteBlogPost } from "../hooks";
import type { BlogPostWithRelations } from "../types";

export function BlogListPage() {
  const [filters, setFilters] = React.useState<BlogFiltersFormData>({
    search: "",
    status: "all",
    type: "all",
  });

  const [currentPage, setCurrentPage] = React.useState(1);

  // Состояние для диалога удаления
  const [deleteDialog, setDeleteDialog] = React.useState<{
    isOpen: boolean;
    postId: string | null;
    postTitle?: string;
  }>({
    isOpen: false,
    postId: null,
    postTitle: undefined,
  });

  // Получаем посты с фильтрами
  const {
    posts,
    totalCount,
    totalPages,
    currentPage: page,
    isLoading,
    error,
    refetch,
  } = useBlogPosts({
    ...filters,
    page: currentPage,
    limit: 20,
    status: filters.status === "all" ? undefined : filters.status,
    type: filters.type === "all" ? undefined : filters.type,
  });

  // Мутация для удаления поста
  const deletePostMutation = useDeleteBlogPost();

  const handleDeletePost = async (postId: string) => {
    const post = posts.find((p: BlogPostWithRelations) => p.id === postId);
    setDeleteDialog({
      isOpen: true,
      postId,
      postTitle: post?.title,
    });
  };

  const handleConfirmDelete = async () => {
    if (!deleteDialog.postId) return;

    try {
      await deletePostMutation.mutateAsync({ id: deleteDialog.postId });
      setDeleteDialog({ isOpen: false, postId: null });
      // Обновляем список постов после удаления
      refetch();
    } catch (error) {
      console.error("Ошибка удаления поста:", error);
      alert("Ошибка удаления поста. Попробуйте еще раз.");
    }
  };

  const handleCloseDeleteDialog = () => {
    setDeleteDialog({ isOpen: false, postId: null });
  };

  const handleEditPost = (postId: string) => {
    window.location.href = `/blog/edit/${postId}`;
  };

  const handleViewPost = (postId: string) => {
    const post = posts.find((p: BlogPostWithRelations) => p.id === postId);
    if (post) {
      window.open(`/blog/${post.slug}`, "_blank");
    }
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="space-y-6">
        {/* Header */}
        <BlogPageHeader
          title="Блог"
          description="Управляйте записями и страницами блога"
        />

        {/* Loading skeleton */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {[...Array(6)].map((_, i) => (
            <div
              key={`blog-skeleton-${Date.now()}-${i}`}
              className="p-6 border border-border/50 rounded-lg space-y-4"
            >
              <div className="space-y-2">
                <Skeleton className="h-6 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
              </div>
              <div className="flex items-center gap-4">
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-4 w-16" />
                <Skeleton className="h-4 w-12" />
              </div>
              <div className="flex gap-2">
                <Skeleton className="h-6 w-16" />
                <Skeleton className="h-6 w-20" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="space-y-6">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Не удалось загрузить записи блога. Попробуйте еще раз.
            <Button
              variant="outline"
              size="sm"
              className="ml-4"
              onClick={() => refetch()}
            >
              Повторить
            </Button>
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <BlogPageHeader
        title="Блог"
        description="Управляйте записями и страницами блога"
      />

      {/* Filters */}
      <BlogFilters
        filters={filters}
        onFiltersChange={(newFilters) => {
          setFilters(newFilters);
          setCurrentPage(1); // Сбрасываем страницу при изменении фильтров
        }}
      />

      {/* Posts Grid */}
      {posts.length === 0 ? (
        <div className="text-center py-16">
          <AlertCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">Записей не найдено</h3>
          <p className="text-muted-foreground mb-6 max-w-md mx-auto">
            {filters.search ||
            filters.status !== "all" ||
            filters.type !== "all"
              ? "Попробуйте изменить фильтры или создать новую запись"
              : "Создайте первую запись для вашего блога"}
          </p>
          <Button asChild>
            <Link href="/blog/new">
              <Plus className="h-4 w-4 mr-2" />
              Создать запись
            </Link>
          </Button>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {posts.map((post: BlogPostWithRelations) => (
            <BlogPostCard
              key={post.id}
              post={post}
              onEdit={handleEditPost}
              onDelete={handleDeletePost}
              onView={handleViewPost}
            />
          ))}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between pt-6 border-t border-border/50">
          <p className="text-sm text-muted-foreground">
            Показано {posts.length} из {totalCount} записей
          </p>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(page - 1)}
              disabled={page <= 1}
            >
              Назад
            </Button>
            <span className="text-sm px-3 py-1 bg-muted rounded-md">
              Страница {page} из {totalPages}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(page + 1)}
              disabled={page >= totalPages}
            >
              Вперед
            </Button>
          </div>
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      <DeleteBlogPostDialog
        isOpen={deleteDialog.isOpen}
        onClose={handleCloseDeleteDialog}
        onConfirm={handleConfirmDelete}
        postId={deleteDialog.postId}
        postTitle={deleteDialog.postTitle}
        isDeleting={deletePostMutation.isPending}
      />
    </div>
  );
}
