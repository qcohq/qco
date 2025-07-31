import { eq } from "drizzle-orm";
import { TRPCError } from "@trpc/server";

import { productVariantOptions } from "@qco/db/schema";
import { updateVariantOptionSchema } from "@qco/validators";
import { protectedProcedure } from "../../trpc";

export const updateOption = protectedProcedure
  .input(updateVariantOptionSchema)
  .mutation(async ({ ctx, input }) => {
    const { id, name, type, metadata, sortOrder } = input;

    // Проверяем существование опции
    const existingOption = await ctx.db.query.productVariantOptions.findFirst({
      where: eq(productVariantOptions.id, id),
    });

    if (!existingOption) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "Опция не найдена",
      });
    }

    // Подготавливаем данные для обновления
    const updateData: any = {
      updatedAt: new Date(),
    };

    if (name !== undefined) {
      updateData.name = name;
      updateData.slug = name.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");
    }

    if (type !== undefined) {
      updateData.type = type;
    }

    if (metadata !== undefined) {
      updateData.metadata = metadata;
    }

    if (sortOrder !== undefined) {
      updateData.sortOrder = sortOrder;
    }

    // Обновляем опцию
    const [updatedOption] = await ctx.db
      .update(productVariantOptions)
      .set(updateData)
      .where(eq(productVariantOptions.id, id))
      .returning();

    if (!updatedOption) {
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Не удалось обновить опцию",
      });
    }

    return updatedOption;
  }); 
