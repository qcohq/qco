"use client";

import { useQuery } from "@tanstack/react-query";
import {
  ArrowLeft,
  Calendar,
  Edit,
  Eye,
  Folder,
  Tag,
  User,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useTRPC } from "~/trpc/react";

// Интерфейс для данных блога, возвращаемых API
interface BlogPostDetail {
  id: string;
  title: string;
  slug: string;
  excerpt?: string;
  content?: unknown; // Заменяем any на unknown для большей типобезопасности
  contentHtml?: string;
  contentPlain?: string;
  status: "draft" | "published" | "scheduled" | "archived";
  type: "post" | "page";
  createdAt: Date | string;
  updatedAt: Date | string;
  publishedAt?: Date | string;
  author?: {
    id: string;
    name: string;
  };
  featuredImage?: {
    url: string;
    key: string;
  };
  viewCount?: number;
  postTags?: Array<{
    tag: {
      id: string;
      name: string;
    };
  }>;
  postCategories?: Array<{
    category: {
      id: string;
      name: string;
    };
  }>;
  metaTitle?: string;
  metaDescription?: string;
  isFeatured: boolean;
  isSticky: boolean;
  allowComments: boolean;
}

import { Alert, AlertDescription } from "@qco/ui/components/alert";
import { Badge } from "@qco/ui/components/badge";
import { Button } from "@qco/ui/components/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@qco/ui/components/card";
import { Label } from "@qco/ui/components/label";
import { Separator } from "@qco/ui/components/separator";
import { Skeleton } from "@qco/ui/components/skeleton";

export default function BlogPostViewPage() {
  const params = useParams();
  const slug = params.slug as string;
  const trpc = useTRPC();

  const postQuery = useQuery(trpc.blog.getBySlug.queryOptions({ slug }));

  const formatDate = (date: string | Date) => {
    return new Date(date).toLocaleDateString("ru-RU", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      draft: { variant: "secondary" as const, label: "Черновик" },
      published: { variant: "default" as const, label: "Опубликовано" },
      scheduled: { variant: "outline" as const, label: "Запланировано" },
      archived: { variant: "destructive" as const, label: "В архиве" },
    };

    const config =
      statusConfig[status as keyof typeof statusConfig] || statusConfig.draft;

    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  if (postQuery.isLoading) {
    return (
      <div className="p-6 space-y-6">
        <div className="flex items-center space-x-4">
          <Skeleton className="h-10 w-10" />
          <div className="space-y-2">
            <Skeleton className="h-6 w-48" />
            <Skeleton className="h-4 w-32" />
          </div>
        </div>

        <Card>
          <CardHeader>
            <Skeleton className="h-8 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
          </CardHeader>
          <CardContent className="space-y-4">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
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

  const post = postQuery.data as BlogPostDetail;

  if (!post) {
    return (
      <div className="p-6">
        <Alert variant="destructive">
          <AlertDescription>Запись не найдена.</AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button variant="outline" size="sm" asChild>
            <Link href="/blog">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Назад к списку
            </Link>
          </Button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">{post.title}</h1>
            <p className="text-muted-foreground">Просмотр записи блога</p>
          </div>
        </div>
        <Link href={`/blog/edit/${post.slug}`}>
          <Button variant="outline" size="sm">
            <Edit className="h-4 w-4 mr-2" />
            Редактировать
          </Button>
        </Link>
      </div>

      {/* Post Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-2xl">{post.title}</CardTitle>
                {getStatusBadge(post.status)}
              </div>
              <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                <div className="flex items-center">
                  <User className="h-4 w-4 mr-1" />
                  {post.author?.name || "Неизвестный автор"}
                </div>
                <div className="flex items-center">
                  <Calendar className="h-4 w-4 mr-1" />
                  {formatDate(post.createdAt)}
                </div>
                <div className="flex items-center">
                  <Eye className="h-4 w-4 mr-1" />
                  {post.viewCount || 0} просмотров
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              {post.featuredImage && (
                <div className="aspect-video overflow-hidden rounded-lg relative">
                  <Image
                    src={post.featuredImage.url}
                    alt={post.title || "Изображение записи"}
                    fill
                    className="object-cover"
                  />
                </div>
              )}

              {post.excerpt && (
                <div className="text-lg text-muted-foreground leading-relaxed">
                  {post.excerpt}
                </div>
              )}

              <Separator />

              <div className="prose prose-gray max-w-none">
                {/* Безопасное отображение контента через компоненты */}
                <div className="content-wrapper">
                  {post.contentHtml ? (
                    <div className="formatted-content">
                      {post.contentPlain || "Нет содержимого"}
                    </div>
                  ) : (
                    <p>Нет содержимого</p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Tags */}
          {post.postTags && post.postTags.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Tag className="h-4 w-4 mr-2" />
                  Теги
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {post.postTags.map(
                    (postTag: { tag: { id: string; name: string } }) => (
                      <Badge key={postTag.tag.id} variant="secondary">
                        {postTag.tag.name}
                      </Badge>
                    ),
                  )}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Categories */}
          {post.postCategories && post.postCategories.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Folder className="h-4 w-4 mr-2" />
                  Категории
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {post.postCategories.map(
                    (postCategory: {
                      category: { id: string; name: string };
                    }) => (
                      <Badge key={postCategory.category.id} variant="outline">
                        {postCategory.category.name}
                      </Badge>
                    ),
                  )}
                </div>
              </CardContent>
            </Card>
          )}

          {/* SEO Info */}
          <Card>
            <CardHeader>
              <CardTitle>SEO информация</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label className="text-sm font-medium">Мета-заголовок</Label>
                <p className="text-sm text-muted-foreground mt-1">
                  {post.metaTitle || "Не задан"}
                </p>
              </div>
              <div>
                <Label className="text-sm font-medium">Мета-описание</Label>
                <p className="text-sm text-muted-foreground mt-1">
                  {post.metaDescription || "Не задано"}
                </p>
              </div>
              <div>
                <Label className="text-sm font-medium">URL</Label>
                <code className="text-sm bg-muted px-2 py-1 rounded block mt-1">
                  {post.slug}
                </code>
              </div>
            </CardContent>
          </Card>

          {/* Settings */}
          <Card>
            <CardHeader>
              <CardTitle>Настройки</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm">Рекомендуемая запись</span>
                <Badge variant={post.isFeatured ? "default" : "secondary"}>
                  {post.isFeatured ? "Да" : "Нет"}
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Закрепленная запись</span>
                <Badge variant={post.isSticky ? "default" : "secondary"}>
                  {post.isSticky ? "Да" : "Нет"}
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Комментарии</span>
                <Badge variant={post.allowComments ? "default" : "secondary"}>
                  {post.allowComments ? "Разрешены" : "Запрещены"}
                </Badge>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
