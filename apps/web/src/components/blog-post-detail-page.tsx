import { format } from "date-fns";
import { ru } from "date-fns/locale";
import {
  CalendarDays,
  Eye,
  Heart,
  MessageCircle,
  Tag,
  UserCircle,
} from "lucide-react";
import Image from "next/image";
import type { BlogPostFull } from "@/types/blog";

interface BlogPostDetailPageProps {
  post: BlogPostFull;
}

export default function BlogPostDetailPage({ post }: BlogPostDetailPageProps) {
  return (
    <article className="container mx-auto px-4 py-8 md:py-16 max-w-4xl">
      <div className="mb-8">
        <h1 className="font-playfair text-3xl md:text-5xl font-bold mb-4 text-center">
          {post.title}
        </h1>
        <div className="text-sm text-muted-foreground flex flex-wrap items-center justify-center gap-x-4 gap-y-2 mb-4">
          <span className="flex items-center">
            <CalendarDays className="w-4 h-4 mr-2" />
            {format(new Date(post.publishedAt), "dd MMMM yyyy", { locale: ru })}
          </span>
          {post.author && (
            <span className="flex items-center">
              <UserCircle className="w-4 h-4 mr-2" />
              {post.author.name}
            </span>
          )}
          <span className="flex items-center">
            <Eye className="w-4 h-4 mr-2" />
            {post.viewCount} просмотров
          </span>
          <span className="flex items-center">
            <Heart className="w-4 h-4 mr-2" />
            {post.likeCount} лайков
          </span>
          <span className="flex items-center">
            <MessageCircle className="w-4 h-4 mr-2" />
            {post.commentCount} комментариев
          </span>
        </div>

        {/* Теги */}
        {post.tags.length > 0 && (
          <div className="flex flex-wrap items-center justify-center gap-2 mb-4">
            <Tag className="w-4 h-4 text-muted-foreground" />
            {post.tags.map((tag) => (
              <span
                key={tag.id}
                className="px-3 py-1 text-xs rounded-full bg-muted text-muted-foreground"
                style={
                  tag.color
                    ? { backgroundColor: `${tag.color}20`, color: tag.color }
                    : {}
                }
              >
                {tag.name}
              </span>
            ))}
          </div>
        )}

        {/* Категории */}
        {post.categories.length > 0 && (
          <div className="flex flex-wrap items-center justify-center gap-2 mb-4">
            {post.categories.map((category) => (
              <span
                key={category.id}
                className="px-3 py-1 text-xs rounded-full bg-primary/10 text-primary"
              >
                {category.name}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Изображение */}
      {post.featuredImage && (
        <div className="aspect-[16/9] relative overflow-hidden rounded-xl mb-8 shadow-lg">
          <Image
            src={post.featuredImage.url}
            alt={post.featuredImage.name || post.title}
            fill
            className="object-cover"
            priority
          />
        </div>
      )}

      {/* Контент */}
      {/* eslint-disable-next-line react/no-danger */}
      <div
        className="prose prose-lg max-w-none"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: post.contentHtml }}
      />

      {/* Комментарии */}
      {post.allowComments && post.comments.length > 0 && (
        <div className="mt-12">
          <h3 className="text-2xl font-bold mb-6">
            Комментарии ({post.commentCount})
          </h3>
          <div className="space-y-6">
            {post.comments.map((comment) => (
              <div key={comment.id} className="border rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <span className="font-semibold">{comment.authorName}</span>
                  <span className="text-sm text-muted-foreground">
                    {format(new Date(comment.createdAt), "dd MMM yyyy", {
                      locale: ru,
                    })}
                  </span>
                </div>
                <p className="text-sm">{comment.content}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </article>
  );
}
