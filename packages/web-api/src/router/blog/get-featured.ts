import { eq, and, desc } from "@qco/db";
import { blogPosts } from "@qco/db/schema";
import { z } from "zod";
import { publicProcedure } from "../../trpc";
import { getFileUrl } from "@qco/lib";

const getFeaturedPostsSchema = z.object({
  limit: z.number().min(1).max(10).default(3),
});

export const getFeatured = publicProcedure
  .input(getFeaturedPostsSchema)
  .query(async ({ ctx, input }) => {
    const { limit = 3 } = input;

    const posts = await ctx.db.query.blogPosts.findMany({
      where: and(
        eq(blogPosts.status, "published"),
        eq(blogPosts.visibility, "public"),
        eq(blogPosts.isFeatured, true)
      ),
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
      orderBy: [desc(blogPosts.publishedAt)],
    });

    // Форматируем результат
    const formattedPosts = posts.map((post: any) => ({
      id: post.id,
      title: post.title,
      slug: post.slug,
      excerpt: post.excerpt,
      publishedAt: post.publishedAt,
      viewCount: post.viewCount || 0,
      likeCount: post.likeCount || 0,
      commentCount: post.commentCount || 0,
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

    return formattedPosts;
  }); 
