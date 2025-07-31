import type {
  CreateBlogCategoryInput,
  CreateBlogCommentInput,
  CreateBlogPostInput,
  CreateBlogTagInput,
  GetBlogCategoriesInput,
  GetBlogCategoryInput,
  GetBlogCommentInput,
  GetBlogCommentsInput,
  GetBlogPostInput,
  GetBlogPostsInput,
  GetBlogTagInput,
  GetBlogTagsInput,
  UpdateBlogCategoryInput,
  UpdateBlogCommentInput,
  UpdateBlogPostInput,
  UpdateBlogTagInput,

} from "@qco/validators";

// Re-export types from validators
export type {
  CreateBlogPostInput,
  UpdateBlogPostInput,
  GetBlogPostInput,
  GetBlogPostsInput,
  CreateBlogTagInput,
  UpdateBlogTagInput,
  GetBlogTagInput,
  GetBlogTagsInput,
  CreateBlogCategoryInput,
  UpdateBlogCategoryInput,
  GetBlogCategoryInput,
  GetBlogCategoriesInput,
  CreateBlogCommentInput,
  UpdateBlogCommentInput,
  GetBlogCommentInput,
  GetBlogCommentsInput,
};

// Blog post status options
export const BLOG_POST_STATUSES = {
  DRAFT: "draft",
  PUBLISHED: "published",
  SCHEDULED: "scheduled",
  ARCHIVED: "archived",
} as const;

export type BlogPostStatus =
  (typeof BLOG_POST_STATUSES)[keyof typeof BLOG_POST_STATUSES];

// Blog post type options
export const BLOG_POST_TYPES = {
  POST: "post",
  PAGE: "page",
} as const;

export type BlogPostType =
  (typeof BLOG_POST_TYPES)[keyof typeof BLOG_POST_TYPES];

// Blog post visibility options
export const BLOG_POST_VISIBILITIES = {
  PUBLIC: "public",
  MEMBERS: "members",
  PAID: "paid",
  PRIVATE: "private",
} as const;

export type BlogPostVisibility =
  (typeof BLOG_POST_VISIBILITIES)[keyof typeof BLOG_POST_VISIBILITIES];

// Sort options
export const BLOG_SORT_OPTIONS = {
  CREATED_AT: "createdAt",
  UPDATED_AT: "updatedAt",
  PUBLISHED_AT: "publishedAt",
  TITLE: "title",
  VIEW_COUNT: "viewCount",
} as const;

export type BlogSortOption =
  (typeof BLOG_SORT_OPTIONS)[keyof typeof BLOG_SORT_OPTIONS];

// Filter options
export interface BlogFilters {
  search?: string;
  status?: BlogPostStatus;
  type?: BlogPostType;
  authorId?: string;
  categoryId?: string;
  tagId?: string;
  page?: number;
  limit?: number;
  sortBy?: BlogSortOption;
  sortOrder?: "asc" | "desc";
}

// Pagination result
export interface PaginatedResult<T> {
  data: T[];
  totalCount: number;
  totalPages: number;
  currentPage: number;
  limit: number;
}
