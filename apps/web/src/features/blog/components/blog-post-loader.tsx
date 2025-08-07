"use client";

import { useQuery } from "@tanstack/react-query";
import { notFound } from "next/navigation";
import BlogPostDetailPage from "@/components/blog-post-detail-page";
import Breadcrumbs from "@/components/breadcrumbs";
import { useTRPC } from "@/trpc/react";

interface BlogPostLoaderProps {
  slug: string;
}

export default function BlogPostLoader({ slug }: BlogPostLoaderProps) {
  const trpc = useTRPC();

  // Создаем опции запроса для получения поста по slug
  const postQueryOptions = trpc.blog.getBySlug.queryOptions({ slug });

  // Используем опции с хуком useQuery
  const { data: post, isPending, error } = useQuery(postQueryOptions);

  if (isPending) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-3/4 mx-auto mb-4" />
          <div className="h-4 bg-gray-200 rounded w-1/2 mx-auto mb-8" />
          <div className="aspect-[16/9] bg-gray-200 rounded-xl mb-8" />
          <div className="space-y-4">
            <div className="h-4 bg-gray-200 rounded" />
            <div className="h-4 bg-gray-200 rounded w-5/6" />
            <div className="h-4 bg-gray-200 rounded w-4/6" />
          </div>
        </div>
      </div>
    );
  }

  if (error || !post) {
    console.error("Error fetching blog post:", error);
    notFound();
  }

  return (
    <>
      <Breadcrumbs
        items={[
          { label: "Главная", href: "/" },
          { label: "Блог", href: "/blog" },
          { label: post.title, href: `/blog/${post.slug}` },
        ]}
      />
      <main>
        <BlogPostDetailPage post={post} />
      </main>
    </>
  );
}
