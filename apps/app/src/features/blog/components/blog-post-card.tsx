"use client";

import { Badge } from "@qco/ui/components/badge";
import { Button } from "@qco/ui/components/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@qco/ui/components/dropdown-menu";
import { cn } from "@qco/ui/lib/utils";
import {
  Calendar,
  Edit,
  Eye,
  Eye as EyeIcon,
  Folder,
  MoreHorizontal,
  Tag,
  Trash2,
  User,
} from "lucide-react";
import Link from "next/link";

import type { BlogPostWithRelations } from "../types";
import {
  formatBlogDate,
  getBlogPostStatusConfig,
  getBlogPostTypeConfig,
  truncateText,
} from "../utils";

interface BlogPostCardProps {
  post: BlogPostWithRelations;
  onEdit?: (postId: string) => void;
  onDelete?: (postId: string) => void;
  onView?: (postId: string) => void;
  className?: string;
}

export function BlogPostCard({
  post,
  onEdit,
  onDelete,
  onView,
  className,
}: BlogPostCardProps) {
  const statusConfig = getBlogPostStatusConfig(post.status);
  const typeConfig = getBlogPostTypeConfig(post.type);

  return (
    <div
      className={cn(
        "group relative p-6 border border-border/50 rounded-lg hover:border-border hover:shadow-sm transition-all duration-200",
        "bg-background/50 backdrop-blur-sm",
        className,
      )}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1 min-w-0 pr-4">
          <h3 className="text-lg font-semibold line-clamp-2 group-hover:text-primary transition-colors">
            <Link href={`/blog/${post.slug}`} className="hover:underline">
              {post.title}
            </Link>
          </h3>
          {post.excerpt && (
            <p className="text-sm text-muted-foreground mt-2 line-clamp-2">
              {truncateText(post.excerpt, 120)}
            </p>
          )}
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              className="opacity-0 group-hover:opacity-100 transition-opacity -mt-1 -mr-1"
            >
              <MoreHorizontal className="h-4 w-4" />
              <span className="sr-only">Действия</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {onView && (
              <DropdownMenuItem onClick={() => onView(post.id)}>
                <EyeIcon className="h-4 w-4 mr-2" />
                Просмотр
              </DropdownMenuItem>
            )}
            {onEdit && (
              <DropdownMenuItem onClick={() => onEdit(post.id)}>
                <Edit className="h-4 w-4 mr-2" />
                Редактировать
              </DropdownMenuItem>
            )}
            {onDelete && (
              <DropdownMenuItem
                onClick={() => onDelete(post.id)}
                className="text-destructive focus:text-destructive"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Удалить
              </DropdownMenuItem>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Meta information */}
      <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
        <div className="flex items-center gap-1">
          <Calendar className="h-3 w-3" />
          <span>{formatBlogDate(post.createdAt)}</span>
        </div>
        {post.author && (
          <div className="flex items-center gap-1">
            <User className="h-3 w-3" />
            <span>{post.author.name}</span>
          </div>
        )}
        <div className="flex items-center gap-1">
          <Eye className="h-3 w-3" />
          <span>{post.viewCount}</span>
        </div>
      </div>

      {/* Badges */}
      <div className="flex items-center gap-2 mb-4">
        <Badge variant={statusConfig.variant} className="text-xs">
          {statusConfig.label}
        </Badge>
        <Badge variant={typeConfig.variant} className="text-xs">
          {typeConfig.label}
        </Badge>
        {post.isFeatured && (
          <Badge
            variant="default"
            className="text-xs bg-yellow-100 text-yellow-800 border-yellow-200"
          >
            Избранное
          </Badge>
        )}
        {post.isSticky && (
          <Badge
            variant="default"
            className="text-xs bg-blue-100 text-blue-800 border-blue-200"
          >
            Закреплено
          </Badge>
        )}
      </div>

      {/* Tags and categories */}
      <div className="flex flex-wrap gap-1">
        {post.postTags?.slice(0, 3).map(({ tag }) => (
          <Badge
            key={tag.id}
            variant="outline"
            className="text-xs bg-background/50"
          >
            <Tag className="h-3 w-3 mr-1" />
            {tag.name}
          </Badge>
        ))}
        {post.postCategories?.slice(0, 2).map(({ category }) => (
          <Badge
            key={category.id}
            variant="outline"
            className="text-xs bg-background/50"
          >
            <Folder className="h-3 w-3 mr-1" />
            {category.name}
          </Badge>
        ))}
      </div>
    </div>
  );
}
