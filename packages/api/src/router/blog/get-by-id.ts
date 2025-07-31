import { z } from "zod";
import { eq } from "@qco/db";
import { blogPosts, blogComments } from "@qco/db/schema";
import { protectedProcedure } from "../../trpc";
import type { TRPCContext } from "../../trpc";

const getByIdSchema = z.object({
    id: z.string(),
});

export const getById = protectedProcedure
    .input(getByIdSchema)
    .query(async ({ ctx, input }: { ctx: TRPCContext; input: z.infer<typeof getByIdSchema> }) => {
        const post = await ctx.db.query.blogPosts.findFirst({
            where: eq(blogPosts.id, input.id),
        });

        if (!post) {
            throw new Error("Post not found");
        }

        const comments = await ctx.db.query.blogComments.findMany({
            where: eq(blogComments.postId, input.id),
        });

        return {
            ...post,
            comments: comments.map((comment: typeof comments[0]) => comment),
        };
    }); 
