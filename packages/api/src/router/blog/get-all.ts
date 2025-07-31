import { z } from "zod";
import { desc } from "drizzle-orm";
import { createTRPCRouter, protectedProcedure } from "../../trpc";
import { blogPosts } from "@qco/db/schema";

const getAllBlogPostsSchema = z.object({
    page: z.number().min(1).default(1),
    limit: z.number().min(1).max(100).default(10),
    search: z.string().optional(),
    categoryId: z.string().optional(),
    tagId: z.string().optional(),
});

export const getAll = protectedProcedure
    .input(getAllBlogPostsSchema)
    .query(async ({ ctx, input }) => {
        const { page, limit, search, categoryId, tagId } = input;
        const offset = (page - 1) * limit;

        const posts = await ctx.db.query.blogPosts.findMany({
            orderBy: (fields, { desc }) => [desc(fields.createdAt)],
            limit,
            offset,
        });

        const totalCountResult = await ctx.db.select().from(blogPosts);
        const totalCount = totalCountResult.length;

        return {
            posts,
            pagination: {
                page,
                limit,
                total: totalCount,
                totalPages: Math.ceil(totalCount / limit),
            },
        };
    }); 
