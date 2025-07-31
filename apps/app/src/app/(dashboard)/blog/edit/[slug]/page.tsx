"use client";

import { Alert, AlertDescription } from "@qco/ui/components/alert";
import { Card, CardContent, CardHeader } from "@qco/ui/components/card";
import { Skeleton } from "@qco/ui/components/skeleton";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import { BlogPostForm } from "~/features/blog/components/blog-post-form";
import { useTRPC } from "~/trpc/react";

export default function EditBlogPostPage() {
  const params = useParams();
  const postSlug = params.slug as string;
  const trpc = useTRPC();

  const postQuery = useQuery(
    trpc.blog.getBySlug.queryOptions({ slug: postSlug }),
  );

  if (postQuery.isLoading) {
    return (
      <div className="p-6 space-y-6">
        <div>
          <Skeleton className="h-8 w-1/3 mb-2" />
          <Skeleton className="h-4 w-1/2" />
        </div>
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-1/4" />
          </CardHeader>
          <CardContent className="space-y-4">
            {[...Array(4)].map((_, i) => (
              <div
                key={`blog-skeleton-field-${i}-${Date.now()}`}
                className="space-y-2"
              >
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-10 w-full" />
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    );
  }

  if (postQuery.isError) {
    return (
      <div className="p-6">
        <Alert variant="destructive">
          <AlertDescription>
            Не удалось загрузить запись. Возможно, она не существует или была
            удалена.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  const post = postQuery.data;

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">
          Редактировать запись
        </h1>
        <p className="text-muted-foreground">
          Измените содержимое и настройки записи
        </p>
      </div>

      <BlogPostForm mode="edit" post={post} />
    </div>
  );
}
