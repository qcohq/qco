import { TRPCError } from "@trpc/server";
import { eq } from "drizzle-orm";
import { z } from "zod";

import { products, productFiles } from "@qco/db/schema";
import { protectedProcedure } from "../../trpc";

export const updateImagesOrder = protectedProcedure
  .input(
    z.object({
      productId: z.string(),
      images: z.array(
        z.object({
          id: z.string(),
          fileId: z.string(),
          type: z.string(),
          order: z.number(),
        })
      ),
    })
  )
  .mutation(async ({ ctx, input }) => {
    try {
      // Проверяем существование продукта
      const product = await ctx.db.query.products.findFirst({
        where: eq(products.id, input.productId),
      });

      if (!product) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: `Товар с ID ${input.productId} не найден`,
        });
      }

      // Обновляем порядок для каждого изображения
      const updatePromises = input.images.map((image, index) =>
        ctx.db
          .update(productFiles)
          .set({
            order: index,
          })
          .where(eq(productFiles.fileId, image.fileId))
      );

      await Promise.all(updatePromises);

      return { success: true };
    } catch (error) {
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Не удалось обновить порядок изображений",
        cause: error,
      });
    }
  }); 
