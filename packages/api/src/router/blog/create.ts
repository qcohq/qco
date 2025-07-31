import { z } from "zod";
import { blogPosts } from "@qco/db/schema";
import { protectedProcedure } from "../../trpc";
import type { TRPCContext } from "../../trpc";

const createBlogPostSchema = z.object({
    title: z.string(),
    slug: z.string(),
    content: z.string(),
    contentHtml: z.string(),
    excerpt: z.string().optional(),
    status: z.enum(["draft", "published", "scheduled", "archived"]).default("draft"),
    type: z.enum(["post", "page"]).default("post"),
    visibility: z.enum(["public", "members", "paid", "private"]).default("public"),
    authorId: z.string(),
    isActive: z.boolean().optional(),
});

export const create = protectedProcedure
    .input(createBlogPostSchema)
    .mutation(async ({ ctx, input }: { ctx: TRPCContext; input: z.infer<typeof createBlogPostSchema> }) => {
        const [post] = await ctx.db.insert(blogPosts).values(input).returning();
        return post;
    }); 
