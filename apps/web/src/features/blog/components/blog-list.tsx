"use client";

import { Button } from "@qco/ui/components/button";
import { useQuery } from "@tanstack/react-query";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useState } from "react";
import BlogPostCard from "@/components/blog-post-card";
import { useTRPC } from "@/trpc/react";
import type { BlogPost } from "@/types/blog";

export default function BlogList() {
  const trpc = useTRPC();
  const [page, setPage] = useState(1);
  const limit = 9;

  // Создаем опции запроса для получения опубликованных постов
  const postsQueryOptions = trpc.blog.getPublished.queryOptions({
    page,
    limit,
    sortBy: "publishedAt",
    sortOrder: "desc",
  });

  // Используем опции с хуком useQuery
  const { data, isPending, error } = useQuery(postsQueryOptions);

  if (isPending) {
    return (
      <div className="container mx-auto px-4 py-8 md:py-16">
        <div className="text-center mb-12">
          <h1 className="font-playfair text-4xl md:text-5xl font-bold mb-4">
            Наш Блог
          </h1>
          <p className="text-muted-foreground max-w-3xl mx-auto">
            Здесь мы делимся последними новостями из мира высокой моды, советами
            от ведущих стилистов, обзорами новых коллекций и вечной классики.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {Array.from({ length: 6 }, (_, i) => (
            <div key={`blog-skeleton-${i}`} className="animate-pulse">
              <div className="aspect-[16/9] bg-gray-200 rounded-lg mb-4" />
              <div className="h-6 bg-gray-200 rounded mb-2" />
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-2" />
              <div className="h-4 bg-gray-200 rounded w-1/2" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8 md:py-16">
        <div className="text-center">
          <h1 className="font-playfair text-4xl md:text-5xl font-bold mb-4">
            Наш Блог
          </h1>
          <p className="text-red-500">Ошибка загрузки блога: {error.message}</p>
        </div>
      </div>
    );
  }

  const { posts, totalPages } = data || { posts: [], totalPages: 0 };

  return (
    <div className="container mx-auto px-4 py-8 md:py-16">
      <div className="text-center mb-12">
        <h1 className="font-playfair text-4xl md:text-5xl font-bold mb-4">
          Наш Блог
        </h1>
        <p className="text-muted-foreground max-w-3xl mx-auto">
          Здесь мы делимся последними новостями из мира высокой моды, советами
          от ведущих стилистов, обзорами новых коллекций и вечной классики.
        </p>
      </div>

      {posts.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground">
            Пока нет опубликованных статей.
          </p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
            {posts.map((post: BlogPost) => (
              <BlogPostCard key={post.id} post={post} />
            ))}
          </div>

          {/* Пагинация */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage(page - 1)}
                disabled={page <= 1}
              >
                <ChevronLeft className="w-4 h-4 mr-1" />
                Назад
              </Button>

              <span className="text-sm text-muted-foreground">
                Страница {page} из {totalPages}
              </span>

              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage(page + 1)}
                disabled={page >= totalPages}
              >
                Вперед
                <ChevronRight className="w-4 h-4 ml-1" />
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
