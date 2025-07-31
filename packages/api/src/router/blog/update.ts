import { TRPCError } from "@trpc/server";
import { eq } from "drizzle-orm";
import { z } from "zod";

import { blogPosts, blogPostTags, blogPostCategories } from "@qco/db/schema";
import { createTRPCRouter, protectedProcedure } from "../../trpc";

const updateBlogPostSchema = z.object({
    id: z.string(),
    title: z.string().min(1, "Title is required"),
    content: z.string().min(1, "Content is required"),
    excerpt: z.string().optional(),
    status: z.enum(["draft", "published", "scheduled", "archived"]).default("draft"),
    publishedAt: z.date().optional(),
    categoryId: z.string().optional(),
    tagIds: z.array(z.string()).optional(),
    metaTitle: z.string().optional(),
    metaDescription: z.string().optional(),
    slug: z.string().optional(),
});

export const update = protectedProcedure
    .input(updateBlogPostSchema)
    .mutation(async ({ ctx, input }) => {
        const { id, tagIds, ...updateData } = input;

        // Проверяем существование поста
        const existingPost = await ctx.db.query.blogPosts.findFirst({
            where: eq(blogPosts.id, id),
        });

        if (!existingPost) {
            throw new TRPCError({
                code: "NOT_FOUND",
                message: "Blog post not found",
            });
        }

        // Обновляем пост
        const [updatedPost] = await ctx.db
            .update(blogPosts)
            .set({
                ...updateData,
                updatedAt: new Date(),
            })
            .where(eq(blogPosts.id, id))
            .returning();

        // Обновляем теги, если они предоставлены
        if (tagIds) {
            // Удаляем старые связи с тегами
            await ctx.db.delete(blogPostTags).where(eq(blogPostTags.postId, id));

            // Добавляем новые связи с тегами
            if (tagIds.length > 0) {
                const tagRelations = tagIds.map(tagId => ({
                    postId: id,
                    tagId,
                }));

                await ctx.db.insert(blogPostTags).values(tagRelations);
            }
        }

        return updatedPost;
    }); 
