// Re-export types from web-validators package for consistency
export type {
  BlogAuthor,
  BlogCategory,
  BlogComment,
  BlogImage,
  BlogPost,
  BlogPostFilters,
  BlogPostFull,
  BlogPostListResponse,
  BlogTag,
  CreateBlogCommentInput,
  GetBlogCategoriesInput,
  GetBlogPostBySlugInput,
  GetBlogPostsInput,
  GetBlogTagsInput,
} from "@qco/web-validators";

// Re-export schemas for validation
export {
  blogAuthorSchema,
  blogCategorySchema,
  blogCommentSchema,
  blogImageSchema,
  blogPostFiltersSchema,
  blogPostFullSchema,
  blogPostListResponseSchema,
  blogPostSchema,
  blogTagSchema,
  createBlogCommentSchema,
  getBlogCategoriesSchema,
  getBlogPostBySlugSchema,
  getBlogPostsSchema,
  getBlogTagsSchema,
} from "@qco/web-validators";
