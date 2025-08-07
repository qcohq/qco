"use client";

import { Button } from "@qco/ui/components/button";
import type { RouterOutputs } from "@qco/web-api";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { useTRPC } from "@/trpc/react";
import BlogPostCard from "./blog-post-card";

export default function BlogSection() {
  const trpc = useTRPC();

  // Создаем опции запроса для получения избранных постов
  const featuredPostsQueryOptions = trpc.blog.getFeatured.queryOptions({
    limit: 2,
  });

  // Используем опции с хуком useQuery
  const {
    data: blogPosts,
    isPending,
    error,
  } = useQuery(featuredPostsQueryOptions);

  if (isPending) {
    return (
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4 pr-[0]">
          <div className="text-center mb-12">
            <h2 className="font-playfair text-3xl md:text-4xl font-bold mb-4">
              Наш Блог
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Последние новости из мира моды, советы стилистов и эксклюзивные
              обзоры коллекций.
            </p>
          </div>
          <div className="text-center">
            <div className="animate-pulse">
              <div className="h-64 bg-gray-200 rounded-lg mb-4" />
              <div className="h-4 bg-gray-200 rounded w-3/4 mx-auto mb-2" />
              <div className="h-4 bg-gray-200 rounded w-1/2 mx-auto" />
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4 pr-[0]">
          <div className="text-center mb-12">
            <h2 className="font-playfair text-3xl md:text-4xl font-bold mb-4">
              Наш Блог
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Последние новости из мира моды, советы стилистов и эксклюзивные
              обзоры коллекций.
            </p>
          </div>
          <div className="text-center">
            <p className="text-red-500">
              Ошибка загрузки блога: {error.message}
            </p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4 pr-[0]">
        <div className="text-center mb-12">
          <h2 className="font-playfair text-3xl md:text-4xl font-bold mb-4">
            Наш Блог
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Последние новости из мира моды, советы стилистов и эксклюзивные
            обзоры коллекций.
          </p>
        </div>
        {/* Mobile version - horizontal scroll */}
        <div className="md:hidden">
          <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
            {blogPosts
              ?.slice(0, 2)
              .map((post: RouterOutputs["blog"]["getFeatured"]) => (
                <div
                  key={`mobile-${post.id}`}
                  className="w-[80vw] max-w-sm flex-shrink-0"
                >
                  <BlogPostCard post={post} />
                </div>
              ))}
          </div>
        </div>

        {/* Desktop version - grid */}
        <div className="hidden md:grid md:grid-cols-2 gap-8">
          {blogPosts
            ?.slice(0, 2)
            .map((post: RouterOutputs["blog"]["getFeatured"]) => (
              <BlogPostCard key={`desktop-${post.id}`} post={post} />
            ))}
        </div>
        {blogPosts && blogPosts.length > 2 && (
          <div className="text-center mt-12">
            <Button variant="secondary" size="lg" asChild>
              <Link href="/blog">Все статьи</Link>
            </Button>
          </div>
        )}
      </div>
    </section>
  );
}
