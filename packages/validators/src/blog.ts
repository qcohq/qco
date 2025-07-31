import { z } from "zod";

// Схема для изображения
const imageSchema = z.object({
  key: z.string(),
  url: z.string(),
  name: z.string().optional(),
  mimeType: z.string().optional(),
  size: z.number().optional(),
});

// Схемы для постов
export const createBlogPostSchema = z.object({
  title: z.string().min(1, "Title is required").max(255),
  slug: z.string().min(1, "Slug is required").max(255).regex(/^[a-z0-9-]+$/, "Slug must contain only lowercase letters, numbers, and hyphens"),
  excerpt: z.string().optional(),
  content: z.any().default([]),
  contentHtml: z.string().default(""),
  contentPlain: z.string().optional(),
  status: z.enum(["draft", "published", "scheduled", "archived"]).default("draft"),
  type: z.enum(["post", "page"]).default("post"),
  visibility: z.enum(["public", "members", "paid", "private"]).default("public"),
  publishedAt: z.date().optional(),
  scheduledAt: z.date().optional(),
  metaTitle: z.string().max(255).optional(),
  metaDescription: z.string().optional(),
  metaKeywords: z.array(z.string()).optional(),
  canonicalUrl: z.url().optional(),
  featuredImage: imageSchema.nullish().or(z.null()),
  ogImage: imageSchema.nullish().or(z.null()),
  featuredImageId: z.string().optional(),
  ogImageId: z.string().optional(),
  authorId: z.string().min(1, "Author is required").optional(),
  isFeatured: z.boolean().default(false),
  isSticky: z.boolean().default(false),
  allowComments: z.boolean().default(true),
  tagIds: z.array(z.string()).optional(),
  categoryIds: z.array(z.string()).optional(),
});

export const updateBlogPostSchema = createBlogPostSchema.partial().extend({
  id: z.string().min(1, "Post ID is required"),
});

export const getBlogPostSchema = z.object({
  id: z.string().min(1, "Post ID is required"),
});

export const getBlogPostsSchema = z.object({
  page: z.number().min(1).default(1),
  limit: z.number().min(1).max(100).default(20),
  status: z.enum(["draft", "published", "scheduled", "archived"]).optional(),
  type: z.enum(["post", "page"]).optional(),
  authorId: z.string().optional(),
  categoryId: z.string().optional(),
  tagId: z.string().optional(),
  search: z.string().optional(),
  sortBy: z.enum(["createdAt", "updatedAt", "publishedAt", "title", "viewCount"]).default("createdAt"),
  sortOrder: z.enum(["asc", "desc"]).default("desc"),
});

// Схемы для тегов
export const createBlogTagSchema = z.object({
  name: z.string().min(1, "Name is required").max(100),
  slug: z.string().min(1, "Slug is required").max(100).regex(/^[a-z0-9-]+$/, "Slug must contain only lowercase letters, numbers, and hyphens"),
  description: z.string().optional(),
  color: z.string().regex(/^#[0-9A-F]{6}$/i, "Color must be a valid hex color").optional(),
  isActive: z.boolean().default(true),
});

export const updateBlogTagSchema = createBlogTagSchema.partial().extend({
  id: z.string().min(1, "Tag ID is required"),
});

export const getBlogTagSchema = z.object({
  id: z.string().min(1, "Tag ID is required"),
});

export const getBlogTagsSchema = z.object({
  page: z.number().min(1).default(1),
  limit: z.number().min(1).max(100).default(20),
  isActive: z.boolean().optional(),
  search: z.string().optional(),
  sortBy: z.enum(["name", "createdAt", "updatedAt"]).default("name"),
  sortOrder: z.enum(["asc", "desc"]).default("asc"),
});

// Схемы для категорий
export const createBlogCategorySchema = z.object({
  name: z.string().min(1, "Name is required").max(100),
  slug: z.string().min(1, "Slug is required").max(100).regex(/^[a-z0-9-]+$/, "Slug must contain only lowercase letters, numbers, and hyphens"),
  description: z.string().optional(),
  parentId: z.string().optional(),
  imageId: z.string().optional(),
  isActive: z.boolean().default(true),
  sortOrder: z.number().default(0),
});

export const updateBlogCategorySchema = createBlogCategorySchema.partial().extend({
  id: z.string().min(1, "Category ID is required"),
});

export const getBlogCategorySchema = z.object({
  id: z.string().min(1, "Category ID is required"),
});

export const getBlogCategoriesSchema = z.object({
  page: z.number().min(1).default(1),
  limit: z.number().min(1).max(100).default(20),
  isActive: z.boolean().optional(),
  parentId: z.string().optional(),
  search: z.string().optional(),
  sortBy: z.enum(["name", "sortOrder", "createdAt", "updatedAt"]).default("sortOrder"),
  sortOrder: z.enum(["asc", "desc"]).default("asc"),
});

// Схемы для комментариев
export const createBlogCommentSchema = z.object({
  postId: z.string().min(1, "Post ID is required"),
  parentId: z.string().optional(),
  authorName: z.string().min(1, "Author name is required").max(255),
  authorEmail: z.string().email("Valid email is required").max(255),
  authorWebsite: z.url().optional(),
  content: z.string().min(1, "Comment content is required"),
});

export const updateBlogCommentSchema = z.object({
  id: z.string().min(1, "Comment ID is required"),
  content: z.string().min(1, "Comment content is required"),
  isApproved: z.boolean().optional(),
  isSpam: z.boolean().optional(),
});

export const getBlogCommentSchema = z.object({
  id: z.string().min(1, "Comment ID is required"),
});

export const getBlogCommentsSchema = z.object({
  postId: z.string().optional(),
  page: z.number().min(1).default(1),
  limit: z.number().min(1).max(100).default(20),
  isApproved: z.boolean().optional(),
  isSpam: z.boolean().optional(),
  sortBy: z.enum(["createdAt", "updatedAt"]).default("createdAt"),
  sortOrder: z.enum(["asc", "desc"]).default("desc"),
});

// Типы для экспорта
export type CreateBlogPostInput = z.infer<typeof createBlogPostSchema>;
export type UpdateBlogPostInput = z.infer<typeof updateBlogPostSchema>;
export type GetBlogPostInput = z.infer<typeof getBlogPostSchema>;
export type GetBlogPostsInput = z.infer<typeof getBlogPostsSchema>;

export type CreateBlogTagInput = z.infer<typeof createBlogTagSchema>;
export type UpdateBlogTagInput = z.infer<typeof updateBlogTagSchema>;
export type GetBlogTagInput = z.infer<typeof getBlogTagSchema>;
export type GetBlogTagsInput = z.infer<typeof getBlogTagsSchema>;

export type CreateBlogCategoryInput = z.infer<typeof createBlogCategorySchema>;
export type UpdateBlogCategoryInput = z.infer<typeof updateBlogCategorySchema>;
export type GetBlogCategoryInput = z.infer<typeof getBlogCategorySchema>;
export type GetBlogCategoriesInput = z.infer<typeof getBlogCategoriesSchema>;

export type CreateBlogCommentInput = z.infer<typeof createBlogCommentSchema>;
export type UpdateBlogCommentInput = z.infer<typeof updateBlogCommentSchema>;
export type GetBlogCommentInput = z.infer<typeof getBlogCommentSchema>;
export type GetBlogCommentsInput = z.infer<typeof getBlogCommentsSchema>; 
