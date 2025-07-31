import { z } from "zod";

// Схема для автора блога (соответствует таблице admins)
export const blogAuthorSchema = z.object({
  id: z.string(),
  name: z.string(),
  email: z.string().email(),
});

// Схема для изображения блога (соответствует таблице files)
export const blogImageSchema = z.object({
  id: z.string(),
  url: z.string().url(),
  name: z.string(),
  mimeType: z.string(),
  size: z.number(),
});

// Схема для тега блога (соответствует таблице blogTags)
export const blogTagSchema = z.object({
  id: z.string(),
  name: z.string(),
  slug: z.string(),
  description: z.string().nullable(),
  color: z.string().nullable(),
  isActive: z.boolean(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

// Схема для категории блога (соответствует таблице blogCategories)
export const blogCategorySchema = z.object({
  id: z.string(),
  name: z.string(),
  slug: z.string(),
  description: z.string().nullable(),
  parentId: z.string().nullable(),
  imageId: z.string().nullable(),
  isActive: z.boolean(),
  sortOrder: z.number(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

// Схема для комментария блога (соответствует таблице blogComments)
export const blogCommentSchema = z.object({
  id: z.string(),
  postId: z.string(),
  parentId: z.string().nullable(),
  content: z.string(),
  authorName: z.string(),
  authorEmail: z.string().email(),
  authorWebsite: z.string().nullable(),
  isApproved: z.boolean(),
  isSpam: z.boolean(),
  userAgent: z.string().nullable(),
  ipAddress: z.string().nullable(),
  createdAt: z.date(),
  updatedAt: z.date(),
  approvedAt: z.date().nullable(),
});

// Схема для поста блога (соответствует таблице blogPosts)
export const blogPostSchema = z.object({
  id: z.string(),
  title: z.string(),
  slug: z.string(),
  excerpt: z.string().nullable(),
  content: z.any(), // JSON content (Slate/Plate.js)
  contentHtml: z.string(),
  status: z.enum(["draft", "published", "scheduled", "archived"]),
  type: z.enum(["post", "page"]),
  visibility: z.enum(["public", "members", "paid", "private"]),
  publishedAt: z.date().nullable(),
  scheduledAt: z.date().nullable(),
  metaTitle: z.string().nullable(),
  metaDescription: z.string().nullable(),
  metaKeywords: z.array(z.string()).nullable(),
  canonicalUrl: z.string().nullable(),
  featuredImageId: z.string().nullable(),
  ogImageId: z.string().nullable(),
  authorId: z.string(),
  isFeatured: z.boolean(),
  isSticky: z.boolean(),
  allowComments: z.boolean(),
  viewCount: z.number(),
  likeCount: z.number(),
  commentCount: z.number(),
  createdAt: z.date(),
  updatedAt: z.date(),
  createdBy: z.string().nullable(),
  updatedBy: z.string().nullable(),
  author: blogAuthorSchema.nullable(),
  featuredImage: blogImageSchema.nullable(),
  ogImage: blogImageSchema.nullable(),
  tags: z.array(blogTagSchema),
  categories: z.array(blogCategorySchema),
});

// Схема для полного поста блога (с дополнительными полями)
export const blogPostFullSchema = blogPostSchema.extend({
  comments: z.array(blogCommentSchema),
});

// Схема для списка постов блога
export const blogPostListResponseSchema = z.object({
  posts: z.array(blogPostSchema),
  totalCount: z.number().min(0),
  page: z.number().min(1),
  limit: z.number().min(1),
  totalPages: z.number().min(0),
});

// Схема для фильтров блога
export const blogPostFiltersSchema = z.object({
  page: z.number().min(1).optional(),
  limit: z.number().min(1).max(100).optional(),
  categoryId: z.string().optional(),
  tagId: z.string().optional(),
  search: z.string().optional(),
  sortBy: z.enum(["createdAt", "publishedAt", "title", "viewCount"]).optional(),
  sortOrder: z.enum(["asc", "desc"]).optional(),
  status: z.enum(["draft", "published", "scheduled", "archived"]).optional(),
  type: z.enum(["post", "page"]).optional(),
});

// Схема для получения поста по slug
export const getBlogPostBySlugSchema = z.object({
  slug: z.string().min(1, "Slug поста обязателен"),
});

// Схема для получения постов с фильтрами
export const getBlogPostsSchema = blogPostFiltersSchema;

// Схема для создания комментария
export const createBlogCommentSchema = z.object({
  postId: z.string().min(1, "ID поста обязателен"),
  parentId: z.string().optional(),
  content: z.string().min(1, "Содержание комментария обязательно"),
  authorName: z.string().min(1, "Имя автора обязательно"),
  authorEmail: z.string().email("Введите корректный email"),
  authorWebsite: z.string().url().optional(),
});

// Схема для получения категорий блога
export const getBlogCategoriesSchema = z.object({
  includePostsCount: z.boolean().optional(),
});

// Схема для получения тегов блога
export const getBlogTagsSchema = z.object({
  includePostsCount: z.boolean().optional(),
});

// Типы для TypeScript
export type BlogAuthor = z.infer<typeof blogAuthorSchema>;
export type BlogImage = z.infer<typeof blogImageSchema>;
export type BlogTag = z.infer<typeof blogTagSchema>;
export type BlogCategory = z.infer<typeof blogCategorySchema>;
export type BlogComment = z.infer<typeof blogCommentSchema>;
export type BlogPost = z.infer<typeof blogPostSchema>;
export type BlogPostFull = z.infer<typeof blogPostFullSchema>;
export type BlogPostListResponse = z.infer<typeof blogPostListResponseSchema>;
export type BlogPostFilters = z.infer<typeof blogPostFiltersSchema>;
export type GetBlogPostBySlugInput = z.infer<typeof getBlogPostBySlugSchema>;
export type GetBlogPostsInput = z.infer<typeof getBlogPostsSchema>;
export type CreateBlogCommentInput = z.infer<typeof createBlogCommentSchema>;
export type GetBlogCategoriesInput = z.infer<typeof getBlogCategoriesSchema>;
export type GetBlogTagsInput = z.infer<typeof getBlogTagsSchema>; 
