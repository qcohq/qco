import { eq, and, desc, asc, or, like, count, inArray } from "@qco/db";
import { blogPosts, blogPostTags, blogPostCategories, blogTags, blogCategories, files, admins } from "@qco/db/schema";
import { z } from "zod";
import { publicProcedure } from "../../trpc";
import { getFileUrl } from "@qco/lib";

const getPublishedPostsSchema = z.object({
  page: z.number().min(1).default(1),
  limit: z.number().min(1).max(50).default(10),
  categoryId: z.string().optional(),
  tagId: z.string().optional(),
  search: z.string().optional(),
  sortBy: z.enum(["createdAt", "publishedAt", "title", "viewCount"]).default("publishedAt"),
  sortOrder: z.enum(["asc", "desc"]).default("desc"),
});

export const getPublished = publicProcedure
  .input(getPublishedPostsSchema)
  .query(async ({ ctx, input }) => {
    const {
      page = 1,
      limit = 10,
      categoryId,
      tagId,
      search,
      sortBy = "publishedAt",
      sortOrder = "desc",
    } = input;

    const conditions = [
      eq(blogPosts.status, "published"),
      eq(blogPosts.visibility, "public"),
    ];

    // Фильтр по категории
    if (categoryId) {
      const postIds = await ctx.db
        .select({ postId: blogPostCategories.postId })
        .from(blogPostCategories)
        .where(eq(blogPostCategories.categoryId, categoryId));
      conditions.push(inArray(blogPosts.id, postIds.map((p: any) => p.postId)));
    }

    // Фильтр по тегу
    if (tagId) {
      const postIds = await ctx.db
        .select({ postId: blogPostTags.postId })
        .from(blogPostTags)
        .where(eq(blogPostTags.tagId, tagId));
      conditions.push(inArray(blogPosts.id, postIds.map((p: any) => p.postId)));
    }

    // Поиск
    if (search) {
      conditions.push(like(blogPosts.title, `%${search}%`));
    }

    const whereClause = and(...conditions);

    // Определяем сортировку
    const orderBy = sortOrder === "desc" ? desc(blogPosts[sortBy]) : asc(blogPosts[sortBy]);

    // Получаем посты с отношениями
    const posts = await ctx.db.query.blogPosts.findMany({
      where: whereClause,
      with: {
        author: {
          columns: {
            id: true,
            name: true,
            email: true,
          },
        },
        featuredImage: {
          columns: {
            id: true,
            path: true,
            name: true,
          },
        },
        postTags: {
          with: {
            tag: {
              columns: {
                id: true,
                name: true,
                slug: true,
                color: true,
              },
            },
          },
        },
        postCategories: {
          with: {
            category: {
              columns: {
                id: true,
                name: true,
                slug: true,
                description: true,
              },
            },
          },
        },
      },
      limit,
      offset: (page - 1) * limit,
      orderBy: [orderBy],
    });

    // Получаем общее количество
    const totalCount = await ctx.db
      .select({ count: count() })
      .from(blogPosts)
      .where(whereClause);

    // Форматируем результат
    const formattedPosts = posts.map((post: any) => ({
      id: post.id,
      title: post.title,
      slug: post.slug,
      excerpt: post.excerpt,
      content: post.content,
      publishedAt: post.publishedAt,
      viewCount: post.viewCount,
      likeCount: post.likeCount,
      commentCount: post.commentCount,
      isFeatured: post.isFeatured,
      isSticky: post.isSticky,
      createdAt: post.createdAt,
      updatedAt: post.updatedAt,
      author: post.author ? {
        id: post.author.id,
        name: post.author.name,
        email: post.author.email,
      } : null,
      featuredImage: post.featuredImage ? {
        id: post.featuredImage.id,
        url: getFileUrl(post.featuredImage.path),
        name: post.featuredImage.name,
      } : null,
      tags: post.postTags?.map((pt: any) => ({
        id: pt.tag.id,
        name: pt.tag.name,
        slug: pt.tag.slug,
        color: pt.tag.color,
      })) || [],
      categories: post.postCategories?.map((pc: any) => ({
        id: pc.category.id,
        name: pc.category.name,
        slug: pc.category.slug,
        description: pc.category.description,
      })) || [],
    }));

    return {
      posts: formattedPosts,
      totalCount: totalCount[0]?.count || 0,
      page,
      limit,
      totalPages: Math.ceil((totalCount[0]?.count || 0) / limit),
    };
  }); 
