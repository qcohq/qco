import { TRPCError } from "@trpc/server";
import { eq as eqFn } from "drizzle-orm";
import { z } from "zod";
import type { SQL } from "drizzle-orm";

import { brands, brandFiles } from "@qco/db/schema";
import { protectedProcedure } from "../../trpc";

export const getBySlug = protectedProcedure
  .input(z.object({ slug: z.string() }))
  .query(async ({ input, ctx }) => {
    const brand = await ctx.db.query.brands.findFirst({
      where: eqFn(brands.slug, input.slug),
    });
    if (!brand) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: `Бренд со slug ${input.slug} не найден`,
      });
    }
    const files = await ctx.db.query.brandFiles.findMany({
      where: eqFn(brandFiles.brandId, brand.id),
      orderBy: (fields, { asc }) => [asc(fields.order)],
    });
    return { ...brand, files };
  });
