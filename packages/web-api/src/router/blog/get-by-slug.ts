import { eq, and } from "@qco/db";
import { blogPosts, blogComments } from "@qco/db/schema";
import { z } from "zod";
import { publicProcedure } from "../../trpc";
import { getFileUrl } from "@qco/lib";

const getPostBySlugSchema = z.object({
  slug: z.string().min(1, "Slug is required"),
});

export const getBySlug = publicProcedure
  .input(getPostBySlugSchema)
  .query(async ({ ctx, input }) => {
    const { slug } = input;

    const post = await ctx.db.query.blogPosts.findFirst({
      where: and(
        eq(blogPosts.slug, slug),
        eq(blogPosts.status, "published"),
        eq(blogPosts.visibility, "public")
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
        ogImage: {
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
        comments: {
          where: eq(blogComments.isApproved, true),
          columns: {
            id: true,
            content: true,
            authorName: true,
            authorEmail: true,
            authorWebsite: true,
            createdAt: true,
          },
        },
      },
    });

    if (!post) {
      throw new Error(`Post with slug "${slug}" not found`);
    }

    // Увеличиваем счетчик просмотров
    await ctx.db
      .update(blogPosts)
      .set({ viewCount: (post.viewCount || 0) + 1 })
      .where(eq(blogPosts.id, post.id));

    // Форматируем результат
    return {
      id: post.id,
      title: post.title,
      slug: post.slug,
      excerpt: post.excerpt,
      contentHtml: post.contentHtml,
      publishedAt: post.publishedAt,
      viewCount: (post.viewCount || 0) + 1, // Показываем обновленное значение
      likeCount: post.likeCount || 0,
      commentCount: post.commentCount || 0,
      isFeatured: post.isFeatured,
      isSticky: post.isSticky,
      allowComments: post.allowComments,
      createdAt: post.createdAt,
      updatedAt: post.updatedAt,
      // SEO метаданные
      metaTitle: post.metaTitle,
      metaDescription: post.metaDescription,
      metaKeywords: post.metaKeywords,
      canonicalUrl: post.canonicalUrl,
      // Автор
      author: post.author ? {
        id: post.author.id,
        name: post.author.name,
        email: post.author.email,
      } : null,
      // Изображения
      featuredImage: post.featuredImage ? {
        id: post.featuredImage.id,
        url: getFileUrl(post.featuredImage.path),
        name: post.featuredImage.name,
      } : null,
      ogImage: post.ogImage ? {
        id: post.ogImage.id,
        url: getFileUrl(post.ogImage.path),
        name: post.ogImage.name,
      } : null,
      // Теги
      tags: post.postTags?.map((pt: any) => ({
        id: pt.tag.id,
        name: pt.tag.name,
        slug: pt.tag.slug,
        color: pt.tag.color,
      })) || [],
      // Категории
      categories: post.postCategories?.map((pc: any) => ({
        id: pc.category.id,
        name: pc.category.name,
        slug: pc.category.slug,
        description: pc.category.description,
      })) || [],
      // Комментарии
      comments: post.comments?.map((comment: any) => ({
        id: comment.id,
        content: comment.content,
        authorName: comment.authorName,
        authorEmail: comment.authorEmail,
        authorWebsite: comment.authorWebsite,
        createdAt: comment.createdAt,
      })) || [],
    };
  }); 
