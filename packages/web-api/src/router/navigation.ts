import { TRPCError } from "@trpc/server";
import { eq, isNull } from "@qco/db";
import z from "zod";

import { categories } from "@qco/db/schema";
import { NavItemSchema } from "@qco/web-validators";

import { publicProcedure } from "../trpc";
import type { TRPCRouterRecord } from "@trpc/server";

export const navigationRouter = {
  getAll: publicProcedure
    .output(z.array(NavItemSchema))
    .query(async ({ ctx }) => {
      try {
        const categoriesData = await ctx.db
          .select()
          .from(categories)
          .where(isNull(categories.parentId))
          .orderBy(categories.sortOrder);

        return Promise.all(
          categoriesData.map(async (cat: any) => {
            const subcategories = await ctx.db
              .select()
              .from(categories)
              .where(eq(categories.parentId, cat.id))
              .orderBy(categories.sortOrder);

            return {
              title: cat.name,
              href: `/catalog/${cat.slug}`,
              description: cat.description ?? undefined,
              subcategories: subcategories.length
                ? [
                  {
                    title: "Категории",
                    items: subcategories.map((sub: any) => ({
                      title: sub.name,
                      href: `/catalog/${sub.slug}`,
                      description: sub.description ?? undefined,
                    })),
                  },
                ]
                : [],
              featured:
                cat.isFeatured && cat.imageFileId
                  ? [
                    {
                      title: cat.name,
                      href: `/catalog/${cat.slug}`,
                      image: `/images/categories/${cat.slug}.jpg`,
                    },
                  ]
                  : undefined,
            };
          }),
        );
      } catch (error) {

        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Не удалось загрузить навигацию",
        });
      }
    }),
} satisfies TRPCRouterRecord;
