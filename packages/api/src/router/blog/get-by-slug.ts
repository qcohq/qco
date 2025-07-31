import { z } from "zod";
import { eq } from "@qco/db";
import { blogPosts, blogComments } from "@qco/db/schema";
import { protectedProcedure } from "../../trpc";
import type { TRPCContext } from "../../trpc";

const getBySlugSchema = z.object({
    slug: z.string(),
});

export const getBySlug = protectedProcedure
    .input(getBySlugSchema)
    .query(async ({ ctx, input }: { ctx: TRPCContext; input: z.infer<typeof getBySlugSchema> }) => {
        const post = await ctx.db.query.blogPosts.findFirst({
            where: eq(blogPosts.slug, input.slug),
        });

        if (!post) {
            throw new Error("Post not found");
        }

        const comments = await ctx.db.query.blogComments.findMany({
            where: eq(blogComments.postId, post.id),
        });

        return {
            ...post,
            comments: comments.map((comment: typeof comments[0]) => comment),
        };
    }); 
